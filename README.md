# Build with AI workshop companion

Live: https://hermes-workshop-guide.vercel.app/

Static HTML, CSS, and JavaScript. No build step or backend. Vercel deploys `main`.

## Content

- `index.html`: welcome, instructors, helper names, live build brief.
- `app.js`: five Mac/Windows pre-work steps, help answers, navigation and local completion checkmarks.
- `styles.css`: responsive layout and summit-derived graphite, electric-blue, and lime palette.
- `assets/amaan.webp` and `assets/nadim.webp`: user-provided headshots. Amaan is in the grey sweater; Nadim is in the black T-shirt.
- `assets/summit-logo.png`: official logo from the linked summit guide, reused with the organizer's permission in this request.

## Add the real screenshots

Add a cropped, compressed screenshot under `assets/`. In `app.js`, change its entry in the `screenshots` map from `null` to the relative path, for example:

```js
'mac-editor': 'assets/mac-editor.webp',
```

The placeholder becomes an image automatically. Slots exist for both OS installations, the repository, .env on each OS, provider settings, and the running bot. Hide all real keys and personal data in screenshots. Do not substitute simulated bot replies for proof of a working API connection.

## Workshop checks

- The starter at https://github.com/amaanr/hermes-bot is private. Arrange attendee access or explicitly approve a visibility change before the workshop. This site does not grant access.
- Share the OpenAI key privately. Never put it into this website or repository. Use limited workshop credentials and revoke them after the event.
- The Node starter is a chat bot. Opportunity briefings are the live build goal; live search and scheduling are stretch features, not existing features.
- A native Windows dry run and a real OpenAI-key test of the bot are still needed. Website/browser tests do not validate those environments.
- Completion checkmarks are self-reported and saved only in the attendee's current browser. No keys or attendee information are collected.

## Sources

- Session: https://ipn-ai-youth-summit-guide.zainpunjwani.chatgpt.site/ and its `data.js`. September 12, 2026, 3–4 PM Eastern; advanced track in the Social Hall. Instructor/helper assignment comes from the organizer's request; the main conference guide combines tracks and does not list Nadim.
- Amaan's title/bio and helper roles: summit guide. Nadim's AI Build Academy role: co-host's previously supplied workshop materials. Bios are brief paraphrases.
- Install/provider steps: https://openchamber.dev/download, https://docs.openchamber.dev/providers/, https://opencode.ai/docs/.

The published site is the attendee guide; the former Notion draft is no longer the deliverable.
