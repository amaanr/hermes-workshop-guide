# Build with AI workshop companion

Live: https://hermes-workshop-guide.vercel.app/

Static HTML, CSS, and JavaScript. No build step or backend. Vercel deploys `main`.

## Content

- `index.html`: the welcome page (what we're building, ideas, the hour, what you need, the crew), the setup shell, the locked "What we'll build" vault, and the help desk.
- `app.js`: five Mac/Windows setup steps as an accordion (only the first incomplete step opens by default), the "starting it up again" card, help answers, navigation, local completion checkmarks, the hero ASCII pyramid and vault ASCII torus renderers, and the vault (countdown, access code, in-browser decryption).
- `styles.css`: responsive layout in a warm editorial palette (cream paper, terracotta, deep teal) with Fraunces + Inter, modeled on the Module 1 deck. The vault switches to a dark retro style.
- `assets/brief.sealed.json`: the in-room build plan, encrypted with AES-256-GCM using a key derived from the access code (PBKDF2-SHA256). The plaintext is not in this repo.
- The home hero shows a spinning ASCII tetrahedron rendered in JavaScript, ported from montekkundan's MIT-licensed `ascii-pyramid` (21st.dev). It pauses when scrolled off-screen and holds still under reduced motion.
- The vault shows a spinning ASCII torus (the classic "donut") rendered live in JavaScript inside the CRT frame — no video files. It animates only while the vault is open and holds a single still frame under reduced motion.
- `assets/amaan.webp` and `assets/nadim.webp`: user-provided headshots, cropped face-centered so the avatar stack aligns. Amaan is in the grey sweater; Nadim is in the black T-shirt.
- `assets/summit-logo-ink.png` / `-rust.png` / `-white.png`: the official summit maple-leaf wordmark, recolored from the original white knockout (`summit-logo.png`) via its alpha mask for use on light and dark backgrounds. Reused with the organizer's permission for this request.

## The locked build plan

"What we'll build" shows a single-screen vault (an ASCII torus on a CRT on the left, code entry and a live countdown on the right) until someone enters the access code. Instructors read the code out in the room at 3 PM on Saturday; anyone who sets up at home can also try to guess it early. Decryption happens in the browser, and nothing is sent anywhere. Once unlocked, the plan stays open on that device until someone clicks "Lock this page again".

The code is deliberately guessable, so never put a real API key in the brief (the seal script refuses anything that looks like one).

To edit the plan or change the code, use the workshop tooling, which lives outside this repo:

1. Edit `tooling/workshop-brief.html`. For a new code, edit `tooling/workshop-code.mjs` too.
2. From `tooling/`, run `node seal-workshop.mjs`, then commit the new `assets/brief.sealed.json`.

`node seal-workshop.mjs --unseal` prints the published plan if the plaintext is ever lost.

## Add the real screenshots

Add a cropped, compressed screenshot under `assets/`. In `app.js`, change its entry in the `screenshots` map from `null` to the relative path, for example:

```js
'mac-editor': 'assets/mac-editor.webp',
```

Slots render nothing until an image is set, so the steps stay uncluttered. Slots exist for the basics install (`mac-tools`/`windows-tools`), the Hermes install (`mac-hermes`/`windows-hermes`), the editor (`mac-editor`/`windows-editor`), the connected repo (`repo`), and the running bot (`running`). Hide all real keys and personal data in screenshots. Do not substitute simulated bot replies for proof of a working connection.

## Workshop checks

- The starter at https://github.com/amaanr/wall-g-bot is public, so attendees can clone it with no invitation. `repoIsPrivate` is `false` in `app.js`, which hides the invitation, sign-in, and GitHub Desktop notes. Flip it back to `true` only if the repo ever returns to private.
- The Hermes install commands pass `--skip-setup` (Mac) / `-SkipSetup` (Windows). Without it, the installer opens Hermes's own setup wizard, whose default option is a Nous Portal sign-in. The help desk covers recovery for anyone who already went through it.
- Every step uses one project location, `~/wall-g-bot`, including the GitHub Desktop route, so restart instructions are the same for everyone.
- The bot is a web chat UI in front of a **local Hermes agent** (Hermes runs on the attendee's laptop; the app talks to it via Hermes's api_server). At home it uses a free, no-sign-up model (`opencode-free`); `npm run setup` wires this up automatically.
- Share the OpenAI key privately at the workshop. Never put it into this website, the sealed brief, or the repository. Use limited workshop credentials and revoke them after the event. Switching to it is `hermes model`. No code change needed.
- The starter is a chat bot. Opportunity briefings are the live build goal; live search and scheduling are stretch features Hermes can grow into, not existing starter features.
- A native Windows dry run is still needed. The Mac path (install → setup → gateway → web app) has been tested end-to-end. Website/browser tests do not validate the bot's runtime.
- Completion checkmarks and the unlocked state are saved only in the attendee's current browser. No keys or attendee information are collected.

## Sources

- Session: https://ipn-ai-youth-summit-guide.zainpunjwani.chatgpt.site/ and its `data.js`. September 12, 2026, 3–4 PM Eastern; advanced track in the Social Hall. Instructor/helper assignment comes from the organizer's request; the main conference guide combines tracks and does not list Nadim.
- Amaan's title/bio and helper roles: summit guide. Nadim's AI Build Academy role: co-host's previously supplied workshop materials. Bios are brief paraphrases.
- Install/provider steps: https://openchamber.dev/download, https://docs.openchamber.dev/providers/, https://opencode.ai/docs/, and the Hermes installers at https://hermes-agent.nousresearch.com/install.sh and `install.ps1`.

The published site is the attendee guide; the former Notion draft is no longer the deliverable.
