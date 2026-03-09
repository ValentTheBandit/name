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
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

if (sections.length && linkEls.length) {
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((en) => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    linkEls.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    });
  }, { threshold: [0.25, 0.5, 0.75] });

  sections.forEach((sec) => io.observe(sec));
}

// ===== Footer év =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Csomagkártya -> görgetés + automatikus kitöltés =====
const packageButtons = document.querySelectorAll(".package-cta");
const contactSection = document.getElementById("kapcsolat");
const nameInput = document.getElementById("name");
const packageInput = document.getElementById("package");

packageButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const selectedPackage = button.dataset.package;

    if (packageInput) {
      packageInput.value = selectedPackage;
    }

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (nameInput) {
      setTimeout(() => nameInput.focus(), 350);
    }
  });
});

// ===== Mini booking rendszer =====
const consultationDateInput = document.getElementById("consultationDate");
const consultationTimeInput = document.getElementById("consultationTime");

function formatHungarianDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isValidConsultationTime(timeString) {
  const timePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timePattern.test(timeString);
}

if (consultationDateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  consultationDateInput.min = `${yyyy}-${mm}-${dd}`;
}

if (consultationTimeInput) {
  consultationTimeInput.addEventListener("blur", () => {
    const value = consultationTimeInput.value.trim();

    if (!value) {
      consultationTimeInput.setCustomValidity("");
      return;
    }

    if (!isValidConsultationTime(value)) {
      consultationTimeInput.setCustomValidity(
        "Az időpont formátuma legyen pl. 7:00 vagy 18:30."
      );
      consultationTimeInput.reportValidity();
    } else {
      consultationTimeInput.setCustomValidity("");
    }
  });
}

// ===== EmailJS =====
const EMAILJS_PUBLIC_KEY = "OrJuLoNThQSnjJUBk";
const EMAILJS_SERVICE_ID = "service_6s6nd4y";
const EMAILJS_TEMPLATE_ID = "template_337cgpe";

if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
} else {
  console.error("EmailJS nincs betöltve.");
}

const form = document.getElementById("contactForm");
const hint = document.getElementById("formHint");
const submitBtn = document.getElementById("submitBtn");

if (form && hint && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const selectedPackage = document.getElementById("package")?.value.trim();
    const consultationDate = document.getElementById("consultationDate")?.value;
    const consultationTime = document.getElementById("consultationTime")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !selectedPackage || !consultationDate || !consultationTime) {
      hint.textContent = "Kérlek töltsd ki a nevet, email címet, csomagot, dátumot és időpontot.";
      return;
    }

    if (!isValidConsultationTime(consultationTime)) {
      hint.textContent = "Az időpont formátuma legyen pl. 7:00 vagy 18:30.";
      return;
    }

    if (typeof emailjs === "undefined") {
      hint.textContent = "❌ Az EmailJS script nincs betöltve.";
      return;
    }

    hint.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Küldés...";

    const templateParams = {
      name: name,
      email: email,
      package: selectedPackage,
      consultationDate: formatHungarianDate(consultationDate),
      consultationTime: consultationTime,
      message: message || "-",
      reply_to: email,
    };

    console.log("=== EmailJS DEBUG START ===");
    console.log("PUBLIC KEY:", EMAILJS_PUBLIC_KEY);
    console.log("SERVICE ID:", EMAILJS_SERVICE_ID);
    console.log("TEMPLATE ID:", EMAILJS_TEMPLATE_ID);
    console.log("DÁTUM:", consultationDate);
    console.log("IDŐ:", consultationTime);
    console.log("PARAMS:", templateParams);

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log("✅ EmailJS siker:", response);
      hint.textContent = "✅ Sikeres jelentkezés! Hamarosan válaszolok.";
      form.reset();
    } catch (error) {
      console.error("❌ EmailJS teljes hiba objektum:", error);

      let errorMessage = "Hiba történt küldés közben.";

      if (error?.text) {
        errorMessage += ` ${error.text}`;
      }

      if (error?.status) {
        errorMessage += ` (Status: ${error.status})`;
      }

      if (error?.message) {
        errorMessage += ` ${error.message}`;
      }

      hint.textContent = `❌ ${errorMessage}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Jelentkezés elküldése";
      console.log("=== EmailJS DEBUG END ===");
    }
  });
}

const dateInputWrap = document.getElementById("dateInputWrap");

if (consultationDateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  consultationDateInput.min = `${yyyy}-${mm}-${dd}`;
}

if (dateInputWrap && consultationDateInput) {
  dateInputWrap.addEventListener("click", () => {
    if (typeof consultationDateInput.showPicker === "function") {
      consultationDateInput.showPicker();
    } else {
      consultationDateInput.focus();
      consultationDateInput.click();
    }
  });
}

if (consultationDateInput) {
  consultationDateInput.addEventListener("click", () => {
    if (typeof consultationDateInput.showPicker === "function") {
      consultationDateInput.showPicker();
    }
  });
}