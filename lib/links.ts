export type Platform = "x" | "linkedin" | "web";

export type PostLink = {
  url: string;
  platform: Platform;
  // Per i post di X: l'id dello status. Per LinkedIn: l'URL di embed, se ricavabile.
  xStatusId?: string;
  linkedinEmbedUrl?: string | null;
};

const LINKEDIN_HOST = /^([a-z]{2,3}\.)?linkedin\.com$/;
const X_HOST = /^(www\.|mobile\.)?(x|twitter)\.com$/;

// Accetta un post di X o LinkedIn (con anteprima incorporata) oppure qualsiasi pagina https.
export function parsePostLink(input: string): PostLink | null {
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || !u.hostname.includes(".")) return null;

  if (X_HOST.test(u.hostname)) {
    const m = u.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/(\d+)\/?$/);
    if (!m) return null;
    return { url: `https://x.com/${m[1]}/status/${m[2]}`, platform: "x", xStatusId: m[2] };
  }

  if (LINKEDIN_HOST.test(u.hostname)) {
    const urn = u.pathname.match(/^\/(?:feed\/update|embed\/feed\/update)\/urn:li:(activity|share|ugcPost):(\d+)\/?$/);
    if (urn) {
      return {
        url: `https://www.linkedin.com/feed/update/urn:li:${urn[1]}:${urn[2]}/`,
        platform: "linkedin",
        linkedinEmbedUrl: linkedinEmbed(urn[1], urn[2]),
      };
    }
    if (/^\/posts\/[^/]+\/?$/.test(u.pathname)) {
      const id = u.pathname.match(/-(activity|share|ugcPost)-(\d+)-/);
      return {
        url: `https://www.linkedin.com${u.pathname}`,
        platform: "linkedin",
        linkedinEmbedUrl: id ? linkedinEmbed(id[1], id[2]) : null,
      };
    }
    return null;
  }

  u.hash = "";
  return { url: u.toString(), platform: "web" };
}

function linkedinEmbed(type: string, id: string): string {
  return `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`;
}

export function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
