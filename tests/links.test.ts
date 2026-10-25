import { describe, expect, it } from "vitest";
import { parsePostLink } from "@/lib/links";

describe("parsePostLink", () => {
  it("riconosce i post di X, anche dai vecchi link di twitter.com", () => {
    expect(parsePostLink("https://twitter.com/jack/status/20?s=20")).toEqual({
      url: "https://x.com/jack/status/20",
      platform: "x",
      xStatusId: "20",
    });
    expect(parsePostLink("https://x.com/jack/status/20/photo/1")).toBeNull();
  });

  it("riconosce i post LinkedIn e ricava l'embed dall'id dell'attività", () => {
    const p = parsePostLink(
      "https://www.linkedin.com/posts/mario-rossi_ai-lancio-activity-7254012345678901234-AbCd?utm_source=share",
    );
    expect(p).toEqual({
      url: "https://www.linkedin.com/posts/mario-rossi_ai-lancio-activity-7254012345678901234-AbCd",
      platform: "linkedin",
      linkedinEmbedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7254012345678901234",
    });
  });

  it("accetta qualsiasi pagina https come link semplice", () => {
    expect(parsePostLink("https://example.com/launch#top")).toEqual({
      url: "https://example.com/launch",
      platform: "web",
    });
  });

  it("rifiuta link non sicuri o non validi", () => {
    expect(parsePostLink("http://example.com")).toBeNull();
    expect(parsePostLink("https://localhost/x")).toBeNull();
    expect(parsePostLink("https://www.linkedin.com/in/mario-rossi")).toBeNull();
    expect(parsePostLink("javascript:alert(1)")).toBeNull();
    expect(parsePostLink("not a link")).toBeNull();
  });
});
