# Viollet app preview embed

`public/embeds/viollet-app/` is a static export of the exact app simulation used in the viollet.app landing hero
(`src/components/landing/prototype` in the private Viollet repo). Only the compiled client bundle is committed here,
which is the same code viollet.app already ships to every visitor. No Viollet source is copied into this repo.

Rebuild:
1. Copy the Viollet repo to a scratch dir (exclude .git), link node_modules.
2. Delete every route file under `src/app` (page, layout, route, loading, error, not-found, sitemap, robots) and `src/proxy.ts`.
3. Copy `layout.tsx`, `page.tsx` and `embed.css` from this folder into `src/app/`, `embed-shims/` to the root and replace `next.config.ts`.
4. `SKIP_ENV_VALIDATION=1 npx next build --webpack`, then copy `out/` to `public/embeds/viollet-app/` (drop 404 and google verification files).

Server actions, Clerk and env are swapped for the prototype shims at build time, so the export never talks to a backend.
