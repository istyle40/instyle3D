const filterButtons = document.querySelectorAll(".filter");
const printCards = document.querySelectorAll(".print-card");
const siteHeader = document.querySelector(".site-header");
const introScreen = document.querySelector(".intro-screen");
const introSkip = document.querySelector(".intro-skip");
const introSound = document.querySelector(".intro-sound");
const ideaButton = document.querySelector(".idea-button");
const showcaseBoxes = document.querySelector("#showcase-boxes");
const revealPreview = document.querySelector("#reveal-preview");
const revealBaseInput = document.querySelector("#reveal-base");
const revealColourInput = document.querySelector("#reveal-colour");
let introTimer;
let introMusicStarted = false;

const closeIntro = () => {
  if (!introScreen) return;
  window.clearTimeout(introTimer);
  introScreen.classList.add("is-hidden");
  document.body.classList.remove("intro-active");
};

introTimer = window.setTimeout(closeIntro, 3000);
introSkip?.addEventListener("click", closeIntro);

const playIntroMusic = () => {
  if (introMusicStarted) return;
  introMusicStarted = true;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audio = new AudioContext();
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, audio.currentTime);
  master.gain.exponentialRampToValueAtTime(0.16, audio.currentTime + 0.08);
  master.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 3.1);
  master.connect(audio.destination);

  const notes = [164.81, 246.94, 329.63, 493.88, 659.25];
  notes.forEach((frequency, index) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = index % 2 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(frequency, audio.currentTime + index * 0.18);
    gain.gain.setValueAtTime(0.0001, audio.currentTime + index * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.16, audio.currentTime + index * 0.18 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 2.4 + index * 0.08);
    osc.connect(gain);
    gain.connect(master);
    osc.start(audio.currentTime + index * 0.18);
    osc.stop(audio.currentTime + 3.2);
  });
};

introSound?.addEventListener("click", () => {
  window.clearTimeout(introTimer);
  introMusicStarted = false;
  introScreen?.classList.add("is-replaying");
  window.requestAnimationFrame(() => {
    introScreen?.classList.remove("is-replaying");
  });
  playIntroMusic();
  introTimer = window.setTimeout(closeIntro, 3600);
});

const updateHeaderVisibility = () => {
  if (!siteHeader) return;
  const dissolveProgress = Math.min(window.scrollY / 220, 1);
  siteHeader.style.setProperty("--logo-opacity", (1 - dissolveProgress).toString());
  siteHeader.style.setProperty("--logo-lift", `${-28 * dissolveProgress}px`);
};

updateHeaderVisibility();
window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
window.addEventListener("resize", updateHeaderVisibility);

ideaButton?.addEventListener("click", (event) => {
  if (!showcaseBoxes) return;
  event.preventDefault();
  closeIntro();
  showcaseBoxes.scrollIntoView({ behavior: "smooth", block: "center" });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    printCards.forEach((card) => {
      const shouldShow = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const isJpegFile = (file) => {
  if (!file) return false;
  const name = file.name.toLowerCase();
  return file.type === "image/jpeg" || name.endsWith(".jpg") || name.endsWith(".jpeg");
};

const setRevealImage = (selector, file) => {
  if (!revealPreview || !isJpegFile(file)) return;
  const layer = revealPreview.querySelector(selector);
  if (!layer) return;
  layer.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
  revealPreview.classList.add(selector.includes("base") ? "has-base" : "has-colour");
};

const updateRevealPosition = (clientX) => {
  if (!revealPreview) return;
  const rect = revealPreview.getBoundingClientRect();
  const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  revealPreview.style.setProperty("--reveal", `${percent}%`);
};

revealBaseInput?.addEventListener("change", (event) => {
  setRevealImage(".reveal-base", event.target.files[0]);
});

revealColourInput?.addEventListener("change", (event) => {
  setRevealImage(".reveal-colour", event.target.files[0]);
});

revealPreview?.addEventListener("pointermove", (event) => {
  updateRevealPosition(event.clientX);
});

revealPreview?.addEventListener("pointerdown", (event) => {
  revealPreview.setPointerCapture(event.pointerId);
  updateRevealPosition(event.clientX);
});
