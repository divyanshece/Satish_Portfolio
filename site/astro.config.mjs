// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://satishregonda.in",
  trailingSlash: "always",
  integrations: [
    // Google ignores changefreq and priority, and no page on this site carries
    // a change date we could verify, so the sitemap states locations only. A
    // lastmod that does not hold up gets the signal discounted for every URL.
    sitemap({ changefreq: undefined, priority: undefined }),
  ],
  build: { inlineStylesheets: "never" },   // one external stylesheet, cached site-wide
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
  vite: {
    build: {
      // The site ships no JavaScript. If a stray script ever appears, this
      // keeps it from being silently split into a dozen tiny requests.
      assetsInlineLimit: 0,
      // One stylesheet for the whole site rather than six per page. It is a few
      // hundred bytes larger on a cold first view and free on every page after,
      // which is the right trade for a text site read over a slow connection.
      cssCodeSplit: false,
    },
  },
});
