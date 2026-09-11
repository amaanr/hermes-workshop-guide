const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The starter repo is public at github.com/amaanr/wall-g-bot, so the
// invitation, GitHub sign-in and GitHub Desktop notes are hidden. Flip this
// back to true only if the repo ever returns to private.
const repoIsPrivate = false;

const command = (label, text) =>
  `<div class="command"><div class="command-top"><span class="command-label">${icon("code")}${escapeHTML(label)}</span><button class="copy-button" type="button" aria-label="Copy the ${escapeHTML(label)} command">${icon("copy")}<span>Copy</span></button></div><pre><code>${escapeHTML(text)}</code></pre></div>`;
const miniNote = (text, variant = "") =>
  `<div class="mini-note${variant ? " " + variant : ""}">${icon(variant === "guard" ? "lock" : "compass")}<div>${text}</div></div>`;
const checkpoint = (text) =>
  `<div class="checkpoint">${icon("check")}<div><strong>You'll know it worked when</strong> ${text}</div></div>`;
const instruction = (marker, title, body) =>
  `<div class="instruction"><h4><span class="marker">${marker}</span>${title}</h4>${body}</div>`;
const linkButton = (href, text) =>
  `<div class="download"><a class="button button-solid button-download" href="${href}" target="_blank" rel="noopener"><span>${text}</span>${icon("external")}</a><span class="download-hint">${icon("external")}Opens in a new tab</span></div>`;

// Set a value to a relative path (e.g. "assets/mac-tools.webp") when a real
// screenshot is ready. Until then the slot renders nothing, so the steps stay
// uncluttered. Hide keys and personal data in any screenshot you add.
const screenshots = {
  "mac-tools": null,
  "windows-tools": null,
  "mac-hermes": null,
  "windows-hermes": null,
  "mac-editor": null,
  "windows-editor": null,
  repo: null,
  running: null,
};
function screenshot(id, title, caption) {
  const source = screenshots[id];
  if (!source) return "";
  return `<figure class="setup-shot"><img src="${escapeHTML(source)}" alt="${escapeHTML(title)}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
}

const stages = [
  {
    title: "Install the basics",
    sub: "Node.js and Git, the tools everything runs on",
    time: "10–20 min",
  },
  {
    title: "Install Hermes",
    sub: "The AI engine behind your assistant",
    time: "10–20 min",
  },
  {
    title: "Set up your editor",
    sub: "OpenCode, then the OpenChamber app",
    time: "5–10 min",
  },
  {
    title: "Get the starter code",
    sub: "Download the project and connect it to Hermes",
    time: "5–10 min",
  },
  {
    title: "Run it and see it work",
    sub: "Your first real reply",
    time: "5 min",
  },
];

function stageContent(os, step) {
  const mac = os === "mac";
  const app = mac ? "Terminal" : "PowerShell";
  const npm = mac ? "npm" : "npm.cmd";
  const enter = mac ? "Return" : "Enter";
  // Friendly label for terminal blocks: "Paste into Terminal" reads as a
  // gentle instruction instead of a shouty "TERMINAL" noun.
  const paste = `Paste into ${app}`;
  if (step === 1)
    return (
      `<p class="step-lede">New to typing commands? No problem. You'll copy a line, paste it, and press ${enter}. Already have Node.js and Git? Skip to <strong>C</strong>.</p>` +
      instruction(
        "A",
        "Install Node.js",
        `<p>Node.js runs the chat app. On the download page, choose the <strong>LTS</strong> version and the ready-made <strong>installer</strong>. You can ignore every other option.</p>${linkButton("https://nodejs.org/en/download", "Download Node.js")}<p>${
          mac
            ? "Pick <strong>macOS Installer (.pkg)</strong>, open it, and click through with the defaults. It asks for your Mac's password. That's normal."
            : "Pick <strong>Windows Installer (.msi)</strong>: x64 for most laptops, ARM64 for Snapdragon or other ARM laptops. Run it with the defaults and click <strong>Yes</strong> when Windows asks for permission."
        }</p>`,
      ) +
      instruction(
        "B",
        mac ? "Open Terminal and check for Git" : "Install Git, then open PowerShell",
        mac
          ? `<p>Press <strong>Command + Space</strong>, type <strong>Terminal</strong>, and press Return. Paste this line and press Return:</p>${command(paste, "git --version")}<p>If a box offers to install <strong>Command Line Tools</strong>, click <strong>Install</strong> and let it finish. It can take 10–20 minutes. Already see a version number? You're set.</p>`
          : `${linkButton("https://git-scm.com/downloads/win", "Download Git for Windows")}<p>Run it and keep every default. Then open the <strong>Start menu</strong>, type <strong>PowerShell</strong>, and open it. No admin mode or WSL needed.</p>`,
      ) +
      instruction(
        "C",
        "Check they're installed",
        `<p>Close ${app} and open it again so it sees the new tools. Paste all three lines and press ${enter}:</p>${command(paste, `node --version\n${npm} --version\ngit --version`)}${mac ? "" : miniNote("We write <code>npm.cmd</code> on Windows so you never have to change PowerShell's script settings. It's the same npm.")}${screenshot(`${os}-tools`, `${mac ? "macOS" : "Windows"}: version check`, "Your three version numbers.")}${checkpoint("you see three version numbers and no “not found”. Node's should be v22.13 or higher.")}`,
      )
    );
  if (step === 2)
    return (
      `<p class="step-lede">Hermes is the AI engine behind your assistant. One command installs it along with everything it needs. It's the biggest download, so start it and let it run.</p>` +
      instruction(
        "A",
        "Run the installer",
        `<p>Paste this into ${app} and press ${enter}. It can take 10–20 minutes, with lots of text scrolling past.</p>${command(
          app,
          mac
            ? "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup"
            : "& ([scriptblock]::Create((irm https://hermes-agent.nousresearch.com/install.ps1))) -SkipSetup",
        )}${miniNote(`The <code>${mac ? "--skip-setup" : "-SkipSetup"}</code> part skips Hermes's own setup questions, because the starter sets things up for you in step 4. When the installer finishes, it suggests commands like <code>hermes setup</code>. You don't need those.`)}<p>When it's done, ${mac ? "quit Terminal (<strong>Command + Q</strong>) and open it again" : "close PowerShell and open it again"}.</p>`,
      ) +
      instruction(
        "B",
        "Check it worked",
        `<p>Run:</p>${command(paste, "hermes --version")}${screenshot(`${os}-hermes`, `${mac ? "macOS" : "Windows"}: Hermes installed`, "The Hermes version line.")}${checkpoint("you see a line starting with <strong>Hermes Agent</strong> and a version number.")}${miniNote(`Got asked “How would you like to set up Hermes?” The <a href="#help">Help desk</a> explains what to do.`)}`,
      )
    );
  if (step === 3)
    return (
      `<p class="step-lede">This is where you'll change your assistant with AI help. <strong>OpenCode</strong> is the engine and <strong>OpenChamber</strong> is the friendly app on top. Install them in that order.</p>` +
      instruction(
        "A",
        "Install OpenCode",
        `<p>Paste this into ${app}:</p>${command(paste, mac ? "curl -fsSL https://opencode.ai/install | bash" : "npm.cmd install -g opencode-ai")}<p>Close and reopen the window, then check it:</p>${command(paste, mac ? "opencode --version" : "opencode.cmd --version")}`,
      ) +
      instruction(
        "B",
        "Download OpenChamber",
        `${linkButton("https://openchamber.dev/download", "Download OpenChamber")}<p>${
          mac
            ? "Not sure which Mac you have? <strong>Apple menu → About This Mac.</strong> An M-series “Chip” means <strong>Apple Silicon</strong>. An Intel processor means <strong>Intel</strong>."
            : "Not sure which to pick? <strong>Settings → System → About → System type.</strong> x64 means <strong>Windows (x64)</strong>. ARM means <strong>Windows (arm64)</strong>."
        }</p><p>${mac ? "Open the .dmg, drag OpenChamber into Applications, and open it from there." : "Run the installer, then open OpenChamber."}</p>${screenshot(`${os}-editor`, `${mac ? "Mac" : "Windows"}: OpenChamber`, "OpenChamber's first screen.")}${miniNote("Already use Cursor, Claude Code, or another AI coding app? Use that instead and skip this step.")}${checkpoint("OpenChamber opens without an “OpenCode not found” message, or your own AI coding app is ready.")}`,
      )
    );
  if (step === 4) {
    const desktopRoute = `<details class="inline-help"><summary>Use GitHub Desktop instead</summary><div><ol><li>Install <a href="https://desktop.github.com/download/" target="_blank" rel="noopener">GitHub Desktop</a> and sign in.</li><li><strong>File → Clone repository → URL</strong>, and paste <code>https://github.com/amaanr/wall-g-bot</code>.</li><li>Next to <strong>Local path</strong>, click <strong>Choose…</strong> and pick your home folder (the one named after you), so the path ends in <strong>wall-g-bot</strong>. Then click <strong>Clone</strong>.</li><li>In ${app}, run <code>cd ~/wall-g-bot</code> and carry on with <strong>B</strong> below. Don't clone twice.</li></ol></div></details>`;
    const signIn = mac
      ? miniNote(
          "If Terminal asks for a <strong>Username</strong> or <strong>Password</strong>, press <strong>Control + C</strong> and use GitHub Desktop instead. GitHub won't accept your normal password here.",
          "guard",
        )
      : miniNote(
          "A GitHub sign-in window may pop up. Sign in with the account we invited.",
        );
    return (
      `<p class="step-lede">Now grab the starter project, a small chat app, and connect it to Hermes with one command.</p>` +
      (repoIsPrivate
        ? miniNote(
            "<strong>You need access first.</strong> The starter is private for now. Sign in to GitHub and accept the invitation we sent. A “404” page just means your access hasn't landed yet.",
            "guard",
          )
        : "") +
      instruction(
        "A",
        "Download it to your laptop",
        `<p>Paste these three lines into ${app} and press ${enter}. They put the project in your home folder, so it's easy to find again.</p>${command(paste, "cd ~\ngit clone https://github.com/amaanr/wall-g-bot.git\ncd wall-g-bot")}${repoIsPrivate ? signIn + desktopRoute : ""}`,
      ) +
      instruction(
        "B",
        "Install it and connect it to Hermes",
        `<p>Still inside <strong>wall-g-bot</strong>, run these two. Do this before you start Hermes in step 5.</p>${command(paste, `${npm} install\n${npm} run setup`)}<p>Setup connects the chat app to Hermes and turns on a <strong>free model</strong> that needs no account or key. It also makes a private connection password called <code>API_SERVER_KEY</code>. That isn't an OpenAI key and it costs nothing. Just keep it to yourself.</p>${screenshot("repo", "The starter, connected", "Setup finishing with “All set!”.")}${checkpoint("setup finishes with <strong>“All set!”</strong>.")}`,
      )
    );
  }
  return (
    `<p class="step-lede">The finish line: a real reply from your own assistant. You'll use two ${app} windows, one for Hermes and one for the chat app.</p>` +
    instruction(
      "A",
      "Start Hermes in window 1",
      `<p>In the window you've been using, run this and leave it open:</p>${command(paste, "hermes gateway")}<p>Lots of text scrolls past, including warnings about optional extras you haven't set up. That's expected. If it stops with an error and gives you back the prompt, check the <a href="#help">Help desk</a>.</p>`,
    ) +
    instruction(
      "B",
      "Start the chat app in window 2",
      `<p>${mac ? "Press <strong>Command + N</strong> to open a new Terminal window." : "Open a <strong>second</strong> PowerShell window from the Start menu."} Paste these two lines:</p>${command(paste, `cd ~/wall-g-bot\n${npm} run dev`)}<p>Leave it open once it says it's running at <strong>http://localhost:3000</strong>.</p>`,
    ) +
    instruction(
      "C",
      "Say hello",
      `${linkButton("http://localhost:3000", "Open localhost:3000")}<p>If a bar asks you to start <code>hermes gateway</code>, give it a few seconds. It disappears by itself once the chat app finds Hermes. Then send <strong>“Reply only with: Hermes is ready.”</strong> The welcome screen doesn't count. You need a reply.</p>${miniNote(`The free model is shared by lots of people, so the first reply can take a couple of minutes. Please don't send it anything personal. Nothing after three minutes? Keep both windows open and check the <a href="#help">Help desk</a>.`)}${screenshot("running", "A real reply in your browser", "Your test conversation.")}${checkpoint("a real reply appears in your browser. You're ready for Saturday! 🎉")}`,
    )
  );
}

function restartHTML() {
  const mac = state.os === "mac";
  const app = mac ? "Terminal" : "PowerShell";
  const npm = mac ? "npm" : "npm.cmd";
  return `<section class="restart" aria-labelledby="restart-title">
    <span class="eyebrow">On Saturday, or any time</span>
    <h2 id="restart-title">Starting it up again</h2>
    <p>Closed everything after setup? That's fine. Nothing is lost. Open two ${app} windows:</p>
    <div class="restart-grid">${command(`Window 1 · ${app}`, "hermes gateway")}${command(`Window 2 · ${app}`, `cd ~/wall-g-bot\n${npm} run dev`)}</div>
    <p>Then open <a href="http://localhost:3000" target="_blank" rel="noopener">localhost:3000</a>. On Saturday, bring your laptop <strong>and its charger</strong>.</p>
  </section>`;
}

const helpItems = [
  [
    "Laptop",
    "I only have a Chromebook, iPad, or a locked school laptop",
    `<p>These tools need a Mac or Windows laptop you can install apps on. If you can, borrow one from family or a friend for the day. If not, tell a helper when you arrive. You can pair up with someone and still build.</p>`,
  ],
  repoIsPrivate && [
    "Access",
    "The GitHub page says 404 or “not found”",
    `<p>The starter is private. Sign in to the GitHub account we invited and accept the invitation, or ask a facilitator for access. The guide being public doesn't make the code public.</p>`,
  ],
  repoIsPrivate && [
    "Access",
    "Terminal asks for a GitHub username or password",
    `<p>Press <strong>Control + C</strong> to cancel. GitHub no longer accepts your normal password there. Use the GitHub Desktop route in <a href="#setup/mac/4" data-setup-step="4">step 4</a> instead. It signs you in through your browser.</p>`,
  ],
  [
    "Install",
    "The Hermes installer started asking setup questions",
    `<p>That's Hermes's own setup wizard (“How would you like to set up Hermes?”). It appears if the install command ran without its skip-setup part. You don't need it: press <strong>Control + C</strong> to leave. Hermes is already installed by then. Close and reopen your window, then carry on with <code>hermes --version</code>.</p><p>Already picked an option or signed in to something? Run <code>hermes config set model.provider auto</code>, then run the setup command from <a href="#setup/mac/4" data-setup-step="4">step 4</a> again inside <strong>wall-g-bot</strong>. That puts you back on the free model.</p>`,
  ],
  [
    "Windows",
    "“npm.ps1 cannot be loaded” / scripts disabled",
    `<p>Use <code>npm.cmd</code> instead of <code>npm</code>, for example <code>npm.cmd install</code> and <code>npm.cmd run dev</code>. For OpenCode use <code>opencode.cmd --version</code>. No need to change your script settings.</p>`,
  ],
  [
    "Install",
    "“command not found” for node, npm, git, hermes, or opencode",
    `<p>Close the Terminal or PowerShell window completely and open it again. New tools only show up in fresh windows. On a Mac you can also run <code>source ~/.zshrc</code>. Then run the check again.</p><p>On a Mac, install Command Line Tools if <code>git --version</code> asks. On Windows, keep the installers' default options, which add the tools for you. Ask a helper before changing system settings.</p>`,
  ],
  [
    "Security",
    "My computer blocks an installer",
    `<p>First confirm you downloaded the matching build from <a href="https://openchamber.dev/download" target="_blank" rel="noopener">openchamber.dev/download</a>. On Mac, a verified app may offer <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>. Windows may offer <strong>More info → Run anyway</strong>. Don't disable protections or bypass a managed laptop. Grab a helper and we'll find a path.</p>`,
  ],
  [
    "Folder",
    "“Could not read package.json”",
    `<p>You're in the wrong folder. Run <code>cd ~/wall-g-bot</code> first (or type <code>cd </code> and drag the folder in), then try again. If you already downloaded the project once, use that copy rather than downloading it again.</p>`,
  ],
  [
    "Hermes",
    "The page asks me to start hermes gateway",
    `<p>That bar means the chat app can't reach Hermes yet. In window 1, run <code>hermes gateway</code> and leave it open. The bar clears by itself once they connect. No reload needed.</p><p>Still there after a minute? If you started Hermes before running setup, press <strong>Control + C</strong> in window 1 and run <code>hermes gateway</code> again so it picks up the new settings. If it stops with an error, show a helper the exact message, and hide any keys first.</p>`,
  ],
  [
    "Slow",
    "The first reply takes ages, or shows an error",
    `<p>The free at-home models are shared, so their speed varies a lot. To switch to a faster one, open a third window and run:</p><p><code>hermes config set model.default ling-3.0-flash-fin-free</code></p><p>Then press <strong>Control + C</strong> in window 1 and run <code>hermes gateway</code> again. Leave the chat app running and send a new message. If that model is down too, try <code>mimo-v2.5-free</code> the same way, or run <code>hermes model</code>, choose <strong>OpenCode Free</strong>, and pick from the current list. At the workshop we switch to a faster model together.</p>`,
  ],
  [
    "Port",
    "“Port 3000 is in use” / EADDRINUSE",
    `<p>An earlier copy is probably still running. Stop it with <strong>Control + C</strong>. Or add <code>PORT=3001</code> on a new line in the <code>.env</code> file inside wall-g-bot, save, restart, and open <a href="http://localhost:3001" target="_blank" rel="noopener">localhost:3001</a>.</p>`,
  ],
  [
    "Restart",
    "I closed everything. How do I start it again?",
    `<p>Nothing is lost. Open two windows. In the first, run <code>hermes gateway</code>. In the second, run <code>cd ~/wall-g-bot</code>, then <code>npm run dev</code> (<code>npm.cmd run dev</code> on Windows). Then open <a href="http://localhost:3000" target="_blank" rel="noopener">localhost:3000</a>.</p>`,
  ],
  [
    "Safety",
    "Is this safe? How do I remove it later?",
    `<p>Yes. These are standard tools developers use every day, and nothing here changes your security settings. The free model is a shared online service, so don't send it anything personal.</p><p>To remove everything later, run <code>hermes uninstall --full</code>, delete the <strong>wall-g-bot</strong> folder, and uninstall Node.js, Git, and OpenChamber like any other app.</p>`,
  ],
].filter(Boolean);
document.getElementById("faq-list").innerHTML = helpItems
  .map(
    ([tag, title, body]) =>
      `<details><summary><span class="tag">${tag}</span><span class="q">${title}</span><span class="plus">${icon("plus")}</span></summary><div class="faq-body">${body}</div></details>`,
  )
  .join("");
document.querySelectorAll("[data-private-only]").forEach((element) => {
  element.hidden = !repoIsPrivate;
});

// State + persistence
const storageKey = "ipn-build-workshop-v3";
let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {}
const state = {
  os: ["mac", "windows"].includes(saved.os)
    ? saved.os
    : /Windows/.test(navigator.userAgent)
      ? "windows"
      : "mac",
  done: {},
};
for (const os of ["mac", "windows"]) {
  state.done[os] = Array.isArray(saved.done?.[os])
    ? [
        ...new Set(
          saved.done[os].filter((n) => Number.isInteger(n) && n >= 1 && n <= 5),
        ),
      ]
    : [];
}
function saveProgress() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ os: state.os, done: state.done }),
    );
  } catch {}
}
const isDone = (n) => state.done[state.os].includes(n);
const doneCount = () => state.done[state.os].length;
const firstIncomplete = () => {
  for (let n = 1; n <= 5; n++) if (!isDone(n)) return n;
  return 1;
};

const platformIcons = {
  mac: '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.9-3.4.9-.7 0-1.8-.9-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.6 2.2 2.8 2.1 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1 2.7-2.1c.9-1.2 1.2-2.4 1.2-2.4-.1 0-2.4-.9-2.4-3.4ZM15.4 6.4c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3Z"/></svg>',
  windows:
    '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h9v7H2zm11 0h9v7h-9zM2 13h9v7H2zm11 0h9v7h-9z"/></svg>',
};

let builtOS = null;
let openStepNum = 0;
const root = document.getElementById("setup-root");

function stepItemHTML(n, open) {
  const stage = stages[n - 1];
  const done = isDone(n);
  const num = String(n).padStart(2, "0");
  const last = n === 5;
  return `<div class="step-item${open ? " open" : ""}${done ? " done" : ""}" data-step="${n}">
    <button class="step-summary" type="button" aria-expanded="${open}" aria-controls="panel-${n}">
      <span class="step-badge"><span class="num">${num}</span><span class="tick">${icon("check")}</span></span>
      <span class="step-headline"><strong>${stage.title}</strong><span>${stage.sub}</span></span>
      <span class="step-meta"><span class="step-done-flag">${icon("check")} Done</span><span class="step-time">${stage.time}</span><span class="step-chevron">${icon("plus")}</span></span>
    </button>
    <div class="step-panel" id="panel-${n}"><div class="step-panel-inner"><div class="step-body"><div class="step-body-pad">
      ${stageContent(state.os, n)}
      <div class="step-foot">
        <button class="mark-done${done ? " is-done" : ""}" type="button" data-mark="${n}"><span class="box">${icon("check")}</span><span class="label">${done ? "Done. Tap to undo" : "Mark this step done"}</span></button>
        ${last ? `<a class="next-step" href="#workshop">Peek at what we'll build ${icon("arrow")}</a>` : `<button class="next-step" type="button" data-next="${n + 1}">Next step ${icon("arrow")}</button>`}
      </div>
    </div></div></div></div>
  </div>`;
}

function progressHTML() {
  const count = doneCount();
  return `<div class="platform-bar">
      <div class="platform-picker" role="group" aria-label="Choose your computer">
        ${["mac", "windows"]
          .map(
            (p) =>
              `<button type="button" data-os="${p}" aria-pressed="${p === state.os}">${platformIcons[p]}${p === "mac" ? "macOS" : "Windows"}</button>`,
          )
          .join("")}
      </div>
      <div class="progress-wrap"><span class="progress-copy"><b>${count}</b> of 5 done</span><div class="progress-track" role="progressbar" aria-label="Setup progress" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="5"><div class="progress-fill" style="width:${count * 20}%"></div></div></div>
    </div>
    <div class="all-ready" ${count === 5 ? "" : "hidden"}>${icon("check")} Setup complete. You're arriving ready. See you Saturday at 3 PM in the Social Hall.</div>`;
}

function buildSetup(openTarget) {
  openStepNum = openTarget;
  root.innerHTML =
    progressHTML() +
    `<div class="step-list">${[1, 2, 3, 4, 5].map((n) => stepItemHTML(n, n === openTarget)).join("")}</div>` +
    restartHTML();
  builtOS = state.os;
}

function refreshProgressUI() {
  const count = doneCount();
  const fill = root.querySelector(".progress-fill");
  if (fill) fill.style.width = count * 20 + "%";
  const copy = root.querySelector(".progress-copy b");
  if (copy) copy.textContent = count;
  const track = root.querySelector(".progress-track");
  if (track) track.setAttribute("aria-valuenow", count);
  const ready = root.querySelector(".all-ready");
  if (ready) ready.hidden = count !== 5;
}

function openStep(n, { toggle = false } = {}) {
  const items = root.querySelectorAll(".step-item");
  if (toggle && openStepNum === n) {
    openStepNum = 0;
  } else {
    openStepNum = n;
  }
  items.forEach((item) => {
    const step = Number(item.dataset.step);
    const on = step === openStepNum;
    item.classList.toggle("open", on);
    item.querySelector(".step-summary").setAttribute("aria-expanded", on);
  });
  hashReplace();
}

function markDone(n) {
  const list = state.done[state.os];
  const wasDone = list.includes(n);
  state.done[state.os] = wasDone ? list.filter((x) => x !== n) : [...list, n];
  saveProgress();
  const item = root.querySelector(`.step-item[data-step="${n}"]`);
  if (item) {
    const nowDone = !wasDone;
    item.classList.toggle("done", nowDone);
    const btn = item.querySelector(".mark-done");
    btn.classList.toggle("is-done", nowDone);
    btn.querySelector(".label").textContent = nowDone
      ? "Done. Tap to undo"
      : "Mark this step done";
  }
  refreshProgressUI();
  if (!wasDone) {
    // Gentle forward momentum: open the next thing that still needs doing.
    const next = firstIncomplete();
    if (next !== n) {
      openStep(next);
      const el = root.querySelector(`.step-item[data-step="${next}"]`);
      if (el)
        el.scrollIntoView({
          block: "nearest",
          behavior: prefersReduced() ? "auto" : "smooth",
        });
    }
    notify(
      doneCount() === 5
        ? "That's everything. You're ready! 🎉"
        : `Nice. ${doneCount()} of 5 done.`,
    );
  }
}

// ---------- The locked build plan ----------
// "What we'll build" ships encrypted (assets/brief.sealed.json). The access
// code decrypts it in the browser and nothing is sent anywhere. Edit and
// re-seal the plan with tooling/seal-workshop.mjs.
const REVEAL_AT = Date.parse("2026-09-12T15:00:00-04:00");
const SESSION_ENDS = Date.parse("2026-09-12T16:00:00-04:00");
const codeKey = "ipn-build-workshop-code";
const denials = [
  "The vault stays sealed.",
  "Not quite. Try again.",
  "Still locked. Listen for it in the room.",
];
// Must match normalizeCode() in tooling/workshop-code.mjs.
const normalizeCode = (value) =>
  value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]/g, "");

const workshopView = document.getElementById("workshop-view");
const gate = document.getElementById("gate");
const brief = document.getElementById("brief");
const gateForm = document.getElementById("gate-form");
const gateInput = document.getElementById("gate-code");
const gateSubmit = gateForm.querySelector(".gate-submit");
const gateStatus = document.getElementById("gate-status");
const gateState = document.getElementById("gate-state");
const gateClock = gate.querySelector("[data-cd-clock]");
const gateVideo = gate.querySelector("video");
let sealedBrief = null;
let attempts = 0;
let unlocking = false;
let countdownTimer = 0;

const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
const vaultError = (kind, message) => Object.assign(new Error(message), { kind });
async function unsealBrief(code) {
  if (!window.crypto?.subtle)
    throw vaultError(
      "unsupported",
      "This browser can't open the vault. Try a recent Chrome, Safari, Edge, or Firefox.",
    );
  if (!sealedBrief) {
    const response = await fetch("assets/brief.sealed.json", {
      cache: "no-cache",
    }).catch(() => null);
    if (!response?.ok)
      throw vaultError(
        "network",
        "Couldn't reach the vault. Check your connection and try again.",
      );
    sealedBrief = await response.json();
  }
  const base = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(code),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: fromBase64(sealedBrief.salt),
      iterations: sealedBrief.iter,
    },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(sealedBrief.iv) },
      key,
      fromBase64(sealedBrief.ct),
    );
    return new TextDecoder().decode(plain);
  } catch {
    throw vaultError("denied", "Access denied.");
  }
}

function setLockIcons(open) {
  document
    .querySelectorAll("[data-lock-icon]")
    .forEach((use) => use.setAttribute("href", open ? "#i-unlock" : "#i-lock"));
}
function setStatus(html) {
  gateStatus.innerHTML = html;
}

const pad = (value) => String(value).padStart(2, "0");
function renderCountdown() {
  const now = Date.now();
  const label = gate.querySelector(".countdown-label");
  if (now >= REVEAL_AT) {
    label.textContent = now < SESSION_ENDS ? "Live now" : "Revealed";
    gateClock.textContent =
      now < SESSION_ENDS ? "in the Social Hall" : "Sept 12";
    return;
  }
  const total = Math.floor((REVEAL_AT - now) / 1000);
  const d = Math.floor(total / 86400);
  gateClock.textContent = `${d ? d + "d " : ""}${pad(
    Math.floor((total % 86400) / 3600),
  )}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}
function startGateEffects() {
  if (workshopView.hidden || gate.hidden) return;
  renderCountdown();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(renderCountdown, 1000);
  if (gateVideo && !prefersReduced()) {
    gateVideo.preload = "auto";
    gateVideo.play().catch(() => {});
  }
}
function stopGateEffects() {
  clearInterval(countdownTimer);
  countdownTimer = 0;
  gateVideo?.pause();
}

function showBrief(html, { focus = true } = {}) {
  stopGateEffects();
  brief.innerHTML = html;
  brief.hidden = false;
  gate.hidden = true;
  workshopView.setAttribute("aria-labelledby", "brief-title");
  setLockIcons(true);
  window.scrollTo({ top: 0, behavior: "auto" });
  if (focus)
    document.getElementById("brief-title")?.focus({ preventScroll: true });
}
function showGate() {
  brief.hidden = true;
  brief.innerHTML = "";
  gate.hidden = false;
  gate.classList.remove("is-granted", "is-denied");
  gateInput.disabled = gateSubmit.disabled = false;
  workshopView.setAttribute("aria-labelledby", "workshop-title");
  setLockIcons(false);
  startGateEffects();
}

async function enterWorkshop() {
  if (!brief.hidden || unlocking) return;
  let savedCode = "";
  try {
    savedCode = localStorage.getItem(codeKey) || "";
  } catch {}
  if (savedCode) {
    unlocking = true;
    setStatus("<span>Welcome back. Decrypting…</span>");
    try {
      showBrief(await unsealBrief(savedCode), { focus: false });
      return;
    } catch (error) {
      if (error.kind === "denied")
        try {
          localStorage.removeItem(codeKey);
        } catch {}
      setStatus("");
    } finally {
      unlocking = false;
    }
  }
  showGate();
}

gateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (unlocking) return;
  const code = normalizeCode(gateInput.value);
  if (!code) {
    setStatus("Type the access code first.");
    gateInput.focus();
    return;
  }
  unlocking = true;
  gate.classList.remove("is-denied");
  gateState.textContent = "Decrypting";
  setStatus("<span>Decrypting…</span>");
  gateInput.disabled = gateSubmit.disabled = true;
  try {
    const [html] = await Promise.all([
      unsealBrief(code),
      wait(prefersReduced() ? 0 : 1100),
    ]);
    try {
      localStorage.setItem(codeKey, code);
    } catch {}
    gateState.textContent = "Open";
    gate.classList.add("is-granted");
    setStatus('<strong class="granted">Access granted</strong>');
    await wait(prefersReduced() ? 0 : 850);
    showBrief(html);
    notify("Unlocked. Welcome in.");
  } catch (error) {
    gateInput.disabled = gateSubmit.disabled = false;
    if (error.kind === "denied") {
      attempts += 1;
      gateState.textContent = "Denied";
      setStatus(
        `<strong class="denied">Access denied</strong> <span>${denials[(attempts - 1) % denials.length]}</span>`,
      );
      void gate.offsetWidth; // restart the shake animation
      gate.classList.add("is-denied");
    } else {
      gateState.textContent = "Offline";
      setStatus(escapeHTML(error.message));
    }
    gateInput.select();
    gateInput.focus();
  } finally {
    unlocking = false;
  }
});
try {
  if (localStorage.getItem(codeKey)) setLockIcons(true);
} catch {}

// Routing between the four views
const viewNames = {
  home: "Welcome",
  setup: "Get set up",
  workshop: "What we'll build",
  help: "Help desk",
};
function hashReplace() {
  const hash = openStepNum
    ? `#setup/${state.os}/${openStepNum}`
    : `#setup/${state.os}`;
  if (location.hash !== hash) history.replaceState(null, "", hash);
}
function showSetup(requestedOS, requestedStep) {
  if (["mac", "windows"].includes(requestedOS)) state.os = requestedOS;
  saveProgress();
  const step =
    Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= 5
      ? requestedStep
      : builtOS === state.os && openStepNum
        ? openStepNum
        : firstIncomplete();
  if (builtOS !== state.os) buildSetup(step);
  else openStep(step);
}

function route(initial = false) {
  const [requestedView, a, b] = location.hash.slice(1).split("/");
  const view = Object.hasOwn(viewNames, requestedView) ? requestedView : "home";
  if (view === "setup") showSetup(a, Number(b));

  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.id !== `${view}-view`;
  });
  if (view === "workshop") enterWorkshop();
  else stopGateEffects();
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === view) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.getElementById("current-view").textContent = viewNames[view];
  document.title = `${viewNames[view]} · Build with AI | IPN AI Youth Summit 2026`;
  document.querySelectorAll("[data-setup-step]").forEach((link) => {
    link.href = `#setup/${state.os}/${link.dataset.setupStep}`;
  });

  if (requestedView === "crew") {
    document
      .getElementById("crew")
      .scrollIntoView({ behavior: initial ? "auto" : "smooth" });
  } else if (!initial) {
    document.getElementById("main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}
window.addEventListener("hashchange", () => route());

// Toast
let toastTimer;
function notify(message) {
  const toast = document.getElementById("toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
}

// Delegated interactions
document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const summary = target.closest(".step-summary");
  if (summary) {
    openStep(Number(summary.closest(".step-item").dataset.step), {
      toggle: true,
    });
    return;
  }
  const mark = target.closest("[data-mark]");
  if (mark) {
    markDone(Number(mark.dataset.mark));
    return;
  }
  const next = target.closest("[data-next]");
  if (next) {
    const n = Number(next.dataset.next);
    openStep(n);
    root.querySelector(`.step-item[data-step="${n}"]`).scrollIntoView({
      block: "nearest",
      behavior: prefersReduced() ? "auto" : "smooth",
    });
    return;
  }
  const osBtn = target.closest("[data-os]");
  if (osBtn) {
    state.os = osBtn.dataset.os;
    saveProgress();
    buildSetup(firstIncomplete());
    hashReplace();
    return;
  }
  if (target.closest("[data-relock]")) {
    try {
      localStorage.removeItem(codeKey);
    } catch {}
    attempts = 0;
    gateInput.value = "";
    setStatus("");
    gateState.textContent = "Sealed";
    showGate();
    window.scrollTo({ top: 0, behavior: "auto" });
    gateInput.focus({ preventScroll: true });
    notify("Locked again.");
    return;
  }
  const copy = target.closest(".copy-button");
  if (copy) {
    const code = copy.closest(".command").querySelector("code");
    try {
      await navigator.clipboard.writeText(code.textContent);
      copy.classList.add("copied");
      const label = copy.childNodes[copy.childNodes.length - 1];
      const prev = label.textContent;
      label.textContent = " Copied";
      notify("Copied. Paste it into the app shown.");
      setTimeout(() => {
        copy.classList.remove("copied");
        label.textContent = prev;
      }, 1700);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      notify("Text selected. Use your device's Copy command.");
    }
  }
});

// Hero ASCII pyramid, ported from montekkundan's ascii-pyramid (21st.dev, MIT):
// a spinning tetrahedron rendered to text with per-face shading. Vanilla, no deps.
(() => {
  const el = document.getElementById("hero-pyramid");
  if (!el) return;
  const S = 2;
  const V = [
    [0, S, 0],
    [-S, -S, -S],
    [S, -S, -S],
    [S, -S, S],
    [-S, -S, S],
  ];
  const F = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 1],
  ];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (v) => {
    const r = Math.hypot(...v) || 1;
    return v.map((x) => x / r);
  };
  const N = F.map(([a, b, c]) => norm(cross(sub(V[b], V[a]), sub(V[c], V[a]))));
  const light = norm([-0.5, 1, -0.9]);
  // Per-face ramps (dark -> light) give each side its own texture.
  const ramps = [" .:-", "=+*#", "%@MW", "oO0&"];
  const W = 44,
    H = 24,
    scale = 0.4,
    dist = 6;
  const zbuf = new Float32Array(W * H);
  const out = new Array(H);

  function frame(theta) {
    zbuf.fill(0);
    for (let i = 0; i < H; i++) out[i] = new Array(W).fill(" ");
    const c = Math.cos(theta),
      s = Math.sin(theta);
    const cx = (W - 1) / 2,
      cy = (H - 1) / 2,
      xs = W * scale;
    for (let f = 0; f < 4; f++) {
      const [A, B, C] = F[f].map((i) => V[i]);
      const nx = N[f][0] * c + N[f][2] * s,
        ny = N[f][1],
        nz = -N[f][0] * s + N[f][2] * c;
      const L = Math.max(0.1, nx * light[0] + ny * light[1] + nz * light[2]);
      const glyph = ramps[f][Math.min(3, Math.floor(L * 4))];
      for (let u = 0; u <= 1; u += 0.01)
        for (let v = 0; u + v <= 1; v += 0.01) {
          const w = 1 - u - v;
          const x = w * A[0] + u * B[0] + v * C[0];
          const y = w * A[1] + u * B[1] + v * C[1];
          const z = w * A[2] + u * B[2] + v * C[2];
          const x2 = x * c + z * s,
            z2 = -x * s + z * c + dist;
          if (z2 <= 0) continue;
          const iz = 1 / z2;
          const px = Math.round(cx + xs * x2 * iz);
          const py = Math.round(cy - xs * y * iz);
          if (px < 0 || px >= W || py < 0 || py >= H) continue;
          const idx = px + py * W;
          if (iz <= zbuf[idx]) continue;
          zbuf[idx] = iz;
          out[py][px] = glyph;
        }
    }
    el.textContent = out.map((row) => row.join("")).join("\n");
  }

  // Start on a full three-quarter face (two shaded sides visible), not edge-on.
  const START = 2.3;
  frame(START);
  if (prefersReduced()) return;
  let theta = START,
    raf = 0,
    last = 0;
  const loop = (t) => {
    if (t - last > 55) {
      theta += 0.05;
      frame(theta);
      last = t;
    }
    raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
  });
  io.observe(el);
})();

route(true);
