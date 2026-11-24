# Digital invitation platform: research and build plan

Goal: sell templated wedding invitations in two formats — a responsive invite website and a
reel-size (9:16) video — where a new order needs only data entry, not manual editing.

Research date: 2026-11-24. Method: fetched the public pages and front-end assets of the three
reference sites and probed one sample video with `ffprobe`. Only publicly served files were
read; nothing behind a login.

Labels used below: **Observed** = seen directly in served files. **Inferred** = my reading of
the evidence, not confirmed.

---

## 1. What the reference sites actually do

### 1.1 Missing Piece Invites (`missingpieceinvites.com`) — website invites, no engine

| | |
|---|---|
| Stack | **Observed:** Framer (`server: Framer`, `generator: Framer`, assets on `framerusercontent.com`). Marketing site and demos are all Framer pages. |
| Demo | `/demos/mountain` — a single long scrolling page: letter-spaced names, invocation, family blessing lines, per-event cards (Mehendi, Haldi, Cocktail, Shaadi, Reception) with "See the route" map links, background music (one MP3). |
| Product | INR 3,999 per template. Copy says "easy to edit", "free tutorial to customize your template", "update anything instantly", separate private pages for bride/groom families, RSVP via WhatsApp or Google Forms. |
| How it is delivered | **Inferred:** the buyer receives a Framer remix/duplicate link and edits it themselves in Framer. There is no custom backend, no RSVP database (RSVP is an outbound link), and no video product. |

Takeaway: this is a no-code template shop. Fast to launch, but the customer does the editing
and you cannot generate a video from it. Useful only as a design reference.

### 1.2 Balcony (`itsbalcony.com`) — the real "template + config" platform

| | |
|---|---|
| Stack | **Observed:** PHP 8.3 backend (`x-powered-by`), Vite-built assets (`/build/assets/*-hash.js`), a `config/templates.php` referenced in code comments, CSRF tokens → **Inferred:** Laravel. Google OAuth + email login. |
| Template format | **Observed:** each template is a plain static folder (`/templates/noor/`): `index.html`, `styles.css`, `config.js`, `render.js`, `scroll.js`, `editor.js`, `media/`. No framework. |
| Shared kit | **Observed:** `/templates/_platform/` holds code every template reuses: `editor-kit.js`, `rsvp.js`, `music.js`, `toolbar.js`, `fit-text.js`, `date-display.js`, `scroll-cue.js`, plus vendored **GSAP + ScrollTrigger + Lenis** (smooth scroll). |
| Data model | **Observed:** `config.js` is "the single source of truth for everything a host can edit": template defaults, deep-merged with the host's saved edits. Includes a table of religious invocations/symbols (Ganesha, Ik Onkar, Cross, …) shared by all templates. |
| Modes | **Observed:** URL-driven — `?edit=1` (in-place editing via `contenteditable` on `[data-edit]` nodes), `?preview=1`, plain view, `?to=Guest%20Name` for personalised greeting, `?trial=1` (try-before-buy; only names are unlocked). |
| Platform ↔ template | **Observed:** the platform loads the template in an **iframe** and passes the event payload as base64 JSON in the URL hash (`#platform=…`); the template talks back with `postMessage` (`balcony:ready`, `balcony:save`, `balcony:rsvp`, `balcony:finalize`). The parent page owns the API calls. |
| Motion | **Observed:** scroll-driven GSAP timelines, a "tap to open" door cover, a date-reveal dial, one short looping MP4 (`garden_palace.mp4`) with a WebP poster, layered PNG/WebP/SVG art. |
| Product | INR 2,999–3,499. One common link + 5 personalised guest links, RSVP tracking, add-to-calendar, directions, 3 published updates within 6 months. No video product. |

Takeaway: this is the architecture to copy for the website side. The key idea is that a
template is dumb static HTML that renders from one JSON config; editor, RSVP, music and
sharing are written once in a shared kit.

### 1.3 LoveSolutions (`lovesolutions.in`) — video invites, mostly a service

| | |
|---|---|
| Stack | **Observed:** static hosting (same CDN as Balcony, `server: hcdn`), React bundles per page, no visible order backend. Ordering is a pre-filled **WhatsApp link** (`wa.me/…?text=I would like The Vow Gallery with 4 events at ₹2,499`). |
| Sample video (measured) | `the-vow-gallery-hq.mp4`: **720×1280, 30 fps, H.264 High + AAC stereo, 43.7 s, ~1.3 Mbps, 7.3 MB**, muxed by ffmpeg (`Lavf60`). A `-low` variant is served on slow connections. |
| Video structure | **Observed** from a contact sheet: intro scene (desk, typewriter, monogram) → couple announcement with family lines → one or two events per screen (Mehendi, Sangeet, Haldi, Baraat, Varmala) → closing RSVP screen. Each screen is an illustrated full-bleed plate with a text block in a reserved clear area; transitions are zooms through picture frames. |
| Artwork | **Inferred:** the plates are AI-generated illustrations (style, consistency, detail level). Text is composited on top, not baked into the art. |
| Pricing / process | **Observed:** ₹999 (1 event) to ₹2,499 (4 events), +₹500 per extra event; custom ₹599–799 **per screen**. Delivery 3–5 days. "You can request static screens to check before animation… once animation begins, no edits are included." |
| What that tells us | **Inferred:** production is semi-manual (a person in an editor such as After Effects or CapCut). The "approve static screens, then animate" rule and multi-day turnaround only make sense if each render costs human time. |

Takeaway: the product shape is right (screen-based template, priced per event, WhatsApp-ready
MP4) but the pipeline is manual. That is the gap: automate it and turnaround drops from days
to minutes.

### 1.4 Summary

| | Missing Piece | Balcony | LoveSolutions |
|---|---|---|---|
| Website invite | Framer template, self-edit | Config-driven static templates + in-place editor | Offered (from ₹1,999), service-led |
| Video invite | No | No | Yes, semi-manual |
| Custom backend | No | Yes (PHP) | No (WhatsApp ordering) |
| Edit effort per order | Customer edits in Framer | Customer edits in browser | Studio staff |

None of them produces **both** outputs from one data entry. That is the differentiator.

---

## 2. Core design decision: one config, two renderers

```
                       ┌──────────────────────────┐
  Order form / editor  │  invite.json             │   names, families, events[],
  ───────────────────► │  (validated with a       │   venue, date, photos, music,
                       │   schema, stored in DB)  │   invocation, language
                       └───────────┬──────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
     Website renderer                       Video renderer
     responsive, scroll-driven              fixed 1080×1920, 30 fps, time-driven
     /i/<slug>?to=Guest                     headless Chromium → MP4
```

A **template** is a package containing:

- `template.json` — manifest: slots (which fields it uses), max characters per slot, number of
  events per screen, fonts, palette, music track, safe areas for text.
- `assets/` — layered art (background plates, foreground florals, frames) as WebP/PNG/SVG,
  optional short looping MP4 plates, music.
- `web/` — section components (cover, couple, events, gallery, RSVP).
- `video/` — scene components (intro, couple, event screen ×N, outro) plus transitions.

Both renderers import the same typography, colour tokens, art and text-fitting logic. Scenes
that take `events[]` repeat automatically, so a 2-event and a 7-event order need no manual
work — the video just gets longer (this is exactly how LoveSolutions prices it).

Rules that make "minimum editing" real:

1. **Text never lives in the artwork.** Art is drawn with a reserved clear zone; text is laid
   out by code.
2. **Auto-fit text.** Long names and three-generation family lines must shrink/wrap inside
   their box (Balcony ships a `fit-text.js` for this). The manifest sets hard character limits
   so the form rejects what cannot fit.
3. **Browser-based rendering for video.** Hindi/Gujarati/Punjabi/Tamil scripts need proper
   text shaping. Chromium does this correctly; ffmpeg `drawtext` and most canvas libraries do
   not. This rules out pure-ffmpeg templating.
4. **Deterministic animation.** Video scenes must be a pure function of the frame number (no
   `Date.now()`, no scroll, no autoplaying CSS animation) or renders will flicker.

---

## 3. Tooling

### 3.1 Video engine — the main choice

| Option | How templates are authored | Licence / cost | Fit |
|---|---|---|---|
| **Remotion** (recommended) | React components; props = `invite.json` | Source-available. Free for individuals and companies of up to 3 people; above that a company licence (Automators plan: $0.01/render, $100/month minimum, per Remotion's terms). | Most mature. `@remotion/player` plays the customer's personalised video **live in the browser** before paying, with no render. `@remotion/lambda` renders in parallel on AWS. Shares React code with a Next.js site. |
| **HyperFrames** (HeyGen) | Plain HTML + GSAP timelines | Apache-2.0 per its README, no per-render fee | Closest to Balcony-style HTML/GSAP templates, licence-free. Newer; cloud rendering is less proven. Fallback if the Remotion licence is a problem. |
| After Effects + nexrender / Plainly | Designer builds in AE; JSON swaps text layers | AE seats + render nodes (Windows/macOS) | Best motion quality and designers already know AE. Slow renders, awkward to scale, Indic text needs care, no shared code with the website. |
| Creatomate / Shotstack (SaaS APIs) | Their editor + JSON API | Per-render pricing | Fastest to start, but vendor lock-in, weaker Indic typography control, and customer data leaves your infrastructure. |
| Raw ffmpeg / MoviePy | Scripts | Free | Not viable for shaped Indic text and rich layout. |

**Recommendation: Remotion**, mainly for the in-browser live preview (it replaces
LoveSolutions' "approve static screens" step with instant self-service) and the shared React
codebase. Two caveats:

- **Licence depends on who operates this.** If it runs under a company with more than 3
  people, a paid Remotion company licence applies. I am not an authoritative source on
  licensing — confirm against the current terms (and with Legal if this is a company project)
  before committing. Remotion's licence file also notes changes planned for v5.
- I could not find an official Lambda cost-per-render figure; measure it in the spike instead
  of trusting third-party estimates.

### 3.2 Full stack

| Layer | Choice | Why |
|---|---|---|
| App + invite sites | **Next.js (App Router) + TypeScript + Tailwind** | One codebase for marketing, editor, and guest-facing invite pages; SSR gives correct WhatsApp link previews (OG tags). |
| Web animation | **GSAP + ScrollTrigger + Lenis** | Same as Balcony; proven for scroll-driven invites on mobile. Check GSAP's current licence terms. |
| Video | **Remotion** (`remotion`, `@remotion/player`, `@remotion/lambda` or a self-hosted `@remotion/renderer` worker) | See 3.1. |
| Schema | **Zod** | One schema validates the form, the API and the Remotion props. |
| DB / auth / storage | **Postgres + object storage** (Supabase, or Postgres + S3) | Invites, guests, RSVPs, orders; photos and rendered MP4s. |
| Render queue | SQS / BullMQ → Lambda or a worker container with Chromium + ffmpeg | Renders are 30–120 s jobs; must be async with status polling. |
| Payments | Razorpay | UPI support for India. |
| Sharing | WhatsApp deep links (`wa.me`), per-guest slugs | Matches how all three competitors distribute. |
| Art production | Image-generation model for illustrated plates → cleanup/layering in Photoshop or Figma; optional image-to-video model for 3–5 s looping plates | Matches the style seen at LoveSolutions and Balcony's looping garden clip. This is a one-time cost per template, not per order. |
| Music | Licensed/royalty-free tracks with commercial rights | One track per template, pre-cut to beat markers. |

### 3.3 Output specs

| | Spec |
|---|---|
| Video master | 1080×1920, 30 fps, H.264 High, AAC 128 kbps stereo, `+faststart`, 35–75 s depending on event count |
| WhatsApp variant | 720×1280 at ~1.3–2 Mbps (LoveSolutions ships exactly this, 7.3 MB for 44 s). Keep it small so WhatsApp does not recompress it heavily; test on real devices. |
| Safe area | Keep text out of the top ~12% and bottom ~18% so Instagram/WhatsApp status UI does not cover it (rule of thumb; verify on devices). |
| Website | Mobile-first (360–430 px wide is the primary target), fluid up to desktop with the 9:16 art centred or split-layout; images as WebP/AVIF with posters for video; target < 2 MB initial load on 4G. |

---

## 4. Data model (starting point)

```ts
Invite {
  id, slug, templateId, status: 'draft' | 'paid' | 'live',
  language, invocation: { tradition, symbol, text },
  couple: { bride: Person, groom: Person, order: 'bride-first' | 'groom-first' },
  hosts: string[],                       // "With the blessings of…"
  events: Event[],                       // name, date, time, venue, mapsUrl, dressCode?
  gallery: Photo[], story?: string,
  rsvp: { enabled, deadline }, music: { trackId, enabled },
  closing: { rsvpContacts[], withLove[] },
}
Person  { name, parents, grandparents? }
Guest   { inviteId, slug, displayName, eventIds[] }   // personalised link + per-guest event subset
Rsvp    { inviteId, guestId?, name, phone, status, headcount, message }
Render  { inviteId, format: '1080x1920' | '720x1280', status, url, configHash }
```

`Guest.eventIds` covers the "invite someone only to the pre-wedding" feature that Missing
Piece advertises. `Render.configHash` avoids re-rendering when nothing changed.

Data handling: guest names and phone numbers are personal data. Collect the minimum, keep
invite pages `noindex`, use unguessable slugs, and get the privacy policy and retention rules
reviewed (DPDP Act applies in India — defer to Legal/Compliance; I am not an authoritative
source).

---

## 5. Build plan

| Phase | Scope | Exit criteria | Rough effort (1 dev + 1 designer) |
|---|---|---|---|
| **0. Spike** | One template, hard-coded JSON. Remotion composition with intro → couple → event×N → outro. Same art in a scrolling web page. Render locally and on Lambda. Repeat the video scene in HyperFrames for comparison. | 1080×1920 MP4 with Hindi + English text renders correctly; measured render time and cost per video; engine decision made. | 1 week |
| **1. Template system** | `template.json` manifest, Zod schema, text auto-fit, event pagination (1–2 events per screen), shared tokens. Web section kit: cover/tap-to-open, couple, events, gallery, countdown, maps, add-to-calendar, music toggle. | Changing only `invite.json` produces a correct site and video for 1, 4 and 8 events and for very long names. | 2–3 weeks |
| **2. Editor + preview** | Form-based editor (not free-form canvas), photo upload with client-side compression, live site preview, live video preview via `@remotion/player`, draft autosave. | A non-technical user completes an invite in under 10 minutes on a phone. | 2 weeks |
| **3. Publish + render** | Auth, Razorpay checkout, slug publishing, render queue, MP4 download + WhatsApp share, watermark on unpaid previews. | Pay → live link + MP4 delivered in minutes with no staff involvement. | 2 weeks |
| **4. Guests + RSVP** | Common link and personalised links (`?to=` / guest slugs), per-guest event subsets, RSVP capture, host dashboard, CSV export. | Host sees who opened/responded. | 1–2 weeks |
| **5. Catalogue** | 4–6 templates across styles (royal/palace, floral watercolour, minimal, South Indian, Sikh, Christian), template authoring guide for designers. | New template ships with no platform code changes. | ~1 week per template, mostly art |

MVP = phases 0–3 with two templates, about 7–8 weeks.

---

## 6. Risks and weak assumptions

1. **"Minimum editing" is a design constraint, not a tooling feature.** It only holds if every
   template is designed around slots with hard limits. Free-form customer edits (move this,
   change that flower) break it. Decide early: strict templates with a paid custom tier, as
   LoveSolutions does.
2. **Art is the real cost and the real moat.** The engine is about 30% of the work; each
   template still needs a designer to produce layered, consistent, text-safe artwork and
   motion. Budget for that per template.
3. **Do not reuse the competitors' assets or code.** This research covers architecture and
   product patterns only. Their artwork, templates, copy and scripts are their property; build
   original designs. Rights to AI-generated art and music also need checking (defer to Legal).
4. **Web and video will not share 100% of code.** Scroll-driven and time-driven animation
   differ. Expect to share data, tokens, art, typography and layout primitives, and to write
   the motion twice per template.
5. **Render cost and concurrency.** Wedding season is spiky. Lambda handles bursts; a single
   worker box will not. Measure in phase 0.
6. **Indic typography.** Font choice, conjuncts and line-breaking need native-reader review
   per language. Do not ship a script nobody on the team can proofread.
7. **Mobile performance.** Heavy scroll animation and video backgrounds stutter on low-end
   Android, which is a large share of guests. Test on a real budget device; ship a
   reduced-motion fallback.

## 7. Open decisions

- Who operates this (individual vs company)? It decides the Remotion licence question.
- Self-service SaaS (Balcony model) or assisted service via WhatsApp (LoveSolutions model) at
  launch? The plan above assumes self-service.
- Launch languages and traditions.
- Is the video a separate product or bundled with the website?

---

## Sources

Reference sites (fetched 2026-11-24):

- https://www.missingpieceinvites.com/product-cards/product-card-mountain and `/demos/mountain`
- https://www.itsbalcony.com and `/templates/noor/` (`config.js`, `platform-adapter.js`, `_platform/editor-kit.js`, `_platform/rsvp.js`)
- https://www.lovesolutions.in/wedding-video-invite/designs/the-vow-gallery/ and its sample MP4

Tooling:

- Remotion licence and pricing: https://www.remotion.dev/docs/license , https://www.remotion.dev/docs/license/faq , https://remotion.dev/pricing , https://www.remotion.dev/docs/terms
- HyperFrames: https://github.com/heygen-com/hyperframes , https://hyperframes.heygen.com/guides/hyperframes-vs-remotion

Not verified in this research: Revideo's current licence, GSAP's current licence terms,
WhatsApp's current video size limits, and AWS Lambda cost per render. Check each before
relying on it.
