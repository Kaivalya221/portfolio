/* Static page generator — Kaivalya Basu portfolio (re-skin of the template).
   Emits: works/, works/<slug>/, legal-page/<x>/, 404/  (all index.html)
   Run: node gen.cjs   (output is plain static HTML; no runtime build needed) */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const F = "https://framerusercontent.com/images/";

const GITHUB = "https://github.com/Kaivalya221";
const LINKEDIN = "https://www.linkedin.com/in/kaivalya-basu";
const EMAIL = "kaivalya.offi@gmail.com";

/* ---------------- shared partials ---------------- */
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;800;900&family=Geist:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />`;

function head(title, p) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${fonts}
  <link rel="stylesheet" href="${p}assets/css/style.css" />
</head>
<body>`;
}

function nav(p) {
  return `
  <nav class="nav">
    <a href="${p}" class="nav-logo">Kaivalya</a>
    <div class="nav-center">
      <span class="meta"><span data-clock>7:03 pm</span></span>
      <span class="meta"><span class="rotator"><ul>
        <li>Based in Andhra Pradesh, India</li><li>Based in Andhra Pradesh, India</li>
        <li>Based in Andhra Pradesh, India</li><li>Based in Andhra Pradesh, India</li>
      </ul></span></span>
    </div>
    <div class="nav-right">
      <a href="mailto:${EMAIL}" class="btn-pill">Let's Talk</a>
      <button class="nav-burger" data-burger aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </nav>
  <div class="menu" data-menu>
    <a href="${p}">Home</a>
    <a href="${p}works/">Work</a>
    <a href="${p}#about">About</a>
    <a href="mailto:${EMAIL}">Contact</a>
    <div class="menu-socials">
      <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
      <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>`;
}

const socialSvgs = {
  gh: `<svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0C17.18 4.5 18.15 4.8 18.15 4.8c.63 1.6.23 2.78.11 3.08.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>`,
  in: `<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 7.5L3.8 6H20.2L12 11.5Zm0 2.3L3 7.7V18h18V7.7l-9 6.1Z"/></svg>`,
};

function cta() {
  return `
  <section class="cta">
    <div class="cta-bg"><img src="${F}mOHVzgU2fOhMJ79dUp4UrMH8Pc.png" alt="" /></div>
    <div class="cta-inner">
      <div class="cta-icons">
        <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg></span>
      </div>
      <h2 class="cta-title">Let's Build<br>Something<br>Great<span class="dot">.</span></h2>
      <div class="cta-socials">
        <a href="${GITHUB}" target="_blank" rel="noopener" aria-label="GitHub">${socialSvgs.gh}</a>
        <a href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">${socialSvgs.in}</a>
        <a href="mailto:${EMAIL}" aria-label="Email">${socialSvgs.mail}</a>
      </div>
    </div>
  </section>`;
}

function footer(p) {
  return `
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-col footer-links">
        <ul>
          <li><a href="${p}">Home</a></li>
          <li><a href="${p}works/">Work</a></li>
          <li><a href="${p}#about">About</a></li>
          <li><a href="mailto:${EMAIL}">Contact</a></li>
        </ul>
        <ul>
          <li><a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="mailto:${EMAIL}">Email</a></li>
          <li><a href="tel:+917842465269">+91 78424 65269</a></li>
        </ul>
      </div>
      <div></div>
      <div class="footer-col footer-contact">
        <p class="eyebrow">Reach Out Anytime</p>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
      </div>
    </div>
    <div class="footer-mid">
      <div class="f-logo">Kaivalya</div>
      <div class="f-tags"><span>AI / ML</span><span>Web Development</span><span>Software</span></div>
    </div>
    <div class="footer-copy">
      <p>© 2025 Kaivalya Basu. All Rights Reserved.</p>
      <p>B.Tech CSE · SRM Institute of Science and Technology</p>
    </div>
    <div class="footer-word"><span>Kaivalya</span></div>
  </footer>
  <div class="cursor-glow" data-cursor-glow></div>
  <div class="cursor-ring" data-cursor-ring></div>
  <div class="cursor-dot" data-cursor-dot></div>
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
  <script src="${p}assets/js/main.js"></script>
</body>
</html>`;
}

function fmt(t) { return t.replace(/•/g, "\n•").trim(); }

/* ---------------- data (from resume) ---------------- */
const works = [
  { slug: "railway-management-system", name: "Railway Management System", cat: "Full-Stack Web", img: "bsOVyM4XG8uD2AY548T4Fc4LpA.png" },
  { slug: "crop-guard", name: "CROP GUARD", cat: "AI Web Platform", img: "IG2TbzXZBqWxMG0WBq6BXmaUQ.png" },
  { slug: "demand-forecasting", name: "Demand Forecasting System", cat: "Machine Learning", img: "5qECfl85aZyoLqX4zuYQggvVLY.png" },
  { slug: "algorithms-visualizer", name: "Algorithms Visualizer", cat: "Python Tooling", img: "aUEH8JAJImxuae4rwruKib7aCsE.png" },
  { slug: "pothole-detection", name: "Pothole Detection & 3D Reconstruction", cat: "Computer Vision Research", img: "kOUtbc3a4C0wKMDaeFigxBksA4.png" },
  { slug: "ppe-detection", name: "PPE Detection", cat: "Computer Vision Research", img: "nhxJBEX6Zy58CiRjAwMjFM6b1yE.png" },
];

const projects = {
  "railway-management-system": {
    h1: "Railway Management System", type: "Personal Project", role: "Full-Stack Developer", stack: "Next.js · TypeScript · Supabase · Groq AI",
    hero: "hQsUtag595xZ3vfz1tKA7tN3IZk.jpg", g1: "2clle6j2VugwNImtCfurzPncwQI.jpeg", g2: "ldv76eV9y10BNNE47hrj0YUXFTg.jpeg",
    a: [["Overview", "A railway management platform built with Next.js, TypeScript, Supabase and Groq AI APIs — combining ticket booking with intelligent, real-time operational insight."],
        ["Key Features", "• Ticket booking with real-time train delay prediction. • Predictive maintenance alerts to improve operational efficiency. • An analytics dashboard to monitor system performance and key insights."]],
    b: [["Tech Stack", "Next.js, TypeScript, Supabase, and Groq AI APIs — chosen for a fast, type-safe frontend, a real-time database, and AI-driven prediction."]],
  },
  "crop-guard": {
    h1: "CROP GUARD", type: "Personal Project", role: "Full-Stack Developer", stack: "Web · OpenAI GPT · REST APIs",
    hero: "qXWwrLW7ImVrMM8AcEJA255HSIs.jpg", g1: "afw7gDzIR7WIyimq0rwN41VLXCs.jpeg", g2: "k4Trrwaoje065B2sqUbTb0HX9E.jpg",
    a: [["Overview", "An AI-powered, scalable web platform for leaf disease identification and prevention support — pairing computer vision with conversational AI guidance."],
        ["Key Features", "• OpenAI GPT integration for real-time interactive AI assistance using natural language processing. • Secure authentication, personalized dashboards, session booking and performance tracking. • RESTful APIs for efficient frontend-backend communication with multi-user support."]],
    b: [["Tech Stack", "A web-based stack with OpenAI GPT for NLP assistance and RESTful APIs powering a scalable, multi-user backend."]],
  },
  "demand-forecasting": {
    h1: "Demand Forecasting System", type: "Internship — Edubot", role: "AIML Intern", stack: "Python · Streamlit · ML",
    hero: "bsOVyM4XG8uD2AY548T4Fc4LpA.png", g1: "8u5aFnmouZ52EXX92EvJOnNftag.png", g2: "ZqogWVwBlm2fnQJ7BHnyhI1tOw.jpg",
    a: [["Overview", "Built during my AIML internship at Edubot (June–Aug 2025): a system that predicts product demand using historical sales data, promotions, weather and seasonal trends."],
        ["Key Features", "• Data preprocessing, analysis and feature engineering to improve prediction accuracy and reliability. • An interactive Streamlit dashboard delivering real-time insights. • Decision support for smarter inventory management."]],
    b: [["Tech Stack", "Python for data preprocessing and modelling, with an interactive Streamlit dashboard for real-time, actionable insight."]],
  },
  "algorithms-visualizer": {
    h1: "Algorithms Visualizer", type: "Personal Project", role: "Developer", stack: "Python · PyQt",
    hero: "RZEj75fbJpqAjBzsuh2wyTM7RU.png", g1: "04X6xyeezxFekRvf6amHTo1TdE.png", g2: "t9sxuraac5uDE6KEbhh72sv3lI.png",
    a: [["Overview", "A GUI-based visualization tool built with Python and PyQt that brings sorting, searching and pathfinding algorithms to life with real-time execution flow."],
        ["Key Features", "• Real-time visualization of sorting, searching and pathfinding algorithms. • An interactive interface that demonstrates algorithm behaviour and time complexity. • Step-by-step execution to help users understand algorithm logic clearly."]],
    b: [["Tech Stack", "Python and PyQt — a desktop GUI focused on clear, real-time algorithm execution and teaching."]],
  },
  "pothole-detection": {
    h1: "Pothole Detection & 3D Reconstruction", type: "Research", role: "Researcher", stack: "CNNs · Depth Estimation",
    hero: "5ZaOPIX75RCmLrPklnwqSrC2DiA.jpg", g1: "ff3JMQnpWql9gf8pUkp6XwiLg.jpg", g2: "3Sy3fM2IsgOd6aq7ODwtIn7dMY.jpg",
    a: [["Overview", "Research on pothole detection and 3D reconstruction using depth estimation with convolutional neural networks (CNNs)."],
        ["Focus", "Applying deep learning and depth estimation to detect road defects and reconstruct them in 3D — part of my computer vision research at SRM Institute of Science and Technology."]],
    b: [["Approach", "Convolutional neural networks for detection paired with depth-estimation techniques to recover 3D structure from imagery."]],
  },
  "ppe-detection": {
    h1: "PPE Detection", type: "Research", role: "Researcher", stack: "CNNs · Computer Vision",
    hero: "h97vJ5NmuI8vYgoOhPoujWa8Sg.jpg", g1: "4gtbxm5gOZJhS0u7lmiZiwMv7A.jpg", g2: "kKYPwIC1haTtO7Ib1kGahzLaH8.jpg",
    a: [["Overview", "Research on detecting personal protective equipment (PPE) using convolutional neural networks, in collaboration with UTP Malaysia."],
        ["Focus", "Using CNN-based computer vision to identify whether workers are wearing required safety equipment — a workplace-safety research collaboration with UTP Malaysia."]],
    b: [["Approach", "Convolutional neural networks trained for PPE recognition, developed in collaboration with Universiti Teknologi PETRONAS (UTP), Malaysia."]],
  },
};

/* ---------------- writers ---------------- */
function write(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log("wrote", rel);
}

/* WORKS LISTING */
function worksGrid(p) {
  return works.map(w => `
        <a href="${p}works/${w.slug}/" class="work-card" data-reveal>
          <div class="work-media"><img src="${F}${w.img}?scale-down-to=1024" alt="${w.name}" /></div>
          <div class="work-meta"><h4>${w.name}</h4><p>${w.cat}</p></div>
        </a>`).join("");
}
write("works/index.html",
  head("Work — Kaivalya Basu", "../") + nav("../") + `
  <main class="works-list">
    <header class="proj-hero"><h1 class="reveal-mask"><span>Things I've<br>Built<span class="dot">.</span></span></h1></header>
    <section class="section works"><div class="wrap"><div class="works-grid">${worksGrid("../")}</div></div></section>
  </main>` + cta() + footer("../"));

/* PROJECT PAGES */
function bodyBlocks(arr) { return arr.map(([h, t]) => `<h3>${h}</h3><p>${fmt(t)}</p>`).join("\n          "); }
Object.entries(projects).forEach(([slug, d]) => {
  write(`works/${slug}/index.html`,
    head(d.h1 + " — Kaivalya Basu", "../../") + nav("../../") + `
  <main>
    <header class="proj-hero"><h1 class="reveal-mask"><span>${d.h1}<span class="dot">.</span></span></h1></header>
    <section class="proj-info" data-reveal>
      <div class="info-item"><h4>Type:</h4><h4>${d.type}</h4></div>
      <div class="info-item"><h4>Role:</h4><h4>${d.role}</h4></div>
      <div class="info-item"><h4>Stack:</h4><h4>${d.stack}</h4></div>
      <div></div>
    </section>
    <figure class="proj-figure" data-reveal><img src="${F}${d.hero}" alt="${d.h1}" /></figure>
    <div class="proj-body">
          ${bodyBlocks(d.a)}
    </div>
    <div class="proj-gallery">
      <figure data-reveal><img src="${F}${d.g1}" alt="" /></figure>
      <figure data-reveal><img src="${F}${d.g2}" alt="" /></figure>
    </div>
    <div class="proj-body">
          ${bodyBlocks(d.b)}
    </div>
  </main>` + cta() + footer("../../"));
});

/* LEGAL PAGES */
function legalPage(title, updated, blocks) {
  return head(title + " - Kaivalya Basu", "../../") + nav("../../") + `
  <main>
    <header class="legal-hero"><h1 class="reveal-mask"><span>${title}<span class="dot">.</span></span></h1></header>
    <div class="legal-updated"><h4>Last updated:</h4><h4>${updated}</h4></div>
    <div class="legal-body" data-reveal>
      ${blocks.map(([h, t]) => `<h3>${h}</h3><p>${fmt(t)}</p>`).join("\n      ")}
    </div>
  </main>` + cta() + footer("../../");
}

/* Privacy Policy, Terms of Service, and 404 pages intentionally not generated
   (removed at the owner's request). legalPage() is kept above but unused. */

console.log("\nDone.");
