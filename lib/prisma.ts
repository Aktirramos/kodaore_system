import { Prisma, PrismaClient } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set(["student", "enrollment", "receipt"]);

type QueryArgs = Record<string, unknown> | undefined;
type RelationFieldMeta = {
  targetModel: string;
  isList: boolean;
};

const RELATION_FIELDS_BY_MODEL = new Map<string, Map<string, RelationFieldMeta>>(
  Prisma.dmmf.datamodel.models.map((model) => [
    model.name.toLowerCase(),
    new Map(
      model.fields
        .filter((field) => field.kind === "object")
        .map((field) => [
          field.name,
          { targetModel: String(field.type).toLowerCase(), isList: field.isList },
        ]),
    ),
  ]),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

function applySoftDeleteToSelection(
  currentModel: string,
  selection: unknown,
): unknown {
  if (!isRecord(selection)) {
    return selection;
  }

  const relationFields = RELATION_FIELDS_BY_MODEL.get(currentModel.toLowerCase());

  if (!relationFields) {
    return selection;
  }

  let hasChanges = false;
  const nextSelection: Record<string, unknown> = { ...selection };

  for (const [fieldName, fieldValue] of Object.entries(selection)) {
    const relationField = relationFields.get(fieldName);

    if (!relationField) {
      continue;
    }

    const targetIsSoftDeleteModel = SOFT_DELETE_MODELS.has(relationField.targetModel);

    if (fieldValue === true) {
      if (relationField.isList && targetIsSoftDeleteModel) {
        nextSelection[fieldName] = withSoftDeleteFilter(undefined);
        hasChanges = true;
      }

      continue;
    }

    if (!isRecord(fieldValue)) {
      continue;
    }

    const relationArgs = fieldValue as QueryArgs;
    const relationArgsWithTopLevelFilter =
      relationField.isList && targetIsSoftDeleteModel
        ? withSoftDeleteFilter(relationArgs)
        : (relationArgs ?? {});

    const relationArgsWithNestedFilters = applySoftDeleteToRelationArgs(
      relationField.targetModel,
      relationArgsWithTopLevelFilter,
    );

    if (relationArgsWithNestedFilters !== fieldValue) {
      nextSelection[fieldName] = relationArgsWithNestedFilters;
      hasChanges = true;
    }
  }

  return hasChanges ? nextSelection : selection;
}

function applySoftDeleteToRelationArgs(
  currentModel: string,
  args: QueryArgs,
): QueryArgs {
  if (!isRecord(args)) {
    return args;
  }

  const nextInclude = applySoftDeleteToSelection(currentModel, args.include);
  const nextSelect = applySoftDeleteToSelection(currentModel, args.select);

  if (nextInclude === args.include && nextSelect === args.select) {
    return args;
  }

  return {
    ...args,
    include: nextInclude,
    select: nextSelect,
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
        const modelName = model?.toLowerCase();
        const argsWithRelationFilters = modelName
          ? applySoftDeleteToRelationArgs(modelName, args as QueryArgs)
          : args;
        const safeArgsForQuery = (argsWithRelationFilters ?? {}) as typeof args;

        if (!modelName || !SOFT_DELETE_MODELS.has(modelName)) {
          return query(safeArgsForQuery);
        }

        const modelKey = `${model.charAt(0).toLowerCase()}${model.slice(1)}`;
        const delegate = prismaBase as unknown as Record<string, unknown>;
        const modelDelegate = delegate[modelKey] as
          | {
              findFirst: (args: Record<string, unknown>) => Promise<unknown>;
              findFirstOrThrow: (args: Record<string, unknown>) => Promise<unknown>;
              update: (args: Record<string, unknown>) => Promise<unknown>;
              updateMany: (args: Record<string, unknown>) => Promise<unknown>;
            }
          | undefined;

        if (!modelDelegate) {
          return query(safeArgsForQuery);
        }

        if (operation === "findUnique") {
          return modelDelegate.findFirst(withSoftDeleteFilter(argsWithRelationFilters as QueryArgs));
        }

        if (operation === "findUniqueOrThrow") {
          return modelDelegate.findFirstOrThrow(
            withSoftDeleteFilter(argsWithRelationFilters as QueryArgs),
          );
        }

        if (
          operation === "findMany" ||
          operation === "findFirst" ||
          operation === "findFirstOrThrow" ||
          operation === "count" ||
          operation === "aggregate" ||
          operation === "groupBy"
        ) {
          return query(withSoftDeleteFilter(argsWithRelationFilters as QueryArgs));
        }

        if (operation === "delete") {
          const deleteArgs = (argsWithRelationFilters ?? {}) as Record<string, unknown>;
          return modelDelegate.update({
            where: deleteArgs.where,
            data: { deletedAt: new Date() },
          });
        }

        if (operation === "deleteMany") {
          const deleteManyArgs = withSoftDeleteFilter(argsWithRelationFilters as QueryArgs);
          return modelDelegate.updateMany({
            ...deleteManyArgs,
            data: { deletedAt: new Date() },
          });
        }

        return query(safeArgsForQuery);
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prismaBase;
}
