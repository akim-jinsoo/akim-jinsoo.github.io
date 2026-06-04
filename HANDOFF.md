# Pass-Off Instructions

## Current State
- The publications data lives in `src/data/user.js`.
- The fused estimation paper has been removed from the publications list.
- The ARISTO publication now includes an arXiv link.
- The arXiv link is styled as a pill button with the official Academicons arXiv glyph.
- The Publications page and homepage publications preview both use the shared publication data.

## Important Files
- `src/data/user.js`
- `src/pages/publications.jsx`
- `src/pages/styles/publications.css`
- `src/components/homepage/publications.jsx`
- `src/components/homepage/styles/publications.css`
- `public/index.html`

## Run / Verify
- Install dependencies: `npm install`
- Start the app: `npm start`
- Build for production: `npm run build`

## Notes
- The arXiv icon comes from Academicons.
- The repo uses the shared `publications` array in `src/data/user.js`, so one change updates both the homepage preview and the dedicated publications page.
- If the browser styling looks off, check that the Academicons stylesheet is still loaded in `public/index.html`.

## Watchouts
- The repository has a few existing npm deprecation warnings during install; they are warnings, not a blocking failure.
- If you want to change the ARISTO publication link or styling again, update the shared data entry first, then adjust the two publication renderers only if needed.
