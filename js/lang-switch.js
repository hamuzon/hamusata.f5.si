// js/lang-switch.js

async function loadLang(lang) {
  try {
    const res = await fetch("lang/lang.json");
    const data = await res.json();
    const text = data[lang] || data["ja"];

    // data-lang 属性の要素を書き換え
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (text[key]) el.textContent = text[key];
    });

    // カード内 data-lang-key を書き換え
    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.dataset.langKey;
      if (key === "view") {
        el.textContent = lang === "en" ? "View" : "見る / View";
      } else if (text[key]) {
        el.textContent = text[key];
      }
    });

    document.documentElement.lang = lang;

    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";

    localStorage.setItem("lang", lang);

  } catch (e) {
    console.error("言語ファイル読み込みエラー:", e);
  }
}

function initLang() {
  const saved = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("en") ? "en" : "ja";
  const lang = saved || browserLang;

  loadLang(lang);

  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem("lang") === "ja") ? "en" : "ja";
      loadLang(next);
    });
  }
}

document.addEventListener("DOMContentLoaded", initLang);
