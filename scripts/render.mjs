import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const BRAND = "Nyxa Network";

const NAV = [
  ["/", "Home"],
  ["/veil.html", "Veil"],
  ["/whisper.html", "Whisper"],
  ["/eclipse.html", "Eclipse"],
  ["/crossing.html", "Crossing"],
  ["/dawn.html", "Dawn"],
  ["/agents.html", "Agents"],
  ["/how-it-works.html", "How it works"],
  ["/chains.html", "Chains"],
  ["/docs.html", "Docs"],
  ["/faq.html", "FAQ"],
  ["/token.html", "$NYXA"],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mark(id) {
  return `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs>
      <mask id="${id}">
        <rect width="64" height="64" fill="#000"/>
        <circle cx="26" cy="34" r="18" fill="#fff"/>
        <circle cx="37.5" cy="28" r="15.2" fill="#000"/>
      </mask>
    </defs>
    <circle cx="26" cy="34" r="18" fill="#E0B44F" mask="url(#${id})"/>
    <path d="M37.5 48V29.2L52.5 48V29.2" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path fill="#E0B44F" d="M55.2 13.2l.85 2.35 2.45.35-1.9 1.6.62 2.4-2.02-1.28-2.02 1.28.62-2.4-1.9-1.6 2.45-.35z"/>
  </svg>`;
}

const ICONS = {
  veil: '<path d="M16 3.5l9 3.2v8.4c0 5.6-3.6 9.2-9 11.4-5.4-2.2-9-5.8-9-11.4V6.7l9-3.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  whisper: '<path d="M8 16c4-6 12-6 16 0M5 16c5.2-8.4 16.8-8.4 22 0M11 16a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="16" r="1.4" fill="currentColor"/>',
  eclipse: '<circle cx="13" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="19" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  crossing: '<path d="M5 20c6-10 16-10 22 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="6" cy="20" r="2" fill="currentColor"/><circle cx="26" cy="12" r="2" fill="currentColor"/>',
  dawn: '<path d="M5 22h22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 22a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  builders: '<rect x="5" y="7" width="22" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 13h8M9 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  network: '<circle cx="8" cy="16" r="2.2" fill="currentColor"/><circle cx="24" cy="10" r="2.2" fill="currentColor"/><circle cx="22" cy="23" r="2.2" fill="currentColor"/><path d="M10 15.5l12-4.5M10 17l10 5" stroke="currentColor" stroke-width="1.4"/>',
  roadmap: '<path d="M8 24V8M8 12h8l2 3-2 3H8M8 20h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  learn: '<path d="M7 12a9 9 0 1 0 9-9 7 7 0 0 1-9 9z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  token: '<circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13 16h6M16 13v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
};

function icon(name) {
  return `<span class="icon"><svg viewBox="0 0 32 32" aria-hidden="true">${ICONS[name]}</svg></span>`;
}

function illustration(name) {
  const open = '<svg class="illo" viewBox="0 0 360 280" fill="none" aria-hidden="true">';
  const close = "</svg>";
  const art = {
    veil: '<rect x="78" y="46" width="180" height="188" rx="22" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="168" cy="118" r="36" stroke="#F3E0A8" stroke-width="1.5"/><circle cx="184" cy="108" r="28" stroke="#F7F1E2" stroke-width="1.5"/><path d="M118 176h100M118 194h68" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round"/>',
    whisper: '<path d="M70 150c40-70 180-70 220 0" stroke="#F3E0A8" stroke-width="1.5" stroke-linecap="round"/><path d="M100 150c28-46 132-46 160 0" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round"/><path d="M130 150c16-24 84-24 100 0" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round"/><circle cx="180" cy="150" r="6" fill="#F3E0A8"/>',
    eclipse: '<circle cx="150" cy="140" r="78" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="210" cy="140" r="78" stroke="#F3E0A8" stroke-width="1.5"/>',
    crossing: '<circle cx="78" cy="176" r="28" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="282" cy="96" r="28" stroke="#F3E0A8" stroke-width="1.5"/><path d="M106 164C160 150 210 130 254 112" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 7"/>',
    dawn: '<path d="M36 196h288" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round"/><path d="M92 196a88 88 0 0 1 176 0" stroke="#F3E0A8" stroke-width="1.5"/><path d="M180 108v-28M132 124l-16-16M228 124l16-16" stroke="#F3E0A8" stroke-width="1.5" stroke-linecap="round"/>',
    agents: '<rect x="54" y="48" width="252" height="176" rx="22" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="86" cy="80" r="4" fill="#F3E0A8"/><circle cx="104" cy="80" r="4" fill="#F7F1E2"/><circle cx="122" cy="80" r="4" fill="#F7F1E2"/><path d="M86 118h120M86 146h84M86 174h140" stroke="#F7F1E2" stroke-width="1.5" stroke-linecap="round"/>',
    flow: '<circle cx="70" cy="140" r="26" stroke="#F3E0A8" stroke-width="1.5"/><circle cx="150" cy="140" r="26" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="230" cy="140" r="26" stroke="#F7F1E2" stroke-width="1.5"/><circle cx="310" cy="140" r="26" stroke="#F3E0A8" stroke-width="1.5"/><path d="M96 140h28M176 140h28M256 140h28" stroke="#F7F1E2" stroke-width="1.5"/>',
  };
  return open + (art[name] || art.flow) + close;
}

const PROTOCOL = [
  ["/veil.html", "Veil", "veil", "Shield ETH, USDC, or USDG into a private note."],
  ["/whisper.html", "Whisper", "whisper", "Send to any address. A relayer pays the gas."],
  ["/eclipse.html", "Eclipse", "eclipse", "Turn one asset into another, inside the pool."],
  ["/crossing.html", "Crossing", "crossing", "Carry value across chains. Solana is a far shore."],
  ["/dawn.html", "Dawn", "dawn", "Recover a note from the wallet that made it."],
  ["/network.html", "Network", "network", "The chains where the night will fall."],
  ["/roadmap.html", "Roadmap", "roadmap", "Four phases, from this website to mainnet."],
  ["/builders.html", "Builders", "builders", "A CLI and API for AI agents."],
  ["/learn.html", "Learn", "learn", "The path, the craft, and the questions."],
  ["/token.html", "$NYXA", "token", "The mark. The address comes on official channels."],
];

function header(current) {
  const rows = PROTOCOL.map(([href, label, glyph, text], index) => {
    const on = href === current ? ' aria-current="page"' : "";
    return `<a class="menu-row" href="${href}" style="--i:${index}"${on}>${icon(glyph)}<strong>${label}</strong><em>${text}</em></a>`;
  }).join("");
  const appOn = current === "/app/" ? ' aria-current="page"' : "";
  const homeOn = current === "/" ? ' aria-current="page"' : "";
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/"${homeOn}>
    ${mark("mark-header")}
    <span class="wordmark">Nyxa <em>Network</em></span>
  </a>
  <nav id="site-nav" aria-label="Primary">
    <div class="protocol" data-protocol>
      <button class="protocol-toggle" type="button" aria-expanded="false" aria-controls="protocol-menu">
        Protocol <span class="caret" aria-hidden="true"></span>
      </button>
      <div id="protocol-menu" class="protocol-menu" aria-hidden="true">
        ${rows}
      </div>
    </div>
    <a class="btn btn-moon nav-cta" href="/app/"${appOn}>Launch App</a>
  </nav>
  <div class="scroll-progress" aria-hidden="true"></div>
</header>
<noscript><p class="noscript-banner">JavaScript is off. The pages still read. The wallet and the moving sequence use JavaScript.</p></noscript>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/">
          ${mark("mark-footer")}
          <span class="wordmark">Nyxa <em>Network</em></span>
        </a>
        <p class="footer-blurb">Payments that leave the path in shadow.</p>
      </div>
      <div>
        <h2>Protocol</h2>
        <ul>
          <li><a href="/veil.html">Veil</a></li>
          <li><a href="/whisper.html">Whisper</a></li>
          <li><a href="/eclipse.html">Eclipse</a></li>
          <li><a href="/crossing.html">Crossing</a></li>
          <li><a href="/dawn.html">Dawn</a></li>
        </ul>
      </div>
      <div>
        <h2>Night</h2>
        <ul>
          <li><a href="/network.html">Network</a></li>
          <li><a href="/roadmap.html">Roadmap</a></li>
          <li><a href="/builders.html">Builders</a></li>
          <li><a href="/learn.html">Learn</a></li>
          <li><a href="/token.html">$NYXA</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bar">
      <p>© 2026 Nyxa Network. Nyxa Network is in development. Contracts are not yet deployed.</p>
      <a class="github-link" href="https://github.com/nyxaagent-max/nyxa" rel="noopener noreferrer">GitHub</a>
    </div>
  </div>
</footer>`;
}

function layout({ title, description, path, current, main, extra = "" }) {
  const canonical = "https://nyxa.cash" + (path === "/" ? "/" : path);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta name="theme-color" content="#3a2788">
  <meta name="apple-mobile-web-app-title" content="${BRAND}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/css/site.css">
  <script>document.documentElement.classList.add("js");</script>
  ${extra}
</head>
<body class="is-entering">
${header(current)}
<main id="main">
${main}
</main>
${footer()}
<script src="/js/site.js"></script>
${path === "/" || path === "/app/" ? '<script src="/js/feed.js"></script>' : ""}
${path === "/" ? '<script src="/js/stage.js"></script>' : ""}
${path === "/app/" ? '<script src="/js/app.js"></script>' : ""}
</body>
</html>
`;
}

function card(href, iconName, kicker, title, text, delay) {
  return `<a class="card reveal" style="transition-delay:${delay}ms" href="${href}">
    ${icon(iconName)}
    <span class="card-kicker">${kicker}</span>
    <h3>${title}</h3>
    <p>${text}</p>
    <span class="more">Enter ${title} <i aria-hidden="true">→</i></span>
  </a>`;
}

function sequence() {
  const steps = [
    ["Veil", "A note is born. ETH, USDC, or USDG, held as a secret only its owner can spend."],
    ["Prove", "The browser draws a proof of that note, and leaves the name of it unspoken."],
    ["Relay", "Another hand pays the gas. The chain records that hand, not yours."],
    ["Arrive", "Value reaches an address. The road back stays dark."],
  ];
  const buttons = steps.map(([name], index) => `<li><button type="button" data-step="${index}"><span class="num">0${index + 1}</span><span class="name">${name}</span></button></li>`).join("");
  const panels = steps.map(([name, text], index) => `<article class="sequence-panel" data-panel="${index}"><h3>${name}</h3><p>${text}</p></article>`).join("");
  return `<div class="sequence" data-flow>
    <div class="sequence-top">
      <p class="sequence-label">The path of a payment, from first shadow to arrival.</p>
      <button class="text-btn" type="button" data-flow-toggle>Pause</button>
    </div>
    <div class="sequence-track">
      <div class="sequence-orb" aria-hidden="true"></div>
      <ol class="sequence-steps">${buttons}</ol>
    </div>
    <div class="sequence-panels" aria-live="polite">${panels}</div>
  </div>`;
}

function home() {
  const step = (name) => `<li data-step><span>${name}</span><span class="ss">queued</span></li>`;
  const steps = ["Shield", "Prove", "Relay", "Arrive"].map(step).join("");
  return `<section class="hero sky">
    <div class="wrap">
      <div class="hero-top">
        <div>
          <p class="pill">Testnet soon</p>
          <h1 aria-label="Pay in the dark. Leave no trace.">Pay in the dark.<br><em>Leave no trace.</em></h1>
        </div>
        <div>
          <p class="lede">Nyxa Network is a private pool named for Nyx. Shield a note, send from the dark, and let the path between them go quiet.</p>
          <div class="hero-actions">
            <a class="btn btn-moon" href="/app/">Launch App</a>
            <a class="btn btn-ghost" href="/learn.html">Learn the night</a>
          </div>
        </div>
      </div>
      <ul class="chips">
        <li>Robinhood Chain</li>
        <li>Base</li>
        <li>Arbitrum</li>
        <li>BNB Chain</li>
        <li>Solana <small>bridge only</small></li>
        <li>Ethereum <small>bridge only</small></li>
      </ul>
      <div class="stage" data-stage>
        <div class="stage-top">
          <span class="example-tag">Example</span>
          <span class="stage-note">A walkthrough of the rites. Not a live payment.</span>
        </div>
        <div class="stage-body">
          <div class="stage-nav" role="tablist" aria-label="Example rites">
            <button type="button" data-stage-tab role="tab" aria-selected="true">Veil</button>
            <button type="button" data-stage-tab role="tab" aria-selected="false">Whisper</button>
            <button type="button" data-stage-tab role="tab" aria-selected="false">Eclipse</button>
            <button type="button" data-stage-tab role="tab" aria-selected="false">Crossing</button>
            <button type="button" data-stage-tab role="tab" aria-selected="false">Dawn</button>
          </div>
          <div class="stage-main">
            <div data-stage-panel>
              <p class="stage-kicker">Veil · example</p>
              <div class="stage-form"><div><span>Asset</span><b>ETH</b></div><div><span>Amount</span><b>1.00 ETH</b></div></div>
              <ol class="stage-steps">${steps}</ol>
            </div>
            <div data-stage-panel hidden>
              <p class="stage-kicker">Whisper · example</p>
              <div class="stage-form"><div><span>To</span><b>0x9f…e7</b></div><div><span>Amount</span><b>0.25 ETH</b></div></div>
              <ol class="stage-steps">${steps}</ol>
            </div>
            <div data-stage-panel hidden>
              <p class="stage-kicker">Eclipse · example</p>
              <div class="stage-form"><div><span>From</span><b>0.50 ETH</b></div><div><span>Toward</span><b>USDC</b></div></div>
              <ol class="stage-steps">${steps}</ol>
            </div>
            <div data-stage-panel hidden>
              <p class="stage-kicker">Crossing · example</p>
              <div class="stage-form"><div><span>From</span><b>Base</b></div><div><span>Far shore</span><b>Solana</b></div></div>
              <ol class="stage-steps">${steps}</ol>
            </div>
            <div data-stage-panel hidden>
              <p class="stage-kicker">Dawn · example</p>
              <div class="stage-form"><div><span>From</span><b>A signature</b></div><div><span>Looking</span><b>4 chains</b></div></div>
              <ol class="stage-steps">${["Remember", "Scan", "Sweep", "Return"].map(step).join("")}</ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="band" id="live" style="padding-top:36px">
    <div class="wrap">
      <p class="feed-kicker">Live network feed — public chain data</p>
      <div class="term" data-feed>
        <div class="term-top"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Robinhood Chain · Base · Arbitrum · BNB Chain</span></div>
        <div class="term-screen" data-feed-screen role="log" aria-live="polite"></div>
      </div>
    </div>
  </section>
  <section class="band" id="steps">
    <div class="wrap">
      <h2>Every step, kept in the dark</h2>
      <p class="section-lead">Five rites. One pool. The path between a deposit and a payment is what the night is for.</p>
      <div class="card-grid">
        <a class="card" href="/veil.html">
          <span class="card-kicker">Veil</span>
          <h3>Shield a note</h3>
          <div class="mini-ui"><span class="example-tag">Example</span><span>Amount</span><b>1.00 ETH → a private note</b></div>
        </a>
        <a class="card" href="/whisper.html">
          <span class="card-kicker">Whisper</span>
          <h3>Send, and stay unnamed</h3>
          <div class="mini-ui"><span class="example-tag">Example</span><span>A relayer pays the gas</span><b>0.25 ETH toward an address</b></div>
        </a>
        <a class="card" href="/eclipse.html">
          <span class="card-kicker">Eclipse</span>
          <h3>Turn one asset into another</h3>
          <div class="mini-ui"><span class="example-tag">Example</span><span>Inside the pool</span><b>ETH toward USDC</b></div>
        </a>
        <a class="card" href="/crossing.html">
          <span class="card-kicker">Crossing</span>
          <h3>A far shore, still dark</h3>
          <div class="mini-ui"><span class="example-tag">Example</span><span>Base to Solana</span><b>Value arrives without the road</b></div>
        </a>
        <a class="card" href="/dawn.html">
          <span class="card-kicker">Dawn</span>
          <h3>The wallet remembers</h3>
          <div class="mini-ui"><span class="example-tag">Example</span><span>From a signature</span><b>Notes found again</b></div>
        </a>
        <a class="card" href="/builders.html">
          <span class="card-kicker">Builders</span>
          <h3>For agents of the night</h3>
          <p>A CLI and an API, still being written.</p>
        </a>
      </div>
    </div>
  </section>
  <section class="band" id="principles" style="padding-top:10px">
    <div class="wrap">
      <div class="quotes">
        <article class="quote"><p>“The note does not wait in a queue of fixed sizes. Any amount can enter the night.”</p><span>Veil</span></article>
        <article class="quote"><p>“The proof is born in the browser. The secret stays where you already are.”</p><span>On the device</span></article>
        <article class="quote"><p>“A relayer pays the gas. The chain meets another hand, not yours.”</p><span>Whisper</span></article>
        <article class="quote"><p>“If the path breaks, the same wallet can look again.”</p><span>Dawn</span></article>
      </div>
    </div>
  </section>
  <section class="band" id="builders">
    <div class="wrap">
      <div class="cli">
        <div>
          <p class="card-kicker">Planned</p>
          <h2>Your agent can walk the same dark.</h2>
          <p class="lede" style="margin-top:12px">A command line and an API are planned for AI agents. Nothing here is published, and the lines beside this do not run.</p>
          <div class="actions"><a class="btn btn-moon" href="/builders.html">For builders</a></div>
        </div>
        <pre class="sketch"><code># Planned interface. These commands are not available.
nyxa veil --asset ETH --amount AMOUNT
nyxa whisper --to ADDRESS --asset USDC --amount AMOUNT</code></pre>
      </div>
    </div>
  </section>
  <section class="band" id="questions" style="padding-top:20px">
    <div class="wrap">
      <h2>Questions, in a low voice</h2>
      <div class="faq">
        <details><summary>Where is the proof made?</summary><p>In the browser, beside the note. A relayer is meant to receive a finished proof, not the secret.</p></details>
        <details><summary>Which chains?</summary><p>Robinhood Chain, Base, Arbitrum, and BNB Chain for the pool. Solana and Ethereum are far shores for Crossing, not homes for the pool.</p></details>
        <details><summary>Where is the $NYXA address?</summary><p>It will be announced only on official channels. Until then the token page stays quiet.</p></details>
        <details><summary>What is the terminal showing?</summary><p>Public chain data: block numbers, gas, and recent transaction hashes from Robinhood Chain, Base, Arbitrum, and BNB Chain. Those are not Nyxa payments.</p></details>
        <details><summary>Has there been an audit?</summary><p>Audit is phase two of the roadmap. It has not begun.</p></details>
      </div>
      <p class="related"><a href="/faq.html">All questions</a><a href="/roadmap.html">Roadmap</a></p>
    </div>
  </section>
  <section class="band close-band" style="padding-top:12px">
    <div class="wrap">
      <h2>Bring a wallet <em>into the night.</em></h2>
      <p class="section-lead">The app reads your address, your network, and the native balance. The rites open with testnet.</p>
      <div class="actions"><a class="btn btn-moon" href="/app/">Launch App</a></div>
    </div>
  </section>`;
}

function featurePage({ crumb, hash, title, em, lede, art, prose }) {
  return `<section class="page-hero sky" data-starfield>
    <div class="wrap page-hero-grid">
      <div>
        <p class="crumb"><a href="/">Nyxa Network</a> / ${crumb}</p>
        <p class="pill">Testnet soon</p>
        <h1>${title} <em>${em}</em></h1>
        <p class="lede">${lede}</p>
      </div>
      ${illustration(art)}
    </div>
  </section>
  <section class="band">
    <div class="wrap prose-grid">
      <div class="prose">${prose}</div>
      <aside class="side-card">
        <h2>In the app</h2>
        <p>Draft this rite now. It opens with testnet.</p>
        <p><a class="btn btn-line" href="/app/#${hash}">Launch App</a></p>
      </aside>
    </div>
  </section>`;
}

function steps(items) {
  return `<ol class="steps">${items.map((item, index) => `<li><span class="num">0${index + 1}</span><div><h3>${item[0]}</h3><p>${item[1]}</p></div></li>`).join("")}</ol>`;
}

const veil = featurePage({
  crumb: "Veil",
  hash: "veil",
  title: "Shield a",
  em: "note.",
  lede: "ETH, USDC, or USDG, drawn into the pool as a note only its holder can spend.",
  art: "veil",
  prose: `<p>A note is a secret you keep and a commitment the pool can hold. Whisper spends it. Eclipse turns it. Crossing carries it. Dawn remembers it.</p>
  <h2>How a note is born</h2>
  ${steps([
    ["Choose", "An asset and an amount. ETH, USDC, or USDG."],
    ["Commit", "The browser makes a secret and a commitment. The secret stays with you."],
    ["Rest", "The commitment is what the pool will remember."],
  ])}
  <p class="related"><a href="/whisper.html">Whisper</a><a href="/dawn.html">Dawn</a><a href="/how-it-works.html">The path</a></p>`,
});

const whisper = featurePage({
  crumb: "Whisper",
  hash: "whisper",
  title: "Speak,",
  em: "and vanish.",
  lede: "A relayer carries the payment and pays the gas. The chain sees that hand, not the wallet that funded the note.",
  art: "whisper",
  prose: `<p>Choose a note and an address. The browser prepares a proof that the note is real and unspent, without naming which note. The relayer broadcasts it. The address is paid.</p>
  <p>The relayer sees the payment it is asked to carry. Everyone else is meant to see an arrival, not the road back to the deposit. Amounts and hours still exist in the open. That is the shape of the dark, not a promise of invisibility.</p>
  ${steps([
    ["Select", "A note, an asset, and an address on the connected network."],
    ["Prove", "A proof made in the browser. The proving system is still being chosen."],
    ["Relay", "Gas paid by another hand. That hand is the sender on the chain."],
  ])}
  <p class="related"><a href="/veil.html">Veil</a><a href="/crossing.html">Crossing</a><a href="/docs.html">The craft</a></p>`,
});

const eclipse = featurePage({
  crumb: "Eclipse",
  hash: "eclipse",
  title: "Turn inside",
  em: "the eclipse.",
  lede: "One asset becomes another inside the pool. The wallet never stands in a public market.",
  art: "eclipse",
  prose: `<p>ETH, USDC, and USDG. A rate appears when liquidity does. Until then, Nyxa shows no price, because there is no price to show.</p>
  ${steps([
    ["From", "The asset the note holds now."],
    ["To", "A different asset in the same night."],
    ["Again", "A new note. Still yours. Still unspent."],
  ])}
  <p class="related"><a href="/veil.html">Veil</a><a href="/whisper.html">Whisper</a></p>`,
});

const crossing = featurePage({
  crumb: "Crossing",
  hash: "crossing",
  title: "Cross",
  em: "in silence.",
  lede: "Value moves among Robinhood Chain, Base, Arbitrum, and BNB Chain, and onward to Solana as a far shore.",
  art: "crossing",
  prose: `<p>The source is an EVM chain where the note was veiled. The destination is one of those chains, or Solana. Solana is not a network the EVM wallet switcher joins.</p>
  <p>The hope of Crossing is that the shore you left and the shore you reach do not point at each other. The way across is still being drawn.</p>
  <div class="chain-grid">
    <article class="card chain-card"><h3>Source</h3><p>Robinhood Chain, Base, Arbitrum, or BNB Chain.</p></article>
    <article class="card chain-card"><h3>Far shore</h3><p>Those same chains, or Solana.</p></article>
    <article class="card chain-card"><h3>When</h3><p>With the testnet. See the roadmap.</p></article>
  </div>
  <p class="related"><a href="/network.html">Network</a><a href="/roadmap.html">Roadmap</a></p>`,
});

const dawn = featurePage({
  crumb: "Dawn",
  hash: "dawn",
  title: "Morning",
  em: "remembers.",
  lede: "Dawn rebuilds a note from the wallet that created it. Nyxa never keeps the secret.",
  art: "dawn",
  prose: `<p>If that wallet can still speak for you, the note can be found again. If the wallet and the secret are both gone, the note stays in the dark — for you, and for Nyxa.</p>
  ${steps([
    ["The same wallet", "Dawn answers the key that made the note."],
    ["A signature", "The message it will sign is still being written."],
    ["No keeper", "Nyxa does not store a copy. That is the point of the night."],
  ])}
  <div class="callout"><strong>No one here can wake a note for you.</strong> Never hand a seed phrase to a stranger who claims they can.</div>
  <p class="related"><a href="/veil.html">Veil</a><a href="/learn.html">Learn</a></p>`,
});

const builders = `<section class="page-hero sky" data-starfield>
  <div class="wrap page-hero-grid">
    <div>
      <p class="crumb"><a href="/">Nyxa Network</a> / Builders</p>
      <p class="pill">Testnet soon</p>
      <h1>Tools for <em>the sleepless.</em></h1>
      <p class="lede">A command line and an API, so an AI agent can veil, whisper, turn, and cross under rules a person sets.</p>
    </div>
    ${illustration("agents")}
  </div>
</section>
<section class="band">
  <div class="wrap prose-grid">
    <div class="prose">
      <p>The interface is still night-quiet. No package. No base URL. No key. When it wakes, it will speak like this.</p>
      <h2>A shape, not a command you can run</h2>
      <pre class="sketch"><code># Future shape. These lines do not run today.
nyxa veil --asset USDC --amount AMOUNT
nyxa whisper --to ADDRESS --asset USDC --amount AMOUNT</code></pre>
      <p class="related"><a href="/learn.html">Learn</a><a href="/roadmap.html">Roadmap</a></p>
    </div>
    <aside class="side-card">
      <h2>For makers</h2>
      <p>The same four rites as the app, offered to software. The policy — assets, chains, size — stays with the operator.</p>
    </aside>
  </div>
</section>`;

function learnNav(current) {
  const items = [
    ["/learn.html", "Learn"],
    ["/how-it-works.html", "The path"],
    ["/docs.html", "The craft"],
    ["/faq.html", "Questions"],
  ];
  return `<nav class="subnav" aria-label="Learn">${items.map(([href, label]) => {
    const on = href === current ? ' aria-current="page"' : "";
    return `<a href="${href}"${on}>${label}</a>`;
  }).join("")}</nav>`;
}

const learn = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Learn</p>
    <p class="pill">Testnet soon</p>
    <h1>Learn <em>the dark.</em></h1>
    <p class="lede">Three doors. The path a payment walks, the craft beneath it, and the questions people ask.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    ${learnNav("/learn.html")}
    <div class="card-grid">
      <a class="card" href="/how-it-works.html"><span class="card-kicker">The path</span><h3>Veil to arrival</h3><p>Four steps. A note, a proof, a relayer, an address.</p><span class="more">Walk it <i aria-hidden="true">→</i></span></a>
      <a class="card" href="/docs.html"><span class="card-kicker">The craft</span><h3>Under the moon</h3><p>Proofs in the browser, a relayer, a tree of notes, no custodian.</p><span class="more">Read it <i aria-hidden="true">→</i></span></a>
      <a class="card" href="/faq.html"><span class="card-kicker">Questions</span><h3>Asked in the open</h3><p>Short answers. The long one lives on the roadmap.</p><span class="more">Ask <i aria-hidden="true">→</i></span></a>
    </div>
  </div>
</section>`;

const how = `<section class="page-hero sky" data-starfield>
  <div class="wrap page-hero-grid">
    <div>
      <p class="crumb"><a href="/">Nyxa Network</a> / Learn</p>
      <p class="pill">Testnet soon</p>
      <h1>A note leaves. <em>A payment arrives.</em></h1>
      <p class="lede">This is the path. Veil, prove, relay, arrive.</p>
    </div>
    ${illustration("flow")}
  </div>
</section>
<section class="band sky" data-starfield>
  <div class="wrap">
    ${learnNav("/how-it-works.html")}
    ${sequence()}
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    <h2>Read it by moonlight</h2>
    <p>Veil makes the note. Prove shows it can be spent without pointing at it. Relay lays that proof on a chain under someone else’s gas. Arrive is an address, paid. The dark is the missing line between the first and the last.</p>
    <p class="related"><a href="/docs.html">The craft</a><a href="/app/">Launch App</a></p>
  </div>
</section>`;

const network = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Network</p>
    <p class="pill">Testnet soon</p>
    <h1>Where the <em>night falls.</em></h1>
    <p class="lede">Public chains. Nyxa’s pools join them at testnet. Listing a chain is not a claim that we run it.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    <div class="chain-grid">
      <article class="card chain-card"><h3>Robinhood Chain</h3><p>Chain id 4663. Gas in ETH. RPC <a href="https://rpc.mainnet.chain.robinhood.com" rel="noopener noreferrer">rpc.mainnet.chain.robinhood.com</a>. Explorer <a href="https://robinhoodchain.blockscout.com" rel="noopener noreferrer">blockscout</a>.</p></article>
      <article class="card chain-card"><h3>Base</h3><p>Chain id 8453. Gas in ETH. RPC <a href="https://mainnet.base.org" rel="noopener noreferrer">mainnet.base.org</a>. Explorer <a href="https://basescan.org" rel="noopener noreferrer">basescan.org</a>.</p></article>
      <article class="card chain-card"><h3>Arbitrum</h3><p>Chain id 42161. Gas in ETH. RPC <a href="https://arb1.arbitrum.io/rpc" rel="noopener noreferrer">arb1.arbitrum.io/rpc</a>. Explorer <a href="https://arbiscan.io" rel="noopener noreferrer">arbiscan.io</a>.</p></article>
      <article class="card chain-card"><h3>BNB Chain</h3><p>Chain id 56. Gas in BNB. RPC <a href="https://bsc-dataseed.binance.org" rel="noopener noreferrer">bsc-dataseed.binance.org</a>. Explorer <a href="https://bscscan.com" rel="noopener noreferrer">bscscan.com</a>.</p></article>
      <article class="card chain-card"><h3>Solana</h3><p>A destination, not a home for the pool. It is absent from the EVM switcher. The wallet stays on the source chain.</p></article>
    </div>
  </div>
</section>`;

const roadmap = `<section class="page-hero sky page-hero-compact" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Roadmap</p>
    <p class="pill">In development</p>
    <h1>Four phases <em>of night.</em></h1>
    <p class="lede">No dates. The order is the promise. We are in the first phase.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    <ol class="phases">
      <li class="is-now">
        <span class="phase-num">Phase 0 · Now</span>
        <h2>Website</h2>
        <p>The night is drawn. You are standing in it. The rites are named. The pools are still ahead.</p>
      </li>
      <li>
        <span class="phase-num">Phase 1</span>
        <h2>Testnet pools and relayer</h2>
        <p>Notes, proofs, and a relayer on testnet. The app’s button wakes here.</p>
      </li>
      <li>
        <span class="phase-num">Phase 2</span>
        <h2>Audit</h2>
        <p>An outside review, before anyone is asked to trust the dark with real value. That review has not begun.</p>
      </li>
      <li>
        <span class="phase-num">Phase 3</span>
        <h2>Mainnet</h2>
        <p>The pools open on the chains named under Network. $NYXA’s address, if it has one, is announced only on official channels.</p>
      </li>
    </ol>
  </div>
</section>`;

const docs = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Learn</p>
    <p class="pill">Testnet soon</p>
    <h1>Under the <em>moon.</em></h1>
    <p class="lede">The shape of the craft. The proving system is still being chosen. An audit is phase two of the roadmap.</p>
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    ${learnNav("/docs.html")}
    <h2>Four parts</h2>
    <div class="arch">
      <article><span class="card-kicker">Browser</span><h3>The proof</h3><p>Built where the note already lives. The secret is not meant to travel.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Relayer</span><h3>The hand</h3><p>Submits the proof and pays gas, so the note’s wallet is not the sender.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Tree</span><h3>The grove</h3><p>Commitments in a Merkle tree. A later spend proves a leaf without naming it.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Arrival</span><h3>The shore</h3><p>An address is paid. The link to a particular note is what the dark keeps.</p></article>
    </div>
    <h2>No custodian</h2>
    <p>Nyxa is not meant to hold the spend secret. Dawn, when it comes, is still a signature from the holder’s own wallet.</p>
    <h2>What stays in the open</h2>
    <ul>
      <li>That a deposit of a given size entered.</li>
      <li>That a payment of a given size arrived.</li>
      <li>The relayer, as sender.</li>
      <li>The address that was paid.</li>
    </ul>
    <h2>Still unspoken</h2>
    <ul>
      <li>Which proof system.</li>
      <li>The fee.</li>
      <li>Who may relay.</li>
      <li>The exact shape of a note.</li>
      <li>Any contract address.</li>
    </ul>
  </div>
</section>`;

const faqs = [
  ["Is Nyxa Network live?", "This website is phase zero. Testnet pools and a relayer are phase one. The order is on the roadmap."],
  ["What does the app do today?", "It connects your wallet and reads the address, the network, and the native balance. The rites wait. The button reads Launching soon."],
  ["Where is the $NYXA address?", "Announced only on official channels. Until that hour, the token page stays quiet on purpose."],
  ["Has there been an audit?", "Audit is phase two. It has not begun. Nyxa does not name a reviewer, a report, or a date."],
  ["Which assets?", "ETH, USDC, and USDG. The balance in the app is the chain’s own gas token, read from your wallet."],
  ["Which chains?", "Robinhood Chain, Base, Arbitrum, and BNB Chain for the pool. Solana as a destination. Details live on Network."],
  ["Who holds the secret?", "You do. Nyxa is built to never keep it. Dawn is a way back through your own wallet, not a spare kept by anyone else."],
  ["What does a relayer see?", "The payment it agrees to carry, including the destination. Others are meant to see the arrival, not which note it came from."],
  ["Does the dark hide everything?", "No. Recipients see what arrives. Relayers see what they send. Amounts and timing remain. The missing piece is the public link between a deposit and a later payment."],
  ["Is there an official social account?", "Not yet. No X account. The only profile on this site is GitHub, in the footer."],
  ["Someone sent me a contract address.", "It is not ours. $NYXA has no address until we announce one on official channels."],
];

const faq = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Learn</p>
    <p class="pill">Testnet soon</p>
    <h1>Questions, <em>asked plainly.</em></h1>
    <p class="lede">Short answers. The phases live on the roadmap.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    ${learnNav("/faq.html")}
    <div class="faq">
      ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
    </div>
  </div>
</section>`;

const token = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / $NYXA</p>
    <p class="pill">In development</p>
    <h1>A mark, <em>waiting.</em></h1>
    <p class="lede">$NYXA is the mark of Nyxa Network. Its address will be spoken only on official channels.</p>
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    <p class="token-display">$NYXA</p>
    <div class="ca-blank">
      <span class="card-kicker">Contract address</span>
      <strong>Awaiting announcement</strong>
      <p>When the address exists, it will be written here, and only an official channel will speak it first.</p>
    </div>
    <div class="warning">
      <p><strong>A stranger’s address is not ours.</strong> Ignore addresses offered in a reply, an ad, or a direct message. There is no public X account to “confirm” one. GitHub, in the footer, is the only profile linked from this site.</p>
    </div>
  </div>
</section>`;

function field(id, label, control, hint = "") {
  return `<div class="field"><label for="${id}">${label}</label>${control}${hint ? `<span class="hint">${hint}</span>` : ""}<span class="error-text"></span></div>`;
}

const app = `<section class="app-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / App</p>
    <p class="pill">Testnet soon</p>
    <h1>Enter with <em>a wallet.</em></h1>
    <p class="lede">Nyxa reads your address, your network, and the native balance. The rites open with testnet.</p>
  </div>
</section>
<section class="band" style="padding-top:8px;padding-bottom:8px">
  <div class="wrap">
    <p class="feed-kicker">Live network feed — public chain data</p>
    <div class="term term-compact" data-feed data-feed-compact>
      <div class="term-top"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>public rpc</span></div>
      <div class="term-screen" data-feed-screen role="log" aria-live="polite"></div>
    </div>
  </div>
</section>
<section class="band" style="padding-top:18px">
  <div class="wrap app-shell">
    <aside class="wallet-panel panel">
      <p id="wallet-error" class="alert" role="alert" hidden></p>
      <div id="wallet-empty">
        <h2>Wallet</h2>
        <p>MetaMask, Rabby, OKX, or any EIP-1193 wallet. Nyxa never asks for a seed phrase.</p>
        <button id="connect-btn" class="btn btn-moon" type="button">Connect wallet</button>
      </div>
      <div id="wallet-live" hidden>
        <h2>Connected</h2>
        <p id="wallet-label" class="card-kicker"></p>
        <p id="account-short"></p>
        <p id="account-address" class="address"></p>
        <button id="copy-address" class="btn btn-line" type="button">Copy address</button>
        <p class="balance"><span id="balance-value">Reading…</span> <span id="balance-symbol"></span></p>
        <p id="balance-note" class="hint"></p>
        <p id="balance-raw" class="hint"></p>
        <p id="network-name"></p>
        <p id="network-id" class="hint"></p>
        <a id="explorer-link" hidden rel="noopener noreferrer" target="_blank">View on the public explorer</a>
        <div class="wallet-actions">
          <button id="refresh-balance" class="btn btn-line" type="button">Refresh balance</button>
          <button id="disconnect-btn" class="btn btn-line" type="button">Clear</button>
        </div>
      </div>
      <div>
        <h2>Network</h2>
        <p class="hint">Robinhood Chain, Base, Arbitrum, or BNB Chain. Solana is a far shore, not a source.</p>
        <div id="network-switcher" class="network-switcher" role="group" aria-label="Networks"></div>
      </div>
    </aside>
    <div class="workspace panel">
      <div class="tabs" role="tablist" aria-label="Rites">
        <button type="button" role="tab" id="tab-veil" aria-controls="panel-veil" aria-selected="true">Veil</button>
        <button type="button" role="tab" id="tab-whisper" aria-controls="panel-whisper" aria-selected="false" tabindex="-1">Whisper</button>
        <button type="button" role="tab" id="tab-eclipse" aria-controls="panel-eclipse" aria-selected="false" tabindex="-1">Eclipse</button>
        <button type="button" role="tab" id="tab-crossing" aria-controls="panel-crossing" aria-selected="false" tabindex="-1">Crossing</button>
      </div>
      <div role="tabpanel" id="panel-veil" aria-labelledby="tab-veil">
        <h2>Veil</h2>
        <p class="hint">Compose a note.</p>
        <form id="form-veil" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("veil-asset", "Asset", '<select id="veil-asset" data-kind="asset" required></select>', "ETH, USDC, or USDG.")}
              ${field("veil-amount", "Amount", '<input id="veil-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>', "How much the note holds.")}
            </div>
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Opens with testnet.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-whisper" aria-labelledby="tab-whisper" hidden>
        <h2>Whisper</h2>
        <p class="hint">A payment carried by a relayer.</p>
        <form id="form-whisper" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("whisper-asset", "Asset", '<select id="whisper-asset" data-kind="asset" required></select>')}
              ${field("whisper-amount", "Amount", '<input id="whisper-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            </div>
            ${field("whisper-to", "Recipient", '<input id="whisper-to" data-kind="address" autocomplete="off" spellcheck="false" placeholder="0x…" required>', "An Ethereum address. Format only — the checksum is not checked here.")}
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Opens with testnet.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-eclipse" aria-labelledby="tab-eclipse" hidden>
        <h2>Eclipse</h2>
        <p class="hint">Turn one asset into another. No rate is shown, because none exists yet.</p>
        <form id="form-eclipse" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("eclipse-from", "From", '<select id="eclipse-from" data-kind="asset" required></select>')}
              ${field("eclipse-to", "To", '<select id="eclipse-to" data-kind="asset" required></select>')}
            </div>
            ${field("eclipse-amount", "Amount", '<input id="eclipse-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Opens with testnet.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-crossing" aria-labelledby="tab-crossing" hidden>
        <h2>Crossing</h2>
        <p class="hint">Solana can be the far shore. It is not a source.</p>
        <form id="form-crossing" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("cross-source", "Source", '<select id="cross-source" data-kind="chain" required></select>')}
              ${field("cross-dest", "Destination", '<select id="cross-dest" data-kind="chain" required></select>')}
            </div>
            <div class="form-row">
              ${field("cross-asset", "Asset", '<select id="cross-asset" data-kind="asset" required></select>')}
              ${field("cross-amount", "Amount", '<input id="cross-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            </div>
            <div class="field">
              <label for="cross-to" id="cross-to-label">Destination address</label>
              <input id="cross-to" data-kind="address" autocomplete="off" spellcheck="false" placeholder="0x…" required>
              <span class="hint" id="cross-to-hint">Where the value should arrive.</span>
              <span class="error-text"></span>
            </div>
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Opens with testnet.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
<div class="modal" id="wallet-modal" hidden>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
    <h2 id="wallet-title">Choose a wallet</h2>
    <ul id="wallet-list"></ul>
    <button id="wallet-close" class="btn btn-line" type="button">Cancel</button>
  </div>
</div>`;

const missing = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a></p>
    <p class="pill">Testnet soon</p>
    <h1>This path <em>is unlit.</em></h1>
    <p class="lede">That address is not part of Nyxa Network.</p>
    <div class="actions"><a class="btn btn-moon" href="/">Return</a></div>
  </div>
</section>`;

const pages = [
  ["index.html", "/", "/", "Nyxa Network — Pay in the dark.", "Nyxa Network. Pay in the dark. Leave no trace. Private payments under moonlight. Testnet soon.", home()],
  ["veil.html", "/veil.html", "/veil.html", "Veil — Nyxa Network", "Veil on Nyxa Network shields ETH, USDC, or USDG as a private note. Testnet soon.", veil],
  ["whisper.html", "/whisper.html", "/whisper.html", "Whisper — Nyxa Network", "Whisper on Nyxa Network sends in the dark. A relayer pays the gas. Testnet soon.", whisper],
  ["eclipse.html", "/eclipse.html", "/eclipse.html", "Eclipse — Nyxa Network", "Eclipse on Nyxa Network turns one asset into another inside the pool. Testnet soon.", eclipse],
  ["crossing.html", "/crossing.html", "/crossing.html", "Crossing — Nyxa Network", "Crossing on Nyxa Network carries value across chains, with Solana as a far shore. Testnet soon.", crossing],
  ["dawn.html", "/dawn.html", "/dawn.html", "Dawn — Nyxa Network", "Dawn on Nyxa Network remembers a note from the wallet that created it. Testnet soon.", dawn],
  ["builders.html", "/builders.html", "/builders.html", "Builders — Nyxa Network", "Builders on Nyxa Network: a future CLI and API for AI agents. Testnet soon.", builders],
  ["learn.html", "/learn.html", "/learn.html", "Learn — Nyxa Network", "Learn Nyxa Network: the path of a payment, the craft beneath it, and common questions.", learn],
  ["how-it-works.html", "/how-it-works.html", "/how-it-works.html", "The path — Nyxa Network", "The path on Nyxa Network: veil, prove, relay, arrive.", how],
  ["network.html", "/network.html", "/network.html", "Network — Nyxa Network", "Networks for Nyxa Network: Robinhood Chain, Base, Arbitrum, BNB Chain, and Solana as a far shore.", network],
  ["roadmap.html", "/roadmap.html", "/roadmap.html", "Roadmap — Nyxa Network", "Nyxa Network roadmap: website, testnet pools and relayer, audit, then mainnet. No dates.", roadmap],
  ["docs.html", "/docs.html", "/docs.html", "The craft — Nyxa Network", "The craft of Nyxa Network: browser proofs, a relayer, Merkle notes, and no custodian.", docs],
  ["faq.html", "/faq.html", "/faq.html", "Questions — Nyxa Network", "Questions about Nyxa Network, answered shortly. The phases are on the roadmap.", faq],
  ["token.html", "/token.html", "/token.html", "$NYXA — Nyxa Network", "$NYXA is the mark of Nyxa Network. The contract address will be announced only on official channels.", token],
  ["app/index.html", "/app/", "/app/", "App — Nyxa Network", "Launch the Nyxa Network app. Connect a wallet and read your real address, network, and native balance.", app],
  ["404.html", "/404.html", "/404.html", "Unlit — Nyxa Network", "That page is not part of Nyxa Network.", missing],
];

const eip = `<script>
window.__nyxaWallets = window.__nyxaWallets || [];
window.addEventListener("eip6963:announceProvider", function (event) {
  var detail = event.detail;
  if (!detail || !detail.info || !detail.provider) return;
  var known = window.__nyxaWallets.some(function (item) { return item.info.uuid === detail.info.uuid; });
  if (!known) window.__nyxaWallets.push(detail);
});
window.dispatchEvent(new Event("eip6963:requestProvider"));
</script>`;

for (const stale of ["agents.html", "chains.html"]) {
  const old = join(root, stale);
  if (existsSync(old)) unlinkSync(old);
}

for (const [file, path, current, title, description, main] of pages) {
  if (!title.includes("Nyxa Network")) throw new Error("Title missing brand: " + title);
  if (!description.includes("Nyxa Network")) throw new Error("Description missing brand: " + description);
  const html = layout({
    title,
    description,
    path,
    current,
    main,
    extra: path === "/app/" ? eip : "",
  });
  const dest = join(root, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html);
  console.log("wrote", file);
}
