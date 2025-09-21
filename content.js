(() => {
  const STORAGE_KEY = "cgpt_autoscroll_enabled";

  let enabled = false;
  let observer = null;
  let rafScheduled = false;
  let lastScrollEl = null;
  let autoNudgeTimer = null;

  let shouldPin = true;
  const NEAR_BOTTOM_PX = 80;

  let detachScrollListener = null;

  function createToggle() {
    const btn = document.createElement("button");
    btn.id = "cgpt-auto-scroll-toggle";
    btn.type = "button";
    btn.textContent = "AS";
    btn.title = "Auto-Scroll: Off";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "8px",
      right: "10px",
      width: "28px",
      height: "22px",
      lineHeight: "22px",
      fontSize: "11px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      textAlign: "center",
      color: "#fff",
      background: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: "2147483647",
      opacity: "0.35",
      padding: "0",
      userSelect: "none"
    });
    btn.addEventListener("mouseenter", () => (btn.style.opacity = "0.85"));
    btn.addEventListener("mouseleave", () => (btn.style.opacity = enabled ? "0.6" : "0.35"));
    btn.addEventListener("click", toggleEnabled);
    document.documentElement.appendChild(btn);
    return btn;
  }

  function reflectUI(btn) {
    btn.style.opacity = enabled ? "0.6" : "0.35";
    btn.title = `Auto-Scroll: ${enabled ? "On" : "Off"}`;
    btn.style.background = enabled ? "rgba(0,150,0,0.55)" : "rgba(0,0,0,0.45)";
  }

  function loadSetting() {
    return new Promise((resolve) => {
      if (!chrome?.storage?.sync) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          resolve(raw === "1");
        } catch {
          resolve(false);
        }
        return;
      }
      chrome.storage.sync.get([STORAGE_KEY], (res) => resolve(res[STORAGE_KEY] === true));
    });
  }

  function saveSetting(val) {
    if (!chrome?.storage?.sync) {
      try { localStorage.setItem(STORAGE_KEY, val ? "1" : "0"); } catch {}
      return;
    }
    chrome.storage.sync.set({ [STORAGE_KEY]: !!val });
  }

  function getScrollContainer() {
    const hints = [
      '[data-testid="conversation-turns"]',
      'main [class*="overflow-y-auto"]',
      'main [class*="scroll"]',
      'main',
    ];
    for (const sel of hints) {
      const el = document.querySelector(sel);
      if (el && isScrollable(el)) return el;
    }

    const candidates = Array.from(document.querySelectorAll("body *, body")).filter(isScrollable);
    if (candidates.length) {
      candidates.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight));
      return candidates[0];
    }

    return document.scrollingElement || document.documentElement || document.body;
  }

  function isScrollable(el) {
    const cs = getComputedStyle(el);
    const canScrollY = /(auto|scroll)/.test(cs.overflowY);
    return canScrollY && (el.scrollHeight - el.clientHeight > 4);
  }

  function computeShouldPin(el) {
    const metrics = getScrollMetrics(el);
    return metrics.distanceToBottom <= NEAR_BOTTOM_PX;
  }

  function getScrollMetrics(el) {
    if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
      const doc = document.scrollingElement || document.documentElement || document.body;
      const top = doc.scrollTop;
      const height = doc.scrollHeight;
      const view = window.innerHeight || doc.clientHeight;
      const maxTop = height - view;
      return {
        top,
        maxTop,
        distanceToBottom: Math.max(0, maxTop - top)
      };
    } else {
      const top = el.scrollTop;
      const maxTop = el.scrollHeight - el.clientHeight;
      return {
        top,
        maxTop,
        distanceToBottom: Math.max(0, maxTop - top)
      };
    }
  }

  function bindScrollListener(el) {
    if (detachScrollListener) {
      detachScrollListener();
      detachScrollListener = null;
    }

    const target = (el === document.scrollingElement || el === document.documentElement || el === document.body)
      ? window
      : el;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        shouldPin = computeShouldPin(el);
      });
    };

    target.addEventListener("scroll", onScroll, { passive: true });

    detachScrollListener = () => {
      target.removeEventListener("scroll", onScroll);
    };

    shouldPin = computeShouldPin(el);
  }

  function scrollToBottom() {
    const el = (lastScrollEl && document.contains(lastScrollEl)) ? lastScrollEl : getScrollContainer();
    if (el !== lastScrollEl) {
      lastScrollEl = el;
      bindScrollListener(el);
    }
    if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
      const doc = document.scrollingElement || document.documentElement || document.body;
      window.scrollTo({ top: doc.scrollHeight, behavior: "auto" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }

  function scheduleScroll() {
    if (!enabled || !shouldPin || rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      scrollToBottom();
    });
  }

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" && (m.addedNodes?.length || m.removedNodes?.length)) {
          scheduleScroll();
          return;
        }
        if (m.type === "characterData") {
          scheduleScroll();
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });

    if (!autoNudgeTimer) {
      autoNudgeTimer = setInterval(() => {
        scheduleScroll();
      }, 500);
    }
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (autoNudgeTimer) {
      clearInterval(autoNudgeTimer);
      autoNudgeTimer = null;
    }
  }

  async function toggleEnabled() {
    enabled = !enabled;
    saveSetting(enabled);
    reflectUI(toggleBtn);

    if (enabled) {
      lastScrollEl = getScrollContainer();
      bindScrollListener(lastScrollEl);
      if (shouldPin) scrollToBottom();
      startObserving();
    } else {
      stopObserving();
    }
  }

  let toggleBtn;
  (async function init() {
    toggleBtn = createToggle();
    enabled = await loadSetting();
    reflectUI(toggleBtn);

    lastScrollEl = getScrollContainer();
    bindScrollListener(lastScrollEl);

    if (enabled) {
      if (shouldPin) scrollToBottom();
      startObserving();
    }

    const spaWatcher = new MutationObserver(() => {
      if (!lastScrollEl || !document.contains(lastScrollEl)) {
        lastScrollEl = getScrollContainer();
        bindScrollListener(lastScrollEl);
      }
    });
    spaWatcher.observe(document.documentElement, { childList: true, subtree: true });
  })();
})();
