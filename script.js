// ===== Mobil menü (hamburger) =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const linkEls = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];

function setMenu(open) {
  if (!burger || !navLinks) return;

  burger.classList.toggle("is-open", open);
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
}

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const open = !navLinks.classList.contains("is-open");
    setMenu(open);
  });

  linkEls.forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (e) => {
    const inside = navLinks.contains(e.target) || burger.contains(e.target);
    if (!inside) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}

// ===== Aktív menüpont görgetés alapján =====
const sectionIds = ["miert", "terv", "csomagok", "kapcsolat"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sections.length && linkEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = visible.target.id;
      linkEls.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    },
    { threshold: [0.25, 0.5, 0.75] }
  );

  sections.forEach((sec) => io.observe(sec));
}

// ===== Footer év =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== EmailJS =====
const EMAILJS_PUBLIC_KEY = "OrJuLoNThQSnjJUBk";
const EMAILJS_SERVICE_ID = "service_6s6nd4y";
const EMAILJS_TEMPLATE_ID = "template_337cgpe";

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
});

const form = document.getElementById("contactForm");
const hint = document.getElementById("formHint");
const submitBtn = document.getElementById("submitBtn");

if (form && hint && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const selectedPackage = document.querySelector('input[name="package"]:checked')?.value;
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !selectedPackage) {
      hint.textContent = "Kérlek töltsd ki a nevet, email címet és a választott csomagot.";
      return;
    }

    hint.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Küldés...";

    const templateParams = {
      name: name,
      email: email,
      package: selectedPackage,
      message: message || "-",
      reply_to: email,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      hint.textContent = "✅ Sikeres jelentkezés! Hamarosan válaszolok.";
      form.reset();
    } catch (error) {
      console.error("EmailJS hiba:", error);
      hint.textContent = "❌ Hiba történt küldés közben. Ellenőrizd a kulcsokat és próbáld újra.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Jelentkezés elküldése";
    }
  });
}

// ===== Csomagkártya -> görgetés + automatikus kiválasztás =====
const packageButtons = document.querySelectorAll(".package-cta");
const contactSection = document.getElementById("kapcsolat");

packageButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const selectedPackage = button.dataset.package;
    const radio = document.querySelector(`input[name="package"][value="${selectedPackage}"]`);

    if (radio) {
      radio.checked = true;
    }

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});