const btn = document.getElementById("lang-switch");
const html = document.documentElement;
const items = document.querySelectorAll("[data-ja]");

let lang = localStorage.getItem("lang") || "ja";
set(lang);

btn.onclick = () => {
  lang = lang === "ja" ? "en" : "ja";
  set(lang);
  localStorage.setItem("lang", lang);
};

function set(l) {
  items.forEach(el => el.textContent = el.getAttribute(`data-${l}`));
  html.lang = l;
}
