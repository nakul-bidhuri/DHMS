<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Deployment Rules

- **Automatic GitHub Push for Vercel Deployment**: Whenever changes, upgrades, or fixes are completed and verified (via `npx tsc --noEmit` and build checks), always commit and push the changes directly to `origin main` on GitHub (`git push origin main`). This ensures Vercel automatically triggers and deploys the updates to the live site.

