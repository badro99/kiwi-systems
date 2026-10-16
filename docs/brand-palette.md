# ÉDITION LIMITÉE · BOUGAINVILLÉE

Explicitly selected for the entire Kiwi Systems website on 2026-10-16. Reference: the Bougainvillée section of Kiwi’s existing `brand.html`. The site background remains pure black.

| Role | Original family | Bougainvillée |
|---|---|---|
| Deep tint | Deep Kiwi / dark green | Nuit `#1B0E2E` |
| Dark supporting shade | Deep structural green | Velours `#5C1F4E` |
| Main brand shade | Growth / Atlas / Signal green | Vif `#C1487E` |
| Bright accent | Mint / neon green | Fleur `#FF8FC8` |
| Background | Black | Black `#000000` |

Neutral white and gray text retains its contrast. Accent text, status dots, borders, gradients, focus indicators, selection colors, connection animations and navigation tints use the corresponding Bougainvillée values with the existing opacity levels.

The existing Systems, Commerce, Kiwi wordmark, monogram, sparkle and favicon files are recolored in place. Their vector outlines, proportions and typography remain unchanged. No alternate or replacement mark is introduced into Kiwi OS.

The WebGL model, animation, camera, interaction and scroll timing remain the original Kiwi scene. Its material uses Vif and Fleur; its point lights use Vif and Fleur. The original green-producing hue grade is removed so it cannot override the new palette. The canvas clear color remains black.

The fallback posters are captured from this real scene with `tools/capture-posters.cjs`, then encoded to the existing WebP filenames. They are displayed only if WebGL fails. The social-preview image uses the same updated landscape poster.

`brand-palette.json`, `theme.js` and the CSS custom properties record the four exact reference colors. `tools/palette-check.cjs` audits palette consistency, existing SVG assets, and old green literals in authored runtime files.

This standalone repository lives at `Documents/kiwi-systems`. The Kiwi OS repository and master brand files are untouched.
