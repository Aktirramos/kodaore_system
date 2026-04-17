import { PrismaClient } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set(["student", "enrollment", "receipt"]);

type QueryArgs = Record<string, unknown> | undefined;

function withSoftDeleteFilter(args: QueryArgs): Record<string, unknown> {
  const normalizedArgs = (args ?? {}) as Record<string, unknown>;
  const where = (normalizedArgs.where ?? {}) as Record<string, unknown>;

  if (Object.prototype.hasOwnProperty.call(where, "deletedAt")) {
    return normalizedArgs;
  }

  return {
    ...normalizedArgs,
    where:
      Object.keys(where).length === 0
        ? { deletedAt: null }
        : { AND: [where, { deletedAt: null }] },
  };
}

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const prismaBase =
  global.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

export const prisma = prismaBase.$extends({
    name: "soft-delete",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !SOFT_DELETE_MODELS.has(model.toLowerCase())) {
            return query(args);
          }

          const modelKey = `${model.charAt(0).toLowerCase()}${model.slice(1)}`;
          const delegate = prismaBase as Record<string, unknown>;
          const modelDelegate = delegate[modelKey] as
            | {
                findFirst: (args: Record<string, unknown>) => Promise<unknown>;
                findFirstOrThrow: (args: Record<string, unknown>) => Promise<unknown>;
                update: (args: Record<string, unknown>) => Promise<unknown>;
                updateMany: (args: Record<string, unknown>) => Promise<unknown>;
              }
            | undefined;

          if (!modelDelegate) {
            return query(args);
          }

          if (operation === "findUnique") {
            return modelDelegate.findFirst(withSoftDeleteFilter(args as QueryArgs));
          }

          if (operation === "findUniqueOrThrow") {
            return modelDelegate.findFirstOrThrow(withSoftDeleteFilter(args as QueryArgs));
          }

          if (
            operation === "findMany" ||
            operation === "findFirst" ||
            operation === "findFirstOrThrow" ||
            operation === "count" ||
            operation === "aggregate" ||
            operation === "groupBy"
          ) {
            return query(withSoftDeleteFilter(args as QueryArgs));
          }

          if (operation === "delete") {
            const deleteArgs = (args ?? {}) as Record<string, unknown>;
            return modelDelegate.update({
              where: deleteArgs.where,
              data: { deletedAt: new Date() },
            });
          }

          if (operation === "deleteMany") {
            const deleteManyArgs = withSoftDeleteFilter(args as QueryArgs);
            return modelDelegate.updateMany({
              ...deleteManyArgs,
              data: { deletedAt: new Date() },
            });
          }

          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prismaBase;
}
