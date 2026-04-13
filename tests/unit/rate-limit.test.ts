import { describe, expect, it } from "vitest";
import { buildRateLimitKey, extractClientIp, normalizeIp } from "../../lib/security/rate-limit";

describe("rate-limit utilities", () => {
  it("builds stable keys with trimmed lowercase values", () => {
    const a = buildRateLimitKey("auth:v1", "identifier", "  USER@Mail.com ");
    const b = buildRateLimitKey("auth:v1", "identifier", "user@mail.com");

    expect(a).toBe(b);
    expect(a.startsWith("auth:v1:identifier:")).toBe(true);
    expect(a.length).toBeGreaterThan(30);
  });

  it("normalizes ipv4 and mapped ipv6", () => {
    expect(normalizeIp("::ffff:192.168.1.10")).toBe("192.168.1.10");
    expect(normalizeIp("10.0.0.3:12345")).toBe("10.0.0.3");
    expect(normalizeIp("unknown")).toBe(null);
  });

  it("extracts client ip from headers priority", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 10.0.0.1",
      "x-real-ip": "198.51.100.12",
    });

    expect(extractClientIp(headers)).toBe("203.0.113.1");
  });

  it("supports plain object headers", () => {
    const headers = {
      "x-real-ip": "198.51.100.7",
    };

    expect(extractClientIp(headers)).toBe("198.51.100.7");
  });
});
