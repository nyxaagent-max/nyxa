(function () {
  const root = document.querySelector("[data-stage]");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tabs = [...root.querySelectorAll("[data-stage-tab]")];
  const panels = [...root.querySelectorAll("[data-stage-panel]")];
  let index = 0;
  let cursor = 0;
  let phase = "queued";
  let timer = 0;
  const order = ["queued", "working", "done"];

  function items() {
    return [...panels[index].querySelectorAll("[data-step]")];
  }

  function paint() {
    const list = items();
    list.forEach((li, n) => {
      let state = "queued";
      if (n < cursor) state = "done";
      else if (n === cursor) state = phase;
      li.dataset.state = state;
      const label = li.querySelector(".ss");
      if (label) label.textContent = state;
    });
  }

  function select(next, reset) {
    index = next;
    tabs.forEach((tab, n) => tab.setAttribute("aria-selected", n === next ? "true" : "false"));
    panels.forEach((panel, n) => {
      panel.hidden = n !== next;
    });
    if (reset) {
      cursor = 0;
      phase = "queued";
    }
    if (reduce) {
      cursor = items().length;
      phase = "done";
    }
    paint();
  }

  function tick() {
    const list = items();
    const at = order.indexOf(phase);
    if (at < order.length - 1) {
      phase = order[at + 1];
      paint();
      return;
    }
    cursor += 1;
    phase = "queued";
    if (cursor >= list.length) {
      select((index + 1) % panels.length, true);
      return;
    }
    paint();
  }

  tabs.forEach((tab, n) => {
    tab.addEventListener("click", () => {
      window.clearInterval(timer);
      select(n, true);
      if (!reduce) timer = window.setInterval(tick, 1100);
    });
  });

  select(0, true);
  if (!reduce) timer = window.setInterval(tick, 1100);
})();
