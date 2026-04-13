import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLE_PERMISSION_MATRIX } from "../../lib/domain/security";

describe("role permission matrix", () => {
  it("developer includes all known permissions", () => {
    const devPermissions = ROLE_PERMISSION_MATRIX.DEVELOPER;
    const all = Object.values(PERMISSIONS);

    expect(devPermissions.length).toBe(all.length);
    expect(new Set(devPermissions)).toEqual(new Set(all));
  });

  it("family role remains read-oriented", () => {
    const family = ROLE_PERMISSION_MATRIX.ALUMNO_TUTOR;

    expect(family).toContain(PERMISSIONS.DASHBOARD_READ);
    expect(family).toContain(PERMISSIONS.BILLING_READ);
    expect(family).not.toContain(PERMISSIONS.BILLING_WRITE);
    expect(family).not.toContain(PERMISSIONS.USERS_MANAGE);
  });
});
