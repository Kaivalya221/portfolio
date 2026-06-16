/* =========================================================
   BENJAMIN — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Live clock (e.g. "7:03 pm") ---------- */
  function tickClock() {
    var el = document.querySelector("[data-clock]");
    if (!el) return;
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ap = h >= 12 ? "pm" : "am";
    h = h % 12; if (h === 0) h = 12;
    el.textContent = h + ":" + (m < 10 ? "0" + m : m) + " " + ap;
  }
  tickClock();
  setInterval(tickClock, 1000 * 10);

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector("[data-burger]");
  var menu = document.querySelector("[data-menu]");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ---------- Logo marquee (duplicate track for seamless loop) ---------- */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Smooth scroll (Lenis if available) ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.09 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
  }

  /* ---------- Scroll reveals ---------- */
  function setupReveals() {
    var targets = document.querySelectorAll("[data-reveal], .reveal-mask");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var delay = e.target.getAttribute("data-delay");
          if (delay) e.target.style.transitionDelay = delay + "ms";
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
  setupReveals();

  /* ---------- Site-wide custom cursor + ambient glow ---------- */
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cDot = document.querySelector("[data-cursor-dot]");
  var cRing = document.querySelector("[data-cursor-ring]");
  var cGlow = document.querySelector("[data-cursor-glow]");
  if (fine && cDot && cRing) {
    document.documentElement.classList.add("cursor-custom");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my, gx = mx, gy = my;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      cDot.style.transform = "translate(" + (mx - 3.5) + "px," + (my - 3.5) + "px)";
    });
    (function frame() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      cRing.style.transform = "translate(" + (rx - 20) + "px," + (ry - 20) + "px)";
      if (cGlow) {
        gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
        cGlow.style.transform = "translate(" + (gx - 380) + "px," + (gy - 380) + "px)";
      }
      requestAnimationFrame(frame);
    })();
    document.querySelectorAll("a, button, .work-card, .svc-row, .awd-row, [data-lens], .btn-pill, .rev-card").forEach(function (el) {
      el.addEventListener("pointerenter", function () { cRing.classList.add("big"); });
      el.addEventListener("pointerleave", function () { cRing.classList.remove("big"); });
    });
    var hl = document.querySelector("[data-lens]");
    if (hl) {
      hl.addEventListener("pointerenter", function () { document.documentElement.classList.add("cursor-hide"); });
      hl.addEventListener("pointerleave", function () { document.documentElement.classList.remove("cursor-hide"); });
    }
  }

  /* ---------- Hero color-reveal lens ---------- */
  var lensFig = document.querySelector("[data-lens]");
  if (lensFig && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    var move = function (e) {
      var r = lensFig.getBoundingClientRect();
      lensFig.style.setProperty("--lx", (e.clientX - r.left) + "px");
      lensFig.style.setProperty("--ly", (e.clientY - r.top) + "px");
    };
    lensFig.addEventListener("pointerenter", function (e) { move(e); lensFig.classList.add("lensing"); });
    lensFig.addEventListener("pointermove", move);
    lensFig.addEventListener("pointerleave", function () { lensFig.classList.remove("lensing"); });
  }

  /* ---------- CTA parallax ---------- */
  var ctaImg = document.querySelector(".cta-bg img");
  if (ctaImg) {
    window.addEventListener("scroll", function () {
      var cta = document.querySelector(".cta");
      if (!cta) return;
      var r = cta.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        ctaImg.style.transform = "translateY(" + (p * -40) + "px) scale(1.05)";
      }
    }, { passive: true });
  }

  /* ---------- Testimonials slider ---------- */
  var viewport = document.querySelector("[data-rev-viewport]");
  if (viewport) {
    var track = viewport.querySelector(".rev-track");
    var cards = track.querySelectorAll(".rev-card");
    var dotsWrap = document.querySelector("[data-rev-dots]");
    var index = 0;
    var pages = 1;
    var autoTimer = null;

    function perView() {
      var cw = cards[0].getBoundingClientRect().width + 24; // gap
      return Math.max(1, Math.round(viewport.getBoundingClientRect().width / cw));
    }
    function buildDots() {
      pages = Math.max(1, cards.length - perView() + 1);
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      // cap dots to 3 visual groups like the original
      var groups = Math.min(3, pages);
      for (var i = 0; i < groups; i++) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (gi) {
          b.addEventListener("click", function () {
            index = Math.round(gi * (pages - 1) / Math.max(1, groups - 1));
            update();
          });
        })(i);
        dotsWrap.appendChild(b);
      }
    }
    function update() {
      if (index < 0) index = 0;
      if (index > pages - 1) index = pages - 1;
      var cw = cards[0].getBoundingClientRect().width + 24;
      track.style.transition = "transform .7s cubic-bezier(0.16,1,0.3,1)";
      track.style.transform = "translateX(" + (-index * cw) + "px)";
      if (dotsWrap) {
        var groups = dotsWrap.children.length;
        var active = Math.round(index / Math.max(1, pages - 1) * (groups - 1));
        Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
          d.classList.toggle("active", di === active);
        });
      }
    }
    function next() { index = (index + 1 > pages - 1) ? 0 : index + 1; update(); }
    function startAuto() { stopAuto(); autoTimer = setInterval(next, 4500); }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    buildDots(); update(); startAuto();
    window.addEventListener("resize", function () { buildDots(); update(); });

    // drag / swipe
    var down = false, startX = 0, curX = 0, baseX = 0;
    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
    viewport.addEventListener("pointerdown", function (e) {
      down = true; startX = getX(e); curX = startX;
      var cw = cards[0].getBoundingClientRect().width + 24;
      baseX = -index * cw;
      track.style.transition = "none";
      viewport.classList.add("dragging");
      stopAuto();
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      curX = getX(e);
      track.style.transform = "translateX(" + (baseX + (curX - startX)) + "px)";
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false; viewport.classList.remove("dragging");
      var diff = curX - startX;
      if (Math.abs(diff) > 60) { diff < 0 ? index++ : index--; }
      update(); startAuto();
    });
    viewport.addEventListener("mouseenter", stopAuto);
    viewport.addEventListener("mouseleave", startAuto);
  }
})();
