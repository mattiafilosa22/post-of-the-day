import { describe, expect, it } from "vitest";
import { addDays, dayStart, formatDay, openAuctionDay, today } from "@/lib/time";

describe("time", () => {
  it("usa il giorno UTC", () => {
    expect(today(new Date("2026-10-24T23:30:00Z"))).toBe("2026-10-24");
    expect(today(new Date("2026-10-25T00:00:00Z"))).toBe("2026-10-25");
  });

  it("somma i giorni attraverso i cambi di mese e d'anno", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("l'asta di domani si chiude alla mezzanotte UTC", () => {
    const now = new Date("2026-10-25T15:00:00Z");
    expect(openAuctionDay(now)).toBe("2026-10-26");
    expect(dayStart(openAuctionDay(now)).toISOString()).toBe("2026-10-26T00:00:00.000Z");
  });

  it("formatta le date in inglese", () => {
    expect(formatDay("2026-10-26")).toBe("Monday, October 26");
  });
});
