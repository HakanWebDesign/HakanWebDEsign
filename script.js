/* ==========================================================
   HakanWebDesign — script.js
   ========================================================== */

/* ----------------------------------------------------------
   AYARLAR — Sadece burayı düzenlemeniz yeterli
   ----------------------------------------------------------
   phone   : Ülke koduyla birlikte, başında + veya 0 olmadan,
             boşluksuz yazın. Örnek: 905551234567
   display : Sitede görünecek numara metni
   message : Sağ alttaki butonla açılan hazır mesaj
---------------------------------------------------------- */
const CONFIG = {
  phone: "905XXXXXXXXX",
  display: "+90 5XX XXX XX XX",
  message: "Merhaba, web sitem hakkında bilgi almak istiyorum."
};

/* ---------- Yardımcı fonksiyonlar ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function buildWhatsAppUrl(text) {
  return `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(text)}`;
}

function isPhoneConfigured() {
  return /^\d{10,15}$/.test(CONFIG.phone);
}

/* ---------- WhatsApp ve telefon bağlantılarını ayarla ---------- */
function setupContactLinks() {
  $$("[data-wa-link]").forEach((link) => {
    link.href = buildWhatsAppUrl(CONFIG.message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  $$("[data-phone-link]").forEach((link) => {
    link.href = `tel:+${CONFIG.phone}`;
  });

  $$("[data-phone-text]").forEach((el) => {
    el.textContent = CONFIG.display;
  });
}

/* ---------- Mobil menü ---------- */
function setupMenu() {
  const toggle = $("#menu-toggle");
  const nav = $("#main-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Bir bağlantıya tıklanınca menüyü kapat
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));

  // ESC ile kapat
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Ekran genişleyince menüyü sıfırla
  window.matchMedia("(min-width: 861px)").addEventListener("change", () => setOpen(false));
}

/* ---------- Scroll: header gölgesi + aktif menü ---------- */
function setupScrollEffects() {
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const links = $$(".main-nav a");
  const sections = links
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- "Detaylı bilgi al" → formda hizmeti seç ---------- */
function setupServiceLinks() {
  const select = $("#service");
  if (!select) return;

  $$("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      select.value = link.dataset.service;
    });
  });
}

/* ---------- İletişim formu → WhatsApp ---------- */
function setupContactForm() {
  const form = $("#contact-form");
  if (!form) return;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Lütfen adınızı ve soyadınızı yazın."),
    service: (v) => (v ? "" : "Lütfen bir hizmet seçin."),
    message: (v) => (v.trim().length >= 10 ? "" : "Mesajınız en az 10 karakter olmalı.")
  };

  const validateField = (name) => {
    const field = form.elements[name];
    const wrapper = field.closest(".field");
    const error = $(`[data-error-for="${name}"]`, form);
    const message = rules[name](field.value);
    wrapper.classList.toggle("invalid", Boolean(message));
    error.textContent = message;
    return !message;
  };

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(name));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      const firstInvalid = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!isPhoneConfigured()) {
      alert("WhatsApp numarası henüz ayarlanmadı. script.js dosyasındaki CONFIG.phone değerini güncelleyin.");
      return;
    }

    const data = new FormData(form);
    const text = [
      "Merhaba, web sitenizden yazıyorum.",
      "",
      `Ad Soyad: ${data.get("name").trim()}`,
      `Hizmet: ${data.get("service")}`,
      "",
      `Mesaj: ${data.get("message").trim()}`
    ].join("\n");

    window.open(buildWhatsAppUrl(text), "_blank", "noopener");
  });
}

/* ---------- Yıl ---------- */
function setupYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Başlat ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setupContactLinks();
  setupMenu();
  setupScrollEffects();
  setupServiceLinks();
  setupContactForm();
  setupYear();
});
