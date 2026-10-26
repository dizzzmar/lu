# Siena reference and implementation

Reference inspected: https://www.siena.film/ . Public HTML, styles, desktop browser entry and post-entry scroll behavior inspected. Source captures at 1440×1000. Original mobile entrance inspected at 390×844; it has an entrance gate. Local mobile checked at 390×844 without a gate.

## Source → local mapping
- Siena `/` film gallery → local `/` with `#film-0` through `#film-3`.
- Film menu → local film-index dialog; selection scrolls to the selected placeholder.
- About/contact → local dialogs, adapted to Lucía's supplied context.
- Explore/case studies → explicitly labeled placeholder detail dialogs.

## Preserved and adapted
Large rounded cinematic frames, ticket-like fixed navigation, film index, scroll exploration, pointer dragging, left-side quick navigation and exploration control. Adapted to warm ivory, brighter landscapes, expressive serif typography, direct navigation without an entry barrier, and touch-friendly portrait layouts.

This is an authored React adaptation, not a reuse of Siena's production bundles. Siena's WebGL scene transitions and shaders are not implemented; the local gallery uses native vertical scrolling and image scale on hover. No film playback exists because project media is intentionally absent. Temporary wordmark awaits a legible logo source. Direct email remains unset; LinkedIn/Behance provide functional contact destinations.

## Temporary imagery
All four landscapes are placeholders from Unsplash, not Lucía's work. No project attribution is implied.
- public/placeholders/dunes.jpg: https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2000&q=85
- public/placeholders/ocean.jpg: https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85
- public/placeholders/mountains.jpg: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85
- public/placeholders/light.jpg: https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85
Fonts: Bodoni Moda and Manrope, sourced from the official google/fonts repository with OFL licenses stored beside the local font files.

## Verification
Production Vite build passed. Chromium checked desktop and mobile. About dialog, Escape dismissal, placeholder details, film-index selection, current-film synchronization and contact links checked. No runtime exceptions and no mobile horizontal overflow observed. Bounded visual self-review used because the Impeccable launcher and its shipped reviewer were unavailable. Screenshots in comparisons/ show source and adapted results; this is not a claim of exact visual duplication.
