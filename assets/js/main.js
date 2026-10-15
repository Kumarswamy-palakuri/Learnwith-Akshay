/* =========================================================
   Learn with Akshay — shared layout + page rendering
   ========================================================= */

/* ---------- Data (assets/js/data.js → window.VIBHI_DATA) ----------
   Open with ?preview=1 to view the draft saved in the Admin Panel. */
let RAW = window.VIBHI_DATA || {};
try {
  if (new URLSearchParams(location.search).get("preview") === "1") {
    const d = JSON.parse(localStorage.getItem("vibhi_admin_draft") || "null");
    if (d && d.data) RAW = d.data;
  }
} catch (e) { /* storage unavailable */ }
const SITE = Object.assign({ name: "Learn with Akshay", tagline: "", domain: "", phone: "", playStoreUrl: "#", social: {} }, RAW.site || {});
SITE.social = SITE.social || {};
SITE.adsense = Object.assign({ enabled: true, publisherId: "ca-pub-XXXXXXXXXXXXXXXX", showPlaceholders: true }, (RAW.site && RAW.site.adsense) || {});
SITE.year = new Date().getFullYear();
const EXAMS = (RAW.exams || []).map(e => Object.assign({ full: "", icon: "other", color: "#0f346c", about: "", official: "", facts: [], pattern: [], subjects: [], roadmap: [], subs: [] }, e));
const MAGAZINES = RAW.magazines || [];

const BLOG = (RAW.blog || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const BANNERS = (RAW.banners || []).filter(b => b && b.active !== false);
const STUDENT_CAROUSEL = (RAW.studentCarousel || []).filter(s => s && s.image).slice(0, 3);
const HERO_STUDENT_IMAGE = "assets/student-preparation-hero.png";


const PAPERS = (RAW.papers || []).filter(p => p && p.title);
const CHANNELS = (RAW.channels || []).filter(c => EXAMS.some(e => e.id === c.exam));
const FALLBACK_EXAM = { id: "", name: "Exam", full: "", icon: "other", color: "#555" };

/* ---------- Icons ---------- */
const S = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const ICON = {
  home: S('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  arrow: S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chev: S('<path d="M9 6l6 6-6 6"/>'),
  play: S('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'),
  doc: S('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 12h6M10 16h6"/>'),
  route: S('<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 000-6H8a3 3 0 010-6h8"/>'),
  list: S('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
  chat: S('<path d="M4 5h16v11H9l-5 4z"/><path d="M9 10l2 2 4-4"/>'),
  wa: S('<path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z"/><path d="M8.5 8.5c0 4 3 7 7 7l1-1.6-2-1-1 1c-1.4-.6-2.4-1.6-3-3l1-1-1-2z" fill="currentColor" stroke="none"/>'),
  search: S('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  download: S('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  eye: S('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  shield: S('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  target: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
  menu: S('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  grid: S('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  ext: S('<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>'),
  // exam icons
  upsc: S('<path d="M3 21h18M4 10h16M12 3l8 5H4z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/>'),
  appsc: S('<circle cx="12" cy="12" r="8"/><path d="M12 4v16M8 6.5v11M16 6.5v11"/>'),
  tgpsc: S('<path d="M4 20h16M6 20V9l6-5 6 5v11"/><path d="M10 20v-5h4v5M9 11h6"/>'),
  ssc: S('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M12 8l1.3 2.7 3 .4-2.2 2 .6 3-2.7-1.5-2.7 1.5.6-3-2.2-2 3-.4z"/>'),
  rrb: S('<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M9 19l-2 2M15 19l2 2"/><circle cx="9" cy="13" r=".8" fill="currentColor"/><circle cx="15" cy="13" r=".8" fill="currentColor"/>'),
  bank: S('<path d="M3 21h18M5 10h14M12 3l8 5H4z"/><path d="M7 10v8M12 10v8M17 10v8"/>'),
  jee: S('<circle cx="12" cy="12" r="1.6" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>'),
  neet: S('<path d="M6 3v5a4 4 0 008 0V3"/><path d="M10 12v3a5 5 0 0010 0v-2"/><circle cx="20" cy="11" r="2"/>'),
  dsc: S('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20l4-4 4 4M7 9h6M7 12h4"/>'),
  other: S('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>'),
  // social
  youtube: S('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>'),
  instagram: S('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
  telegram: S('<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l8-6"/>'),
  x: S('<path d="M4 4l16 16M20 4L4 20"/>')
};

const LOGO = `<svg class="brand-logo" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
  <circle cx="32" cy="32" r="28"/>
  <g stroke-width="1.6">
    <path d="M32 6L32 58M9 19L55 45M9 45L55 19"/>
    <path d="M32 14L47 23L47 41L32 50L17 41L17 23Z"/>
    <path d="M32 22L40 27L40 37L32 42L24 37L24 27Z"/>
  </g>
  <g fill="currentColor" stroke="none">
    <circle cx="32" cy="14" r="2.6"/><circle cx="47" cy="23" r="2.6"/><circle cx="47" cy="41" r="2.6"/>
    <circle cx="32" cy="50" r="2.6"/><circle cx="17" cy="41" r="2.6"/><circle cx="17" cy="23" r="2.6"/>
    <circle cx="32" cy="32" r="3.2"/>
  </g>
</svg>`;

const PLAY_ICON = `<svg viewBox="0 0 24 24"><path fill="#34a853" d="M3.6 2.3l10.5 10.5L3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z"/><path fill="#fbbc04" d="M17.6 9.3l-3.5 3.5 3.5 3.5 4-2.3c.9-.5.9-1.9 0-2.4z"/><path fill="#4285f4" d="M14.1 12.8L3.6 21.7c.3.2.8.2 1.2 0l12.8-5.4z"/><path fill="#ea4335" d="M3.6 2.3c.4-.2.9-.2 1.2 0l12.8 7-3.5 3.5z"/></svg>`;

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const examById = id => EXAMS.find(e => e.id === id || (id === "bank" && e.id === "banking") || (id === "banking" && e.id === "bank"));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const examIcon = (e, size = "") => `<span class="exam-icon ${size}" style="background:${esc(e.color || "#555")}">${ICON[e.icon] || ICON.other}</span>`;
const param = k => new URLSearchParams(location.search).get(k);

/* ---------- Header / Footer ---------- */
const NAV = [
  ["index.html", "Home", "home"],
  ["exams.html", "Exams", "exams"],
  ["index.html#ai-features", "AI Features", "ai"],
  ["roadmaps.html", "Roadmaps", "roadmaps"],
  ["papers.html", "Model Papers", "papers"],
  ["blog.html", "Blog", "blog"],
  ["whatsapp.html", "WhatsApp", "whatsapp"],
  ["about.html", "About", "about"],
  ["contact.html", "Contact", "contact"]
];

function renderHeader(active) {
  const el = $("#site-header");
  if (!el) return;
  const m = $("main");
  if (m && !m.id) m.id = "main";
  const selected = active === "home" && location.hash === "#ai-features" ? "ai" : active;
  el.className = "site-header";
  el.innerHTML = `
  <a href="#main" class="skip-link">Skip to main content</a>
  <div class="top-utility-bar">
    <div class="container top-bar-row">
      <div class="top-bar-left">
        <span class="top-badge">🇮🇳 FREE EDUCATION INITIATIVE</span>
        <span class="top-tagline">Trusted Exam Preparation Platform for All Bharat Aspirants</span>
      </div>
      <div class="top-bar-right">
        <span class="top-item">🔓 100% Free · No Login Required</span>
        <span class="top-divider">|</span>
        <a href="tel:${SITE.phone}" class="top-item top-phone">📞 Helpline: +91&nbsp;${SITE.phone}</a>
      </div>
    </div>
  </div>
  <div class="container nav">
    <a href="index.html" class="brand" aria-label="Learn with Akshay home">
      ${LOGO}
      <div><div class="brand-name">LEARN WITH <span>AKSHAY</span></div><div class="brand-tag">${SITE.tagline}</div></div>
    </a>
    <nav class="nav-links" id="main-nav-links" aria-label="Main navigation">
      ${NAV.map(([h, l, k]) => `<a href="${h}" class="${k === selected ? "active" : ""}"${k === selected ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
      ${SITE.phone ? `<a href="tel:${SITE.phone}" class="nav-phone-cta">📞 Student Helpline: +91&nbsp;${SITE.phone}</a>` : ""}
    </nav>
    <button class="menu-btn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="main-nav-links">${ICON.menu}</button>
  </div>
  <div class="nav-backdrop" aria-hidden="true"></div>`;

  const menuBtn = $(".menu-btn", el);
  const backdrop = $(".nav-backdrop", el);
  const toggleMenu = (forceState) => {
    const willOpen = forceState !== undefined ? forceState : !el.classList.contains("open");
    el.classList.toggle("open", willOpen);
    menuBtn.setAttribute("aria-expanded", String(willOpen));
    menuBtn.innerHTML = willOpen
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : ICON.menu;
    document.body.classList.toggle("menu-lock", willOpen);
  };

  menuBtn.onclick = () => toggleMenu();
  if (backdrop) backdrop.onclick = () => toggleMenu(false);
  el.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => toggleMenu(false));
  });
}

/* ---------- Google AdSense Integration & Ad Unit Helpers ---------- */
function renderAdUnit(type = "leaderboard", slotId = "0000000000", extraClasses = "") {
  const adConfig = SITE.adsense || { enabled: true, publisherId: "ca-pub-XXXXXXXXXXXXXXXX", showPlaceholders: true };
  if (!adConfig.enabled) return "";
  
  const isRealPub = adConfig.publisherId && adConfig.publisherId !== "ca-pub-XXXXXXXXXXXXXXXX";
  
  if (isRealPub) {
    return `
    <div class="ad-unit-container ad-${type} ${extraClasses}">
      <div class="ad-disclaimer-label">Advertisement</div>
      <div class="ad-content-slot">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${esc(adConfig.publisherId)}"
             data-ad-slot="${esc(slotId)}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>`;
  }

  if (adConfig.showPlaceholders !== false) {
    const specs = {
      leaderboard: { title: "Responsive Top Leaderboard", dim: "728×90 / 320×100 Adaptive" },
      "in-article": { title: "In-Article Content Placement", dim: "Fluid Responsive / Native" },
      sidebar: { title: "Sidebar Display Placement", dim: "300×250 / 300×600 Half-Page" },
      "in-feed": { title: "In-Feed Contextual Banner", dim: "Full Width Card Responsive" },
      "footer-banner": { title: "Pre-Footer Anchor Unit", dim: "728×90 / 970×90 Leaderboard" }
    }[type] || { title: "Responsive Ad Unit", dim: "Auto-adaptive" };

    return `
    <div class="ad-unit-container ad-${type} ${extraClasses}">
      <div class="ad-disclaimer-label">Advertisement</div>
      <div class="ad-placeholder-box">
        <div class="ad-placeholder-inner">
          <div class="ad-google-badge">
            <svg class="ad-g-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3h3.9c2.3-2.1 3.6-5.2 3.6-8.9z"/>
              <path fill="#34A853" d="M12 24c3.3 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.3 21.4 7.4 24 12 24z"/>
              <path fill="#FBBC05" d="M5.2 14.2c-.2-.7-.4-1.5-.4-2.2s.2-1.5.4-2.2V6.7H1.2C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l4-3.1z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.7 1.8l3.5-3.5C18 1.2 15.2 0 12 0 7.4 0 3.3 2.6 1.2 6.7l4 3.1c1-2.9 3.7-5 6.8-5z"/>
            </svg>
            <span>Google AdSense Slot</span>
          </div>
          <strong class="ad-slot-title">${specs.title}</strong>
          <span class="ad-slot-meta">${specs.dim} · Policy Compliant Placement</span>
        </div>
      </div>
    </div>`;
  }
  return "";
}

function initAdSense() {
  const adConfig = SITE.adsense;
  if (!adConfig || !adConfig.enabled) return;
  if (adConfig.publisherId && adConfig.publisherId !== "ca-pub-XXXXXXXXXXXXXXXX") {
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adConfig.publisherId)}`;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    setTimeout(() => {
      try {
        document.querySelectorAll(".adsbygoogle").forEach(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        });
      } catch (e) {}
    }, 400);
  }
}

function initCookieConsent() {
  if (localStorage.getItem("vibhi_cookie_consent")) return;
  const banner = document.createElement("aside");
  banner.id = "cookie-consent-banner";
  banner.className = "cookie-consent-bar";
  banner.setAttribute("aria-label", "Cookie and Privacy Consent");
  banner.innerHTML = `
    <div class="container cookie-content">
      <div class="cookie-text">
        <span class="cookie-ic">🍪</span>
        <p><strong>We value your privacy:</strong> We and our advertising partners (including Google AdSense) use cookies to personalize content and ads, analyze traffic, and ensure the best study experience. Review our <a href="privacy.html">Privacy Policy</a> &amp; <a href="terms.html">Terms</a>.</p>
      </div>
      <div class="cookie-actions">
        <button type="button" class="btn btn-outline btn-sm" id="cookie-settings-btn">Cookie Info</button>
        <button type="button" class="btn btn-primary btn-sm" id="cookie-accept-btn">Accept All</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  document.getElementById("cookie-accept-btn").onclick = () => {
    localStorage.setItem("vibhi_cookie_consent", "accepted");
    banner.remove();
  };
  document.getElementById("cookie-settings-btn").onclick = () => {
    window.location.href = "privacy.html#cookies";
  };
}

function renderFooter() {
  const el = $("#site-footer");
  if (!el) return;
  const socials = Object.entries(SITE.social).filter(([, u]) => u)
    .map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${k}">${ICON[k]}</a>`).join("");
  const phoneHtml = SITE.phone ? `<div class="phone-bar"><div class="container phone-bar-content"><span class="phone-item">📞 Student Helpline: <a href="tel:${SITE.phone}">+91&nbsp;${SITE.phone}</a></span><span class="phone-dot">·</span><span class="phone-item">100% Free Mock Tests, PYQs &amp; Roadmaps</span><span class="phone-dot">·</span><span class="badge-tag">No Registration Required</span></div></div>` : "";
  
  el.innerHTML = phoneHtml + `
  <div class="footer-columns-wrap">
    <div class="container footer-grid">
      <div class="footer-col col-brand">
        <a href="index.html" class="brand">${LOGO}<div><div class="brand-name">LEARN WITH <span>AKSHAY</span></div><div class="brand-tag">${SITE.tagline}</div></div></a>
        <p class="brand-desc">Telugu-first AI-powered competitive exam preparation platform from Andhra Pradesh. Empowering lakhs of aspirants across Bharat with free mock tests, structured roadmaps, and daily bilingual notes.</p>
        <div class="footer-trust-chips">
          <span class="chip-sm">🇮🇳 Made in Bharat</span>
          <span class="chip-sm">🔓 100% Free on Web</span>
          <span class="chip-sm">⚡ AI Doubt Solver</span>
        </div>
      </div>
      <div class="footer-col">
        <h4>Target Exams</h4>
        <ul class="foot-col-links">
          <li><a href="exam.html?id=upsc">UPSC Civil Services</a></li>
          <li><a href="exam.html?id=appsc">APPSC Group 1, 2 &amp; 4</a></li>
          <li><a href="exam.html?id=tgpsc">TGPSC Group 1, 2 &amp; 3</a></li>
          <li><a href="exam.html?id=ssc">SSC CGL, CHSL, MTS</a></li>
          <li><a href="exam.html?id=banking">IBPS &amp; SBI Banking</a></li>
          <li><a href="exam.html?id=rrb">RRB NTPC &amp; Railways</a></li>
          <li><a href="exams.html">View All 10+ Exams →</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Study Resources</h4>
        <ul class="foot-col-links">
          <li><a href="roadmaps.html">Curated Study Roadmaps</a></li>
          <li><a href="papers.html">Model Papers &amp; PYQs</a></li>
          <li><a href="blog.html">Strategy &amp; Current Affairs</a></li>
          <li><a href="whatsapp.html">Free WhatsApp Channels</a></li>
          <li><a href="index.html#ai-features">AI Doubts &amp; Mind Maps</a></li>
          <li><a href="sitemap.xml">XML Sitemap</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal &amp; AdSense Policies</h4>
        <ul class="foot-col-links">
          <li><a href="privacy.html"><strong>Privacy Policy</strong></a></li>
          <li><a href="terms.html"><strong>Terms &amp; Conditions</strong></a></li>
          <li><a href="disclaimer.html"><strong>Disclaimer &amp; Non-Affiliation</strong></a></li>
          <li><a href="contact.html"><strong>Contact Us</strong></a></li>
          <li><a href="about.html">About Our Mission</a></li>
          <li><a href="privacy.html#cookies">Cookie Preferences</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot">
    <div class="container foot-row">
      <div class="copy-text">
        © ${SITE.year} ${SITE.name}. All rights reserved.${SITE.phone ? " · Helpline: +91&nbsp;" + SITE.phone : ""} · Made in Bharat, from Andhra Pradesh.
        <span class="ads-ready-badge">✓ Google AdSense Ready</span>
      </div>
      <div class="socials">${socials}<span>${SITE.domain}</span></div>
    </div>
  </div>`;
}

/* ---------- Reusable blocks ---------- */
const examCard = e => `
  <a class="exam-card" href="exam.html?id=${e.id}">
    ${examIcon(e)}
    <div class="meta"><h4>${e.name}${e.subs && e.subs.length ? ` <small style="font-weight:500;color:var(--o600)">(${e.subs.length} exams)</small>` : ""}</h4><p>${e.full}</p></div>
    <span class="chev">${ICON.chev}</span>
  </a>`;

const roadmapMini = e => `
  <a class="mini" href="exam.html?id=${e.id}#roadmap">
    ${examIcon(e, "sm")}
    <div><b>${e.name}</b><br><small>Roadmap</small></div>
  </a>`;

function paperRow(p) {
  const e = examById(p.exam) || Object.assign({}, FALLBACK_EXAM, { name: p.exam });
  let action;
  const href = p.url ? p.url : (p.file ? "papers/" + encodeURI(p.file) : "");
  if (!href) action = `<span class="chip paper-action-chip" style="font-size:.72rem;padding:4px 10px;white-space:nowrap">Coming Soon</span>`;
  else if (p.type === "pdf") action = `<a class="dl" href="${esc(href)}" target="_blank" rel="noopener" ${p.url ? "" : "download"}>${ICON.download} PDF</a>`;
  else action = `<a class="dl" href="${esc(href)}" target="_blank" rel="noopener">${ICON.eye} Open</a>`;
  return `<tr><td class="col-exam"><span class="ex">${examIcon(e, "sm")}<span class="ex-name">${e.name}</span></span></td><td class="col-title">${esc(p.title)} <span class="mobile-year">${p.year}</span></td><td class="col-year">${p.year}</td><td class="col-action" style="text-align:right">${action}</td></tr>`;
}

function waCard(c) {
  const e = examById(c.exam);
  const btn = c.url
    ? `<a class="wa-btn" href="${c.url}" target="_blank" rel="noopener">Join Channel</a>`
    : `<span class="wa-btn" style="opacity:.55">Coming Soon</span>`;
  return `<div class="wa-card"><div class="top">${examIcon(e, "sm")}<b>${e.name}</b></div><small>${c.desc}</small>${btn}</div>`;
}

const privacyNote = `
  <div class="privacy-hero">
    <div class="shield-lg">${ICON.shield}</div>
    <h3>We Respect Your Privacy</h3>
    <p>We never share your phone number, chats, or personal information. Your AI conversations are private, and you can explore mock tests, previous papers, roadmaps, and current affairs without logging in.</p>
    <div class="no-login">🔓 No Login Required</div>
  </div>`;

/* ---------- Papers table with filter + search ---------- */
function mountPapers(root, limit) {
  const used = [...new Set(PAPERS.map(p => p.exam))].filter(id => examById(id));
  let filter = "all", q = "";
  root.innerHTML = `
    <div class="sec-head" style="margin-bottom:12px">
      <div class="chips" aria-label="Filter by exam">${[["all", "All Exams"], ...used.map(id => [id, examById(id).name])]
        .map(([id, l]) => `<button class="chip ${id === "all" ? "active" : ""}" data-f="${id}">${l}</button>`).join("")}</div>
      <label class="search">${ICON.search}<input type="search" placeholder="Search papers..." aria-label="Search papers"></label>
    </div>
    <div class="tbl-wrap"><table><thead><tr><th class="col-exam">Exam</th><th class="col-title">Paper</th><th class="col-year">Year</th><th class="col-action" style="text-align:right">Action</th></tr></thead><tbody></tbody></table></div>`;
  const tbody = $("tbody", root);
  const draw = () => {
    let rows = PAPERS.filter(p => (filter === "all" || p.exam === filter) && p.title.toLowerCase().includes(q));
    if (limit) rows = rows.slice(0, limit);
    tbody.innerHTML = rows.length ? rows.map(paperRow).join("") : `<tr><td colspan="4" class="empty">No papers have been added yet. Please check back soon.</td></tr>`;
  };
  root.querySelectorAll(".chip").forEach(b => b.onclick = () => {
    root.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); filter = b.dataset.f; draw();
  });
  $("input", root).oninput = ev => { q = ev.target.value.trim().toLowerCase(); draw(); };
  const pre = param("exam");
  if (pre && used.includes(pre)) $(`.chip[data-f="${pre}"]`, root).click(); else draw();
}

/* ---------- Pages ---------- */
const PAGES = {
  home() {
    const desktopHeroArt = $(".hero-art");
    if (desktopHeroArt) {
      desktopHeroArt.classList.add("student-hero-art");
      desktopHeroArt.innerHTML = `
        <div class="hero-image-wrapper">
          <img src="${HERO_STUDENT_IMAGE}" alt="Student preparing for exams at a study desk" fetchpriority="high">
          <div class="hero-badge-float top">
            <span class="badge-dot"></span> 2026 Syllabus &amp; Notification Updated
          </div>
          <div class="hero-badge-float bottom">
            <span class="badge-icon">⭐</span>
            <div><b>10+ Major Exams</b><small>Bilingual (Telugu &amp; English)</small></div>
          </div>
        </div>`;
    }
    const mobileHeroPhoto = $("#student-hero-photo");
    if (mobileHeroPhoto) {
      mobileHeroPhoto.innerHTML = `
        <div class="hero-image-wrapper">
          <img src="${HERO_STUDENT_IMAGE}" alt="Student preparing for exams at a study desk">
          <div class="hero-badge-float top">
            <span class="badge-dot"></span> 2026 Notification Updated
          </div>
        </div>`;
      mobileHeroPhoto.hidden = false;
    }
    const carousel = $("#student-carousel");
    if (carousel) {
      if (!STUDENT_CAROUSEL.length) carousel.hidden = true;
      else {
        carousel.innerHTML = `
          <div class="student-carousel-frame" aria-roledescription="carousel">
            ${STUDENT_CAROUSEL.map((slide, i) => `
              <div class="student-slide${i === 0 ? " active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${STUDENT_CAROUSEL.length}" aria-hidden="${i !== 0}">
                <img src="${esc(slide.image)}" alt="${esc(slide.alt || "Student preparing for exams")}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
                <span class="student-slide-brand">Learn with Akshay</span>
                ${slide.caption ? `<div class="student-slide-caption">${esc(slide.caption)}</div>` : ""}
              </div>`).join("")}
            <button class="student-carousel-control prev" type="button" aria-label="Previous image">‹</button>
            <button class="student-carousel-control next" type="button" aria-label="Next image">›</button>
          </div>
          <div class="student-carousel-dots" aria-label="Choose carousel image">
            ${STUDENT_CAROUSEL.map((_, i) => `<button type="button" class="${i === 0 ? "active" : ""}" data-slide="${i}" aria-label="Show image ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`).join("")}
          </div>`;
        if (STUDENT_CAROUSEL.length > 1) {
          const slides = [...carousel.querySelectorAll(".student-slide")];
          const dots = [...carousel.querySelectorAll(".student-carousel-dots button")];
          let current = 0;
          const showSlide = index => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => {
              slide.classList.toggle("active", i === current);
              slide.setAttribute("aria-hidden", String(i !== current));
            });
            dots.forEach((dot, i) => {
              dot.classList.toggle("active", i === current);
              dot.setAttribute("aria-current", String(i === current));
            });
          };
          carousel.querySelector(".prev").onclick = () => showSlide(current - 1);
          carousel.querySelector(".next").onclick = () => showSlide(current + 1);
          dots.forEach((dot, i) => dot.onclick = () => showSlide(i));
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.setInterval(() => {
              if (!document.hidden) showSlide(current + 1);
            }, 5000);
          }
        }
      }
    }
    const ban = $("#home-banners");
    if (ban) {
      const list = BANNERS.length ? BANNERS : [];
      if (!list.length) ban.style.display = "none";
      else {
        ban.style.display = "";
        ban.innerHTML = `<div class="banner-track">${list.map(b => {
          const img = b.image ? `<img src="${esc(b.image)}" alt="${esc(b.title || "Banner")}" loading="lazy">` : `<div class="banner-fallback">${ICON.grid}</div>`;
          const inner = `${img}<div class="banner-text"><strong>${esc(b.title || "")}</strong>${b.subtitle ? `<span>${esc(b.subtitle)}</span>` : ""}</div>`;
          return b.link
            ? `<a class="banner-card" href="${esc(b.link)}" ${b.link.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>`
            : `<div class="banner-card">${inner}</div>`;
        }).join("")}</div>`;
      }
    }
    $("#popular").innerHTML = EXAMS.map(examCard).join("");
    const topAd = $("#home-top-ad");
    if (topAd) topAd.innerHTML = renderAdUnit("leaderboard", "1001001001");
    const midAd = $("#home-mid-ad");
    if (midAd) midAd.innerHTML = renderAdUnit("in-feed", "2002002002");
    const bottomAd = $("#home-bottom-ad");
    if (bottomAd) bottomAd.innerHTML = renderAdUnit("footer-banner", "3003003003");
    $("#rm-mini").innerHTML = EXAMS.filter(e => e.roadmap.length).slice(0, 6).map(roadmapMini).join("");
    mountPapers($("#papers-mini"), 4);
    $("#wa-mini").innerHTML = CHANNELS.map(waCard).join("");
    const wp = $("#wa-privacy");
    if (wp) wp.innerHTML = privacyNote;
    document.querySelectorAll("[data-play]").forEach(a => a.href = SITE.playStoreUrl);
  },

  exams() {
    const root = $("#all-exams");
    if (!root) return;
    const topAd = $("#exams-top-ad");
    if (topAd) topAd.innerHTML = renderAdUnit("leaderboard", "6006006006");
    const renderList = (filterText = "") => {
      const q = filterText.toLowerCase();
      const filtered = EXAMS.filter(e =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.full.toLowerCase().includes(q) ||
        (e.about && e.about.toLowerCase().includes(q)) ||
        (e.subs && e.subs.some(s => s.name.toLowerCase().includes(q) || (s.full && s.full.toLowerCase().includes(q))))
      );
      if (!filtered.length) {
        root.innerHTML = `<div class="empty card" style="grid-column:1/-1;padding:36px;text-align:center"><p style="font-size:1.05rem;font-weight:700;color:var(--brand-950)">No exams found matching "${esc(filterText)}"</p><p style="color:var(--muted);font-size:.86rem;margin-top:6px">Try searching for APPSC, UPSC, SSC, Banking, RRB or Police.</p></div>`;
        return;
      }
      root.innerHTML = filtered.map(e => `
        <a class="card panel" href="exam.html?id=${e.id}" style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:14px;align-items:center">${examIcon(e, "lg")}
            <div><h3 style="font-size:1.2rem">${e.name}${e.subs && e.subs.length ? ` <small style="color:var(--o600);font-weight:600">· ${e.subs.length} sub-exams</small>` : ""}</h3>
            <p style="color:var(--muted);font-size:.84rem">${e.full}</p></div></div>
          <p style="font-size:.88rem;color:var(--ink2);flex:1">${e.about}</p>
          ${e.subs && e.subs.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${e.subs.map(s => `<span class="chip" style="font-size:.72rem">${s.name}</span>`).join("")}</div>` : ""}
          <span class="link-arrow">Syllabus, Pattern, Mock Tests &amp; Roadmap ${ICON.arrow}</span>
        </a>`).join("");
    };
    renderList();
    const searchInput = $("#exam-search-input");
    if (searchInput) {
      searchInput.oninput = ev => renderList(ev.target.value.trim());
    }
  },

  exam() {
    const e = examById(param("id")) || EXAMS[0];
    if (!e) return;
    const subId = param("sub");
    const activeSub = subId && e.subs ? e.subs.find(s => s.id === subId) : null;
    document.title = activeSub ? `${activeSub.name} — ${activeSub.full || e.name} | Learn with Akshay` : `${e.name} — ${e.full} | Learn with Akshay`;
    $("#exam-hero").innerHTML = `
      <div class="crumbs"><a href="index.html">Home</a> / <a href="exams.html">Exams</a> / <a href="exam.html?id=${e.id}">${e.name}</a>${activeSub ? ` / ${esc(activeSub.name)}` : ""}</div>
      <div class="exam-hero-header">${examIcon(e, "lg")}
        <div><h1>${activeSub ? esc(activeSub.name) + " — " + esc(e.name) : e.name}</h1><p class="exam-lead">${activeSub && activeSub.full ? esc(activeSub.full) : e.full}</p>
        ${e.subs && e.subs.length ? `<p class="exam-sub-badge">${activeSub ? `Selected category: <strong>${esc(activeSub.name)}</strong> · ` : ""}${e.subs.length} sub-exams available — Group / category wise</p>` : ""}
        <p class="no-login" style="margin-top:10px">No login required on website — mock tests, papers, roadmaps &amp; current affairs are free to explore.</p>
        </div></div>`;
    const patternHTML = e.pattern.length ? e.pattern.map(s => `
      <h3 style="margin:18px 0 10px;font-size:1.05rem">${s.stage}</h3>
      <div class="card tbl-wrap"><table class="pattern"><thead><tr><th>Paper / Section</th><th>Questions / Marks</th><th>Nature</th></tr></thead>
      <tbody>${s.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>`).join("")
      : `<p class="empty">Details will be added soon.</p>`;
    const roadmapHTML = e.roadmap.length ? `<div class="timeline">${e.roadmap.map((s, i) => `
      <div class="step"><span class="dot">${i + 1}</span><div class="card"><h4>${s.t}</h4><span class="when">${s.d}</span>
      <ul>${s.p.map(x => `<li>${x}</li>`).join("")}</ul></div></div>`).join("")}</div>`
      : `<p class="empty">A roadmap will be added soon.</p>`;
    const myPapers = PAPERS.filter(p => p.exam === e.id);
    const myCh = CHANNELS.find(c => c.exam === e.id);
    $("#exam-body").innerHTML = `
      <div class="tabs" role="tablist" aria-label="Exam Details Tabs">
        <button class="tab active" role="tab" id="tab-overview" aria-controls="t-overview" aria-selected="true" data-t="overview">Overview</button>
        <button class="tab" role="tab" id="tab-pattern" aria-controls="t-pattern" aria-selected="false" data-t="pattern">Exam Pattern</button>
        <button class="tab" role="tab" id="tab-roadmap" aria-controls="t-roadmap" aria-selected="false" data-t="roadmap">Roadmap</button>
        <button class="tab" role="tab" id="tab-papers" aria-controls="t-papers" aria-selected="false" data-t="papers">Papers (${myPapers.length})</button>
      </div>
      <div class="tab-pane active" id="t-overview" role="tabpanel" aria-labelledby="tab-overview">
        ${activeSub ? `
          <div class="sub-exam-banner" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 18px;margin-bottom:18px">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <span class="chip" style="background:var(--brand-800);color:#fff">Selected: ${esc(activeSub.name)}</span>
              <a href="exam.html?id=${e.id}" style="font-size:.82rem;font-weight:600;color:var(--brand-700)">Show all ${esc(e.name)} categories ✕</a>
            </div>
            <h3 style="margin:8px 0 4px;font-size:1.15rem">${esc(activeSub.name)} — ${esc(activeSub.full || e.name)}</h3>
            <p style="font-size:.86rem;color:var(--ink2);margin:0">Explore pattern, syllabus roadmap and interactive model papers below.</p>
          </div>
        ` : ""}
        <p style="color:var(--ink2);margin-bottom:18px;max-width:760px">${e.about}</p>
        ${e.subs && e.subs.length ? `
          <h3 style="margin:8px 0 12px">Choose Sub-Exam / Category</h3>
          <div class="sub-exam-grid">${e.subs.map(s => `
            <a class="sub-exam-card${s.id === subId ? " active" : ""}" href="exam.html?id=${e.id}&sub=${s.id}" style="${s.id === subId ? "border-color:var(--brand-600);background:#eff6ff" : ""}">
              <h4>${s.name}</h4>
              <p>${s.full || ""}</p>
              <span class="link-arrow" style="font-size:.82rem;margin-top:auto">${s.id === subId ? "✓ Currently Viewing" : "View details " + ICON.arrow}</span>
            </a>`).join("")}</div>
          <p style="font-size:.82rem;color:var(--muted);margin:10px 0 18px">You can also add custom categories from the Admin Panel.</p>
        ` : ""}
        <div class="info-grid">${e.facts.map(([k, v]) => `<div class="card info"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
        ${e.subjects.length ? `<h3 style="margin:26px 0 12px">Important Subjects</h3><div class="chips">${e.subjects.map(s => `<span class="chip">${s}</span>`).join("")}</div>` : ""}
        <div class="exam-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
          ${e.official ? `<a class="btn btn-outline" href="${e.official}" target="_blank" rel="noopener">Official Website ${ICON.ext}</a>` : ""}
          ${myCh && myCh.url ? `<a class="btn btn-outline" href="${myCh.url}" target="_blank" rel="noopener">${ICON.wa} Join ${e.name} Channel</a>` : ""}
          <a class="btn btn-primary" href="${SITE.playStoreUrl}" target="_blank" rel="noopener">${ICON.play} Free Mock Tests in App</a>
        </div>
        <div style="margin-top:20px" class="no-login">🔓 No Login Required — Explore mock tests, previous papers, roadmaps, and current affairs for free.</div>
      </div>
      <div class="tab-pane" id="t-pattern" role="tabpanel" aria-labelledby="tab-pattern">
        ${patternHTML}
        <p class="note" style="margin-top:18px">⚠️ Exam patterns may change with each notification. Always check the official notification before applying.</p>
      </div>
      <div class="tab-pane" id="t-roadmap" role="tabpanel" aria-labelledby="tab-roadmap">${roadmapHTML}</div>
      <div class="tab-pane" id="t-papers" role="tabpanel" aria-labelledby="tab-papers">
        <div class="card tbl-wrap"><table><thead><tr><th class="col-exam">Exam</th><th class="col-title">Paper</th><th class="col-year">Year</th><th class="col-action" style="text-align:right">Action</th></tr></thead>
        <tbody>${myPapers.length ? myPapers.map(paperRow).join("") : `<tr><td colspan="4" class="empty">Papers will be added soon.</td></tr>`}</tbody></table></div>
        <a class="link-arrow" style="margin-top:14px" href="papers.html?exam=${e.id}">All ${e.name} papers ${ICON.arrow}</a>
      </div>`;
    const show = t => {
      document.querySelectorAll(".tab").forEach(b => {
        const isActive = b.dataset.t === t;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("active", p.id === "t-" + t));
    };
    document.querySelectorAll(".tab").forEach(b => b.onclick = () => { show(b.dataset.t); history.replaceState(null, "", "#" + b.dataset.t); });
    const h = location.hash.slice(1);
    if (["pattern", "roadmap", "papers"].includes(h)) show(h);
  },

  roadmaps() {
    const topAd = $("#roadmaps-top-ad");
    if (topAd) topAd.innerHTML = renderAdUnit("leaderboard", "7007007007");
    $("#rm-list").innerHTML = EXAMS.filter(e => e.roadmap.length).map(e => `
      <a class="card panel" href="exam.html?id=${e.id}#roadmap" style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;gap:12px;align-items:center">${examIcon(e)}<div><h3 style="font-size:1.1rem">${e.name} Roadmap</h3>
        <p style="font-size:.78rem;color:var(--muted)">${e.roadmap.length} phases · step-by-step plan</p></div></div>
        <ol style="padding-left:18px;font-size:.85rem;color:var(--ink2);flex:1">${e.roadmap.map(s => `<li>${s.t} <span style="color:var(--muted)">(${s.d})</span></li>`).join("")}</ol>
        <span class="link-arrow">View full roadmap ${ICON.arrow}</span>
      </a>`).join("");
  },

  papers() {
    const topAd = $("#papers-top-ad");
    if (topAd) topAd.innerHTML = renderAdUnit("leaderboard", "8008008008");
    mountPapers($("#papers-full"));
  },

  whatsapp() {
    $("#wa-full").innerHTML = CHANNELS.map(waCard).join("");
    $("#wa-privacy").innerHTML = privacyNote;
  },

  about() { document.querySelectorAll("[data-play]").forEach(a => a.href = SITE.playStoreUrl); },

  blog() {
    const root = $("#blog-list");
    if (!root) return;
    const topAd = $("#blog-top-ad");
    if (topAd) topAd.innerHTML = renderAdUnit("leaderboard", "4004004004");
    const bottomAd = $("#blog-bottom-ad");
    if (bottomAd) bottomAd.innerHTML = renderAdUnit("footer-banner", "5005005005");
    if (!BLOG.length) {
      root.innerHTML = `<p class="empty">Articles coming soon.</p>`;
      return;
    }
    root.innerHTML = BLOG.map(a => {
      const title = a.title_en || a.title || a.id;
      const desc = a.desc_en || a.desc || "";
      const img = a.image ? `<div class="blog-thumb"><img src="${esc(a.image)}" alt="${esc(title)}" loading="lazy"></div>` : "";
      return `<a class="card panel blog-card" href="article.html?id=${encodeURIComponent(a.id)}">
        ${img}
        <div class="blog-meta"><span class="chip">${esc(a.category || "Guide")}</span><time>${esc(a.date || "")}</time></div>
        <h3>${esc(title)}</h3>
        <p>${esc(desc)}</p>
        <span class="link-arrow">Read more ${ICON.arrow}</span>
      </a>`;
    }).join("");
  },

  article() {
    const id = param("id");
    const a = BLOG.find(x => x.id === id) || BLOG[0];
    if (!a) {
      $("#article-hero").innerHTML = `<h1>Article not found</h1>`;
      return;
    }
    const title = a.title_en || a.title || a.id;
    let body = a.body_en || a.body || "<p>Content coming soon.</p>";
    document.title = `${title} | Learn with Akshay`;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", a.desc_en || a.desc || title);
    const pageUrl = location.href;
    const shareText = encodeURIComponent(title + " — Learn with Akshay");
    const shareUrl = encodeURIComponent(pageUrl);
    $("#article-hero").innerHTML = `
      <div class="crumbs"><a href="index.html">Home</a> / <a href="blog.html">Blog</a> / ${esc(title)}</div>
      <div class="blog-meta" style="margin-bottom:8px"><span class="chip">${esc(a.category || "")}</span><time>${esc(a.date || "")}</time></div>
      <h1>${esc(title)}</h1>
      <p class="no-login" style="margin-top:12px">No Login Required (Web)</p>`;
    const cover = a.image ? `<div class="article-cover"><img src="${esc(a.image)}" alt="${esc(title)}"></div>` : "";
    
    // Policy compliant in-article Ad Unit insertion
    const inArticleAd = renderAdUnit("in-article", "5566778899");
    const h3Matches = [...body.matchAll(/<h3>/g)];
    if (h3Matches.length >= 2) {
      const splitPos = h3Matches[1].index;
      body = body.slice(0, splitPos) + inArticleAd + body.slice(splitPos);
    } else {
      body = body + inArticleAd;
    }

    const preShareAd = renderAdUnit("footer-banner", "6677889900");

    const share = `<div class="share-bar">
      <span class="share-label">Share:</span>
      <a class="share-btn wa" href="https://wa.me/?text=${shareText}%20${shareUrl}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="share-btn tg" href="https://t.me/share/url?url=${shareUrl}&text=${shareText}" target="_blank" rel="noopener">Telegram</a>
      <a class="share-btn x" href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" rel="noopener">X</a>
      <a class="share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener">Facebook</a>
      <button type="button" class="share-btn copy" id="share-copy">Copy link</button>
    </div>`;
    $("#article-body").innerHTML = cover + body + preShareAd + share;
    const copyBtn = $("#share-copy");
    if (copyBtn) copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(pageUrl); copyBtn.textContent = "Copied!"; setTimeout(() => copyBtn.textContent = "Copy link", 1500); }
      catch { prompt("Copy this link:", pageUrl); }
    };
  }
};

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  renderHeader({ exam: "exams" }[page] || page);
  renderFooter();
  document.querySelectorAll("[data-icon]").forEach(el => el.innerHTML = ICON[el.dataset.icon] || "");
  document.querySelectorAll("[data-logo]").forEach(el => el.innerHTML = LOGO);
  PAGES[page] && PAGES[page]();
  initAdSense();
  initCookieConsent();
});
