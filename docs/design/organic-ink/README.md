# Organic ink gestures

User approved applying the organic strokes discussed from https://a24.raviklaassens.com/ and the supplied screenshot. This borrows the open, pressure-varying contour language, not the site's discs, imagery or content. Lucía's actual scissors and star remain unchanged.

## Placements
- Entrance: two incomplete, offset arcs surround the logo and name; drawn once, with a delayed second pass.
- Gallery: a small gestural underline identifies the selected film in the existing rail. It replaces the selected straight line; frames remain clear of decoration.
- About: a double underline emphasizes “filmmaker.” The current portrait placeholder has a partial contour along one edge, ready to accompany a future photo.
- Contact: a curved arrow and an incomplete ellipse support Say Hello / Let's Talk. Fine-pointer hover and keyboard focus reveal the ellipses; touch devices show the final marks without requiring hover. The Contact title has a small black underline on its cream surface.

## Construction
`src/InkMark.jsx` defines original Bézier ribbons with separate inner/outer edges for variable thickness and tapered ends. SVG masks animate their reveal. Each instance uses a unique React-generated ID, `aria-hidden` and `pointer-events:none`. `src/ink.css` controls fixed drawing sequences, selected/revealed states and interaction. No dependency, raster texture, noise filter, cursor trail or continuous animation was added. Colors inherit the site's existing white/cream/black palette.

The entrance draws once; the existing tab-session entrance behavior remains. Portrait strokes draw when the existing observer reveals their region. Hover transitions are interruptible. Reduced motion shows stationary completed paths. Persistent About navigation now uses dark backing so it remains legible over the light portrait placeholder.

## Validation
Production build passed. Chromium checks passed at desktop and 390px mobile sizes, plus actual touch-mode emulation. Entrance/selected-film marks, About underline, portrait contour, contact arrow, fine-pointer hover, touch-only visibility, Contact navigation, mobile overflow, unique mask IDs and reduced-motion static paths were checked. No runtime exceptions observed. Screenshots were visually reviewed together; no physical-device performance claim is made.
