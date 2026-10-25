import { NextResponse } from "next/server";
import { closeDueAuctions } from "@/lib/bids";

export const dynamic = "force-dynamic";

// Vercel Cron manda "Authorization: Bearer <CRON_SECRET>" quando la variabile è impostata.
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const closed = await closeDueAuctions();
  return NextResponse.json({ closed });
}
