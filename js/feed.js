(function () {
  const mounts = [...document.querySelectorAll("[data-feed]")];
  if (!mounts.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CHAINS = [
    {
      tag: "RHC",
      rpc: "https://rpc.mainnet.chain.robinhood.com",
      explorer: "https://robinhoodchain.blockscout.com/tx/",
    },
    {
      tag: "BASE",
      rpc: "https://mainnet.base.org",
      explorer: "https://basescan.org/tx/",
    },
    {
      tag: "ARB",
      rpc: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io/tx/",
    },
    {
      tag: "BNB",
      rpc: "https://bsc-dataseed.binance.org",
      explorer: "https://bscscan.com/tx/",
    },
  ];

  const screens = mounts.map((mount) => {
    const screen = mount.querySelector("[data-feed-screen]");
    return { mount, screen, compact: mount.hasAttribute("data-feed-compact"), queue: [], typing: false };
  });

  function rpc(url, method, params) {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 8000);
    return fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("http");
        const data = await res.json();
        if (!data || data.error || data.result == null) throw new Error("rpc");
        return data.result;
      })
      .finally(() => window.clearTimeout(timer));
  }

  function gwei(hex) {
    const wei = BigInt(hex);
    const base = 1000000000n;
    const whole = wei / base;
    const frac = (wei % base).toString().padStart(9, "0").slice(0, 4).replace(/0+$/, "");
    return frac ? whole.toString() + "." + frac : whole.toString();
  }

  function shortHash(hash) {
    return hash.slice(0, 6) + "…" + hash.slice(-4);
  }

  function typeLine(entry, item, done) {
    const row = document.createElement("div");
    row.className = "feed-line" + (item.down ? " is-down" : "");
    const text = document.createElement("span");
    row.append(text);
    entry.screen.append(row);
    while (entry.screen.children.length > (entry.compact ? 6 : 14)) {
      entry.screen.firstChild.remove();
    }
    entry.screen.scrollTop = entry.screen.scrollHeight;
    const full = item.text;
    if (reduce) {
      text.textContent = full;
      addLinks(row, item.links);
      done();
      return;
    }
    let i = 0;
    const step = () => {
      i += 1;
      text.textContent = full.slice(0, i);
      entry.screen.scrollTop = entry.screen.scrollHeight;
      if (i < full.length) {
        window.setTimeout(step, 12);
      } else {
        addLinks(row, item.links);
        done();
      }
    };
    step();
  }

  function addLinks(row, links) {
    (links || []).forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = " " + link.label;
      row.append(a);
    });
  }

  function pump(entry) {
    if (entry.typing) return;
    const next = entry.queue.shift();
    if (!next) return;
    entry.typing = true;
    typeLine(entry, next, () => {
      entry.typing = false;
      pump(entry);
    });
  }

  function push(item) {
    screens.forEach((entry) => {
      const shaped = entry.compact
        ? { text: item.compact || item.text, links: item.links ? item.links.slice(0, 1) : [], down: item.down }
        : item;
      entry.queue.push(shaped);
      pump(entry);
    });
  }

  const seen = {};

  async function readChain(chain) {
    try {
      const [gasHex, block] = await Promise.all([
        rpc(chain.rpc, "eth_gasPrice", []),
        rpc(chain.rpc, "eth_getBlockByNumber", ["latest", false]),
      ]);
      if (!block || !block.number || !Array.isArray(block.transactions)) throw new Error("block");
      const num = Number(BigInt(block.number));
      const tx = block.transactions.length;
      const gas = gwei(gasHex);
      let secs = null;
      if (block.parentHash && block.timestamp) {
        try {
          const parent = await rpc(chain.rpc, "eth_getBlockByHash", [block.parentHash, false]);
          if (parent && parent.timestamp) {
            secs = Number(BigInt(block.timestamp) - BigInt(parent.timestamp));
          }
        } catch (err) {
          secs = null;
        }
      }
      const key = chain.tag + ":" + num;
      if (seen[chain.tag] === key) return;
      seen[chain.tag] = key;
      const time = secs == null || !Number.isFinite(secs) ? "" : secs <= 0 ? " · <1s" : " · " + secs + "s";
      const hashes = block.transactions.slice(-2).filter((hash) => typeof hash === "string" && /^0x[0-9a-fA-F]{64}$/.test(hash));
      const links = hashes.map((hash) => ({ href: chain.explorer + hash, label: shortHash(hash) }));
      push({
        text: "[" + chain.tag + "] block " + num + " · " + tx + " tx · gas " + gas + " gwei" + time,
        compact: "[" + chain.tag + "] block " + num + " · " + tx + " tx · gas " + gas + " gwei",
        links,
        down: false,
      });
    } catch (err) {
      const key = chain.tag + ":down";
      if (seen[chain.tag] === key) return;
      seen[chain.tag] = key;
      push({
        text: "[" + chain.tag + "] reconnecting…",
        compact: "[" + chain.tag + "] reconnecting…",
        links: [],
        down: true,
      });
    }
  }

  async function poll() {
    await Promise.all(CHAINS.map((chain) => readChain(chain)));
  }

  push({ text: "connecting to public rpcs…", compact: "connecting to public rpcs…", links: [], down: false });
  seen._boot = "boot";
  poll();
  window.setInterval(poll, 5000);
})();
