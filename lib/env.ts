import { buildValidatedEnv } from "@/lib/env-validation";

export const env = buildValidatedEnv(process.env);
