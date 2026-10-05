import ASSETS from "./assets.json";
import { initMusicUI } from "./music/ui.js";
import { site } from "./config.js";

export function initHomepage() {
  const abort = new AbortController(),
    timers = new Set(),
    frames = new Set(),
    intervals = [],
    observers = [];
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      if (!abort.signal.aborted) fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const raf = (fn) => {
    const id = requestAnimationFrame((time) => {
      frames.delete(id);
      if (!abort.signal.aborted) fn(time);
    });
    frames.add(id);
    return id;
  };
  const repeat = (fn, ms) => {
    const id = setInterval(fn, ms);
    intervals.push(id);
    return id;
  };
  const listen = (target, event, fn, options = {}) =>
    target.addEventListener(event, fn, { ...options, signal: abort.signal });

  // The Vue shell is static; these controllers attach after mount.

  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const root = document.documentElement,
    audio = $("#audio"),
    video = $("#videoBg");
  document.title = site.metaData.title;
  document.querySelector("meta[name=description]").content =
    site.metaData.description;
  const defaults = {
    color: "#ff89b5",
    brightness: 68,
    blur: 0,
    wallpaper: "original",
    custom: "",
    video: "",
    volume: 65,
    engine: "bing",
  };
  const storageKey = "junko-home-v6-preferences";
  let preferences = { ...defaults };
  try {
    const p = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (p && typeof p === "object") preferences = { ...defaults, ...p };
  } catch (e) {}
  preferences.color = /^#[a-f\d]{6}$/i.test(preferences.color)
    ? preferences.color
    : defaults.color;
  for (const [k, min, max] of [
    ["brightness", 20, 100],
    ["blur", 0, 16],
    ["volume", 0, 100],
  ])
    preferences[k] = Number.isFinite(Number(preferences[k]))
      ? Math.max(min, Math.min(max, Number(preferences[k])))
      : defaults[k];
  if (
    !["original", "illustration", "plain", "custom", "video"].includes(
      preferences.wallpaper,
    )
  )
    preferences.wallpaper = "original";
  if (
    typeof preferences.custom !== "string" ||
    !/^data:image\/(jpeg|png|webp);base64,/.test(preferences.custom)
  )
    preferences.custom = "";
  if (
    typeof preferences.video !== "string" ||
    !/^https?:\/\//i.test(preferences.video)
  )
    preferences.video = "";
  let toastTimer,
    savedNotice = false;
  function toast(text) {
    $("#toast").textContent = text;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = later(() => ($("#toast").hidden = true), 3200);
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (e) {
      if (!savedNotice) {
        toast("浏览器未能保存设置，本次预览仍然有效。");
        savedNotice = true;
      }
    }
  }
  $$("[data-asset]").forEach((el) => {
    el.decoding = "async";
    if (!el.classList.contains("avatar")) el.loading = "lazy";
    el.src = ASSETS[el.dataset.asset];
  });
  function color(hex) {
    root.style.setProperty("--accent", hex);
    root.style.setProperty(
      "--accent-rgb",
      [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(","),
    );
    $("#customColor").value = hex;
    $$("[data-color]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.color === hex)),
    );
  }
  function applyPreferences() {
    color(preferences.color);
    root.style.setProperty("--brightness", preferences.brightness / 100);
    root.style.setProperty("--blur", preferences.blur + "px");
    $("#brightness").value = preferences.brightness;
    $("#brightnessValue").textContent = preferences.brightness + "%";
    $("#blur").value = preferences.blur;
    $("#blurValue").textContent = preferences.blur + "px";
    $("#volume").value = preferences.volume;
    $("#volumeValue").textContent = preferences.volume + "%";
    audio.volume = preferences.volume / 100;
    applyWallpaper();
    $("#engine").value = Object.hasOwn(engineUrls, preferences.engine)
      ? preferences.engine
      : "bing";
  }
  function applyWallpaper() {
    let pc = ASSETS.pc,
      mobile = ASSETS.mobile;
    video.pause();
    video.hidden = true;
    video.removeAttribute("src");
    if (preferences.wallpaper === "illustration") {
      pc = mobile = ASSETS.illustration;
    }
    if (preferences.wallpaper === "plain") {
      pc = mobile = "";
    }
    if (preferences.wallpaper === "custom" && preferences.custom) {
      pc = mobile = preferences.custom;
    }
    if (preferences.wallpaper === "video" && preferences.video) {
      pc = mobile = "";
      video.src = preferences.video;
      video.hidden = false;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        video.play().catch(() => toast("动态壁纸未能播放，试试图片背景。"));
    }
    root.style.setProperty("--wallpaper", pc ? 'url("' + pc + '")' : "none");
    root.style.setProperty(
      "--wallpaper-mobile",
      mobile ? 'url("' + mobile + '")' : "none",
    );
    $$("[data-wall]").forEach((el) =>
      el.setAttribute(
        "aria-pressed",
        String(el.dataset.wall === preferences.wallpaper),
      ),
    );
  }
  video.addEventListener("error", () => {
    video.hidden = true;
    root.style.setProperty("--wallpaper", 'url("' + ASSETS.pc + '")');
    root.style.setProperty(
      "--wallpaper-mobile",
      'url("' + ASSETS.mobile + '")',
    );
    toast("动态壁纸暂时不可用，已显示默认背景。");
  });
  const tags = site.tags;
  function createTags(target, list) {
    for (const t of list) {
      const b = document.createElement("button");
      b.className = "tag";
      b.textContent = t;
      b.title = "复制标签";
      b.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(t);
          toast("已复制：" + t);
        } catch (e) {
          const a = document.createElement("textarea");
          a.value = t;
          document.body.append(a);
          a.select();
          let ok = false;
          try {
            ok = document.execCommand("copy");
          } catch (e) {}
          a.remove();
          toast(ok ? "已复制：" + t : "复制不可用，标签是：" + t);
        }
      });
      target.append(b);
    }
  }
  createTags($("#railTags"), tags.slice(0, 5));
  createTags($("#aboutTags"), tags);
  createTags($("#lifeTags"), tags);
  const resources = [
    [
      "沈理校园 SYLUlive",
      "校园互助与社交应用",
      "https://github.com/zhouwu97/SYLUlive",
      "school",
    ],
    [
      "洛谷 Luogu",
      "算法竞赛题目练习与题解",
      "https://www.luogu.com.cn/",
      "code",
    ],
    [
      "SmallPDF",
      "PDF 转换、压缩与编辑工具",
      "https://smallpdf.com/cn/pdf-to-jpg",
      "grid",
    ],
    ["LeetCode", "算法与面试练习平台", "https://leetcode.cn/", "code"],
    [
      "The Pirate Bay",
      "BitTorrent 资源索引",
      "https://thepiratebay.org/",
      "bookmark",
    ],
  ];
  for (const [name, desc, url, icon] of resources) {
    const a = document.createElement("a");
    a.className = "resource";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML =
      '<span class="resource-icon"><svg><use href="#i-' +
      icon +
      '"/></svg></span><div><strong></strong><small></small></div>';
    a.querySelector("strong").textContent = name;
    a.querySelector("small").textContent = desc;
    $("#resourceList").append(a);
  }
  function clock() {
    const d = new Date(),
      opt = { timeZone: "Asia/Shanghai" };
    $("#clockTime").textContent = d.toLocaleTimeString("zh-CN", {
      ...opt,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    $("#clockDate").textContent = d.toLocaleDateString("zh-CN", {
      ...opt,
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    $("#year").textContent = d.getFullYear();
  }
  clock();
  repeat(clock, 15000);
  const engineUrls = {
    bing: "https://www.bing.com/search?q=",
    google: "https://www.google.com/search?q=",
    baidu: "https://www.baidu.com/s?wd=",
    yandex: "https://yandex.com/search/?text=",
    duckduckgo: "https://duckduckgo.com/?q=",
  };
  $("#engine").addEventListener("change", () => {
    preferences.engine = $("#engine").value;
    save();
  });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#searchInput").value.trim();
    if (!q) {
      $("#searchInput").focus();
      return;
    }
    let url;
    if (/^https?:\/\//i.test(q)) {
      try {
        url = new URL(q).href;
      } catch (e) {
        toast("这个网址格式不正确。");
        return;
      }
    } else if (/^([a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i.test(q)) {
      url = "https://" + q;
    } else if (
      /^(localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?(?:[/?#].*)?$/i.test(q)
    ) {
      url = "http://" + q;
    } else {
      url = engineUrls[$("#engine").value] + encodeURIComponent(q);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  });
  let returnFocus = null;
  function openDialog(id) {
    const d = $(id);
    if (d.open) return;
    const previous = $("dialog[open]");
    if (!previous) returnFocus = document.activeElement;
    else previous.close();
    d.showModal();
    document.body.style.overflow = "hidden";
  }
  function closeDialogs() {
    const d = $("dialog[open]");
    if (d) d.close();
    document.body.style.overflow = document.body.classList.contains(
      "clear-mode",
    )
      ? "hidden"
      : "";
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }
  function switchTab(name) {
    $$("[data-tab]").forEach((b) => {
      const selected = b.dataset.tab === name;
      b.setAttribute("aria-selected", selected);
      b.tabIndex = selected ? 0 : -1;
    });
    for (const pane of ["appearance", "wallpaper", "music"])
      $("#pane-" + pane).hidden = pane !== name;
    if (name === "music") loadMusic().catch(() => {});
  }
  function open(kind) {
    if (["appearance", "wallpaper", "music"].includes(kind)) {
      switchTab(kind);
      openDialog("#settingsDialog");
    } else openDialog("#" + kind + "Dialog");
  }
  $$("[data-open]").forEach((b) =>
    b.addEventListener("click", () => open(b.dataset.open)),
  );
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeDialogs));
  $$("[data-tab]").forEach((b) =>
    b.addEventListener("click", () => switchTab(b.dataset.tab)),
  );
  $(".dialog-tabs").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const tabs = $$("[data-tab]"),
      idx = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    let n =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 2
          : (idx + (e.key === "ArrowRight" ? 1 : -1) + 3) % 3;
    switchTab(tabs[n].dataset.tab);
    tabs[n].focus();
  });
  $$("dialog").forEach((d) => {
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeDialogs();
    });
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          closeDialogs();
      }
    });
  });
  function clearScreen() {
    closeDialogs();
    document.body.classList.add("clear-leaving");
    later(
      () => {
        document.body.classList.add("clear-mode");
        document.body.classList.remove("clear-leaving");
        $("#returnButton").hidden = false;
        $("#returnButton").focus();
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280,
    );
  }
  function restoreScreen() {
    document.body.classList.remove("clear-mode");
    document.body.classList.add("restoring");
    later(() => document.body.classList.remove("restoring"), 500);
    $("#returnButton").hidden = true;
    document.body.style.overflow = "";
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }
  $$("[data-clear]").forEach((b) => b.addEventListener("click", clearScreen));
  $("#returnButton").addEventListener("click", restoreScreen);
  listen(document, "keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("clear-mode"))
      restoreScreen();
    if (
      e.key === "/" &&
      !$("dialog[open]") &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      $("#searchInput").focus();
    }
  });
  $$("[data-color]").forEach((b) =>
    b.addEventListener("click", () => {
      preferences.color = b.dataset.color;
      color(preferences.color);
      save();
    }),
  );
  $("#customColor").addEventListener("input", (e) => {
    preferences.color = e.target.value;
    color(preferences.color);
    save();
  });
  for (const [name, unit] of [
    ["brightness", "%"],
    ["blur", "px"],
  ])
    $("#" + name).addEventListener("input", (e) => {
      preferences[name] = Number(e.target.value);
      root.style.setProperty(
        "--" + name,
        name === "brightness"
          ? preferences[name] / 100
          : preferences[name] + "px",
      );
      $("#" + name + "Value").textContent = preferences[name] + unit;
      save();
    });
  $$("[data-wall]").forEach((b) =>
    b.addEventListener("click", () => {
      preferences.wallpaper = b.dataset.wall;
      preferences.video = "";
      applyWallpaper();
      save();
    }),
  );
  $("#wallpaperFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("请选择图片文件。");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast("请选择小于 20MB 的图片。");
      return;
    }
    const objectUrl = URL.createObjectURL(file),
      im = new Image();
    try {
      await new Promise((res, rej) => {
        im.onload = res;
        im.onerror = rej;
        im.src = objectUrl;
      });
      const scale = Math.min(
          1,
          1600 / Math.max(im.naturalWidth, im.naturalHeight),
        ),
        canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(im.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(im.naturalHeight * scale));
      canvas.getContext("2d").drawImage(im, 0, 0, canvas.width, canvas.height);
      preferences.custom = canvas.toDataURL("image/jpeg", 0.84);
      preferences.wallpaper = "custom";
      applyWallpaper();
      save();
      toast("已换上你的壁纸。");
    } catch (e) {
      toast("这张图片未能读取，请换一张。");
    } finally {
      URL.revokeObjectURL(objectUrl);
      $("#wallpaperFile").value = "";
    }
  });
  $("#applyVideo").addEventListener("click", () => {
    try {
      const u = new URL($("#videoUrl").value.trim());
      if (!["https:", "http:"].includes(u.protocol)) throw Error();
      preferences.video = u.href;
      preferences.wallpaper = "video";
      applyWallpaper();
      save();
      toast("已应用动态壁纸。");
    } catch (e) {
      toast("请输入完整的 HTTP 或 HTTPS 视频地址。");
    }
  });
  $("#resetPreferences").addEventListener("click", () => {
    preferences = { ...defaults };
    $("#videoUrl").value = "";
    applyPreferences();
    save();
    toast("已恢复默认外观与壁纸。");
  });
  $("#volume").addEventListener("input", (e) => {
    preferences.volume = Number(e.target.value);
    audio.volume = preferences.volume / 100;
    $("#volumeValue").textContent = preferences.volume + "%";
    save();
  });

  const MUSIC_SHARED =
    "https://api.injahow.cn/meting/?server=netease&type=playlist&id=2028178887";
  const musicUI = initMusicUI({
    audio,
    $,
    $$,
    toast,
    openMusic: () => open("music"),
    config: site.musicPlayer,
  });
  function loadMusic(force = false) {
    return musicUI.loadMusic(force);
  }

  function updateNav() {
    const marker = window.innerWidth <= 800 ? 130 : 100;
    let current = "home";
    for (const id of ["home", "projects", "now"])
      if ($("#" + id).getBoundingClientRect().top <= marker) current = id;
    $$("[data-nav]").forEach((a) => {
      const active = a.dataset.nav === current;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  let navFrame = 0;
  listen(
    window,
    "scroll",
    () => {
      if (!navFrame)
        navFrame = raf(() => {
          updateNav();
          navFrame = 0;
        });
    },
    { passive: true },
  );
  listen(window, "resize", updateNav);
  updateNav();

  // Animation is optional: content is visible when observers or motion support are absent.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)"),
    finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  if (!reducedMotion.matches) {
    document.body.classList.add("intro-on");
    later(() => document.body.classList.remove("intro-on"), 1200);
    if ("IntersectionObserver" in window) {
      document.body.classList.add("motion-ready");
      const observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) {
              e.target.classList.add("revealed");
              observer.unobserve(e.target);
            }
        },
        { threshold: 0.06, rootMargin: "0px 0px -12px 0px" },
      );
      observers.push(observer);
      $$(".section").forEach((el) => {
        el.classList.add("reveal-section");
        observer.observe(el);
      });
      $$(".favorite,.tool-tile").forEach((el, i) =>
        el.style.setProperty("--delay", (i % 4) * 70 + "ms"),
      );
    }
  }
  if (finePointer.matches && !reducedMotion.matches) {
    $$(".featured,.panel,.small-project").forEach((el) => {
      el.classList.add("pointer-light");
      let frame = 0;
      el.addEventListener(
        "pointermove",
        (e) => {
          cancelAnimationFrame(frame);
          const x = e.clientX,
            y = e.clientY;
          frame = raf(() => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", x - r.left + "px");
            el.style.setProperty("--my", y - r.top + "px");
          });
        },
        { passive: true },
      );
    });
  }
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty(
      "--progress",
      max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0,
    );
  }
  listen(window, "scroll", updateProgress, { passive: true });
  listen(window, "resize", updateProgress);
  updateProgress();
  let selectedPreview = "campus";
  const previewNames = { campus: "首页", schedule: "课表", community: "社区" };
  $$("[data-preview]").forEach((b) =>
    b.addEventListener("click", () => {
      selectedPreview = b.dataset.preview;
      $$("[data-preview]").forEach((t) =>
        t.setAttribute("aria-pressed", String(t === b)),
      );
      const im = $("#projectPreview");
      im.style.opacity = "0";
      later(
        () => {
          im.src = ASSETS[selectedPreview];
          im.alt = "沈理校园应用" + previewNames[selectedPreview] + "截图";
          im.style.opacity = "1";
        },
        reducedMotion.matches ? 0 : 120,
      );
      $("#galleryImage").src = ASSETS[selectedPreview];
      $("#galleryImage").alt = im.alt;
      $("#galleryTitle").textContent =
        "沈理校园 · " + previewNames[selectedPreview];
    }),
  );
  const quoteLines = [
    "生活不止眼前的代码，还有远方的番剧和奶茶。",
    "做自己喜欢的事情，过自己想要的生活。",
    "今天的天气真好，适合摸鱼（划掉）适合写代码！",
  ];
  let quoteIndex = 0,
    quoteTimeout = 0;
  function nextQuote() {
    if (document.hidden || reducedMotion.matches) {
      quoteTimeout = later(nextQuote, 8000);
      return;
    }
    const el = $("#rotatingQuote");
    quoteIndex = (quoteIndex + 1) % quoteLines.length;
    let old = el.textContent,
      cut = old.length;
    function erase() {
      if (document.hidden) return schedule();
      el.textContent = old.slice(0, --cut);
      if (cut > 0) quoteTimeout = later(erase, 18);
      else {
        let n = 0;
        function type() {
          el.textContent = quoteLines[quoteIndex].slice(0, ++n);
          if (n < quoteLines[quoteIndex].length) quoteTimeout = later(type, 45);
          else schedule();
        }
        type();
      }
    }
    erase();
  }
  function schedule() {
    quoteTimeout = later(nextQuote, 8000);
  }
  if (!reducedMotion.matches) schedule();

  applyPreferences();
  $("#videoUrl").value = preferences.video;

  return () => {
    abort.abort();
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    intervals.forEach(clearInterval);
    observers.forEach((o) => o.disconnect());
    musicUI.dispose();
    video.pause();
    document.body.classList.remove(
      "playing",
      "intro-on",
      "motion-ready",
      "clear-mode",
      "restoring",
    );
    document.body.style.overflow = "";
  };
}
