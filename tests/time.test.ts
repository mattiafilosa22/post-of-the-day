import { describe, expect, it } from "vitest";
import { addDays, openAuctionDay, romeDay, romeMidnight } from "@/lib/time";

describe("time", () => {
  it("usa il giorno di Roma, non quello UTC", () => {
    // 23:30 UTC del 24 ottobre = 01:30 del 25 a Roma (ora legale)
    expect(romeDay(new Date("2026-10-24T23:30:00Z"))).toBe("2026-10-25");
    expect(romeDay(new Date("2026-10-24T21:30:00Z"))).toBe("2026-10-24");
  });

  it("somma i giorni attraverso i cambi di mese e d'anno", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("calcola la mezzanotte di Roma con ora legale e solare", () => {
    expect(romeMidnight("2026-07-01").toISOString()).toBe("2026-06-30T22:00:00.000Z");
    expect(romeMidnight("2026-12-01").toISOString()).toBe("2026-11-30T23:00:00.000Z");
    // Il 25 ottobre 2026 si torna all'ora solare alle 3: la mezzanotte è ancora in ora legale.
    expect(romeMidnight("2026-10-25").toISOString()).toBe("2026-10-24T22:00:00.000Z");
    expect(romeMidnight("2026-10-26").toISOString()).toBe("2026-10-25T23:00:00.000Z");
  });

  it("l'asta aperta è quella del giorno dopo", () => {
    expect(openAuctionDay(new Date("2026-10-25T10:00:00Z"))).toBe("2026-10-26");
  });
});
