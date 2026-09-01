# Skerter

Personal developer site built as a restrained, mobile-first portfolio.

## Current direction

The accepted homepage concept is **Quiet Statement**:

- one editorial statement: `I build the parts you don't see.`;
- dark graphite background, bone typography, one orange accent;
- mobile composition is the source layout, not a reduced desktop version;
- no grids, counters, cursor tracking, canvas, WebGL, or decorative control panels;
- motion is short, CSS-only, and disabled by `prefers-reduced-motion`;
- the statement and the explicit `Projects` link lead to `/projects/`.

The homepage intentionally ships without client-side JavaScript. It uses one
local variable typeface, Commissioner, and static Astro output.

## Pages

- `/` — finished minimalist cover.
- `/projects/` — accepted image-free project index with internal case studies
  for DemoPlast and DCP.
- `/projects/demoplast/` — commercial backend case study: durable lead flow,
  isolated integrations, privacy, testing, and delivery.
- `/projects/dcp/` — ML/MLOps case study: one workflow across pandas, local
  Dask, and Kubernetes.
- `/contacts/` — direct email, Telegram, and GitHub links in the same repeated
  typographic system; no contact form or client-side JavaScript.

## Projects direction

The accepted projects concept is **Quiet Index**:

- project names carry the visual weight; the index does not depend on screenshots;
- every project uses one repeated module: number, name and type, one statement,
  and one action or status;
- the selected work is DemoPlast, DCP, and Huld;
- `DCP` is the display name; `Distributed churn prediction` remains in its
  metadata for clarity;
- DemoPlast and DCP expose one `Read case study` action; their repository and
  live-demo links live inside the case study. Huld is explicitly marked as
  private work in progress;
- there are no cards, technology chips, secondary live-demo links, bespoke
  project graphics, or entrance animations.

The page keeps the homepage's graphite, bone, muted, and orange palette and the
same Commissioner typeface. It also ships without client-side JavaScript.

## Development

On Windows, double-click `start-local.cmd` or run it from the project root. It
installs locked dependencies when needed and starts the site at
`http://127.0.0.1:4321/`.

```text
npm run dev
npm run check
npm run build
```

The baseline QA widths are 320–430 px mobile, 667×375 landscape, tablet, and
standard desktop sizes. Interaction must remain usable without hover.

## Design guardrails

Before adding an effect, it should justify both its visual role and runtime
cost. Preserve the current hierarchy: one idea, one accent, visible navigation,
and generous negative space. Do not restore the former pressure-grid concept
unless the overall direction is explicitly reconsidered. Do not add imagery to
the project index merely because portfolio pages conventionally use thumbnails;
reserve visuals for a case study only when they provide evidence.
