# LinkAni

Mobile-first dark UI prototype for an anime / manga / manhwa / webnovel / webcomic platform.
Plain HTML, CSS and JavaScript. No build step.

## Run
Open `index.html`, or serve the folder (`python3 -m http.server`).
Deploy free with GitHub Pages: Settings > Pages > branch `main`, folder `/ (root)`.

## Structure
- `css/styles.css` design tokens (`:root`) and components
- `js/app.js` data, state, components, screens, router
- Add a screen: `registerScreen('name', () => html)`, then add it to `NAV` or link with `data-go="name"`.

## Notes
- Titles, coins, chat and history are demo data saved in the browser (localStorage). A real app needs a backend: login, database, payments, live streaming, moderation.
- Public/Private toggle: Private chapters cannot be opened by readers.
- Only host content you own or are licensed to publish.
- Coins: earned by reading (+5 per new chapter) and daily check-in (+20); "Buy coins" is a demo. Real purchases need a payment provider and server-side balance checks, never browser-only.

## Install on phone (PWA)
Push to GitHub, enable Pages, open the https link in Chrome, menu > Add to Home Screen. Installing needs https (GitHub Pages provides it).
After changing any file, bump `CACHE` in `sw.js` so phones fetch the update.
