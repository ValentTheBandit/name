// ===== Mobil menü (hamburger) =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const linkEls = Array.from(navLinks.querySelectorAll("a"));

function setMenu(open) {
  burger.classList.toggle("is-open", open);
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
}

burger.addEventListener("click", () => {
  const open = !navLinks.classList.contains("is-open");
  setMenu(open);
});

// Mobilon: linkre kattintva zárjon
linkEls.forEach(a => a.addEventListener("click", () => setMenu(false)));

// Kattintás “kívülre” => zárás
document.addEventListener("click", (e) => {
  const inside = navLinks.contains(e.target) || burger.contains(e.target);
  if (!inside) setMenu(false);
});

// ESC-re zárás
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});


// ===== Aktív menüpont görgetés alapján =====
const sectionIds = ["miert", "terv", "csomagok", "kapcsolat"];
const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

const io = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(en => en.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  const id = visible.target.id;
  linkEls.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
  });
}, { threshold: [0.25, 0.5, 0.75] });

sections.forEach(sec => io.observe(sec));


// ===== Footer év =====
document.getElementById("year").textContent = new Date().getFullYear();


// ===== Kapcsolat: mailto automatikus kitöltés =====
// FIGYELEM: írd át a saját emailedre itt:
const TO_EMAIL = "TE@EMAIL.HU";

const form = document.getElementById("contactForm");
const mailtoBtn = document.getElementById("mailtoBtn");
const hint = document.getElementById("formHint");

function buildMailto() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();

  const subject = "Sakk oktatás jelentkezés";
  const bodyLines = [
    "Szia!",
    "",
    "Szeretnék jelentkezni sakk oktatásra.",
    "",
    `Név: ${name || "-"}`,
    `Email: ${email || "-"}`,
    "",
    "Üzenet:",
    msg || "-",
    "",
    "Köszönöm!"
  ];

  const body = bodyLines.join("\n");
  const href = `mailto:${encodeURIComponent(TO_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  mailtoBtn.setAttribute("href", href);
}

// Frissítsük a mailto linket gépelés közben is
["name", "email", "message"].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("input", buildMailto);
});

// Demo submit: nem küld igazi emailt, csak üzen
form.addEventListener("submit", (e) => {
  e.preventDefault();
  buildMailto();

  hint.textContent =
    "✅ Demo kész! Ha tényleg emailt akarsz küldeni, nyomd meg a “Küldés emailben” gombot.";
});

// induláskor
buildMailto();