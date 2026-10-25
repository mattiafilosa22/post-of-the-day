import { afterEach, describe, expect, it } from "vitest";
import { isPrelaunch, launchAt, normalizeEmail } from "@/lib/launch";

describe("launch", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_LAUNCH_AT;
  });

  it("di default lancia martedì 17 novembre alle 8:00 di San Francisco", () => {
    expect(launchAt().toISOString()).toBe("2026-11-17T16:00:00.000Z");
  });

  it("mostra il conto alla rovescia solo prima del lancio", () => {
    process.env.NEXT_PUBLIC_LAUNCH_AT = "2026-12-12T17:00:00Z";
    expect(isPrelaunch(new Date("2026-12-12T16:59:59Z"))).toBe(true);
    expect(isPrelaunch(new Date("2026-12-12T17:00:00Z"))).toBe(false);
  });

  it("ignora una data di lancio non valida", () => {
    process.env.NEXT_PUBLIC_LAUNCH_AT = "domani";
    expect(launchAt().toISOString()).toBe("2026-11-17T16:00:00.000Z");
  });

  it("normalizza e valida le email", () => {
    expect(normalizeEmail("  Mario@Example.COM ")).toBe("mario@example.com");
    expect(normalizeEmail("mario@example")).toBeNull();
    expect(normalizeEmail("non è una email")).toBeNull();
  });
});
