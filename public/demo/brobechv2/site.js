// Murerfirmaet Brøbech, proposal v2. Shared by every page in /demo/brobechv2/.
(function () {
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = "IntersectionObserver" in window;

  // Menu on phones, and the dropdowns under "Vi tilbyder" and "Viden".
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }
  document.querySelectorAll(".sub-btn").forEach(function (btn) {
    var li = btn.closest("li");
    var sub = li.querySelector(".sub");
    var wide = window.matchMedia("(min-width: 1000px)");
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      li.classList.toggle("is-open", open);
      if (!wide.matches) sub.hidden = !open;
    }
    if (!wide.matches) sub.hidden = btn.getAttribute("aria-expanded") !== "true";
    wide.addEventListener("change", function () { sub.hidden = wide.matches ? false : btn.getAttribute("aria-expanded") !== "true"; });
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    li.addEventListener("keydown", function (e) { if (e.key === "Escape") { set(false); btn.focus(); } });
  });
  document.addEventListener("click", function (e) {
    if (!window.matchMedia("(min-width: 1000px)").matches) return;
    document.querySelectorAll(".nav li.is-open").forEach(function (li) {
      if (!li.contains(e.target)) { li.classList.remove("is-open"); li.querySelector(".sub-btn").setAttribute("aria-expanded", "false"); }
    });
  });

  // Drone film at the top: muted, loops, with a pause button.
  var drone = document.getElementById("drone");
  var pause = document.querySelector(".pause");
  if (drone && pause) {
    var setPaused = function (p) {
      pause.setAttribute("aria-pressed", String(p));
      pause.setAttribute("aria-label", p ? "Afspil filmen" : "Sæt filmen på pause");
    };
    if (still) { drone.removeAttribute("autoplay"); drone.pause(); setPaused(true); }
    pause.addEventListener("click", function () {
      if (drone.paused) { drone.play(); setPaused(false); } else { drone.pause(); setPaused(true); }
    });
  }

  // The intro film starts with sound when its big play button is pressed.
  document.querySelectorAll(".film").forEach(function (box) {
    var video = box.querySelector("video");
    var play = box.querySelector(".film__play");
    if (!video || !play) return;
    play.addEventListener("click", function () {
      play.hidden = true;
      video.setAttribute("controls", "");
      video.play();
    });
    video.addEventListener("play", function () { play.hidden = true; video.setAttribute("controls", ""); });
  });

  // Things that come up once on the way down.
  var pops = document.querySelectorAll(".pop");
  if (!io || still) {
    pops.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        seen.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    pops.forEach(function (el) { seen.observe(el); });
  }

  // The phone call bar waits until the page's own big call button has scrolled away.
  var bar = document.querySelector(".callbar");
  var watch = document.querySelector("[data-callbar-watch]");
  if (bar && watch && io) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-away", entries[0].isIntersecting);
    }).observe(watch);
  }

  // Projects slideshow: while the section is pinned, scrolling down moves the row of photos sideways.
  // Photos keep their own proportions; only the row moves. Without JS or with reduced motion it is a swipeable row.
  var slides = document.querySelector(".slides");
  if (slides && !still) {
    var pin = slides.querySelector(".slides__pin");
    var track = slides.querySelector(".slides__track");
    var fill = slides.querySelector(".slides__bar span");
    var distance = 0;
    document.documentElement.classList.add("js-slides");
    var measure = function () {
      distance = Math.max(0, track.scrollWidth - pin.clientWidth);
      slides.style.setProperty("--slides-h", (distance + pin.offsetHeight) + "px");
      move();
    };
    var move = function () {
      var top = slides.getBoundingClientRect().top - parseFloat(getComputedStyle(pin).top || 0);
      var p = distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
      track.style.transform = "translate3d(" + (-p * distance) + "px, 0, 0)";
      if (fill) fill.style.width = (p * 100) + "%";
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { move(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", measure);
    track.querySelectorAll("img").forEach(function (img) { if (!img.complete) img.addEventListener("load", measure, { once: true }); });
    measure();
  }
})();
