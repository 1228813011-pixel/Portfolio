// ETC Portfolio Template JS — tiny but useful.
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

const THEME_KEY = "etcpfolio.theme";

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const icon = qs("#themeIcon");
  const label = qs("#themeLabel");
  if(icon) icon.textContent = theme === "light" ? "☀️" : "🌙";
  if(label) label.textContent = theme === "light" ? "Light" : "Dark";
}

(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if(saved){
    setTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
})();

// Reveal-on-scroll
(function initReveal(){
  const els = qsa(".reveal");
  if(!("IntersectionObserver" in window)){
    els.forEach(e => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(e.isIntersecting){
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
})();

// Project data (edit this!)
const PROJECTS = [
  {
    title: "Motus VR: VR Game for Lower Limb Rehab",
    desc: "An engaging, accessible, and configurable virtual reality (VR) game that transforms traditional lower-limb re-habilitation into an enjoyable experience.",
    tags: [ "Unreal Engine 5", "VR", "Group Project"],
    label: "Amusement-Park Theme / VR Game",
    href: "projects/vr-rehab.html",
    cover: "assets/UE/Amusement_Park.png",
    demo:  "assets/UE/Amusement_Park.mp4"
  },
  {
    title: "Skeleton: Castlevania-style 2D platform action game",
    desc: "A 2D platform action game in which the player controls a skeleton hero who navigates a procedurally generated cemetery level, survives patrolling werewolves, and defeats a boss knight.",
    tags: [ "C++", "2D Pixel", "Individual Coursework"],
    label: "Action / Pixel Game",
    href: "projects/C++.html",
    cover: "assets/UE/C++.png",
    demo:  "assets/UE/C++.mp4"
  },
  {
    title: "Generative NPC Pipeline (LLM + Unity)",
    desc: "Text → NPC attributes, appearance, and behaviors.",
    tags: ["Unity", "Generative AI Pipeline", "2D Pixel", "Individual Research", "In Progress"],
    label: "AI / Tools",
    href: "projects/generative-npc.html",
    cover: "assets/UE/ai.png",
    demo:  "assets/UE/ai.mp4"
  },
  {
    title: "Frogger: Refactor classic 2D arcade pixel game",
    desc: " Maintaining and/or extending a re-implementation of a classic retro game (Frogger). ",
    tags: ["Java", "Refactor", "2D Pixel", "Individual Coursework"],
    label: "Arcade / Pixel game",
    href: "projects/Frogger.html",
    cover: "assets/UE/frog.png",
    demo:  "assets/UE/frog.mp4"
  }
];

function renderProjects(){
  const grid = qs("#projectGrid");
  if(!grid) return;

  grid.innerHTML = PROJECTS.map((p) => {
    const hasCover = !!p.cover;
    const coverUrl = hasCover ? p.cover.replace(/\\/g, "/") : "";
    const coverStyle = hasCover ? `style="background-image:url('${coverUrl}');"` : "";

    const demoUrl = (p.demo || "").replace(/\\/g, "/");
    const hasDemo = !!demoUrl;
    const isVideo = /\.(mp4|webm|ogg)$/i.test(demoUrl);

    const demoHtml = !hasDemo ? "" : (
      isVideo
        ? `<video class="thumbDemo" muted loop playsinline preload="none" src="${demoUrl}"></video>`
        : `<img class="thumbDemo" src="${demoUrl}" alt="" loading="lazy" decoding="async" />`
    );

    return `
      <a class="card reveal" href="${p.href}">
        <div class="thumb ${hasCover ? "hasCover" : ""}" ${coverStyle}>
          ${demoHtml}
          <div class="thumbLabel">${p.label}</div>
        </div>

        <div class="body">
          <div class="title">
            <h3>${p.title}</h3>
            <span class="pill">Case Study →</span>
          </div>
          <p>${p.desc}</p>
          <div class="pills">
            ${p.tags.map(t => `<span class="pill" data-tag="${t}">${t}</span>`).join("")}
          </div>
        </div>
      </a>
    `;
  }).join("");
}

function initProjectHoverDemos(){
  qsa("#projectGrid .card").forEach((card) => {
    const demo = qs(".thumbDemo", card);
    if(!demo) return;

    const on = () => {
      card.classList.add("demoOn");
      if(demo.tagName === "VIDEO"){
        demo.currentTime = 0;
        demo.play().catch(()=>{});
      }
    };

    const off = () => {
      card.classList.remove("demoOn");
      if(demo.tagName === "VIDEO"){
        demo.pause();
        demo.currentTime = 0;
      }
    };

    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);

    // 键盘 focus 也能触发
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
  });
}

function initFilters(){
  const wrap = qs("#filters");
  if(!wrap) return;

  // 你可以在这里自定义“类别分组”和“顺序”
  const FILTER_GROUPS = [
    { title: "Filter", tags: ["All"] },

    { title: "Engine / Language", tags: ["Unreal Engine 5", "Unity", "C++", "Java"] },

    { title: "Domain / Style", tags: ["VR", "2D Pixel", "Generative AI Pipeline", "Refactor"] },

    { title: "Work Type", tags: ["Group Project", "Individual Coursework", "Individual Research"] },
  ];

  const tagsInUse = new Set(PROJECTS.flatMap(p => p.tags));

  // 把没被你分到组里的 tag 自动塞进 “Other”
  const used = new Set(
    FILTER_GROUPS.flatMap(g => g.tags).filter(t => t !== "All")
  );
  const leftovers = [...tagsInUse]
    .filter(t => !used.has(t))
    .sort((a,b)=>a.localeCompare(b));

  const groups = leftovers.length
    ? [...FILTER_GROUPS, { title: "Other", tags: leftovers }]
    : FILTER_GROUPS;

  // 渲染分组 HTML
  wrap.innerHTML = groups.map(g => {
    const btns = g.tags
      .filter(t => t === "All" || tagsInUse.has(t))
      .map(t => `
        <button
          class="filterBtn ${t==="All" ? "active" : ""}"
          data-filter="${t}"
          type="button"
        >${t}</button>
      `).join("");

    // 没按钮就不显示这个组
    if(!btns) return "";

    return `
      <div class="filterGroup">
        <div class="filterGroupTitle">${g.title}</div>
        <div class="filterGroupBtns">${btns}</div>
      </div>
    `;
  }).join("");

  const apply = (tag) => {
    qsa(".filterBtn", wrap).forEach(b => b.classList.toggle("active", b.dataset.filter === tag));

    const cards = qsa(".card", qs("#projectGrid"));
    cards.forEach((card) => {
      const pillTags = qsa("[data-tag]", card).map(p => p.dataset.tag);
      const show = tag === "All" || pillTags.includes(tag);
      card.style.display = show ? "" : "none";
    });
  };

  // 默认选 All
  apply("All");

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".filterBtn");
    if(!btn) return;
    apply(btn.dataset.filter);
  });
}

(function initSplash(){
  const splash = document.getElementById("splash");
  if(!splash) return;

  const startBtn = document.getElementById("startBtn");
  const skipBtn  = document.getElementById("skipBtn");


  const NEVER_KEY = "jrui.splashNever";

  // 如果设置过“永不再显示”，直接跳过启动页
  if(localStorage.getItem(NEVER_KEY) === "1"){
    splash.classList.add("hidden");
    splash.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    return;
  }

  const neverBtn = document.getElementById("neverBtn");
  neverBtn && neverBtn.addEventListener("click", () => {
    localStorage.setItem(NEVER_KEY, "1");
    closeSplash();
  });

  document.body.style.overflow = "hidden";

  const closeSplash = () => {
    const LAST_KEY = "jrui.splashLastClosed";
    splash.classList.add("hidden");
    splash.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    localStorage.setItem(LAST_KEY, String(Date.now()));
  };

  startBtn && startBtn.addEventListener("click", closeSplash);
  skipBtn && skipBtn.addEventListener("click", closeSplash);

  window.addEventListener("keydown", (e) => {
    if(splash.classList.contains("hidden")) return;
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      closeSplash();
    }
    if(e.key === "Escape"){
      localStorage.setItem(NEVER_KEY, "1");
      closeSplash();
    }
  });
})();



(function initSplashFX(){
  const splash = document.getElementById("splash");
  const canvas = document.getElementById("splashFx");
  if(!splash || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;

  // reduce motion：不循环动画，但至少画一帧（保证你能看到元素）
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FORCE_ANIM = true;
  const STATIC_ONLY = (!FORCE_ANIM) && !!reduce;


  const W = canvas.width, H = canvas.height;

  const ASSET = {
    cloud: "assets/splash/cloud.png",
    left:  "assets/splash/char_left.png",
    right: "assets/splash/char_right.png",
    crows: Array.from({length: 7}, (_,i)=>`assets/splash/${i+1}.png`)
  };

  const TARGET = {
    cloudH: 42,   // 云在 canvas 里的高度（像素）
    crowH: 18,    // 乌鸦高度
    charH: 90    // 人物高度（sprite sheet 的整张高度）
  };

  function loadImage(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });
  }

  // 先画一个测试像素：确保 canvas 层级没问题
  ctx.fillStyle = "rgba(125,255,178,.95)";
  ctx.fillRect(4, 4, 6, 6);

  Promise.all([
    loadImage(ASSET.cloud),
    loadImage(ASSET.left),
    loadImage(ASSET.right),
    ...ASSET.crows.map(loadImage),
  ]).then(([cloudImg, leftImg, rightImg, ...crowImgs]) => {
    
    const cloudBase = TARGET.cloudH / cloudImg.height;
    const crowBase  = TARGET.crowH  / crowImgs[0].height;
    
    // --- Entities ---
    const rnd = (a,b)=> a + Math.random()*(b-a);

    // Clouds: 1 张图循环飘
    const clouds = Array.from({length: 4}, () => ({
      x: rnd(-160, W),
      y: rnd(0, 55),
      v: rnd(10, 22),          // px/s
      s: rnd(0.85, 1.25),      
      a: rnd(0.55, 0.85),
      bob: rnd(0, Math.PI*2)
    }));

    // Crows: 8 张序列帧 + 飞行
    const crows = Array.from({length: 4}, (_,k) => ({
      x: rnd(-240, W),
      y: rnd(20, 120),
      v: rnd(55, 95),       
      s: rnd(0.8, 1.2),      
      amp: rnd(4, 10),
      phase: rnd(0, Math.PI*2),
      fps: rnd(10, 14),
      offset: k * 2
    }));

    // Characters: 4 帧横向精灵图
    function drawSheet(img, frames, frameIndex, dx, dy, scale, flip){
      const fw = Math.floor(img.width / frames);
      const fh = img.height;
      const sx = (frameIndex % frames) * fw;

      const dw = Math.floor(fw * scale);
      const dh = Math.floor(fh * scale);

      ctx.save();
      if(flip){
        ctx.translate(dx + dw, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, sx, 0, fw, fh, 0, 0, dw, dh);
      }else{
        ctx.drawImage(img, sx, 0, fw, fh, dx, dy, dw, dh);
      }
      ctx.restore();
    }

    let last = performance.now();

    function tick(now){
      const dt = Math.min(0.033, (now - last)/1000);
      last = now;
      const t = now/1000;

      // Splash 关闭后不画（省资源）
      if(splash.classList.contains("hidden")){
        if(!STATIC_ONLY) requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0,0,W,H);

      // ---- Clouds ----
      for(const cl of clouds){
        const bobY = Math.sin(t*0.55 + cl.bob) * 2;
        const w = cloudImg.width  * cloudBase * cl.s;
        const h = cloudImg.height * cloudBase * cl.s;
        ctx.globalAlpha = cl.a;
        ctx.drawImage(
          cloudImg,
          cl.x, cl.y + bobY,
          w,
          h
        );
        if(!STATIC_ONLY){
          cl.x += cl.v * dt;
          if(cl.x > W + 140) cl.x = -w - 160;
        }
      }
      ctx.globalAlpha = 1;

      // ---- Crows (8 frames) ----
      for(const cr of crows){
        const frame = Math.floor(t * cr.fps + cr.offset) % 7;
        const img = crowImgs[frame];
        const y = cr.y + Math.sin(t*2.0 + cr.phase) * cr.amp;
        const w = img.width  * crowBase * cr.s;
        const h = img.height * crowBase * cr.s;

        ctx.drawImage(img, cr.x, y, w, h);

        if(!STATIC_ONLY){
          cr.x -= cr.v * dt;
          if(cr.x < -w - 120) cr.x = W + 80;
        }
      }

      // ---- Characters (4 frames sheet) ----
      const idleFps = 6;
      const f = Math.floor(t * idleFps) % 6;
      const f_r = Math.floor(t * idleFps) % 8;
      const charScale = TARGET.charH  / leftImg.height;



      // 画人物（4帧！）
      drawSheet(leftImg, 8, f_r, 0, 80, charScale, false);
      drawSheet(rightImg, 6, f, 400, 100, charScale, true);

      if(!STATIC_ONLY) requestAnimationFrame(tick);
    }

    tick(performance.now());

    if(!STATIC_ONLY) requestAnimationFrame(tick);

  }).catch((err) => {
    console.error("[SplashFX] " + err.message);
  });
})();

function initThemeToggle(){
  const btn = qs("#themeToggle");
  if(!btn) return;

  btn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(cur === "light" ? "dark" : "light");
  });
}

renderProjects();
initProjectHoverDemos();
initFilters();
initThemeToggle();
