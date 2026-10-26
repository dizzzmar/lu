# Directed by Wes — About reference

## Scope and route map
User request: use https://directedbywes.com/ as the reference for Lucía's About surface. The site's upper-right burger opens a full-viewport About overlay; the hidden About text itself is not the navigation trigger. Source behavior was inspected in Chromium at 1440×1000 and 390×844, including actual pointer activation and wheel scrolling.

Source About overlay → local `/#about`. Existing menu and footer About actions open the same surface. Direct links skip the entrance; closing clears the About hash and returns to the gallery. Other gallery, project, navigation and Contact layouts are retained.

## Measured rules
- Full viewport dark overlay, with the currently playing image blurred beneath the first viewport and black beneath the biography.
- Persistent left About label at approximately 16px left / 105px top; framed client mark at lower left.
- Main column starts around 41% of the viewport. Introduction starts at approximately 31vh; 34.5px regular text at 1440px and a readable line length around 710px.
- Small client and contact rows sit beneath a fine horizontal rule.
- Split location line, large portrait, biography, signature, oversized Say Hello and a Back to Top control form the scrolling sequence.
- Mobile uses a single column, with the About label and framed client mark above the introduction. The reference's resize-time word clipping was not reproduced: local word animation releases its transforms on completion.

## Implementation and assets
`src/AboutPage.jsx` owns content, the framed client-name rotation, scoped Lenis scroll instance, local scroll progress and Back to Top. `src/about.css` scopes the reference composition to `.about-overlay`; `src/main.jsx` owns modal state, URL synchronization and transition to Contact.

Introduction, clients and biography use information supplied by the user: AI filmmaking and editing, seven years' experience, Verizon/Google/Lexus/Iberdrola/Unilever, WPP Production/Hogarth, The Ocean Race and LABASAD. No source biography, film, awards, social accounts, logo or portrait is used. Client names are text, not invented logo artwork.

The first-viewport atmosphere uses the currently selected existing placeholder still. The portrait area explicitly uses a client-branded placeholder until Lucía supplies a suitable photograph. Existing supplied brand PNGs are reused. Manrope substitutes for the reference's proprietary PP Neue Montreal; no new font or source bundle is copied.

## Motion and access
Word crops introduce the bio; a separate Lenis instance smooths wheel scrolling inside the overlay while touch scrolling remains native. Sticky navigation, Escape dismissal and native dialog focus containment remain. Content has visible defaults; IntersectionObserver reveals below-fold sections once. Reduced motion uses native scrolling, stationary text and static client names. Animation fill is released after the intro to avoid stale line clips when resizing.

## Validation
Production Vite build passed. Browser checks passed for direct #about access, menu access, desktop/mobile horizontal overflow, wheel scrolling, About-to-Contact transition with scroll reset, Escape/hash cleanup, Back to Top and reduced-motion text. No runtime exceptions observed. Desktop/mobile screenshots and the scrolled portrait region were inspected; comparisons are in this directory. This is an authored adaptation, not an exact reproduction. The client portrait remains the explicit missing asset.
