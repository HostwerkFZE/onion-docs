# Onion Docs

Public documentation for [Onion](https://onion4.ai): guides, the HTTP API and
the MCP server. Built with [Starlight](https://starlight.astro.build) (Astro)
from the Markdown in `src/content/docs`, styled with the Onion design tokens,
and published to GitHub Pages by `.github/workflows/deploy.yml` on every push
to `main`.

## Run it

```sh
npm ci
npm run dev        # http://localhost:4321/onion-docs/
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

The four top-level sidebar groups are the topics shown as tabs in the header
(`src/components/topics.ts`); a page's sidebar shows only its own topic
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

GitHub Pages, source "GitHub Actions". The site is built for
`https://<owner>.github.io/<repo>/`. For a custom domain, set the repository
variables `DOCS_SITE` (`https://docs.example.com`) and `DOCS_BASE` (`/`) and
add the domain in Settings → Pages.
