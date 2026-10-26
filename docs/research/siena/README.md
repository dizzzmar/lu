# Siena reference and implementation

Reference inspected: https://www.siena.film/ . Public HTML, styles, desktop browser entry and post-entry scroll behavior inspected. Source captures at 1440×1000. Original mobile entrance inspected at 390×844; it has an entrance gate. Local mobile checked at 390×844 without a gate.

## Source → local mapping
- Siena `/` film gallery → local `/` with `#film-0` through `#film-3`.
- Film menu → local film-index dialog; selection scrolls to the selected placeholder.
- About/contact → local dialogs, adapted to Lucía's supplied context.
- Explore/case studies → explicitly labeled placeholder detail dialogs.

## Preserved and adapted — motion revision
Latest user instruction pins the original dark Siena style rather than the earlier lighter adaptation. Near-black canvas, cream ticket controls, uppercase film titles, large rounded stills, film-index navigation and Explore are retained. The original logo and films are not reused. The placeholder titles are now simply Untitled 01–04; promotional slogans have been removed.

A subdivided WebGL plane provides real scroll-velocity image deformation, with a 110ms damping response. Lenis interpolates wheel movement; pointer dragging includes release momentum. Touch scroll remains native. Masked entrance, line-cropped film-title reveals, animated selector state and interruptible clipped dialog transitions complete the movement system. Reduced motion disables WebGL and smooth spatial scrolling; native stills and brief opacity feedback remain. Rendering work stops when the scene is settled. This is a newly authored shader, not an exact reproduction of Siena's WebGL implementation.

Native dialogs retain keyboard focus, Escape dismissal, backdrop dismissal, and internal touch/wheel scrolling. LinkedIn and Behance remain the contact destinations. No client project, video, award, release date or fabricated email is added.

## Temporary imagery
All four landscapes are placeholders from Unsplash, not Lucía's work. No project attribution is implied.
- public/placeholders/dunes.jpg: https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2000&q=85
- public/placeholders/ocean.jpg: https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85
- public/placeholders/mountains.jpg: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85
- public/placeholders/light.jpg: https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85
Current fonts: Space Grotesk, Barlow Condensed and Manrope, sourced from the official google/fonts repository with OFL licenses stored beside the local font files. Earlier Bodoni Moda assets are retained but unused.

## Verification
Production Vite build passed. Chromium checks exercised both shader rendering and native still fallback. Desktop 1440×1000 and portrait 390×844 screenshots were inspected together. Wheel movement, drag release momentum, keyboard Home/PageDown navigation, index selection, modal navigation, film detail, Escape dismissal, remembered entrance, no-WebGL fallback, reduced-motion navigation and horizontal overflow checks passed with no runtime exceptions. WebGL smoke checks used Chromium software rendering; they prove shader compilation and geometry behavior, not physical-device frame-rate guarantees. Inline Impeccable review is recorded in `.impeccable/review/review.md`; the launcher was unavailable.

Comparisons contain the updated desktop/mobile gallery, entrance and menu screenshots plus the reference's settled gallery. No exact-clone or pixel-perfect claim is made.
