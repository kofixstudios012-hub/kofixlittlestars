# Kofix Little Stars
Static web app (HTML/CSS/JS), no backend, no API keys, no build step.
**Preview:** open `index.html`, or run `python3 -m http.server` here and visit http://localhost:8000.
**Netlify:** drag this folder (or the ZIP contents) onto app.netlify.com/drop.
**GitHub Pages:** push these files to a repo, then Settings > Pages > deploy from the main branch root.
**Customize:** edit the data arrays at the top of `app.js` (`A` animals, `C` colors, `L` letters, `K` kindness scenes). Levels live in `LV()`.
**Data:** progress and settings are stored in localStorage only. Parent settings sit behind a small maths gate.
**Helper:** "Starry" is a local keyword helper, not a live AI. A real model would need your own server so keys are never in browser code, and would cost money.
**Offline:** a small service worker (sw.js) lets it keep working without internet after the first visit. Starry's Wikipedia lookups need internet and can be switched off in Settings.

**Install on a phone:** open the deployed link, then Add to Home Screen. Works in any modern browser on Android, iOS, tablets and laptops. Voice input (microphone) works in Chrome, Edge and Safari, not Firefox. Change the WhatsApp number in `index.html` (the `wa.me` link).
