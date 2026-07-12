const body = document.body;
const introOverlay = document.querySelector(".intro-overlay");
const skipIntro = document.querySelector(".skip-intro");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const introSessionKey = "instyle3dIntroPlayed:referenceHero";
const forceIntro = new URLSearchParams(window.location.search).get("intro") === "1";

const closeIntro = () => {
  if (!introOverlay) return;
  introOverlay.classList.add("is-hidden");
  body.classList.remove("intro-running");
  sessionStorage.setItem(introSessionKey, "true");
};

const introAlreadyPlayed = sessionStorage.getItem(introSessionKey) === "true";

if (prefersReducedMotion.matches || (introAlreadyPlayed && !forceIntro)) {
  introOverlay?.classList.add("is-hidden");
  body.classList.remove("intro-running");
} else {
  window.setTimeout(closeIntro, 4300);
}

skipIntro?.addEventListener("click", closeIntro);

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", isOpen.toString());
});

navLinks?.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  navLinks.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
});
