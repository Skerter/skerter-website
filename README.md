# Skerter

Personal developer site built as a restrained, mobile-first portfolio cover.

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
- `/projects/` — placeholder for the serious project case studies; this is the
  next product surface to design and build.

## Development

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
unless the overall direction is explicitly reconsidered.
