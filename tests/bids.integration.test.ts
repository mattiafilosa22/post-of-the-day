import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Stripe finto: registra quali pagamenti vengono annullati o incassati.
const cancelled: string[] = [];
const captured: string[] = [];
vi.mock("@/lib/stripe", () => ({
  stripe: () => ({
    paymentIntents: {
      cancel: async (id: string) => void cancelled.push(id),
      capture: async (id: string) => void captured.push(id),
    },
  }),
}));

const url = process.env.TEST_DATABASE_URL;

// Gira solo con un Postgres di prova: TEST_DATABASE_URL=postgres://... npm test
describe.skipIf(!url)("ciclo di vita delle offerte (Postgres)", async () => {
  process.env.DATABASE_URL = url;
  const { sql } = await import("@/lib/db");
  const bids = await import("@/lib/bids");
  const { openAuctionDay, addDays } = await import("@/lib/time");
  const day = openAuctionDay();

  async function authorizedBid(name: string, euros: number) {
    const id = await bids.createPendingBid({
      day, name, headline: null, postUrl: "https://www.linkedin.com/posts/x", amountCents: euros * 100,
    });
    await bids.attachSession(id, `cs_${name}`);
    await bids.handleAuthorized(`cs_${name}`, `pi_${name}`);
    return id;
  }

  beforeEach(async () => {
    await sql()`delete from bids`;
    cancelled.length = 0;
    captured.length = 0;
  });

  afterAll(async () => {
    await sql()`delete from bids`;
    await sql().end();
  });

  it("chi supera va in testa e il blocco di chi era in testa viene rilasciato", async () => {
    await authorizedBid("anna", 10);
    await authorizedBid("bruno", 12);
    expect((await bids.getLeader(day))?.name).toBe("bruno");
    expect(cancelled).toEqual(["pi_anna"]);
  });

  it("un'offerta autorizzata in ritardo e più bassa viene rilasciata subito", async () => {
    await authorizedBid("anna", 20);
    await authorizedBid("bruno", 15);
    await authorizedBid("carla", 20);
    expect((await bids.getLeader(day))?.name).toBe("anna");
    expect(cancelled).toEqual(["pi_bruno", "pi_carla"]);
  });

  it("lo stesso webhook ricevuto due volte non cambia nulla", async () => {
    await authorizedBid("anna", 10);
    await bids.handleAuthorized("cs_anna", "pi_anna");
    expect((await bids.getLeader(day))?.name).toBe("anna");
    expect(cancelled).toEqual([]);
  });

  it("a mezzanotte incassa solo il vincitore, una volta sola", async () => {
    await authorizedBid("anna", 10);
    await authorizedBid("bruno", 30);
    const afterClose = new Date(Date.now() + 2 * 24 * 3600 * 1000);
    expect(await bids.closeDueAuctions(afterClose)).toBe(1);
    expect(await bids.closeDueAuctions(afterClose)).toBe(0);
    expect(captured).toEqual(["pi_bruno"]);
    expect((await bids.getWinner(day))?.name).toBe("bruno");
    expect(await bids.getWinner(addDays(day, 1))).toBeNull();
  });

  it("la lista d'attesa non duplica le email", async () => {
    const { joinWaitlist, waitlistCount } = await import("@/lib/waitlist");
    await sql()`delete from waitlist`;
    expect(await joinWaitlist("a@example.com")).toBe(true);
    expect(await joinWaitlist("a@example.com")).toBe(false);
    expect(await waitlistCount()).toBe(1);
    await sql()`delete from waitlist`;
  });

  it("la moderazione toglie l'offerta in testa e rilascia il blocco", async () => {
    const id = await authorizedBid("anna", 10);
    expect(await bids.rejectLeadingBid(id)).toBe(true);
    expect(await bids.getLeader(day)).toBeNull();
    expect(cancelled).toEqual(["pi_anna"]);
  });
});
