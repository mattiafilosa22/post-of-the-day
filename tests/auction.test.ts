import { describe, expect, it } from "vitest";
import { decideOnAuthorized, formatMoney, minNextBidCents, parseAmountToCents } from "@/lib/auction";

describe("auction", () => {
  it("parte da $5 e poi richiede almeno $1 in più", () => {
    expect(minNextBidCents(null)).toBe(500);
    expect(minNextBidCents(4700)).toBe(4800);
  });

  it("passa in testa solo chi supera di almeno $1", () => {
    expect(decideOnAuthorized(500, null)).toBe("lead");
    expect(decideOnAuthorized(4800, 4700)).toBe("lead");
    expect(decideOnAuthorized(4750, 4700)).toBe("outbid");
    expect(decideOnAuthorized(4700, 4700)).toBe("outbid");
  });

  it("legge gli importi con punto o virgola", () => {
    expect(parseAmountToCents("12")).toBe(1200);
    expect(parseAmountToCents("12.50")).toBe(1250);
    expect(parseAmountToCents("12,50")).toBe(1250);
    expect(parseAmountToCents("$ 7.5")).toBe(750);
    expect(parseAmountToCents("1,000.00")).toBe(null);
    expect(parseAmountToCents("abc")).toBe(null);
    expect(parseAmountToCents("-3")).toBe(null);
  });

  it("mostra i centesimi solo quando servono", () => {
    expect(formatMoney(4700)).toBe("$47");
    expect(formatMoney(1250)).toBe("$12.50");
  });
});
