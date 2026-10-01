/* HakanWebDesign — script.js */
/* AYAR: sadece burayı düzenleyin. phone: ülke koduyla, + ve boşluksuz (örn. 905551234567) */
const CONFIG = {
  phone: ["90", "551", "055", "12", "97"].join(""), // sitede görünmez, yalnızca WhatsApp bağlantısında kullanılır
  email: "hakanfitt.mv@gmail.com",
  message: "Merhaba, web sitem hakkında bilgi almak istiyorum."
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waUrl = (t) => `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(t)}`;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* WhatsApp / telefon bağlantıları */
$$("[data-wa]").forEach((a) => { a.href = waUrl(CONFIG.message); a.target = "_blank"; a.rel = "noopener noreferrer"; });
$$("[data-mail-link]").forEach((a) => { a.href = `mailto:${CONFIG.email}`; });
$$("[data-mail-text]").forEach((a) => { a.textContent = CONFIG.email; });
$("#year").textContent = new Date().getFullYear();

/* Header + mobil menü */
const header = $("#header"), nav = $("#nav"), burger = $("#burger");
const onScroll = () => header.classList.toggle("on", scrollY > 20);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const setMenu = (o) => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* Scroll animasyonları + sayaç + aktif menü */
const count = (el) => {
  const to = +el.dataset.count, t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  reduce ? (el.textContent = to) : requestAnimationFrame(step);
};
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  $$("[data-count]", e.target).forEach(count);
  io.unobserve(e.target);
}), { threshold: 0.18 });
$$(".rv").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });

const links = $$("nav a");
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach((a) => { const s = $(a.getAttribute("href")); s && spy.observe(s); });

/* Hero: fareyle 3D eğim + renk seçici */
const stage = $("#stage"), browser = $("#browser");
if (!reduce && matchMedia("(hover: hover)").matches) {
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    browser.style.transform = `rotateY(${x * 16 - 6}deg) rotateX(${4 - y * 12}deg)`;
  });
  stage.addEventListener("mouseleave", () => (browser.style.transform = ""));
}
$$(".swatches button").forEach((b) => b.addEventListener("click", () => {
  stage.style.setProperty("--acc", b.dataset.c);
  $$(".swatches button").forEach((x) => x.classList.toggle("on", x === b));
}));

/* Hizmet kartı ışığı (fare takibi) */
$$(".card").forEach((c) => c.addEventListener("pointermove", (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty("--x", `${e.clientX - r.left}px`);
  c.style.setProperty("--y", `${e.clientY - r.top}px`);
}));

/* "Bilgi al" → formda hizmet seç */
$$("[data-service]").forEach((a) => a.addEventListener("click", () => ($("#service").value = a.dataset.service)));

/* Form → WhatsApp */
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, d = new FormData(f), err = $("#err");
  const name = d.get("name").trim(), msg = d.get("message").trim(), svc = d.get("service");
  if (name.length < 2 || !svc || msg.length < 10) { err.textContent = "Lütfen adınızı, hizmeti ve en az 10 karakterlik mesajınızı girin."; return; }
  if (!/^\d{10,15}$/.test(CONFIG.phone)) { err.textContent = "Numara ayarlanmadı: script.js içindeki CONFIG.phone değerini güncelleyin."; return; }
  err.textContent = "";
  const text = `Merhaba, web sitenizden yazıyorum.\n\nAd Soyad: ${name}\nHizmet: ${svc}\n\nMesaj: ${msg}`;
  if (e.submitter && e.submitter.value === "mail") {
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Web sitesi teklifi: " + svc)}&body=${encodeURIComponent(text)}`;
  } else {
    open(waUrl(text), "_blank", "noopener");
  }
});
