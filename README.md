# A Little Place Made for You ♡

A romantic, scrapbook-inspired Next.js website with interactive letters, affection cards, secret notes, a playful quiz, confetti, and a music player.

## Run locally

1. Install Node.js 20.9 or newer.
2. Extract the project folder and open a terminal inside it.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Personalize the website

- `src/data/site-config.ts`: recipient name, nickname, sender name, and music title.
- `src/data/content.ts`: letter, affection cards, envelope messages, quiz questions, and final message.
- `src/app/globals.css`: colors, typography (Poppins, Playfair Display, Dancing Script), spacing, animations, and visual styling.
- `src/app/page.tsx`: interactive layout and behavior.

## Add music

Place an audio file you have permission to use at `public/music/our-song.mp3`. The browser may block autoplay; the visitor can start playback using the music controls. The rest of the website works without the audio file.

## Add real memories

The memory gallery currently uses explicitly labeled placeholders so it does not invent private relationship history. Replace those cards with your own photos, character avatars, screenshots, captions, and dates. Keep private screenshots out of public deployments unless both people are comfortable sharing them.

## Build for production

Run `npm run build`, then `npm start` to serve the production build.
