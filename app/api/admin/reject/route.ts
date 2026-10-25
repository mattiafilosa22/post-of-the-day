import { NextResponse } from "next/server";
import { rejectLeadingBid } from "@/lib/bids";

export const dynamic = "force-dynamic";

// Uso: curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"bidId":"..."}' <sito>/api/admin/reject
export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { bidId } = (await req.json().catch(() => ({}))) as { bidId?: string };
  if (!bidId) return NextResponse.json({ error: "Missing bidId" }, { status: 400 });
  const ok = await rejectLeadingBid(bidId);
  return NextResponse.json({ rejected: ok }, { status: ok ? 200 : 404 });
}
