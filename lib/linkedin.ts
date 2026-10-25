export type LinkedInPost = { url: string; embedUrl: string | null };

const HOST = /^([a-z]{2,3}\.)?linkedin\.com$/;

// Accetta solo link a post LinkedIn pubblici e, quando possibile, ricava l'URL di embed.
export function parseLinkedInPost(input: string): LinkedInPost | null {
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || !HOST.test(u.hostname)) return null;

  const urn = u.pathname.match(/^\/(?:feed\/update|embed\/feed\/update)\/urn:li:(activity|share|ugcPost):(\d+)\/?$/);
  if (urn) {
    const [, type, id] = urn;
    return { url: `https://www.linkedin.com/feed/update/urn:li:${type}:${id}/`, embedUrl: embed(type, id) };
  }

  if (/^\/posts\/[^/]+\/?$/.test(u.pathname)) {
    const url = `https://www.linkedin.com${u.pathname}`;
    const id = u.pathname.match(/-(activity|share|ugcPost)-(\d+)-/);
    return { url, embedUrl: id ? embed(id[1], id[2]) : null };
  }

  return null;
}

function embed(type: string, id: string): string {
  return `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`;
}
