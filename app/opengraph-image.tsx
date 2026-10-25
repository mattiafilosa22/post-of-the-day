import { ImageResponse } from "next/og";
import { formatMoney } from "@/lib/auction";
import { getLeader } from "@/lib/bids";
import { formatDay, openAuctionDay } from "@/lib/time";

export const alt = "The Post of the Day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const PAPER = "#f5f0e6";
const INK = "#1f1c17";
const SOFT = "#5c564c";
const ACCENT = "#c8401f";

// Senza user agent moderno Google Fonts restituisce TTF, l'unico formato che ImageResponse legge.
async function loadFont(family: string, axes: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axes}`)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const day = openAuctionDay();
  const leader = process.env.DATABASE_URL ? await getLeader(day).catch(() => null) : null;
  const [serif, serifItalic, sans, sansBold] = await Promise.all([
    loadFont("Newsreader", "wght@600"),
    loadFont("Newsreader", "ital,wght@1,400"),
    loadFont("Schibsted+Grotesk", "wght@400"),
    loadFont("Schibsted+Grotesk", "wght@700"),
  ]);
  const fonts = [
    ...(serif ? [{ name: "Newsreader", data: serif, weight: 600 as const, style: "normal" as const }] : []),
    ...(serifItalic ? [{ name: "Newsreader", data: serifItalic, weight: 400 as const, style: "italic" as const }] : []),
    ...(sans ? [{ name: "Schibsted", data: sans, weight: 400 as const, style: "normal" as const }] : []),
    ...(sansBold ? [{ name: "Schibsted", data: sansBold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: PAPER, color: INK, padding: "56px 72px", fontFamily: "Newsreader" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: SOFT, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Schibsted" }}>
          <span>Est. 2026</span>
          <span>Only the winner pays</span>
        </div>
        {/* Satori non supporta i bordi "double": due filetti separati */}
        <div style={{ display: "flex", borderTop: `2px solid ${INK}`, marginTop: 16 }} />
        <div style={{ display: "flex", borderTop: `2px solid ${INK}`, marginTop: 3 }} />
        <div style={{ display: "flex", justifyContent: "center", fontSize: 116, fontWeight: 600, letterSpacing: -3, lineHeight: 1, marginTop: 12 }}>
          <span>The&nbsp;</span>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>Post</span>
          <span>&nbsp;of the Day</span>
        </div>
        <div style={{ display: "flex", borderTop: `2px solid ${INK}`, marginTop: 28 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, color: ACCENT, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Schibsted", fontWeight: 700 }}>
              Bidding for tomorrow
            </span>
            <span style={{ fontSize: 56, marginTop: 8, fontStyle: "italic" }}>{formatDay(day)}</span>
            <span style={{ fontSize: 30, color: SOFT, marginTop: 8, fontFamily: "Schibsted" }}>
              {leader ? `On top: ${leader.name}` : "One post on the front page, every day"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 26, color: SOFT, fontFamily: "Schibsted" }}>{leader ? "Highest bid" : "Starting at"}</span>
            <span style={{ fontSize: 120, fontWeight: 600, lineHeight: 1 }}>{formatMoney(leader?.amount_cents ?? 500)}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
