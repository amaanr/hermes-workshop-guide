const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const command = (label, text) =>
  `<div class="command"><div class="command-top"><span>${escapeHTML(label)}</span><button class="copy-button" type="button" aria-label="Copy ${escapeHTML(label)}">${icon("copy")} Copy</button></div><pre><code>${escapeHTML(text)}</code></pre></div>`;
const note = (text, warning = false) =>
  `<div class="inline-note${warning ? " warning" : ""}">${icon(warning ? "lock" : "help")}<div>${text}</div></div>`;
const checkpoint = (text) =>
  `<div class="checkpoint">${icon("check")}<div><strong>You're ready when:</strong> ${text}</div></div>`;
const instruction = (number, title, body) =>
  `<section class="instruction"><h3><span>${number}</span>${title}</h3>${body}</section>`;
const externalButton = (href, text) =>
  `<a class="button button-neutral" href="${href}" target="_blank" rel="noopener">${text}${icon("external")}</a>`;

// Replace a null with an image path when the corresponding real screenshot is ready.
const screenshots = {
  "mac-tools": null,
  "windows-tools": null,
  "mac-editor": null,
  "windows-editor": null,
  repo: null,
  "mac-key": null,
  "windows-key": null,
  provider: null,
  running: null,
};
function screenshot(id, title, caption) {
  const source = screenshots[id];
  if (source)
    return `<figure class="setup-screenshot"><img src="${escapeHTML(source)}" alt="${escapeHTML(title)}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
  return `<figure class="screenshot-placeholder" data-screenshot="${id}">${icon("image")}<figcaption><strong>${title}</strong>${caption}<span>Screenshot coming soon</span></figcaption></figure>`;
}

const stages = [
  {
    title: "Install the basics",
    short: "The basics",
    detail: "Node.js + Git",
    time: "10–15 MIN",
  },
  {
    title: "Set up your editor",
    short: "Your editor",
    detail: "OpenCode + OpenChamber",
    time: "5–10 MIN",
  },
  {
    title: "Get the starter code",
    short: "Starter code",
    detail: "Your local project",
    time: "5 MIN",
  },
  {
    title: "Connect your OpenAI key",
    short: "Connect AI",
    detail: "Bot + coding assistant",
    time: "5 MIN",
  },
  {
    title: "Run it. Check it.",
    short: "Test your bot",
    detail: "Your first real reply",
    time: "5 MIN",
  },
];

function stageContent(os, step) {
  const mac = os === "mac";
  const shell = mac ? "TERMINAL / MAC" : "POWERSHELL / WINDOWS";
  const npm = mac ? "npm" : "npm.cmd";
  if (step === 1)
    return {
      intro: `Start here even if you've never opened ${mac ? "Terminal" : "PowerShell"}. Already have these tools? Run the version check below.`,
      content:
        instruction(
          "A",
          "Install Node.js LTS",
          `<p>Node.js runs your bot. On the download page, choose <strong>LTS</strong> (version 24 or newer), then scroll to the <strong>prebuilt installer</strong>. You don't need the nvm or Docker commands.</p>${externalButton("https://nodejs.org/en/download", "Download Node.js")}<p>${mac ? "Choose <strong>macOS Installer (.pkg)</strong>. Open the downloaded file and keep the defaults." : "Choose <strong>Windows Installer (.msi)</strong>. Use x64 for Intel/AMD, or ARM64 for a Snapdragon/ARM laptop. Run the installer and keep the defaults; optional build tools are not needed for this project."}</p>`,
        ) +
        instruction(
          "B",
          `${mac ? "Open Terminal and check Git" : "Install Git, then open PowerShell"}`,
          mac
            ? `<p>Press <strong>Command + Space</strong>, type <strong>Terminal</strong>, and press Return. Run:</p>${command(shell, "git --version")}<p>If macOS offers to install Command Line Tools, choose <strong>Install</strong> and wait for it to finish. If Git is missing and no prompt appears, run:</p>${command("ONLY IF GIT IS MISSING", "xcode-select --install")}<p>Already see a Git version? Skip the install.</p>`
            : `${externalButton("https://git-scm.com/downloads/win", "Download Git for Windows")}<p>Run the Git installer and keep the defaults. Then open the <strong>Start menu</strong>, type <strong>PowerShell</strong>, and open it normally. No administrator window or WSL required.</p>`,
        ) +
        instruction(
          "C",
          "Check all three tools",
          `<p>Close and reopen ${mac ? "Terminal" : "PowerShell"} after installing. Copy the whole block, paste, then press ${mac ? "Return" : "Enter"}.</p>${command(shell, `node --version\n${npm} --version\ngit --version`)}${mac ? "" : note("We use <code>npm.cmd</code> on Windows so you don’t need to change PowerShell’s script policy. It is the same npm tool.")}${screenshot(`${os}-tools`, `${mac ? "macOS" : "Windows"} installer + version check`, "Compare the installer and terminal output here once the visual guide is added.")}${checkpoint("you see a Node version of v24 or newer, an npm version, and a Git version. No “not found” errors.")}`,
        ),
    };
  if (step === 2)
    return {
      intro:
        "OpenCode is the engine. OpenChamber is the app you work in. Install them in that order.",
      content:
        instruction(
          "A",
          "Install OpenCode first",
          `<p>Paste this into your ${mac ? "Terminal" : "PowerShell"} window:</p>${command(shell, mac ? "curl -fsSL https://opencode.ai/install | bash" : "npm.cmd install -g opencode-ai")}<p>When it finishes, close and reopen the terminal. Check the engine:</p>${command(shell, mac ? "opencode --version" : "opencode.cmd --version")}`,
        ) +
        instruction(
          "B",
          "Choose the right OpenChamber download",
          `${externalButton("https://openchamber.dev/download", "Download OpenChamber")}<p>${mac ? "<strong>Apple menu → About This Mac:</strong> if you see “Chip” and an M-series name, choose <strong>macOS (Apple Silicon)</strong>. If you see an Intel processor, choose <strong>macOS (Intel)</strong>." : "<strong>Settings → System → About → System type:</strong> choose <strong>Windows (x64)</strong> for an x64-based Intel/AMD processor, or <strong>Windows (arm64)</strong> for an ARM-based processor."}</p><p>${mac ? "Open the .dmg, drag OpenChamber to Applications, and launch it from Applications." : "Open the .exe installer and follow the prompts, then launch OpenChamber."}</p>${screenshot(`${os}-editor`, `${mac ? "Mac" : "Windows"}: choose your build`, "The download button and first-launch screen will be shown here.")}${note("Already use another coding assistant? Keep it. You can skip this step if your preferred tool is installed and connected. OpenChamber is what we’ll demo.")}${checkpoint("OpenChamber opens without an “OpenCode not found” error, or your preferred coding assistant is ready.")}`,
        ),
    };
  if (step === 3)
    return {
      intro:
        "Get the workshop project onto your laptop. We’re starting from a small, working Node.js chat bot.",
      content:
        note(
          "<strong>Access comes first.</strong> The starter repository is private. Sign into GitHub, accept the workshop repository invitation when it is shared, and open the link below. A 404 means you need access, not a new Git install.",
          true,
        ) +
        instruction(
          "A",
          "Open the starter repository",
          `${externalButton("https://github.com/amaanr/hermes-bot", "Open workshop repo")}<p>No invitation yet? Finish the tool installs and come back when the facilitators share access. <strong>Do not pay for GitHub or share a password.</strong></p>`,
        ) +
        instruction(
          "B",
          "Clone the project",
          `<p>In ${mac ? "Terminal" : "PowerShell"}, choose the folder where you want your project, then run this once:</p>${command(shell, "git clone https://github.com/amaanr/hermes-bot.git\ncd hermes-bot")}<p>If Git opens a browser, sign in to the GitHub account that received the invitation. If it asks for a password, don't enter your normal GitHub password; use the Desktop option below.</p><details class="inline-help"><summary>New to GitHub or stuck signing in? Use GitHub Desktop</summary><div><ol><li>Install <a href="https://desktop.github.com/download/" target="_blank" rel="noopener">GitHub Desktop</a> and sign in to the invited account.</li><li>Choose <strong>File → Clone repository → URL</strong>. Paste <code>https://github.com/amaanr/hermes-bot</code>, choose a local folder, and clone.</li><li>Return to your ${mac ? "Terminal" : "PowerShell"} window. Type <code>cd </code> (including the space), drag the cloned folder into the window, and press ${mac ? "Return" : "Enter"}.</li><li>Continue with the install command below. Don't clone a second copy.</li></ol></div></details>`,
        ) +
        instruction(
          "C",
          "Install the project’s dependencies",
          `<p>Make sure your terminal is inside <strong>hermes-bot</strong>, then run:</p>${command(shell, `${npm} install`)}${screenshot("repo", "The starter repository", "The green Code button and project files will be shown here.")}${checkpoint("you have a hermes-bot folder with server.js, public, package.json, and .env.example, and the install command finishes without an error.")}`,
        ),
    };
  if (step === 4)
    return {
      intro:
        "The same workshop key goes in two places: your bot’s settings file and your coding assistant’s provider settings.",
      content:
        note(
          "<strong>No key yet? You can pause here.</strong> The facilitators will share it privately. You can finish the software installs and repo setup without it. No ChatGPT subscription is needed for this OpenAI API-key path.",
          true,
        ) +
        instruction(
          "A",
          "Create and open your .env file",
          `<p>From inside your <strong>hermes-bot</strong> folder, run the block below. It preserves an existing .env file.</p>${command(shell, mac ? "cp -n .env.example .env\nopen -e .env" : "if (!(Test-Path .env)) { Copy-Item .env.example .env }\nnotepad .env")}<p>Replace <code>sk-paste-your-key-here</code> with the real key. Keep <code>OPENAI_API_KEY=</code> at the start. <strong>Save the file</strong> ${mac ? "with Command + S; keep it as plain text named .env." : "with Ctrl + S; keep the name .env, not .env.txt."}</p>${command("EXAMPLE FILE CONTENT / NOT A REAL KEY", "OPENAI_API_KEY=sk-your-workshop-key")}${screenshot(`${os}-key`, "Your .env file, with the key hidden", "Only the setting name and a redacted example will appear in this screenshot.")}`,
        ) +
        instruction(
          "B",
          "Connect OpenChamber to OpenAI",
          `<p>In OpenChamber, go to <strong>Settings → Providers → Add provider → OpenAI</strong>. Choose <strong>API key / Manually enter API Key</strong>, paste the workshop key, and save.</p><p>Use the model picker in chat to choose the <strong>OpenAI model recommended by the facilitators</strong>. Don’t choose OpenCode Zen or a ChatGPT subscription sign-in for this key.</p>${screenshot("provider", "OpenChamber: Settings → Providers", "The OpenAI API-key field and model picker will be shown here.")}${note("<strong>Keep the key out of chat, screenshots, and GitHub.</strong> Paste it only into .env and provider settings. The starter ignores .env in Git. Never put the key in public/app.js or browser code.")}${checkpoint("the bot has a saved .env file and OpenAI shows as connected in OpenChamber. These are two separate settings.")}`,
        ),
    };
  return {
    intro:
      "Check that the bot really replies, not just that the page opens. Leave the server running while you use it.",
    content:
      instruction(
        "A",
        "Start the server",
        `<p>Inside your <strong>hermes-bot</strong> folder:</p>${command(shell, `${npm} run dev`)}<p>Look for <strong>“Hermes is running!”</strong>. Leave that terminal open. Use a second terminal window if you need to run other commands.</p>`,
      ) +
      instruction(
        "B",
        "Send a test message",
        `${externalButton("http://localhost:3000", "Open localhost:3000")}<p>In the bot’s chat input, type <strong>“Reply only with: Hermes is ready.”</strong> and send it. A reply from the bot confirms the key works. The welcome message alone doesn’t.</p>${screenshot("running", "Hermes replying in your browser", "Your real test conversation will replace this placeholder.")}`,
      ) +
      instruction(
        "C",
        "Open your project in the coding assistant",
        `<p>In OpenChamber, add/open the <strong>hermes-bot</strong> project folder and start a chat. Ask it to explain <code>server.js</code> without changing files. Check that it can respond too.</p>${note("<strong>Stopping and restarting:</strong> press Ctrl + C in the server terminal to stop it. Run the same start command again after editing .env or server.js, then refresh your browser. The current starter does not auto-restart.")}${checkpoint("you receive a real bot reply and a coding-assistant reply. Your laptop is ready for the build session.")}<p class="small-copy">Bring your charger and keep this guide handy. During the session, open <a href="#workshop">In the room</a> for the build brief.</p>`,
      ),
  };
}

const helpItems = [
  [
    "ACCESS",
    "The GitHub repo shows 404 or “Repository not found”",
    `<p>The starter is private. Sign into the invited GitHub account and accept the repository invitation. Ask a facilitator for access if you haven’t received one. A public workshop guide does not make the code public.</p><p>Still struggling with terminal sign-in? Use the GitHub Desktop option in <a href="#setup/mac/3" data-setup-step="3">step 3</a>. Never enter your ordinary GitHub password into a Git password prompt.</p>`,
  ],
  [
    "WINDOWS",
    "“npm.ps1 cannot be loaded” / scripts are disabled",
    `<p>Use <code>npm.cmd</code> instead of <code>npm</code> in PowerShell. For example, <code>npm.cmd install</code> or <code>npm.cmd run dev</code>. For OpenCode version checks use <code>opencode.cmd --version</code>. You do not need to loosen your script policy.</p>`,
  ],
  [
    "SETUP",
    "Node, npm, Git, or OpenCode is “not found”",
    `<p>Close and reopen your terminal after installing. Fully quit and reopen OpenChamber if it was already open during the install. Run the version checks again.</p><p>On Mac, install Command Line Tools if <code>git --version</code> prompts you. On Windows, check the Node and Git installers added their tools to PATH. Ask a helper before changing system settings.</p>`,
  ],
  [
    "KEY",
    "“No OPENAI_API_KEY found” or the chat hits an error",
    `<p>Check that <code>.env</code> is inside <code>hermes-bot</code>, alongside <code>server.js</code>. It must not be <code>.env.txt</code>. Replace the example key, save, stop the server with Ctrl + C, and start it again.</p><p>Check Wi-Fi. If the key is rejected, rate-limited, or out of credit, ask a facilitator to check the shared key. Reinstalling the app or buying a ChatGPT subscription won’t fix API credits.</p>`,
  ],
  [
    "PORT",
    "Port 3000 is busy / EADDRINUSE",
    `<p>If an earlier copy of Hermes is running, stop it in its terminal with Ctrl + C. Otherwise add <code>PORT=3001</code> on a new line in your <code>.env</code> file, save, and restart the bot. Open <a href="http://localhost:3001" target="_blank" rel="noopener">http://localhost:3001</a> instead. This works on both Mac and Windows.</p>`,
  ],
  [
    "FOLDER",
    "“Could not read package.json” or clone destination exists",
    `<p>You may be in the wrong folder. Open a terminal in <code>hermes-bot</code> before running npm commands. If you already cloned the project, open that copy instead of cloning again. Don’t delete your existing work to fix this.</p>`,
  ],
  [
    "SECURITY",
    "My computer blocks the installer",
    `<p>First check that you downloaded the matching build from <a href="https://openchamber.dev/download" target="_blank" rel="noopener">openchamber.dev/download</a>. Ask a helper to verify the file.</p><p>On Mac, a verified app may offer <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>. Windows may offer <strong>More info → Run anyway</strong>. Do not disable security protection or bypass a managed laptop’s policies. A helper can help you use an approved editor instead.</p>`,
  ],
  [
    "EDITOR",
    "My bot works, but OpenChamber cannot reply",
    `<p>The two apps have separate key settings. The bot uses <code>.env</code>. OpenChamber uses <strong>Settings → Providers → OpenAI</strong>. Add the API key there, then choose the recommended OpenAI model in the chat model picker. An OpenAI key is not an OpenCode Zen key.</p>`,
  ],
  [
    "BUILD",
    "My changes are not showing up",
    `<p>The starter does not reload the server automatically. After changing <code>server.js</code> or <code>.env</code>, press Ctrl + C in the running terminal, run <code>npm run dev</code> on Mac or <code>npm.cmd run dev</code> on Windows, then refresh the browser.</p>`,
  ],
];
document.getElementById("faq-list").innerHTML = helpItems
  .map(
    ([tag, title, body]) =>
      `<details><summary><span>${tag}</span>${title}</summary><div class="faq-body">${body}</div></details>`,
  )
  .join("");

const storageKey = "ipn-build-workshop-v2";
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
  step:
    Number.isInteger(saved.step) && saved.step >= 1 && saved.step <= 5
      ? saved.step
      : 1,
  done: {},
};
for (const os of ["mac", "windows"]) {
  state.done[os] = Array.isArray(saved.done?.[os])
    ? [
        ...new Set(
          saved.done[os].filter(
            (step) => Number.isInteger(step) && step >= 1 && step <= 5,
          ),
        ),
      ]
    : [];
}
function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {}
}
const platformIcons = {
  mac: '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.9-3.4.9-.7 0-1.8-.9-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.6 2.2 2.8 2.1 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1 2.7-2.1c.9-1.2 1.2-2.4 1.2-2.4-.1 0-2.4-.9-2.4-3.4ZM15.4 6.4c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3Z"/></svg>',
  windows:
    '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h9v7H2zm11 0h9v7h-9zM2 13h9v7H2zm11 0h9v7h-9z"/></svg>',
};

function renderSetup() {
  const { os, step } = state;
  const stage = stages[step - 1];
  const content = stageContent(os, step);
  const count = state.done[os].length;
  const completed = state.done[os].includes(step);
  document.getElementById("setup-root").innerHTML = `
    <div class="platform-bar">
      <div class="platform-picker" role="group" aria-label="Your computer">
        ${["mac", "windows"].map((platform) => `<button type="button" id="os-${platform}" data-os="${platform}" aria-pressed="${platform === os}">${platformIcons[platform]}${platform === "mac" ? "macOS" : "Windows"}</button>`).join("")}
      </div>
      <div class="progress-copy"><strong>${count} of 5 steps complete</strong><div class="progress-track" role="progressbar" aria-label="Setup completion" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="5"><div class="progress-fill" style="width:${count * 20}%"></div></div></div>
    </div>
    ${count === 5 ? '<div class="all-ready">All five steps checked. Bring your laptop and charger. See you September 12 at 3 PM in the Social Hall.</div>' : ""}
    <div class="setup-layout">
      <aside class="setup-sidebar"><nav class="step-menu" aria-label="Setup steps">${stages
        .map((item, index) => {
          const number = index + 1;
          const done = state.done[os].includes(number);
          return `<a class="step-link${done ? " complete" : ""}" href="#setup/${os}/${number}" ${number === step ? 'aria-current="step"' : ""} aria-label="Step ${number}: ${item.title}${done ? ", complete" : ""}"><span class="step-index">${done ? icon("check") : `0${number}`}</span><span><strong>${item.short}</strong><small>${item.detail}</small></span></a>`;
        })
        .join(
          "",
        )}</nav><p class="step-aside-note">Your checkmarks stay in this browser. They record what you've checked, not an automatic device test.<br><a href="#help">Something not working?</a></p></aside>
      <article class="step-reader" aria-labelledby="step-title">
        <header class="reader-heading"><div class="reader-kicker"><span>STEP 0${step} / ${os === "mac" ? "MACOS" : "WINDOWS"}</span><span>${stage.time}</span></div><h2 id="step-title">${stage.title}</h2><p>${content.intro}</p></header>
        <div class="reader-body">${content.content}</div>
        <footer class="reader-bottom"><button class="complete-step" id="complete-step" type="button" aria-pressed="${completed}"><span class="complete-box">${icon("check")}</span>${completed ? "Step checked. Click to uncheck." : "I’ve checked this step. Mark it complete."}</button><div class="step-paging">${step > 1 ? `<a class="previous-step" href="#setup/${os}/${step - 1}">${icon("arrow")} Previous step</a>` : '<span class="small-copy">One step at a time.</span>'}${step < 5 ? `<a class="button button-blue" href="#setup/${os}/${step + 1}">Next: ${stages[step].short}${icon("arrow")}</a>` : `<a class="button button-blue" href="#workshop">See the build brief${icon("arrow")}</a>`}</div></footer>
      </article>
    </div>`;
  requestAnimationFrame(() => {
    const menu = document.querySelector(".step-menu");
    const active = menu.querySelector('[aria-current="step"]');
    if (menu.scrollWidth > menu.clientWidth)
      menu.scrollLeft =
        active.offsetLeft -
        menu.offsetLeft -
        (menu.clientWidth - active.offsetWidth) / 2;
  });
}

const viewNames = {
  home: "Welcome",
  setup: "Pre-work",
  workshop: "In the room",
  help: "Help desk",
};
function route(initial = false) {
  const [requestedView, requestedOS, requestedStep] = location.hash
    .slice(1)
    .split("/");
  const view = Object.hasOwn(viewNames, requestedView) ? requestedView : "home";
  const previousOS = state.os;
  if (view === "setup") {
    if (["mac", "windows"].includes(requestedOS)) state.os = requestedOS;
    const step = Number(requestedStep);
    if (Number.isInteger(step) && step >= 1 && step <= 5) state.step = step;
    const hash = `#setup/${state.os}/${state.step}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
    saveProgress();
    renderSetup();
  }
  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.id !== `${view}-view`;
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === view) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.getElementById("current-view").textContent = viewNames[view];
  document.title = `${viewNames[view]} | Build with AI · IPN AI Youth Summit 2026`;
  document.querySelectorAll("[data-setup-step]").forEach((link) => {
    link.href = `#setup/${state.os}/${link.dataset.setupStep}`;
  });
  if (requestedView === "crew") {
    document.getElementById("crew").scrollIntoView({ behavior: "instant" });
  } else if (!initial) {
    const target =
      view === "setup" && previousOS !== state.os
        ? document.getElementById(`os-${state.os}`)
        : document.getElementById("main");
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
window.addEventListener("hashchange", () => route());

let toastTimer;
function notify(message) {
  const toast = document.getElementById("toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
    toast.textContent = "";
  }, 4500);
}

document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest(".skip-link")) {
    event.preventDefault();
    document.getElementById("main").focus();
    return;
  }
  const platform = target.closest("[data-os]");
  if (platform) location.hash = `setup/${platform.dataset.os}/${state.step}`;
  if (target.closest("#complete-step")) {
    const done = state.done[state.os];
    state.done[state.os] = done.includes(state.step)
      ? done.filter((number) => number !== state.step)
      : [...done, state.step];
    saveProgress();
    renderSetup();
    document.getElementById("complete-step").focus({ preventScroll: true });
    notify(`${state.done[state.os].length} of 5 setup steps checked.`);
  }
  const copy = target.closest(".copy-button");
  if (copy) {
    const code = copy.closest(".command").querySelector("code");
    try {
      await navigator.clipboard.writeText(code.textContent);
      const original = copy.innerHTML;
      copy.textContent = "Copied";
      notify("Copied. Paste into the indicated app.");
      setTimeout(() => {
        copy.innerHTML = original;
      }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      notify(
        "Clipboard unavailable. The text is selected; use your device’s Copy command.",
      );
    }
  }
});
route(true);
