# Onion Docs

Public documentation for [Onion](https://onion4.ai): guides, the HTTP API and
the MCP server. Built with [Starlight](https://starlight.astro.build) (Astro)
from the Markdown in `src/content/docs`, styled with the Onion design tokens,
and published to GitHub Pages by `.github/workflows/deploy.yml` on every push
to `main`. Readers get it at **https://onion4.ai/docs/**: the landing's nginx
(onion-landing `nginx.conf`) serves the Pages site under that path.

## Run it

```sh
npm ci
npm run dev        # http://localhost:4321/docs/
npm run build      # into dist/, with the search index
npm run preview    # serve dist/
```

Node 22.23.4 or newer.

## Write a page

1. Add a `.md` file under `src/content/docs/<topic>/` with a `title` and a
   `description` in its front matter. Use `.mdx` only when the page needs
   Starlight components (`Tabs`, `Steps`, `Aside`).
2. Put it in the `sidebar` in `astro.config.mjs`, under its topic.
3. Link to other pages from the site root — `[limits](/guides/rate-limits/)` —
   the base path is added at build time.

The four top-level sidebar groups are the topics (`src/components/topics.ts`),
shown as tabs in the header from 72rem and at the top of the sidebar below
that (`TopicNav.astro`); a page's sidebar shows only its own topic
(`src/route-middleware.ts`).

What goes here: what a customer can do with an API key or through MCP, as the
service does it today. Check behaviour against the code and the OpenAPI spec
(`https://user.onion4.ai/api/v1/openapi.yaml`) before writing it down; internal
endpoints and infrastructure stay out.

## Design tokens

`src/styles/tokens.css` is a copy of the kit's generated tokens
(`@hostwerkfze/alternanthera`, `src/generated/tokens.css` in onion-ui-kit).
`src/styles/onion.css` maps Starlight's variables onto them. After a kit
release:

```sh
npm run sync-tokens                        # from ../onion-ui-kit
KIT_DIR=/path/to/onion-ui-kit npm run sync-tokens
```

## Deploy

GitHub Pages, source "GitHub Actions". The pages are fetched from
`https://hostwerkfze.github.io/onion-docs/` by the landing and shown at
`https://onion4.ai/docs/`, so the site is built for that address
(`astro.config.mjs`); opened directly on github.io it has no styles.

To move it to a host of its own (`docs.onion4.ai`): set the repository
variables `DOCS_SITE` (`https://docs.onion4.ai`) and `DOCS_BASE` (`/`), add
the domain in Settings → Pages, and point the landing's `/docs/` at it with a
redirect.
