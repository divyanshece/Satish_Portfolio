/**
 * Anchor attributes for a link that leaves this site.
 *
 * A link to another page here replaces the page, which is what a reader
 * expects. A link to Scholar, ORCID, LinkedIn, a DOI or a store listing opens
 * a tab of its own, so the reader does not lose their place on the site.
 *
 * The decision is made from the URL rather than by hand at each call site,
 * because the URLs are data: they come from the sheet, and whether a given
 * one is off-site is not something the page can know in advance.
 *
 *   <a href={url} {...ext(url)}>…</a>
 *   <a href={url} {...ext(url, "me")}>…</a>   // keeps an existing rel
 *
 * scripts/seo-check.mjs fails the build if an external anchor ships without
 * this, so a link added later cannot quietly open in the same tab.
 */
import { SITE } from "./seo";

const HOST = new URL(SITE).host;

export function isExternal(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).host !== HOST;
  } catch {
    return false;
  }
}

export function ext(href: string, rel?: string): Record<string, string> {
  if (!isExternal(href)) return rel ? { rel } : {};
  /* noopener is the default for target=_blank in current browsers, and is
     stated anyway: it is the guarantee, not the browser's good manners. */
  return { target: "_blank", rel: [rel, "noopener"].filter(Boolean).join(" ") };
}
