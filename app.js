const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const command = (label, text) =>
  `<div class="command"><div class="command-top"><span>${escapeHTML(label)}</span><button class="copy-button" type="button" aria-label="Copy: ${escapeHTML(label)}">${icon("copy")} Copy</button></div><pre><code>${escapeHTML(text)}</code></pre></div>`;
const miniNote = (text, variant = "") =>
  `<div class="mini-note${variant ? " " + variant : ""}">${icon(variant === "guard" ? "lock" : "compass")}<div>${text}</div></div>`;
const checkpoint = (text) =>
  `<div class="checkpoint">${icon("check")}<div><strong>You'll know it worked when</strong> ${text}</div></div>`;
const instruction = (marker, title, body) =>
  `<div class="instruction"><h4><span class="marker">${marker}</span>${title}</h4>${body}</div>`;
const linkButton = (href, text) =>
  `<a class="button button-quiet button-sm" href="${href}" target="_blank" rel="noopener">${text}${icon("external")}</a>`;

// Set a value to a relative path (e.g. "assets/mac-tools.webp") when the real
// screenshot is ready; the placeholder becomes an image automatically.
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
  if (source)
    return `<figure class="setup-shot"><img src="${escapeHTML(source)}" alt="${escapeHTML(title)}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
  return `<figure class="screenshot-slot" data-screenshot="${id}">${icon("image")}<figcaption><strong>${title}</strong><span>${caption}</span></figcaption></figure>`;
}

const stages = [
  {
    title: "Install the basics",
    sub: "Node.js and Git — the tools everything runs on",
    time: "10–15 min",
  },
  {
    title: "Install Hermes",
    sub: "Your AI agent — it runs on your own laptop",
    time: "5–10 min",
  },
  {
    title: "Set up your editor",
    sub: "OpenCode, then the OpenChamber app",
    time: "5–10 min",
  },
  {
    title: "Get the starter code",
    sub: "Copy the project and connect it to Hermes",
    time: "5–10 min",
  },
  {
    title: "Run it and see it work",
    sub: "Your first real reply from the bot",
    time: "5 min",
  },
];

function stageContent(os, step) {
  const mac = os === "mac";
  const shell = mac ? "Terminal · macOS" : "PowerShell · Windows";
  const npm = mac ? "npm" : "npm.cmd";
  if (step === 1)
    return (
      `<p class="step-lede">New to the terminal? That's fine — you'll just copy, paste, and press ${mac ? "Return" : "Enter"}. Already have these tools? Jump to the version check.</p>` +
      instruction(
        "A",
        "Install Node.js (LTS)",
        `<p>Node.js runs your bot. Choose the <strong>LTS</strong> version (24 or newer), then use the <strong>prebuilt installer</strong> — you can ignore the nvm and Docker options.</p>${linkButton("https://nodejs.org/en/download", "Download Node.js")}<p>${mac ? "Choose <strong>macOS Installer (.pkg)</strong>, open it, and keep the defaults." : "Choose <strong>Windows Installer (.msi)</strong> — x64 for most laptops, ARM64 for a Snapdragon/ARM one. Run it and keep the defaults."}</p>`,
      ) +
      instruction(
        "B",
        mac ? "Check Git in Terminal" : "Install Git, then open PowerShell",
        mac
          ? `<p>Press <strong>Command + Space</strong>, type <strong>Terminal</strong>, hit Return, then run:</p>${command(shell, "git --version")}<p>If macOS offers Command Line Tools, choose <strong>Install</strong>. If Git is missing with no prompt, run <code>xcode-select --install</code>. Already see a version? You're set.</p>`
          : `${linkButton("https://git-scm.com/downloads/win", "Download Git for Windows")}<p>Run it with the defaults. Then open the <strong>Start menu</strong>, type <strong>PowerShell</strong>, and open it normally — no admin or WSL needed.</p>`,
      ) +
      instruction(
        "C",
        "Check they're installed",
        `<p>Close and reopen ${mac ? "Terminal" : "PowerShell"} first. Paste all three lines, then press ${mac ? "Return" : "Enter"}.</p>${command(shell, `node --version\n${npm} --version\ngit --version`)}${mac ? "" : miniNote("On Windows we use <code>npm.cmd</code> so you never have to touch PowerShell's script policy — it's the same npm.")}${screenshot(`${os}-tools`, `${mac ? "macOS" : "Windows"}: installer + version check`, "A photo of the installer and your version output will go here.")}${checkpoint("you see a Node version (v24+), an npm version, and a Git version — no “not found”.")}`,
      )
    );
  if (step === 2)
    return (
      `<p class="step-lede">Hermes is your AI agent — it runs on <strong>your own laptop</strong> and remembers what you work on. This one download is the slow part, so please do it at home.</p>` +
      instruction(
        "A",
        "Run the one-line installer",
        `<p>Paste this into ${mac ? "Terminal" : "PowerShell"} and press ${mac ? "Return" : "Enter"}. It sets up everything Hermes needs — give it a few minutes.</p>${command(shell, mac ? "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash" : "iex (irm https://hermes-agent.nousresearch.com/install.ps1)")}${mac ? `<p>When it finishes, reload your terminal:</p>${command(shell, "source ~/.zshrc")}` : "<p>When it finishes, close and reopen PowerShell.</p>"}`,
      ) +
      instruction(
        "B",
        "Check it installed",
        `<p>Run:</p>${command(shell, "hermes doctor")}${screenshot(`${os}-hermes`, `${mac ? "macOS" : "Windows"}: Hermes installed`, "A photo of hermes doctor looking happy will go here.")}${miniNote("You don't need to pick a model here — the starter's setup step turns on a <strong>free, no-sign-up</strong> model for you. At the workshop we'll switch to a faster OpenAI model together.")}${checkpoint("hermes doctor runs and reports things look healthy — no red errors.")}`,
      )
    );
  if (step === 3)
    return (
      `<p class="step-lede">Two small pieces for editing code with AI: <strong>OpenCode</strong> is the engine, <strong>OpenChamber</strong> is the friendly app on top. Install them in that order.</p>` +
      instruction(
        "A",
        "Install OpenCode",
        `<p>Paste this into ${mac ? "Terminal" : "PowerShell"}:</p>${command(shell, mac ? "curl -fsSL https://opencode.ai/install | bash" : "npm.cmd install -g opencode-ai")}<p>When it finishes, close and reopen the window, then check it:</p>${command(shell, mac ? "opencode --version" : "opencode.cmd --version")}`,
      ) +
      instruction(
        "B",
        "Download the right OpenChamber",
        `${linkButton("https://openchamber.dev/download", "Download OpenChamber")}<p>${mac ? "<strong>Apple menu → About This Mac.</strong> An M-series “Chip” → <strong>Apple Silicon</strong>. An Intel processor → <strong>Intel</strong>." : "<strong>Settings → System → About → System type.</strong> x64 processor → <strong>Windows (x64)</strong>. ARM processor → <strong>Windows (arm64)</strong>."}</p><p>${mac ? "Open the .dmg, drag OpenChamber into Applications, and launch it from there." : "Run the .exe installer, then launch OpenChamber."}</p>${screenshot(`${os}-editor`, `${mac ? "Mac" : "Windows"}: pick your build`, "The download buttons and first launch will go here.")}${miniNote("Prefer Cursor, Claude Code, or another assistant? Keep it — you can skip this step. OpenChamber is just what we'll demo.")}${checkpoint("OpenChamber opens without an “OpenCode not found” message — or your own assistant is ready.")}`,
      )
    );
  if (step === 4)
    return (
      `<p class="step-lede">Now grab the project — a small web chat page that talks to your Hermes — and connect the two with one command.</p>` +
      miniNote(
        "<strong>Access first.</strong> The starter repo is private. Sign into GitHub and accept the invitation we share. Seeing a 404 just means access hasn't landed yet — not a broken setup.",
        "guard",
      ) +
      instruction(
        "A",
        "Clone it to your laptop",
        `${linkButton("https://github.com/amaanr/hermes-bot", "Open the workshop repo")}<p>In ${mac ? "Terminal" : "PowerShell"}, go to the folder you want it in, then run this once:</p>${command(shell, "git clone https://github.com/amaanr/hermes-bot.git\ncd hermes-bot")}<details class="inline-help"><summary>New to GitHub? Use GitHub Desktop instead →</summary><div><ol><li>Install <a href="https://desktop.github.com/download/" target="_blank" rel="noopener">GitHub Desktop</a> and sign in.</li><li><strong>File → Clone repository → URL</strong>, paste <code>https://github.com/amaanr/hermes-bot</code>, pick a folder, clone.</li><li>Back in ${mac ? "Terminal" : "PowerShell"}, type <code>cd </code> (with a space) and drag the cloned folder in, then press ${mac ? "Return" : "Enter"}.</li><li>Continue below — don't clone twice.</li></ol></div></details>`,
      ) +
      instruction(
        "B",
        "Install it and connect it to Hermes",
        `<p>Make sure you're inside <strong>hermes-bot</strong>, then run these two:</p>${command(shell, `${npm} install\n${npm} run setup`)}<p>Finish this before starting <code>hermes gateway</code> in step 5. Setup connects the web app to Hermes and selects a free model if you haven't chosen a provider. No model key to paste at home.</p>${miniNote("<code>API_SERVER_KEY</code> is a local connection password that setup creates for you, not an OpenAI key. Keep it private. The free model needs no provider account; the shared <code>OPENAI_API_KEY</code> comes at the workshop and does not replace this local password.")}${screenshot("repo", "The starter, connected", "A shot of npm run setup finishing will go here.")}${miniNote("At the workshop we'll choose OpenAI API in <code>hermes model</code>, enter the key we share, and restart the gateway. No code changes.", "guard")}${checkpoint(`${npm} run setup prints “All set!” and lists the two terminals to run next.`)}`,
      )
    );
  return (
    `<p class="step-lede">The finish line: a real reply from your own bot. Hermes runs in one window, the web app in another.</p>` +
    instruction(
      "A",
      "Start Hermes",
      `<p>Inside <strong>hermes-bot</strong>, start your agent and leave this window open:</p>${command(shell, "hermes gateway")}${miniNote("Startup can include warnings about optional tools you haven't connected. You don't need to wait for a particular log message: leave this window running and continue below. If it exits with an error, stop and check the Help desk rather than ignoring it.")}`,
    ) +
    instruction(
      "B",
      "Start the web app",
      `<p>Open a <strong>second</strong> ${mac ? "Terminal" : "PowerShell"} window. Type <code>cd </code> followed by a space, drag your <strong>hermes-bot</strong> folder from ${mac ? "Finder" : "File Explorer"} into the window, and press ${mac ? "Return" : "Enter"}. Then run:</p>${command(shell, `${npm} run dev`)}<p>Look for <strong>“Hermes web app is running!”</strong> and leave it open too. This command also checks setup automatically.</p>`,
    ) +
    instruction(
      "C",
      "Say hello",
      `${linkButton("http://localhost:3000", "Open localhost:3000")}<p>If you see a “Waiting for Hermes…” bar for a few seconds, that's fine — it clears itself once your agent is reachable, no reload needed. Then type <strong>“Reply only with: Hermes is ready.”</strong> and send it. A reply back means everything's wired up — the welcome message alone doesn't count.</p>${miniNote('First reply slow or still waiting after a minute? Keep both terminal windows open and visit the <a href="#help">Help desk</a>. The free models are shared, so response times and availability vary.')}${screenshot("running", "Hermes replying in your browser", "Your real test conversation will go here.")}${checkpoint("you get a real reply in the browser. You're ready for Saturday. 🎉")}`,
    )
  );
}

const helpItems = [
  [
    "Access",
    "The GitHub repo shows 404 or “not found”",
    `<p>The starter is private. Sign into the invited GitHub account and accept the repository invitation, or ask a facilitator for access. A public guide doesn't make the code public.</p><p>Stuck on terminal sign-in? Use the GitHub Desktop route in <a href="#setup/mac/4" data-setup-step="4">step 4</a>. Never type your normal GitHub password into a Git prompt.</p>`,
  ],
  [
    "Windows",
    "“npm.ps1 cannot be loaded” / scripts disabled",
    `<p>Use <code>npm.cmd</code> instead of <code>npm</code> — e.g. <code>npm.cmd install</code>, <code>npm.cmd run dev</code>. For OpenCode use <code>opencode.cmd --version</code>. No need to change your script policy.</p>`,
  ],
  [
    "Setup",
    "Node, npm, Git, or OpenCode is “not found”",
    `<p>Close and reopen your terminal after installing, and fully restart OpenChamber if it was open. Then run the version checks again.</p><p>On Mac, install Command Line Tools if <code>git --version</code> asks. On Windows, confirm the installers added the tools to PATH. Ask a helper before changing system settings.</p>`,
  ],
  [
    "Hermes",
    "The page shows “Waiting for Hermes…”",
    `<p>That bar means the web app can't reach your agent yet. In Terminal 1, run <code>hermes gateway</code> and leave it open. Warnings about optional tools can appear; you don't need to wait for a particular log message. The bar clears on its own when connected.</p><p>Still waiting after a minute? If you started the gateway before setup, press <strong>Ctrl + C</strong> in Terminal 1, follow the setup commands in <a href="#setup/mac/4" data-setup-step="4">step 4</a>, then run <code>hermes gateway</code> again. Leave Terminal 2 running the web app. If the gateway exits with an error or the bar stays, ask a helper with the exact error text; hide all keys before sharing.</p>`,
  ],
  [
    "Slow",
    "The first reply takes ages, or errors",
    `<p>The free at-home models are shared, so speed and availability vary. In a third terminal, run <code>hermes config set model.default mimo-v2.5-free</code>. Then press <strong>Ctrl + C</strong> in Terminal 1 and run <code>hermes gateway</code> again to load the change. Leave the web app running and send a new message.</p><p>If that model is unavailable too, run <code>hermes model</code> and choose <strong>OpenCode Free</strong> to see the current options, then restart the gateway. At the workshop we'll choose OpenAI API together with a key we share.</p>`,
  ],
  [
    "Port",
    "“Port 3000 is in use” / EADDRINUSE",
    `<p>An earlier copy is probably still running — stop it with Ctrl + C. Or add <code>PORT=3001</code> on a new line in <code>.env</code>, save, restart, and open <a href="http://localhost:3001" target="_blank" rel="noopener">localhost:3001</a>. Works on Mac and Windows.</p>`,
  ],
  [
    "Folder",
    "“Could not read package.json”",
    `<p>You're likely in the wrong folder. Open a terminal <em>inside</em> <code>hermes-bot</code> before running npm. If you already cloned it once, reopen that copy instead of cloning again.</p>`,
  ],
  [
    "Security",
    "My computer blocks the installer",
    `<p>First confirm you downloaded the matching build from <a href="https://openchamber.dev/download" target="_blank" rel="noopener">openchamber.dev/download</a>. On Mac, a verified app may offer <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>; Windows may offer <strong>More info → Run anyway</strong>. Don't disable protections or bypass a managed laptop — grab a helper and we'll find a path.</p>`,
  ],
  [
    "Setup",
    "“hermes: command not found”",
    `<p>Close and reopen your terminal after installing Hermes${""} — the installer adds it to your PATH on a fresh shell. On Mac you can also run <code>source ~/.zshrc</code>. Then try <code>hermes doctor</code> again.</p>`,
  ],
];
document.getElementById("faq-list").innerHTML = helpItems
  .map(
    ([tag, title, body]) =>
      `<details><summary><span class="tag">${tag}</span><span class="q">${title}</span><span class="plus">${icon("plus")}</span></summary><div class="faq-body">${body}</div></details>`,
  )
  .join("");

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
        <button class="mark-done${done ? " is-done" : ""}" type="button" data-mark="${n}"><span class="box">${icon("check")}</span><span class="label">${done ? "Done — tap to undo" : "Mark this step done"}</span></button>
        ${last ? `<a class="next-step" href="#workshop">See the build brief ${icon("arrow")}</a>` : `<button class="next-step" type="button" data-next="${n + 1}">Next step ${icon("arrow")}</button>`}
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
    <div class="all-ready" ${count === 5 ? "" : "hidden"}>${icon("check")} Setup complete — you're arriving ready. Bring your laptop and charger, and we'll add the key together. See you Saturday at 3 PM in the Social Hall.</div>`;
}

function buildSetup(openTarget) {
  openStepNum = openTarget;
  root.innerHTML =
    progressHTML() +
    `<div class="step-list">${[1, 2, 3, 4, 5].map((n) => stepItemHTML(n, n === openTarget)).join("")}</div>`;
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
      ? "Done — tap to undo"
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
        ? "That's everything — you're ready! 🎉"
        : `Nice — ${doneCount()} of 5 done.`,
    );
  }
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Routing between the four views
const viewNames = {
  home: "Welcome",
  setup: "Get set up",
  workshop: "In the room",
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
  const copy = target.closest(".copy-button");
  if (copy) {
    const code = copy.closest(".command").querySelector("code");
    try {
      await navigator.clipboard.writeText(code.textContent);
      copy.classList.add("copied");
      const label = copy.childNodes[copy.childNodes.length - 1];
      const prev = label.textContent;
      label.textContent = " Copied";
      notify("Copied — paste it into the app shown.");
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
      notify("Text selected — use your device's Copy command.");
    }
  }
});

route(true);
