# Invite platform – web app

Marketing site and (later) editor for the wedding invite platform.
See `../docs/invite-platform-research-and-plan.md` for the overall plan.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4, brand tokens in `src/app/globals.css`
- shadcn/ui components in `src/components/ui` (form controls, badges)
- GSAP (ScrollTrigger, SplitText) for motion, in `src/components/home/home-motion.tsx`
- Fonts bundled from `@fontsource` (Playfair Display, Mukta with Devanagari)

## Run

```bash
npm install
npm run dev     # http://127.0.0.1:3000
npm run build
npm run lint
```

## What exists

- `/` home page
- `/templates` design gallery with style filters

Brand name, contact and prices are placeholders in `src/lib/site.ts`.
Template entries in `src/lib/templates.ts` are placeholders until artwork exists.
