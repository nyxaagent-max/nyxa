(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupNav() {
    const root = document.querySelector("[data-protocol]");
    const btn = document.querySelector(".protocol-toggle");
    const menu = document.getElementById("protocol-menu");
    if (!root || !btn || !menu) return;

    function open() {
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
    }

    function close() {
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
    }

    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!hoverable) {
        if (btn.getAttribute("aria-expanded") === "true") close();
        else open();
        return;
      }
      open();
    });

    if (hoverable) {
      let timer = 0;
      root.addEventListener("mouseenter", () => {
        window.clearTimeout(timer);
        open();
      });
      root.addEventListener("mouseleave", () => {
        timer = window.setTimeout(close, 180);
      });
    }

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function setupProgress() {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = "scaleX(" + progress + ")";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
  }

  function setupTypewriter() {
    const el = document.querySelector("[data-typewriter]");
    const second = document.querySelector(".line-two");
    if (!el) return;
    if (reduce) {
      second?.classList.add("is-in");
      return;
    }
    const text = el.textContent || "";
    el.textContent = "";
    let index = 0;
    const step = () => {
      index += 1;
      el.textContent = text.slice(0, index);
      if (index < text.length) {
        window.setTimeout(step, 42);
      } else {
        el.classList.add("typed");
        second?.classList.add("is-in");
      }
    };
    window.setTimeout(step, 260);
    window.setTimeout(() => second?.classList.add("is-in"), 4200);
  }

  function setupStarfield(host) {
    const canvas = document.createElement("canvas");
    canvas.className = "stars";
    canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let stars = [];
    let raf = 0;
    let inView = false;

    function resize() {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(100, Math.max(32, width / 18)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() < 0.08 ? 1.7 + Math.random() * 0.8 : 0.4 + Math.random() * 1.05,
        a: 0.25 + Math.random() * 0.65,
        p: Math.random() * Math.PI * 2,
        s: 0.45 + Math.random() * 1.2,
        c: Math.random() < 0.18 ? "#f3e2b0" : Math.random() < 0.4 ? "#ddd2ff" : "#ffffff",
      }));
      draw(0);
    }

    function draw(time) {
      const width = host.clientWidth;
      const height = host.clientHeight;
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const alpha = reduce ? star.a : star.a * (0.55 + 0.45 * Math.sin(time * 0.001 * star.s + star.p));
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.fillStyle = star.c;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function frame(time) {
      raf = 0;
      if (inView && !document.hidden) draw(time);
      if (!reduce && inView && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduce || raf) return;
      raf = requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) start();
      });
      observer.observe(host);
    } else {
      inView = true;
      start();
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && inView) start();
    });
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener("resize", resize);
  }

  function setupSequence(root) {
    const buttons = [...root.querySelectorAll("[data-step]")];
    const panels = [...root.querySelectorAll("[data-panel]")];
    const orb = root.querySelector(".sequence-orb");
    const list = root.querySelector(".sequence-steps");
    const frame = root.querySelector(".sequence-track") || list;
    const toggle = root.querySelector("[data-flow-toggle]");
    if (!buttons.length || !panels.length || !list) return;

    let index = 0;
    let timer = 0;
    let paused = reduce;

    function vertical() {
      return window.matchMedia("(max-width: 800px)").matches;
    }

    function place() {
      if (!orb) return;
      const button = buttons[index];
      const parent = frame.getBoundingClientRect();
      const rect = button.getBoundingClientRect();
      if (vertical()) {
        orb.style.left = "17px";
        orb.style.top = rect.top + rect.height / 2 - parent.top + "px";
      } else {
        orb.style.top = "18px";
        orb.style.left = rect.left + rect.width / 2 - parent.left + "px";
      }
    }

    function show(next) {
      index = next;
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === index;
        panel.hidden = !active;
      });
      buttons.forEach((button, buttonIndex) => {
        if (buttonIndex === index) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      place();
    }

    function queue() {
      window.clearTimeout(timer);
      if (paused) return;
      timer = window.setTimeout(() => {
        show((index + 1) % buttons.length);
        queue();
      }, 3800);
    }

    buttons.forEach((button, buttonIndex) => {
      button.addEventListener("click", () => {
        show(buttonIndex);
        queue();
      });
    });

    list.addEventListener("keydown", (event) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !back) return;
      event.preventDefault();
      const next = (index + (forward ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      show(next);
      queue();
    });

    if (toggle) {
      const paint = () => {
        toggle.textContent = paused ? "Play sequence" : "Pause";
        toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      };
      toggle.addEventListener("click", () => {
        paused = !paused;
        paint();
        queue();
      });
      paint();
    }

    show(0);
    queue();
    window.addEventListener("resize", place);
  }

  document.querySelectorAll("[data-starfield]").forEach(setupStarfield);
  document.querySelectorAll("[data-flow]").forEach(setupSequence);
  setupNav();
  setupProgress();
  setupReveal();
  setupTypewriter();
})();
