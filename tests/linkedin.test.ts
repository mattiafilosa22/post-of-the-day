import { describe, expect, it } from "vitest";
import { parseLinkedInPost } from "@/lib/linkedin";

describe("parseLinkedInPost", () => {
  it("accetta i link /posts/ e ricava l'embed dall'id dell'attività", () => {
    const p = parseLinkedInPost(
      "https://www.linkedin.com/posts/mario-rossi_ai-lancio-activity-7254012345678901234-AbCd?utm_source=share",
    );
    expect(p).toEqual({
      url: "https://www.linkedin.com/posts/mario-rossi_ai-lancio-activity-7254012345678901234-AbCd",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7254012345678901234",
    });
  });

  it("accetta i link feed/update e i sottodomini di lingua", () => {
    expect(parseLinkedInPost("https://it.linkedin.com/feed/update/urn:li:share:7254012345678901234/")?.embedUrl).toBe(
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7254012345678901234",
    );
  });

  it("rifiuta link che non sono post LinkedIn", () => {
    expect(parseLinkedInPost("http://www.linkedin.com/posts/x")).toBeNull();
    expect(parseLinkedInPost("https://linkedin.com.evil.it/posts/x")).toBeNull();
    expect(parseLinkedInPost("https://www.linkedin.com/in/mario-rossi")).toBeNull();
    expect(parseLinkedInPost("non è un link")).toBeNull();
  });
});
