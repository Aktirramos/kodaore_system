import { type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
type JsonObject = Record<string, JsonValue>;

type AuditLogClient = {
  auditLog: {
    create: (args: Prisma.AuditLogCreateArgs) => Promise<unknown>;
  };
};

type DiffResult = {
  before: JsonValue;
  after: JsonValue;
};

export type CreateAuditLogForChangesParams = {
  actorUserId: string;
  entity: string;
  action: string;
  before: unknown;
  after: unknown;
  entityId?: string;
  siteId?: string | null;
  ipAddress?: string | null;
  db?: AuditLogClient;
};

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeForAudit(value: unknown): JsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      const normalized = normalizeForAudit(item);
      return normalized ?? null;
    });
  }

  if (typeof value === "object") {
    const normalizedEntries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, normalizeForAudit(item)] as const)
      .filter((entry): entry is readonly [string, JsonValue] => entry[1] !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));

    const normalizedObject: JsonObject = {};

    for (const [key, item] of normalizedEntries) {
      normalizedObject[key] = item;
    }

    return normalizedObject;
  }

  return String(value);
}

function serialize(value: JsonValue): string {
  return JSON.stringify(value);
}

function diffValues(before: JsonValue | undefined, after: JsonValue | undefined): DiffResult | null {
  const normalizedBefore: JsonValue = before ?? null;
  const normalizedAfter: JsonValue = after ?? null;

  if (isJsonObject(normalizedBefore) && isJsonObject(normalizedAfter)) {
    const keys = Array.from(new Set([...Object.keys(normalizedBefore), ...Object.keys(normalizedAfter)])).sort();
    const beforeDiff: JsonObject = {};
    const afterDiff: JsonObject = {};

    for (const key of keys) {
      const nestedDiff = diffValues(normalizedBefore[key], normalizedAfter[key]);

      if (!nestedDiff) {
        continue;
      }

      beforeDiff[key] = nestedDiff.before;
      afterDiff[key] = nestedDiff.after;
    }

    if (Object.keys(beforeDiff).length === 0) {
      return null;
    }

    return {
      before: beforeDiff,
      after: afterDiff,
    };
  }

  if (serialize(normalizedBefore) === serialize(normalizedAfter)) {
    return null;
  }

  return {
    before: normalizedBefore,
    after: normalizedAfter,
  };
}

function extractEntityId(value: JsonValue | undefined): string | null {
  if (!value || !isJsonObject(value)) {
    return null;
  }

  const id = value.id;

  if (typeof id === "string" && id.length > 0) {
    return id;
  }

  if (typeof id === "number") {
    return String(id);
  }

  return null;
}

export async function createAuditLogForChanges(params: CreateAuditLogForChangesParams): Promise<void> {
  const normalizedBefore = normalizeForAudit(params.before);
  const normalizedAfter = normalizeForAudit(params.after);
  const diff = diffValues(normalizedBefore, normalizedAfter);

  if (!diff) {
    return;
  }

  const entityId =
    params.entityId ?? extractEntityId(normalizedAfter) ?? extractEntityId(normalizedBefore);

  if (!entityId) {
    throw new Error("Audit log requires an entityId or an 'id' field in before/after data.");
  }

  const client = params.db ?? prisma;

  await client.auditLog.create({
    data: {
      actorUserId: params.actorUserId,
      siteId: params.siteId,
      entity: params.entity,
      entityId,
      action: params.action,
      beforeData: diff.before as Prisma.InputJsonValue,
      afterData: diff.after as Prisma.InputJsonValue,
      ipAddress: params.ipAddress,
    },
  });
}
