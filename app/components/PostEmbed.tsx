"use client";

import { useEffect, useRef } from "react";
import { hostLabel, parsePostLink } from "@/lib/links";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
  }
}

// Mostra il post vincitore: embed ufficiale per X e LinkedIn, altrimenti un semplice rimando.
export function PostEmbed({ url, name }: { url: string; name: string }) {
  const link = parsePostLink(url);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (link?.platform !== "x" || !ref.current) return;
    const el = ref.current;
    if (window.twttr?.widgets) {
      window.twttr.widgets.load(el);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, [link?.platform]);

  if (link?.platform === "x") {
    return (
      <div ref={ref} className="x-embed">
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={link.url}>Read {name}&apos;s post on X</a>
        </blockquote>
      </div>
    );
  }

  if (link?.platform === "linkedin" && link.linkedinEmbedUrl) {
    return <iframe className="embed" src={link.linkedinEmbedUrl} title={`LinkedIn post by ${name}`} loading="lazy" />;
  }

  return (
    <div className="empty-slot">
      <p className="big">Read it on {hostLabel(url)}</p>
      <p><a href={url} rel="nofollow noopener" target="_blank">Open {name}&apos;s link</a></p>
    </div>
  );
}
