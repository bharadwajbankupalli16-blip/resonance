# RESONANCE — Landing, Login & Dashboard

A responsive Next.js 16 starter for RESONANCE, an AI resume intelligence and career platform. Includes the landing page, login/sign-up UI, a dashboard preview, and a persistent Light / Dark / System theme switch using coral and teal brand colors.

## Requirements
- Node.js 20.9+ recommended
- npm

## Run locally
1. Extract the ZIP.
2. Open the `RESONANCE_Complete_Website` folder in VS Code (the folder containing `package.json`).
3. Open Terminal in that folder.
4. Run `npm install`
5. Run `npm run dev`
6. Open http://localhost:3000

## Routes
- `/` — landing page
- `/login` — login/sign-up UI
- `/dashboard` — dashboard preview

## Theme
Use the floating theme control at the bottom-right to cycle through Light, Dark, and System. Your preference is saved in local storage.

## Important notes
The dashboard is a frontend starter. Metrics are placeholders until resume analysis and user data storage are connected. Login/signup and social sign-in are UI only; no credentials are sent or stored. Job alerts need a real job data source and notification service.

## Included
- `app/page.js` — landing page
- `app/login/page.js` — login and sign-up UI
- `app/dashboard/page.js` — dashboard and career tools overview
- `app/theme-toggle.js` — persistent theme switch
- `app/globals.css` — styles, responsive layout, themes and animations
- `app/layout.js` — shared layout and metadata
- `public/resonance-logo.png` — brand asset
