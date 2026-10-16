# Kiwi Systems

Kiwi’s websites, applications and Kiwi Commerce landing page. Standalone static site hosted on GitHub Pages. French, English and Arabic with RTL.

## Local preview

`python3 -m http.server 8080 --bind 127.0.0.1`

Open http://localhost:8080. ES modules require HTTP; opening index.html as a file will not load the scene.

## Shared Kiwi OS identity

- `scene.js` ports the original landing’s scene module 47373: same animated GLB, alpha texture, camera, lights, material, bloom, tone mapping, hue adjustment, pointer easing and scroll keyframes.
- `assets/vendor/kiwi-three.js` contains the exact shipped Three.js r170 and postprocessing code. `kiwi-loaders.js` contains the original GLTF and Draco loaders. `tools/extract-parent-runtime.py` regenerates these from the parent repository’s shipped chunks.
- `scroll.js` uses the original Lenis 1.3.25 runtime and its desktop scroll settings; touch and reduced-motion keep native scrolling.
- `app.js` ports Kiwi’s liquid-lens navigation behavior (module 98291), including the 115ms stretch before settling. The custom locale dropdown follows the parent landing’s component.
- Colors follow the landing tokens: black, white, `#00ffae` accent and translucent surfaces. Official SVG artwork retains the approved brand colors.
- Systems uses the official Kiwi mark and the same descriptor layout as the approved Commerce lockup. Descriptor lettering is outlined Inter Tight, removing font substitution in SVG images. `tools/build-lockups.py` documents generation.
- Inter Tight and IBM Plex Sans Arabic are served locally with their font licenses.

The 3D model actually animates; the scene poster is used only when WebGL fails. Reduced-motion preference freezes model animation, pointer movement and UI transitions. Hidden tabs skip scene rendering.

## Interactions

The three hero tabs explore the services. Contact service selection prepares a relevant WhatsApp message; only the visitor sends it. The Commerce confirmation demo uses local sample data, visibly labelled. It never connects to merchant data.

## Validation

`NODE_PATH=/path/to/playwright/node_modules node tools/browser-check.cjs http://127.0.0.1:8080`

Uses installed Chrome and Playwright. Covers actual WebGL asset loading and advancing animation time; liquid-lens motion; language switching and RTL; responsive layouts; service tabs; keyboard/mobile navigation; COD demo; contact selection; reduced motion and browser errors.

## Publishing

GitHub Pages serves the `main` branch at its root. Relative module and asset URLs support project Pages. No Cloudflare configuration or deployment is used.
