import { NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/launch";
import { joinWaitlist } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; website?: string };
  // Campo nascosto: lo compilano solo i bot.
  if (body.website) return NextResponse.json({ ok: true });
  const email = normalizeEmail(String(body.email ?? ""));
  if (!email) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  await joinWaitlist(email);
  return NextResponse.json({ ok: true });
}
