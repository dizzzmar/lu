# Lucía Clavijo — portfolio

A dark cinematic portfolio following Siena.film's style. React + Vite, Lenis smooth scrolling, an authored WebGL film surface and accessible animated overlays. All films and images remain explicit placeholders.

## Run
Requires Node.js 24 and npm.

```sh
npm ci --cache /tmp/npm-cache
npm run dev
```

Build: `npm run build`. Production preview: `npm run preview`.

## GitHub Pages
The workflow in `.github/workflows/deploy.yml` deploys the built `dist/` directory on pushes to `main`. Repository Settings → Pages should use **GitHub Actions** as its source, rather than publishing the source directory. Relative assets support the repository subpath. While legacy branch publishing is also enabled, the workflow waits for it to finish before publishing the compiled app, preventing the source files from replacing the site.

## Content and motion
Film placeholders and biography: `src/main.jsx`. Visual system: `src/style.css`. WebGL renderer: `src/FilmCanvas.js`. The normal DOM gallery is the fallback for reduced motion or unavailable WebGL. Touch scrolling remains native. The entrance is remembered per browser tab session; open a new tab or clear that tab's session storage to see it again.

The client logos and icons are in `public/brand/`; the original supplied PNGs are retained there. Final film media, email and credits are pending. Source mapping, temporary asset origins and validation notes live in `docs/research/siena/README.md`.

## About
Open `/#about` to link directly to the About page. It follows the user-selected Directed by Wes reference, with content in `src/AboutPage.jsx` and scoped styles in `src/about.css`. The portrait area currently contains a labeled brand placeholder, pending Lucía's photo. Reference measurements and checks are recorded in `docs/research/directedbywes/README.md`.

## Organic strokes
`src/InkMark.jsx` and `src/ink.css` define the authored line gestures used in the entrance, film selection, About and Contact. Colors inherit the existing theme. Touch and reduced-motion states remain usable without hover or drawing animations. Details and comparison captures are in `docs/design/organic-ink/`.
