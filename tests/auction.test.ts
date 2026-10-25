import { describe, expect, it } from "vitest";
import { decideOnAuthorized, minNextBidCents, parseEuroToCents } from "@/lib/auction";

describe("auction", () => {
  it("parte da 5 € e poi richiede almeno 1 € in più", () => {
    expect(minNextBidCents(null)).toBe(500);
    expect(minNextBidCents(4700)).toBe(4800);
  });

  it("passa in testa solo chi supera di almeno 1 €", () => {
    expect(decideOnAuthorized(500, null)).toBe("lead");
    expect(decideOnAuthorized(4800, 4700)).toBe("lead");
    expect(decideOnAuthorized(4750, 4700)).toBe("outbid");
    expect(decideOnAuthorized(4700, 4700)).toBe("outbid");
  });

  it("legge importi scritti all'italiana", () => {
    expect(parseEuroToCents("12")).toBe(1200);
    expect(parseEuroToCents("12,50")).toBe(1250);
    expect(parseEuroToCents("€ 7.5")).toBe(750);
    expect(parseEuroToCents("1.000")).toBe(null);
    expect(parseEuroToCents("abc")).toBe(null);
    expect(parseEuroToCents("-3")).toBe(null);
  });
});
