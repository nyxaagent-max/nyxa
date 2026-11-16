(function () {
  const NETWORKS = [
    {
      chainId: "0x1237",
      decimal: 4663,
      name: "Robinhood Chain",
      symbol: "ETH",
      param: {
        chainId: "0x1237",
        chainName: "Robinhood Chain",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
        blockExplorerUrls: ["https://robinhoodchain.blockscout.com"],
      },
    },
    {
      chainId: "0x2105",
      decimal: 8453,
      name: "Base",
      symbol: "ETH",
      param: {
        chainId: "0x2105",
        chainName: "Base",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.base.org"],
        blockExplorerUrls: ["https://basescan.org"],
      },
    },
    {
      chainId: "0xa4b1",
      decimal: 42161,
      name: "Arbitrum",
      symbol: "ETH",
      param: {
        chainId: "0xa4b1",
        chainName: "Arbitrum One",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
      },
    },
    {
      chainId: "0x38",
      decimal: 56,
      name: "BNB Chain",
      symbol: "BNB",
      param: {
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        blockExplorerUrls: ["https://bscscan.com"],
      },
    },
  ];

  const ASSETS = ["ETH", "USDC", "USDG"];
  const state = {
    provider: null,
    account: null,
    name: "",
    chainId: null,
    balance: undefined,
    balanceError: "",
  };
  let subscribed = null;
  let pendingConnect = null;

  const $ = (id) => document.getElementById(id);

  function normalize(hex) {
    if (hex == null) return null;
    return "0x" + BigInt(hex).toString(16);
  }

  function guessName(provider) {
    if (!provider) return "Wallet";
    if (provider.isRabby) return "Rabby";
    if (provider.isOkxWallet || provider.isOKExWallet) return "OKX Wallet";
    if (provider.isCoinbaseWallet) return "Coinbase Wallet";
    if (provider.isBraveWallet && !provider.isMetaMask) return "Brave Wallet";
    if (provider.isMetaMask) return "MetaMask";
    return "Browser wallet";
  }

  function listWallets() {
    const announced = Array.isArray(window.__nyxaWallets) ? window.__nyxaWallets.slice() : [];
    if (announced.length) return announced;
    if (window.ethereum) {
      return [{
        info: { uuid: "injected", name: guessName(window.ethereum), icon: "" },
        provider: window.ethereum,
      }];
    }
    return [];
  }

  function waitForWallets() {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(listWallets()), 350);
    });
  }

  function friendly(err) {
    const code = err && err.code;
    if (code === 4001) return "The wallet request was declined.";
    if (code === -32002) return "A wallet request is already open. Answer it in the wallet, then try again.";
    const message = err && err.message ? String(err.message) : "The wallet request failed.";
    return message.length > 280 ? message.slice(0, 280) + "…" : message;
  }

  function showError(message) {
    const node = $("wallet-error");
    if (!node) return;
    if (!message) {
      node.hidden = true;
      node.textContent = "";
      return;
    }
    node.hidden = false;
    node.textContent = message;
  }

  function networkById(chainId) {
    return NETWORKS.find((network) => network.chainId === chainId) || null;
  }

  function formatUnits(hex) {
    const value = BigInt(hex);
    if (value === 0n) return "0";
    const base = 10n ** 18n;
    const whole = value / base;
    const frac = value % base;
    if (frac === 0n) return whole.toString();
    const digits = frac.toString().padStart(18, "0").replace(/0+$/, "");
    const shown = digits.length <= 6 ? digits : digits.slice(0, 6).replace(/0+$/, "");
    if (!shown) return "< 0.000001";
    return whole.toString() + "." + shown;
  }

  function shortAddress(address) {
    return address.slice(0, 6) + "…" + address.slice(-4);
  }

  function render() {
    const empty = $("wallet-empty");
    const live = $("wallet-live");
    const connected = Boolean(state.account);
    if (empty) empty.hidden = connected;
    if (live) live.hidden = !connected;
    if (!connected) {
      paintNetworks();
      return;
    }
    $("wallet-label").textContent = state.name || "Wallet";
    $("account-address").textContent = state.account;
    $("account-short").textContent = shortAddress(state.account);
    const network = networkById(state.chainId);
    $("network-name").textContent = network ? network.name : "Unrecognized network";
    let decimal = "";
    try {
      decimal = state.chainId ? String(Number(BigInt(state.chainId))) : "";
    } catch (err) {
      decimal = "";
    }
    $("network-id").textContent = decimal ? "Chain id " + decimal : "Chain id unavailable";
    const note = $("balance-note");
    if (state.balance === undefined) {
      $("balance-value").textContent = "Reading…";
      $("balance-symbol").textContent = "";
    } else if (state.balance == null) {
      $("balance-value").textContent = "Unavailable";
      $("balance-symbol").textContent = "";
    } else {
      $("balance-value").textContent = formatUnits(state.balance);
      $("balance-symbol").textContent = network ? network.symbol : "";
    }
    if (note) {
      note.textContent = network
        ? "Native balance reported by your wallet for this network. Nyxa Network does not hold these funds, and this is not a pool balance."
        : "This chain is outside the planned set. The figure assumes 18 decimals — confirm the unit in your wallet. Nyxa Network does not hold these funds.";
    }
    const raw = $("balance-raw");
    if (raw) {
      raw.textContent = state.balanceError
        ? state.balanceError
        : state.balance
          ? "Wei " + BigInt(state.balance).toString()
          : "";
    }
    const explorer = $("explorer-link");
    if (explorer) {
      if (network && state.account) {
        const base = network.param.blockExplorerUrls[0].replace(/\/$/, "");
        explorer.href = base + "/address/" + state.account;
        explorer.hidden = false;
      } else {
        explorer.hidden = true;
        explorer.removeAttribute("href");
      }
    }
    paintNetworks();
  }

  function paintNetworks() {
    const host = $("network-switcher");
    if (!host) return;
    host.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.chain === state.chainId ? "true" : "false");
    });
  }

  function subscribe(provider) {
    if (!provider || subscribed === provider || typeof provider.on !== "function") return;
    subscribed = provider;
    provider.on("accountsChanged", (accounts) => {
      if (!accounts || !accounts.length) {
        clearView("The wallet reports no account. Connect again to read a balance.");
        return;
      }
      state.account = accounts[0];
      state.balance = undefined;
      render();
      refreshBalance();
    });
    provider.on("chainChanged", (chainId) => {
      state.chainId = normalize(chainId);
      state.balance = undefined;
      render();
      refreshBalance();
    });
  }

  async function refreshBalance() {
    if (!state.provider || !state.account) return;
    state.balance = undefined;
    state.balanceError = "";
    render();
    try {
      const hex = await state.provider.request({
        method: "eth_getBalance",
        params: [state.account, "latest"],
      });
      state.balance = hex;
      state.balanceError = "";
    } catch (err) {
      state.balance = null;
      state.balanceError = friendly(err);
    }
    render();
  }

  async function adopt(provider, name, account) {
    state.provider = provider;
    state.account = account;
    state.name = name || guessName(provider);
    state.balance = undefined;
    state.balanceError = "";
    subscribe(provider);
    state.chainId = normalize(await provider.request({ method: "eth_chainId" }));
    showError("");
    render();
    await refreshBalance();
  }

  async function connect(provider, name) {
    showError("");
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts || !accounts[0]) throw new Error("The wallet did not return an account.");
      await adopt(provider, name, accounts[0]);
      return true;
    } catch (err) {
      showError(friendly(err));
      return false;
    }
  }

  function hideModal() {
    const modal = $("wallet-modal");
    if (modal) modal.hidden = true;
  }

  function closeModal(resolved) {
    hideModal();
    if (pendingConnect) {
      const finish = pendingConnect;
      pendingConnect = null;
      finish(resolved);
    }
  }

  function openModal(wallets) {
    const modal = $("wallet-modal");
    const list = $("wallet-list");
    list.replaceChildren();
    wallets.forEach((wallet) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      if (wallet.info.icon) {
        const img = document.createElement("img");
        img.alt = "";
        img.src = wallet.info.icon;
        button.append(img);
      }
      button.append(document.createTextNode(wallet.info.name || "Wallet"));
      button.addEventListener("click", async () => {
        const finish = pendingConnect;
        pendingConnect = null;
        hideModal();
        const ok = await connect(wallet.provider, wallet.info.name || guessName(wallet.provider));
        if (finish) finish(ok);
      });
      item.append(button);
      list.append(item);
    });
    modal.hidden = false;
    const first = list.querySelector("button");
    first?.focus();
  }

  async function connectFlow() {
    const wallets = await waitForWallets();
    if (!wallets.length) {
      showError("No injected wallet found. Install MetaMask, Rabby, OKX Wallet, or another EIP-1193 wallet, then reload this page.");
      return false;
    }
    if (wallets.length === 1) {
      return connect(wallets[0].provider, wallets[0].info.name);
    }
    return new Promise((resolve) => {
      pendingConnect = resolve;
      openModal(wallets);
    });
  }

  function clearView(message) {
    state.provider = null;
    state.account = null;
    state.chainId = null;
    state.balance = undefined;
    state.balanceError = "";
    state.name = "";
    render();
    showError(message || "");
  }

  async function disconnect() {
    const provider = state.provider;
    let revoked = false;
    try {
      if (provider && provider.request) {
        await provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        revoked = true;
      }
    } catch (err) {
      revoked = false;
    }
    clearView(revoked
      ? "Disconnected in the wallet."
      : "Cleared on this page. Your wallet may still list this site until you disconnect it there.");
  }

  async function switchTo(network) {
    if (!state.provider) {
      const ok = await connectFlow();
      if (!ok || !state.provider) return;
    }
    showError("");
    try {
      await state.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (err) {
      const missing = err && (err.code === 4902 || /unrecognized chain|unknown chain/i.test(String(err.message || "")));
      if (!missing) {
        showError(friendly(err));
        return;
      }
      try {
        await state.provider.request({
          method: "wallet_addEthereumChain",
          params: [network.param],
        });
      } catch (addErr) {
        showError(friendly(addErr));
        return;
      }
    }
    try {
      state.chainId = normalize(await state.provider.request({ method: "eth_chainId" }));
    } catch (err) {
      showError(friendly(err));
    }
    render();
    await refreshBalance();
  }

  function buildSwitcher() {
    const host = $("network-switcher");
    NETWORKS.forEach((network) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.chain = network.chainId;
      button.textContent = network.name;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => switchTo(network));
      host.append(button);
    });
  }

  async function trySilent() {
    const wallets = await waitForWallets();
    for (const wallet of wallets) {
      try {
        const accounts = await wallet.provider.request({ method: "eth_accounts" });
        if (accounts && accounts[0]) {
          await adopt(wallet.provider, wallet.info.name || guessName(wallet.provider), accounts[0]);
          return;
        }
      } catch (err) {
        /* Keep looking. A silent read should not surface a popup error. */
      }
    }
  }

  function selectTab(tab) {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('[role="tabpanel"]')];
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
  }

  function setupTabs() {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        selectTab(tab);
        history.replaceState(null, "", "#" + tab.id.replace(/^tab-/, ""));
      });
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        next.focus();
        selectTab(next);
      });
    });
    const hash = location.hash.replace("#", "");
    const fromHash = document.getElementById("tab-" + hash);
    if (fromHash) selectTab(fromHash);
    window.addEventListener("hashchange", () => {
      const next = document.getElementById("tab-" + location.hash.replace("#", ""));
      if (next) selectTab(next);
    });
  }

  function isEvmAddress(value) {
    return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
  }

  function isSolanaAddress(value) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
  }

  function amountError(value) {
    const text = value.trim();
    if (!text) return "Enter an amount.";
    if (!/^\d+(\.\d+)?$/.test(text)) return "Enter a number greater than zero.";
    const decimals = text.includes(".") ? text.split(".")[1].length : 0;
    if (decimals > 18) return "Use at most 18 decimal places.";
    if (Number(text) <= 0) return "Enter a number greater than zero.";
    if (Number(text) > 1e15) return "That amount is larger than this form will accept.";
    return "";
  }

  function setFieldError(field, message) {
    const box = field.closest(".field");
    const error = box ? box.querySelector(".error-text") : null;
    if (box) box.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
    return !message;
  }

  function setupForms() {
    document.querySelectorAll("[data-launch]").forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    });

    const crossDest = $("cross-dest");
    const crossLabel = $("cross-to-label");
    const crossTo = $("cross-to");
    const crossHint = $("cross-to-hint");

    function syncDestination() {
      const solana = crossDest && crossDest.value === "solana";
      if (crossLabel) crossLabel.textContent = solana ? "Solana address" : "Destination address";
      if (crossTo) crossTo.placeholder = solana ? "Base58 address" : "0x…";
      if (crossHint) {
        crossHint.textContent = solana
          ? "Solana is a destination only. Your connected wallet stays on an EVM network."
          : "An Ethereum-style address on the destination chain. Format check only.";
      }
    }
    crossDest?.addEventListener("change", () => {
      syncDestination();
      if (crossTo?.dataset.touched) validateForm($("form-crossing"), false);
    });
    syncDestination();

    document.querySelectorAll("form[data-plan]").forEach((form) => {
      form.querySelectorAll("input, select").forEach((field) => {
        field.addEventListener("blur", () => {
          field.dataset.touched = "true";
          validateForm(form, false);
        });
        field.addEventListener("input", () => {
          if (field.dataset.touched) validateForm(form, false);
          const launch = form.querySelector("[data-launch]");
          if (launch) launch.disabled = true;
        });
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.querySelectorAll("input, select").forEach((field) => {
          field.dataset.touched = "true";
        });
        validateForm(form, true);
        const launch = form.querySelector("[data-launch]");
        if (launch) launch.disabled = true;
      });
    });
  }

  function validateForm(form, announceBlocked) {
    let ok = true;
    const status = form.querySelector("[data-status]");
    form.querySelectorAll("[data-kind]").forEach((field) => {
      if (!field.dataset.touched && !announceBlocked) return;
      const kind = field.dataset.kind;
      let message = "";
      if (kind === "asset" || kind === "chain") {
        if (!field.value) message = kind === "asset" ? "Choose an asset." : "Choose a chain.";
      } else if (kind === "amount") {
        message = amountError(field.value);
      } else if (kind === "address") {
        const solana = $("cross-dest") && form.id === "form-crossing" && $("cross-dest").value === "solana";
        if (!field.value.trim()) message = "Enter an address.";
        else if (solana && !isSolanaAddress(field.value)) message = "Enter a Solana address (base58, 32 to 44 characters).";
        else if (!solana && !isEvmAddress(field.value)) message = "Enter an Ethereum address: 0x followed by 40 hex characters. Checksum is not verified here.";
      }
      if (!setFieldError(field, message)) ok = false;
    });

    if (form.id === "form-eclipse") {
      const from = $("eclipse-from");
      const to = $("eclipse-to");
      if (from.value && to.value && from.value === to.value && (from.dataset.touched || announceBlocked)) {
        setFieldError(to, "Choose two different assets.");
        ok = false;
      }
    }
    if (form.id === "form-crossing") {
      const source = $("cross-source");
      const dest = $("cross-dest");
      if (source.value && dest.value && source.value === dest.value && dest.value !== "solana" && (dest.dataset.touched || announceBlocked)) {
        setFieldError(dest, "Choose a different destination.");
        ok = false;
      }
    }

    if (status) {
      if (ok && [...form.querySelectorAll("[data-kind]")].every((field) => field.value.trim())) {
        status.textContent = "These fields check out. Nyxa still cannot submit them.";
      } else if (announceBlocked) {
        status.textContent = "Launching soon. Nyxa cannot submit this because the contracts are not deployed.";
      } else if (!ok) {
        status.textContent = "Fix the highlighted fields. Nothing will be sent.";
      }
    }
    const launch = form.querySelector("[data-launch]");
    if (launch) launch.disabled = true;
    return ok;
  }

  function fillSelect(select, options, placeholder) {
    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.append(first);
    options.forEach((option) => {
      const item = document.createElement("option");
      if (typeof option === "string") {
        item.value = option;
        item.textContent = option;
      } else {
        item.value = option.value;
        item.textContent = option.label;
      }
      select.append(item);
    });
  }

  buildSwitcher();
  setupTabs();
  setupForms();
  ["veil-asset", "whisper-asset", "eclipse-from", "eclipse-to", "cross-asset"].forEach((id) => {
    fillSelect($(id), ASSETS, "Choose asset");
  });
  fillSelect($("cross-source"), NETWORKS.map((network) => ({ value: network.chainId, label: network.name })), "Choose source");
  fillSelect($("cross-dest"), NETWORKS.map((network) => ({ value: network.chainId, label: network.name })).concat([{ value: "solana", label: "Solana (destination only)" }]), "Choose destination");

  $("connect-btn")?.addEventListener("click", () => connectFlow());
  $("disconnect-btn")?.addEventListener("click", () => disconnect());
  $("refresh-balance")?.addEventListener("click", () => refreshBalance());
  $("copy-address")?.addEventListener("click", async () => {
    if (!state.account) return;
    const button = $("copy-address");
    try {
      await navigator.clipboard.writeText(state.account);
      button.textContent = "Copied";
    } catch (err) {
      const node = $("account-address");
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Selected";
    }
    window.setTimeout(() => {
      button.textContent = "Copy address";
    }, 1600);
  });
  $("wallet-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "wallet-modal") closeModal(false);
  });
  $("wallet-close")?.addEventListener("click", () => closeModal(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("wallet-modal") && !$("wallet-modal").hidden) closeModal(false);
  });

  render();
  trySilent();
})();
