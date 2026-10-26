---
name: Lucía Clavijo
description: Cinema gallery following the user-pinned Siena reference
colors:
  canvas: "#080808"
  paper: "#f5f2e9"
  ink: "#10100f"
  line: "#bdb9ae"
typography:
  display:
    fontFamily: "Space, sans-serif"
    fontWeight: 500
    letterSpacing: "-0.04em"
    lineHeight: 0.86
  identity:
    fontFamily: "Space, sans-serif"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
rounded:
  film: "48px"
  film-mobile: "22px"
  thumbnail: "4px"
spacing:
  film-gutter: "4.4vw"
  film-gap: "32px"
  mobile-gutter: "12px"
---
# Design system: Lucía Clavijo

## Overview
The user explicitly chose Siena.film's original style for this revision. Dark cinema field, cream ticket navigation, large uppercase film titles, and immersive movement replace the earlier light editorial treatment. The work is the visual focus. All films remain labeled placeholders. Copy is factual and concise.

## Colors
Canvas grounds the gallery and entrance. Paper is used for lettering and ticket controls; menus reverse to paper with ink lettering. Gradients only support legibility over photography.

## Typography
Space Grotesk supplies the geometric uppercase film titles and menu. The client-supplied scissors-and-star artwork now supplies the identity, with a compact Space Grotesk name label; Barlow Condensed remains the large footer lettering. Manrope is used for biography text. Fonts are locally hosted with OFL licenses. Siena's proprietary fonts are not reused.

## Layout
Fixed identity at upper left and ticket selector at upper right. Film surfaces occupy nearly one viewport, with the next frame visible beneath. Text and credits sit at lower left; Explore sits opposite. On mobile, film credits stay below the title, the ticket becomes compact, and the film rail moves to the bottom. Overlays collapse from two columns to one.

## Elevation & Depth
Image curvature is real vertex displacement on a subdivided WebGL surface. Scroll velocity drives the bend; damping returns it to rest. Native DOM stills provide a full fallback. The menu backdrop separates focused navigation from the gallery.

## Shapes
Film surfaces have broad rounded corners. Small ticket notches and a perforated divider echo the explicit Siena reference. No card grid or ornamental frame system is introduced.

## Components
The entry gate lifts as a masked screen; the original scissors artwork fades and lifts gently with it. The entrance is remembered per tab session. Film titles reveal through line masks as their frame enters view. Lenis supplies interpolated desktop wheel scrolling; touch scroll remains native. Drag release carries momentum. Film-index navigation shares the same scroll mechanism. Menus use interruptible clipped entry/exit with native dialog semantics, focus containment and Escape dismissal.

Reduced motion uses native scrolling and DOM stills, removes image distortion and spatial movement, and retains short opacity feedback. Rendering work is skipped at rest; DPR is capped at 1.5; only nearby film surfaces are drawn. No claims of real-device frame-rate validation are made.

## Do's and Don'ts
- Do preserve Siena's pinned dark palette, compact ticket controls and cinema gallery proportions.
- Do keep project names, media and credits explicitly provisional until supplied.
- Do use motion to connect gallery positions and navigation states.
- Don't add generic imagination slogans, invented testimonials, awards or project claims.
- Don't replace the client identity with Siena's logo or borrow its film footage.

Brand assets are documented in public/brand/README.md. The header and entrance use the original white scissors mark; the cream menu uses the same silhouette rendered black. The standalone star supplies footer signatures, scheme-aware favicons, home-screen icons and a branded share image. Preserve the original shapes; do not redraw them.
