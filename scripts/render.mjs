import { mkdirSync, writeFileSync } from "node:fs";
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
  agents: '<rect x="5" y="7" width="22" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 13h8M9 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
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

function header(current) {
  const links = NAV.map(([href, label]) => {
    const on = href === current ? ' aria-current="page"' : "";
    return `<a class="nav-link" href="${href}"${on}>${label}</a>`;
  }).join("");
  const appOn = current === "/app/" ? ' aria-current="page"' : "";
  const homeOn = current === "/" ? ' aria-current="page"' : "";
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/"${homeOn}>
    ${mark("mark-header")}
    <span class="wordmark">Nyxa <em>Network</em></span>
  </a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
    <span class="sr-only">Menu</span>
    <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
  </button>
  <nav id="site-nav" aria-label="Primary">
    ${links}
    <a class="btn btn-moon nav-cta" href="/app/"${appOn}>Open app</a>
  </nav>
  <div class="scroll-progress" aria-hidden="true"></div>
</header>
<noscript><p class="noscript-banner">JavaScript is off. You can still read ${BRAND}. Wallet connection and the animated sequence need JavaScript.</p></noscript>`;
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
        <p class="footer-blurb">Private payments, planned in the open. Nyxa is in development: no contracts deployed, no audit claimed, no token address published.</p>
      </div>
      <div>
        <h2>Product</h2>
        <ul>
          <li><a href="/veil.html">Veil</a></li>
          <li><a href="/whisper.html">Whisper</a></li>
          <li><a href="/eclipse.html">Eclipse</a></li>
          <li><a href="/crossing.html">Crossing</a></li>
          <li><a href="/dawn.html">Dawn</a></li>
          <li><a href="/agents.html">Agents</a></li>
          <li><a href="/app/">App</a></li>
        </ul>
      </div>
      <div>
        <h2>Learn</h2>
        <ul>
          <li><a href="/how-it-works.html">How it works</a></li>
          <li><a href="/chains.html">Chains</a></li>
          <li><a href="/docs.html">Docs</a></li>
          <li><a href="/faq.html">FAQ</a></li>
          <li><a href="/token.html">$NYXA</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bar">
      <p>© 2026 Nyxa Network. In development. Contracts are not deployed.</p>
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
    <span class="more">Read ${title} <i aria-hidden="true">→</i></span>
  </a>`;
}

function sequence() {
  const steps = [
    ["Veil", "You would deposit ETH, USDC, or USDG. The browser builds an encrypted note and keeps the spend secret with you. The pool would record a commitment, not your identity."],
    ["Prove", "The browser prepares a zero-knowledge proof that a note is yours and unspent, without revealing which note. The proving system is not chosen yet. This page does not generate a proof."],
    ["Relay", "A relayer is planned to submit the proof and pay the network fee, so your own wallet is not the sender. The relayer would see the withdrawal it is asked to broadcast."],
    ["Arrive", "The recipient address is paid. Observers are meant to see an arrival, not a public link back to the deposit. That is the design goal. It is not a live payment."],
  ];
  const buttons = steps.map(([name], index) => `<li><button type="button" data-step="${index}"><span class="num">0${index + 1}</span><span class="name">${name}</span></button></li>`).join("");
  const panels = steps.map(([name, text], index) => `<article class="sequence-panel" data-panel="${index}"><h3>${name}</h3><p>${text}</p></article>`).join("");
  return `<div class="sequence" data-flow>
    <div class="sequence-top">
      <p class="sequence-label">How it works — an illustrative sequence of the planned flow. Not a live transaction, and not your funds.</p>
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
  return `<section class="hero sky" data-starfield>
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <p class="pill">In development</p>
        <p class="hero-brand">Nyxa <em>Network</em></p>
        <h1 aria-label="Pay in the dark. Leave no trace.">
          <span class="type-line" aria-hidden="true">
            <span class="type-sizer">Pay in the dark.</span>
            <span class="type-text" data-typewriter>Pay in the dark.</span>
          </span>
          <em class="line-two">Leave no trace.</em>
        </h1>
        <p class="lede">Named for Nyx, Nyxa is a private payment pool in development. A deposit is planned to become an encrypted note. A later payment is planned to arrive without a public link back to that deposit. Contracts are not deployed. This site cannot move money.</p>
        <div class="hero-actions">
          <a class="btn btn-moon" href="/how-it-works.html">See how it works</a>
          <a class="btn btn-ghost" href="/app/">Open the app</a>
        </div>
        <p class="hero-note">Contracts are not deployed. The app will not move funds.</p>
        <p class="legend"><span>Planned</span><span>Non-custodial notes</span><span>Proofs in the browser</span><span>A relayer pays gas</span></p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="moon-wrap">
          <div class="orbit orbit-a"><span class="bead"></span></div>
          <div class="orbit orbit-b"></div>
          <div class="moon"></div>
          <div class="note-card">
            <span class="note-seal"></span>
            <span class="note-line"></span>
            <span class="note-line short"></span>
            <span class="note-caption">Diagram · encrypted note</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="band band-tight" id="instruments">
    <div class="wrap">
      <h2 class="indexed" data-index="01">The instruments</h2>
      <p class="section-lead">Nyxa is one pool with six names. Each name is a page. Each one is still being built.</p>
      <div class="card-grid">
        ${card("/veil.html", "veil", "Deposit", "Veil", "Shield ETH, USDC, or USDG into the pool as an encrypted note.", 0)}
        ${card("/whisper.html", "whisper", "Send", "Whisper", "Pay any address in private. A relayer is planned to cover gas so the sender’s wallet does not appear.", 60)}
        ${card("/eclipse.html", "eclipse", "Swap", "Eclipse", "Trade inside the pool, without the wallet standing in a public market.", 120)}
        ${card("/crossing.html", "crossing", "Bridge", "Crossing", "Move value across chains in private. Solana is planned as a destination.", 180)}
        ${card("/dawn.html", "dawn", "Recover", "Dawn", "Reconstruct access to a note from a signature by the wallet that created it.", 240)}
        ${card("/agents.html", "agents", "Delegate", "Agents", "A CLI and an API are planned so an agent can act under rules its operator sets.", 300)}
      </div>
    </div>
  </section>
  <section class="band sky" id="sequence" data-starfield>
    <div class="wrap">
      <h2 class="indexed" data-index="02">Veil, prove, relay, arrive.</h2>
      <p class="section-lead">The sequence plays on its own. It is a diagram of the plan.</p>
      ${sequence()}
    </div>
  </section>
  <section class="band" id="planned-chains">
    <div class="wrap">
      <h2 class="indexed" data-index="03">Where it is planned to land</h2>
      <p class="section-lead">These are the networks in the plan. Nyxa has not deployed contracts on any of them.</p>
      <div class="chain-row">
        <a class="chain-pill" href="/chains.html"><strong>Robinhood Chain</strong><span>Chain id 4663 · ETH gas</span></a>
        <a class="chain-pill" href="/chains.html"><strong>Base</strong><span>Chain id 8453 · ETH gas</span></a>
        <a class="chain-pill" href="/chains.html"><strong>Arbitrum</strong><span>Chain id 42161 · ETH gas</span></a>
        <a class="chain-pill" href="/chains.html"><strong>BNB Chain</strong><span>Chain id 56 · BNB gas</span></a>
        <a class="chain-pill" href="/chains.html"><strong>Solana</strong><span>Destination only</span></a>
      </div>
    </div>
  </section>
  <section class="band alt" id="status">
    <div class="wrap">
      <div class="fact-card reveal">
        <div>
          <h2 class="indexed" data-index="04">What is true today</h2>
          <p class="section-lead">No invented totals, no invented users, no invented reviews. If it is not built, it is not shown as built.</p>
        </div>
        <dl class="facts">
          <div><dt>Contracts</dt><dd><span class="tag">Not deployed</span></dd></div>
          <div><dt>Audits</dt><dd><span class="tag">None claimed</span></dd></div>
          <div><dt>$NYXA contract</dt><dd><span class="tag">Not launched</span> Address announced only on official channels.</dd></div>
          <div><dt>App actions</dt><dd><span class="tag">Disabled</span> The button reads “Launching soon”.</dd></div>
          <div><dt>Wallet connection</dt><dd><span class="tag ok">Available</span> Reads your real address, network, and native balance.</dd></div>
        </dl>
      </div>
    </div>
  </section>
  <section class="band sky close-band" data-starfield>
    <div class="wrap">
      <h2>The app is open. <em>The pool is not.</em></h2>
      <p class="section-lead">You can connect a wallet and read the real native balance on Robinhood Chain, Base, Arbitrum, or BNB Chain. The buttons that would move money stay disabled.</p>
      <div class="actions">
        <a class="btn btn-moon" href="/app/">Open the app</a>
        <a class="btn btn-ghost" href="/docs.html">Read the plan</a>
      </div>
    </div>
  </section>`;
}

function featurePage({ crumb, hash, title, em, lede, art, prose }) {
  return `<section class="page-hero sky" data-starfield>
    <div class="wrap page-hero-grid">
      <div>
        <p class="crumb"><a href="/">Nyxa Network</a> / ${crumb}</p>
        <p class="pill">In development</p>
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
        <h2>Status</h2>
        <p><span class="tag">In development</span></p>
        <p>Contracts are not deployed. You can draft this in the app. The button stays disabled.</p>
        <p><a class="btn btn-line" href="/app/#${hash}">Open the ${crumb} form</a></p>
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
  lede: "Veil is the deposit. ETH, USDC, or USDG would enter the pool as an encrypted note that only the holder can spend. Nothing on this page accepts a deposit.",
  art: "veil",
  prose: `<p>A note is the private record of a deposit: a secret you hold, and a commitment the pool can store without publishing who you are. Spending it later is Whisper, Eclipse, or Crossing. Reconstructing it from the same wallet is Dawn.</p>
  <h2>The planned gesture</h2>
  ${steps([
    ["Choose", "Pick the asset and the amount. The planned assets are ETH, USDC, and USDG. No pool balance exists to display."],
    ["Commit", "The browser would build a secret and a commitment. The secret stays with you. The commitment is what the pool would record."],
    ["Wait", "Until contracts exist, there is nowhere to submit that commitment. The app lets you fill in the form and then stops."],
  ])}
  <div class="callout"><strong>Diagram, not a receipt.</strong> Nyxa cannot create a note today. Any page or message that offers a deposit address is not this project.</div>
  <p class="related"><a href="/whisper.html">Whisper</a><a href="/dawn.html">Dawn</a><a href="/how-it-works.html">How it works</a></p>`,
});

const whisper = featurePage({
  crumb: "Whisper",
  hash: "whisper",
  title: "Send, and stay off",
  em: "the envelope.",
  lede: "Whisper is the private payment. A relayer is planned to submit the transaction and pay the gas, so the wallet that funded the note is not the wallet that appears as the sender.",
  art: "whisper",
  prose: `<p>You would choose a note and a recipient address. The browser prepares a proof that the note is unspent, without revealing which note. The relayer broadcasts that proof. The recipient is paid.</p>
  <h2>What is supposed to stay hidden</h2>
  <p>The public record is designed to show an arrival, not the path back to the deposit. That is a design goal, not a property you can test today. There is no deployment, and Nyxa claims no audit.</p>
  <h2>What the relayer would see</h2>
  <p>The relayer sees the withdrawal it is asked to submit, including the destination, because it has to send that transaction. Observers who are not the relayer are who the pool is designed to keep from matching deposit to withdrawal. Amounts can still be compared. Timing can still be compared. A serious write-up of those limits waits until the design is frozen.</p>
  ${steps([
    ["Select", "A note you hold, an asset, and an Ethereum address on the connected network."],
    ["Prove", "A browser-side proof that the note is real and unspent. The proving system is not chosen yet."],
    ["Relay", "Someone else pays the gas and is the sender the chain records."],
  ])}
  <p class="related"><a href="/veil.html">Veil</a><a href="/crossing.html">Crossing</a><a href="/docs.html">Docs</a></p>`,
});

const eclipse = featurePage({
  crumb: "Eclipse",
  hash: "eclipse",
  title: "Swap inside",
  em: "the dark.",
  lede: "Eclipse is a private swap between assets held in the pool. The trade is planned to settle without your wallet standing in a public exchange.",
  art: "eclipse",
  prose: `<p>The planned assets are ETH, USDC, and USDG. There is no rate, no book, and no liquidity to quote, so this site will not invent one. A chart of prices that do not exist would be a fiction.</p>
  <h2>What you will not find here</h2>
  <ul>
    <li>A quoted price.</li>
    <li>A filled order.</li>
    <li>A pool composition.</li>
  </ul>
  <p>When a swap is possible, it is planned to consume one note and produce another, still inside the pool, still without naming the depositor. The exact curve and fee are not published because they are not decided.</p>
  ${steps([
    ["From", "The asset the note currently represents."],
    ["To", "A different planned asset."],
    ["Settle", "A new note, still unspent, still yours to whisper, cross, or recover."],
  ])}
  <div class="callout"><strong>No market is live.</strong> If someone offers you an Eclipse price in a message, it is not from Nyxa Network.</div>`,
});

const crossing = featurePage({
  crumb: "Crossing",
  hash: "crossing",
  title: "Cross without a",
  em: "public trail.",
  lede: "Crossing is planned to move value between Robinhood Chain, Base, Arbitrum, and BNB Chain, and onward to Solana as a destination.",
  art: "crossing",
  prose: `<p>Cross-chain movement adds a hop between networks. The design goal is that the source deposit and the destination payment stay unlinkable on public explorers. The mechanism is not frozen, and nothing is deployed.</p>
  <p>Nyxa will not ask you to send funds to a personal “bridge address” on this website. There is no deposit address to paste.</p>
  <h2>Roles, as planned</h2>
  <div class="chain-grid">
    <article class="card chain-card"><h3>Source</h3><p>An EVM network where the note was veiled: Robinhood Chain, Base, Arbitrum, or BNB Chain.</p></article>
    <article class="card chain-card"><h3>Destination</h3><p>One of those EVM networks, or Solana. Solana is not a network you connect in the EVM wallet switcher.</p></article>
    <article class="card chain-card"><h3>Status</h3><p>Not connected to Nyxa contracts, because those contracts do not exist yet.</p></article>
  </div>
  <p class="related"><a href="/chains.html">Chain details</a><a href="/docs.html">Planned architecture</a></p>`,
});

const dawn = featurePage({
  crumb: "Dawn",
  hash: "dawn",
  title: "Morning, if you can",
  em: "still sign.",
  lede: "Dawn is recovery. If you can still sign with the wallet that created a note, Nyxa is being designed so that signature is enough to reconstruct access. Nyxa does not keep the secret.",
  art: "dawn",
  prose: `<p>There is no support desk that can unlock a note for you, because the plan is that Nyxa never holds it. If the design works as intended, losing both the wallet and the secret means nobody — including Nyxa — can recover the note.</p>
  <p>Treat that as the point of a non-custodial design, and as a reason it has to be reviewed before anyone relies on it. It cannot be reviewed against deployed code today. There is no deployed code, and no audit is claimed.</p>
  ${steps([
    ["Same wallet", "Dawn is for the key that created the note, not for a stranger who knows an address."],
    ["A signature", "The planned recovery uses a signature from that wallet. The exact message format is not final."],
    ["No custody", "Nyxa storing a backup of your secret would break the design. It is not part of the plan."],
  ])}
  <div class="callout"><strong>Not a rescue service.</strong> Do not send a seed phrase to anyone who claims they can restore a Nyxa note. The product is not live, and the plan is that we cannot restore it.</div>`,
});

const agents = `<section class="page-hero sky" data-starfield>
  <div class="wrap page-hero-grid">
    <div>
      <p class="crumb"><a href="/">Nyxa Network</a> / Agents</p>
      <p class="pill">Planned</p>
      <h1>A quiet interface <em>for agents.</em></h1>
      <p class="lede">Nyxa for agents is a planned command-line tool and HTTP API, so software can veil, whisper, swap, and cross under rules a person sets. Nothing is installable today.</p>
    </div>
    ${illustration("agents")}
  </div>
</section>
<section class="band">
  <div class="wrap prose-grid">
    <div class="prose">
      <p>There is no package name to install, no base URL to call, and no API key to request. Publishing a command here that looks live would send people to a tool that does not exist.</p>
      <h2>What the interface is for</h2>
      <ul>
        <li>Veil, whisper, eclipse, and crossing, each as an explicit action.</li>
        <li>A policy the operator controls: which assets, which chains, which size.</li>
        <li>The same constraint as the app: no action before contracts exist.</li>
      </ul>
      <h2>Sketch, not a published interface</h2>
      <p>The lines below show the shape of a future command. They do not run. There is no binary by this name.</p>
      <pre class="sketch"><code># Sketch only. These commands are not published and will not run.
nyxa veil --asset USDC --amount AMOUNT
nyxa whisper --to ADDRESS --asset USDC --amount AMOUNT</code></pre>
      <p class="related"><a href="/docs.html">Planned architecture</a><a href="/faq.html">FAQ</a></p>
    </div>
    <aside class="side-card">
      <h2>Status</h2>
      <p><span class="tag">Not published</span></p>
      <p>No endpoint, no package, no key. The app in the browser is the only interface, and its actions are disabled.</p>
    </aside>
  </div>
</section>`;

const how = `<section class="page-hero sky" data-starfield>
  <div class="wrap page-hero-grid">
    <div>
      <p class="crumb"><a href="/">Nyxa Network</a> / How it works</p>
      <p class="pill">Illustrative</p>
      <h1>A note leaves. <em>A payment arrives.</em></h1>
      <p class="lede">This is the planned path of a private payment. The animation is a diagram. It is not a tracker, not a mempool, and not your funds.</p>
    </div>
    ${illustration("flow")}
  </div>
</section>
<section class="band sky" data-starfield>
  <div class="wrap">
    ${sequence()}
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    <h2>Read it slowly</h2>
    <p>Veil creates the note. Prove shows the note is spendable without pointing at it. Relay puts that proof on a chain under someone else’s gas. Arrive is the recipient being paid. The link the pool is designed to withhold is the one between the first step and the last.</p>
    <h2>What this diagram is not</h2>
    <ul>
      <li>Not a live payment feed.</li>
      <li>Not evidence of volume, users, or deposits.</li>
      <li>Not a claim that privacy is absolute. A relayer sees what it submits. A recipient sees what arrives. Amounts and timing remain visible as amounts and timing.</li>
    </ul>
    <div class="callout"><strong>Nothing in the sequence can be submitted.</strong> Contracts are not deployed. The app’s buttons stay on “Launching soon”.</div>
    <p class="related"><a href="/docs.html">Architecture notes</a><a href="/app/">Open the app</a></p>
  </div>
</section>`;

const chains = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Chains</p>
    <p class="pill">Planned networks</p>
    <h1>Five names. <em>No deployment.</em></h1>
    <p class="lede">Chain parameters below are the public networks themselves. Nyxa has not deployed contracts on them. Listing a chain here is not a deployment.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    <div class="chain-grid">
      <article class="card chain-card"><h3>Robinhood Chain</h3><p>Chain id 4663. Gas token ETH. Public RPC <a href="https://rpc.mainnet.chain.robinhood.com" rel="noopener noreferrer">rpc.mainnet.chain.robinhood.com</a>. Explorer <a href="https://robinhoodchain.blockscout.com" rel="noopener noreferrer">robinhoodchain.blockscout.com</a>.</p><p><span class="tag">Contracts not deployed</span></p></article>
      <article class="card chain-card"><h3>Base</h3><p>Chain id 8453. Gas token ETH. Public RPC <a href="https://mainnet.base.org" rel="noopener noreferrer">mainnet.base.org</a>. Explorer <a href="https://basescan.org" rel="noopener noreferrer">basescan.org</a>.</p><p><span class="tag">Contracts not deployed</span></p></article>
      <article class="card chain-card"><h3>Arbitrum</h3><p>Chain id 42161. Gas token ETH. Public RPC <a href="https://arb1.arbitrum.io/rpc" rel="noopener noreferrer">arb1.arbitrum.io/rpc</a>. Explorer <a href="https://arbiscan.io" rel="noopener noreferrer">arbiscan.io</a>.</p><p><span class="tag">Contracts not deployed</span></p></article>
      <article class="card chain-card"><h3>BNB Chain</h3><p>Chain id 56. Gas token BNB. Public RPC <a href="https://bsc-dataseed.binance.org" rel="noopener noreferrer">bsc-dataseed.binance.org</a>. Explorer <a href="https://bscscan.com" rel="noopener noreferrer">bscscan.com</a>.</p><p><span class="tag">Contracts not deployed</span></p></article>
      <article class="card chain-card"><h3>Solana</h3><p>Planned as a destination, not as a pool home. It does not appear in the EVM network switcher. Your wallet stays on the source chain.</p><p><span class="tag">Destination only</span></p></article>
    </div>
    <div class="prose" style="margin-top:28px">
      <p>References, not endorsements: <a href="https://docs.robinhood.com/chain/connecting/" rel="noopener noreferrer">Robinhood Chain</a>, <a href="https://docs.base.org/" rel="noopener noreferrer">Base</a>, <a href="https://docs.arbitrum.io/" rel="noopener noreferrer">Arbitrum</a>, <a href="https://docs.bnbchain.org/" rel="noopener noreferrer">BNB Chain</a>, <a href="https://solana.com/docs" rel="noopener noreferrer">Solana</a>.</p>
    </div>
  </div>
</section>`;

const docs = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / Docs</p>
    <p class="pill">Planned architecture</p>
    <h1>The plan, <em>written plainly.</em></h1>
    <p class="lede">An overview of the architecture Nyxa intends to build. Not a specification freeze, not an audit, and not a description of deployed code. There is no deployed code.</p>
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    <h2>Four planned parts</h2>
    <div class="arch">
      <article><span class="card-kicker">Planned</span><h3>Browser</h3><p>Builds the proof from the note. The secret is not meant to leave the device.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Planned</span><h3>Relayer</h3><p>Submits the proof and pays gas, so the depositor’s wallet is not the sender.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Planned</span><h3>Pool</h3><p>A contract that would store commitments in a Merkle tree. It is not deployed.</p></article>
      <span class="arch-arrow" aria-hidden="true">→</span>
      <article><span class="card-kicker">Planned</span><h3>Arrival</h3><p>The recipient is paid. The link back to a specific deposit is what the design withholds.</p></article>
    </div>
    <h2>Non-custodial notes</h2>
    <p>The design is non-custodial: Nyxa should never take custody of a note’s spend secret. Keys stay with the holder. That cannot be verified against deployed contracts, because none are deployed. Dawn, the recovery path, is still a signature by the holder’s own wallet — not a backup kept by us.</p>
    <h2>Proofs in the browser</h2>
    <p>The plan is to generate the zero-knowledge proof in the browser, so the raw note does not have to be sent to a server for someone else to prove. Which proving system, and which circuit, is not decided. This page will not pretend that it is.</p>
    <h2>Merkle tree of notes</h2>
    <p>Deposits are planned as commitments inserted into a Merkle tree. A later spend would prove knowledge of a leaf without revealing which leaf. The tree has no root today, because the contract that would hold it does not exist.</p>
    <h2>The relayer</h2>
    <p>A relayer is planned to submit the withdrawal and pay the network fee. That is how the payer’s own wallet stays off the transaction. Relayer selection — open, allowlisted, or operated — and the fee are not published yet. A relayer necessarily sees the transaction it submits.</p>
    <h2>What would stay public</h2>
    <ul>
      <li>That a deposit of a given asset and size entered a pool.</li>
      <li>That a payment of a given asset and size arrived.</li>
      <li>The relayer’s address as the transaction sender.</li>
      <li>The recipient address.</li>
    </ul>
    <h2>What is deliberately undecided</h2>
    <ul>
      <li>The proving system.</li>
      <li>The fee schedule.</li>
      <li>Who may run a relayer.</li>
      <li>The exact note format.</li>
      <li>Contract addresses. There are none to publish.</li>
    </ul>
    <div class="callout"><strong>Not an audit.</strong> Nothing on this page is a security review. No third party has been claimed as an auditor of Nyxa.</div>
  </div>
</section>`;

const faqs = [
  ["Is Nyxa Network live?", "No. Nyxa is in development. The contracts are not deployed. The website describes the product being built and lets a wallet connect so you can see your own address and native balance. It cannot veil, whisper, swap, or cross."],
  ["Can I deposit or send today?", "No. In the app, the action button is disabled and labelled “Launching soon”. Filling in a form does not create a transaction. If a submit event fires anyway, the page refuses it and sends nothing."],
  ["Why connect a wallet if nothing can be sent?", "So the app can show the real account, the real network, and the real native balance from that wallet. It is a window onto your wallet, not a till. Nyxa will not ask for a seed phrase."],
  ["Has Nyxa been audited?", "No audit is claimed. There is no deployed system to audit, and this site does not name an auditor, a report, or a date."],
  ["What is the $NYXA contract address?", "There isn’t one. The token is not launched. The contract address will be announced only on official channels, and this website will be updated when that happens. It is blank on purpose."],
  ["Which assets are planned?", "ETH, USDC, and USDG. Token balances are not shown in the app, because Nyxa has no contracts to read and this page does not look up someone else’s token addresses. The balance you see is the network’s native gas token, from your wallet."],
  ["Which chains are planned?", "Robinhood Chain, Base, Arbitrum, and BNB Chain as pool networks. Solana as a destination only. Chain ids and public endpoints are listed on the Chains page. None of them host a Nyxa contract."],
  ["Does Nyxa hold funds?", "The design is non-custodial: the spend secret of a note stays with the holder. Nyxa is not holding funds today because it cannot accept them. There is no deposit address."],
  ["What would a relayer see?", "The withdrawal it is asked to submit, including the destination, because it has to broadcast that transaction. The pool is designed so other observers cannot match that withdrawal to a specific deposit. That matching resistance is a goal, not a measured result."],
  ["Does “leave no trace” mean nobody can see anything?", "No. It is the aim of the design: remove the public link between a deposit and a later payment. Recipients see arrivals. Relayers see what they send. Amounts and timing still exist. A full privacy analysis waits until the design is frozen and actually reviewed."],
  ["Is there an official social account?", "Not yet. There is no official X account. The only profile linked from this site is the GitHub repository in the footer."],
  ["Someone sent me a contract address and called it $NYXA. Is it real?", "No. Nyxa Network has not launched the token. An address in a reply, an ad, or a direct message is not an announcement. Do not buy it and do not send funds to it."],
  ["What is Dawn for?", "Recovery of a note from a signature by the wallet that created it. It is not a help desk, and it is not a way for Nyxa to reconstruct a secret we never stored. The exact signature format is not final."],
  ["Is the animation a live payment?", "No. Anywhere you see the sequence Veil → Prove → Relay → Arrive, it is labelled as how it works. It is an illustration of the plan."],
];

const faq = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / FAQ</p>
    <p class="pill">Plain answers</p>
    <h1>Questions, <em>without theatre.</em></h1>
    <p class="lede">Short answers about what exists today. If a question is about a user count or a total locked, the answer is that we do not publish figures we do not have.</p>
  </div>
</section>
<section class="band">
  <div class="wrap faq">
    ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
  </div>
</section>`;

const token = `<section class="page-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / $NYXA</p>
    <p class="pill">Not launched</p>
    <h1>The token is <em>not live.</em></h1>
    <p class="lede">$NYXA is the planned token of Nyxa Network. It has no contract address. This page will not invent one, and it will not invent a supply, a price, or an allocation.</p>
  </div>
</section>
<section class="band">
  <div class="wrap prose">
    <p class="token-display">$NYXA</p>
    <div class="ca-blank">
      <span class="card-kicker">Contract address</span>
      <strong>Not launched</strong>
      <p>Announced only on official channels. This box stays empty until that announcement, and then the address published here will be the one to check against.</p>
    </div>
    <h2>What this page refuses to guess</h2>
    <ul>
      <li>A contract address on any chain.</li>
      <li>A total supply.</li>
      <li>A price.</li>
      <li>An allocation, a sale, or a claim.</li>
    </ul>
    <p>Any of those, if they ever exist, will be described when the token is actually launched. There is no sale on this website.</p>
    <div class="warning">
      <p><strong>Do not buy a token from an address posted in a reply, an ad, or a direct message.</strong> Nyxa Network has not launched $NYXA. There is no official X account to confirm an address in a thread. The only profile linked from this site sits in the footer, and the contract address will be announced only on official channels.</p>
    </div>
  </div>
</section>`;

function field(id, label, control, hint = "") {
  return `<div class="field"><label for="${id}">${label}</label>${control}${hint ? `<span class="hint">${hint}</span>` : ""}<span class="error-text"></span></div>`;
}

const app = `<section class="app-hero sky" data-starfield>
  <div class="wrap">
    <p class="crumb"><a href="/">Nyxa Network</a> / App</p>
    <p class="pill">In development</p>
    <h1>A window, <em>not a till.</em></h1>
    <p class="lede">Nyxa Network connects your own wallet and reads the native balance on that network. The forms are real. The action that would move funds stays disabled, because the contracts are not deployed.</p>
  </div>
</section>
<section class="band" style="padding-top:28px">
  <div class="wrap app-shell">
    <aside class="wallet-panel panel">
      <p id="wallet-error" class="alert" role="alert" hidden></p>
      <div id="wallet-empty">
        <h2>Wallet</h2>
        <p>Connect MetaMask, Rabby, OKX, or another EIP-1193 wallet. Nyxa reads your account and native balance. It never asks for a seed phrase.</p>
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
        <a id="explorer-link" hidden rel="noopener noreferrer" target="_blank">View this address on the public explorer</a>
        <div class="wallet-actions">
          <button id="refresh-balance" class="btn btn-line" type="button">Refresh balance</button>
          <button id="disconnect-btn" class="btn btn-line" type="button">Clear</button>
        </div>
      </div>
      <div>
        <h2>Network</h2>
        <p class="hint">Robinhood Chain, Base, Arbitrum, or BNB Chain. Solana is a destination only. Nyxa does not operate these networks.</p>
        <div id="network-switcher" class="network-switcher" role="group" aria-label="Planned networks"></div>
      </div>
    </aside>
    <div class="workspace panel">
      <div class="tabs" role="tablist" aria-label="Planned actions">
        <button type="button" role="tab" id="tab-veil" aria-controls="panel-veil" aria-selected="true">Veil</button>
        <button type="button" role="tab" id="tab-whisper" aria-controls="panel-whisper" aria-selected="false" tabindex="-1">Whisper</button>
        <button type="button" role="tab" id="tab-eclipse" aria-controls="panel-eclipse" aria-selected="false" tabindex="-1">Eclipse</button>
        <button type="button" role="tab" id="tab-crossing" aria-controls="panel-crossing" aria-selected="false" tabindex="-1">Crossing</button>
      </div>
      <div role="tabpanel" id="panel-veil" aria-labelledby="tab-veil">
        <h2>Veil</h2>
        <p class="hint">Draft a deposit. It will not be submitted.</p>
        <form id="form-veil" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("veil-asset", "Asset", '<select id="veil-asset" data-kind="asset" required></select>', "ETH, USDC, or USDG. No token balance is read.")}
              ${field("veil-amount", "Amount", '<input id="veil-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>', "A number greater than zero. Nothing is deposited.")}
            </div>
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note" id="veil-launch">Contracts are not deployed, so Nyxa cannot send this.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-whisper" aria-labelledby="tab-whisper" hidden>
        <h2>Whisper</h2>
        <p class="hint">Draft a private send on the connected EVM network. A relayer would pay gas. None of that can happen yet.</p>
        <form id="form-whisper" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("whisper-asset", "Asset", '<select id="whisper-asset" data-kind="asset" required></select>')}
              ${field("whisper-amount", "Amount", '<input id="whisper-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            </div>
            ${field("whisper-to", "Recipient address", '<input id="whisper-to" data-kind="address" autocomplete="off" spellcheck="false" placeholder="0x…" required>', "Format check only. This page does not verify the checksum.")}
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Contracts are not deployed, so Nyxa cannot send this.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-eclipse" aria-labelledby="tab-eclipse" hidden>
        <h2>Eclipse</h2>
        <p class="hint">Draft a swap inside the pool. There is no price to show, so none is shown.</p>
        <form id="form-eclipse" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("eclipse-from", "From", '<select id="eclipse-from" data-kind="asset" required></select>')}
              ${field("eclipse-to", "To", '<select id="eclipse-to" data-kind="asset" required></select>')}
            </div>
            ${field("eclipse-amount", "Amount", '<input id="eclipse-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Contracts are not deployed, so Nyxa cannot send this.</p>
            <p class="form-status" data-status role="status"></p>
          </div>
        </form>
      </div>
      <div role="tabpanel" id="panel-crossing" aria-labelledby="tab-crossing" hidden>
        <h2>Crossing</h2>
        <p class="hint">Draft a cross-chain move. Solana can be a destination. It is not an EVM source.</p>
        <form id="form-crossing" data-plan novalidate>
          <div class="form-grid">
            <div class="form-row">
              ${field("cross-source", "Source chain", '<select id="cross-source" data-kind="chain" required></select>')}
              ${field("cross-dest", "Destination chain", '<select id="cross-dest" data-kind="chain" required></select>')}
            </div>
            <div class="form-row">
              ${field("cross-asset", "Asset", '<select id="cross-asset" data-kind="asset" required></select>')}
              ${field("cross-amount", "Amount", '<input id="cross-amount" data-kind="amount" inputmode="decimal" autocomplete="off" placeholder="Amount" required>')}
            </div>
            <div class="field">
              <label for="cross-to" id="cross-to-label">Destination address</label>
              <input id="cross-to" data-kind="address" autocomplete="off" spellcheck="false" placeholder="0x…" required>
              <span class="hint" id="cross-to-hint">An Ethereum-style address on the destination chain. Format check only.</span>
              <span class="error-text"></span>
            </div>
            <button class="btn btn-moon" type="submit" data-launch disabled>Launching soon</button>
            <p class="launch-note">Contracts are not deployed, so Nyxa cannot send this.</p>
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
    <p class="crumb"><a href="/">Nyxa Network</a> / 404</p>
    <h1>This page is <em>not in the sky.</em></h1>
    <p class="lede">That address is not part of the site. The pool is not missing — it was never deployed.</p>
    <div class="actions"><a class="btn btn-moon" href="/">Back home</a></div>
  </div>
</section>`;

const pages = [
  ["index.html", "/", "/", "Nyxa Network — Pay in the dark.", "Nyxa Network is a private payment pool in development. Pay in the dark. Leave no trace. Contracts are not deployed.", home()],
  ["veil.html", "/veil.html", "/veil.html", "Veil — Nyxa Network", "Veil is Nyxa Network’s planned deposit: shield ETH, USDC, or USDG as an encrypted note. In development. Contracts are not deployed.", veil],
  ["whisper.html", "/whisper.html", "/whisper.html", "Whisper — Nyxa Network", "Whisper is Nyxa Network’s planned private send. A relayer would pay gas so the sender’s wallet does not appear. Not live.", whisper],
  ["eclipse.html", "/eclipse.html", "/eclipse.html", "Eclipse — Nyxa Network", "Eclipse is Nyxa Network’s planned private swap inside the pool. No price is shown because no market exists yet.", eclipse],
  ["crossing.html", "/crossing.html", "/crossing.html", "Crossing — Nyxa Network", "Crossing is Nyxa Network’s planned private move across Robinhood Chain, Base, Arbitrum, BNB Chain, and Solana as a destination.", crossing],
  ["dawn.html", "/dawn.html", "/dawn.html", "Dawn — Nyxa Network", "Dawn is Nyxa Network’s planned recovery of a note from the wallet signature that created it. Non-custodial. Not live.", dawn],
  ["agents.html", "/agents.html", "/agents.html", "Agents — Nyxa Network", "Nyxa Network plans a CLI and API for agents. No package and no endpoint are published.", agents],
  ["how-it-works.html", "/how-it-works.html", "/how-it-works.html", "How it works — Nyxa Network", "An illustrative Nyxa Network sequence: Veil, prove, relay, arrive. A diagram of the plan, not a live payment.", how],
  ["chains.html", "/chains.html", "/chains.html", "Chains — Nyxa Network", "Networks planned for Nyxa Network: Robinhood Chain, Base, Arbitrum, BNB Chain, and Solana as a destination. No contracts deployed.", chains],
  ["docs.html", "/docs.html", "/docs.html", "Docs — Nyxa Network", "Planned Nyxa Network architecture: browser zero-knowledge proofs, a relayer, Merkle-tree notes, and a non-custodial design. Not an audit.", docs],
  ["faq.html", "/faq.html", "/faq.html", "FAQ — Nyxa Network", "Plain answers about Nyxa Network: it is in development, unaudited, with no token address and no live pool.", faq],
  ["token.html", "/token.html", "/token.html", "$NYXA — Nyxa Network", "The $NYXA token is not launched. Nyxa Network will announce the contract address only on official channels.", token],
  ["app/index.html", "/app/", "/app/", "App — Nyxa Network", "Connect a wallet to Nyxa Network and read your real address, network, and native balance. Actions are disabled until launch.", app],
  ["404.html", "/404.html", "/404.html", "Page not found — Nyxa Network", "That page is not part of the Nyxa Network site.", missing],
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
