# Build with AI workshop companion

Live: https://hermes-workshop-guide.vercel.app/

Static HTML, CSS, and JavaScript. No build step or backend. Vercel deploys `main`.

## Content

- `index.html`: welcome, instructors, helper names, live build brief.
- `app.js`: five Mac/Windows pre-work steps as a collapse/expand accordion (only the first-incomplete step opens by default), help answers, navigation, and local completion checkmarks.
- `styles.css`: responsive layout in a warm editorial palette — cream paper, terracotta, deep teal — with Fraunces (serif display) + Inter, modeled on the Module 1 deck.
- `assets/amaan.webp` and `assets/nadim.webp`: user-provided headshots, cropped face-centered so the avatar stack aligns. Amaan is in the grey sweater; Nadim is in the black T-shirt.
- `assets/summit-logo-ink.png` / `-rust.png` / `-white.png`: the official summit maple-leaf wordmark, recolored from the original white knockout (`summit-logo.png`) via its alpha mask for use on light and dark backgrounds. Reused with the organizer's permission for this request.

## Add the real screenshots

Add a cropped, compressed screenshot under `assets/`. In `app.js`, change its entry in the `screenshots` map from `null` to the relative path, for example:

```js
'mac-editor': 'assets/mac-editor.webp',
```

The placeholder becomes an image automatically. Slots exist for the basics install (`mac-tools`/`windows-tools`), the Hermes install (`mac-hermes`/`windows-hermes`), the editor (`mac-editor`/`windows-editor`), the connected repo (`repo`), and the running bot (`running`). Hide all real keys and personal data in screenshots. Do not substitute simulated bot replies for proof of a working connection.

## Workshop checks

- The starter at https://github.com/amaanr/hermes-bot is private. Arrange attendee access or explicitly approve a visibility change before the workshop. This site does not grant access.
- The bot is a web chat UI in front of a **local Hermes agent** (Hermes runs on the attendee's laptop; the app talks to it via Hermes's api_server). At home it uses a free, no-sign-up model (`opencode-free`); `npm run setup` wires this up automatically.
- Share the OpenAI key privately at the workshop. Never put it into this website or repository. Use limited workshop credentials and revoke them after the event. Switching to it is `hermes model` — no code change.
- The starter is a chat bot. Opportunity briefings are the live build goal; live search and scheduling are stretch features Hermes can grow into, not existing starter features.
- A native Windows dry run is still needed. The Mac path (install → setup → gateway → web app) has been tested end-to-end. Website/browser tests do not validate the bot's runtime.
- Completion checkmarks are self-reported and saved only in the attendee's current browser. No keys or attendee information are collected.

## Sources

- Session: https://ipn-ai-youth-summit-guide.zainpunjwani.chatgpt.site/ and its `data.js`. September 12, 2026, 3–4 PM Eastern; advanced track in the Social Hall. Instructor/helper assignment comes from the organizer's request; the main conference guide combines tracks and does not list Nadim.
- Amaan's title/bio and helper roles: summit guide. Nadim's AI Build Academy role: co-host's previously supplied workshop materials. Bios are brief paraphrases.
- Install/provider steps: https://openchamber.dev/download, https://docs.openchamber.dev/providers/, https://opencode.ai/docs/.

The published site is the attendee guide; the former Notion draft is no longer the deliverable.
