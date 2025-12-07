// ============================================
// js/lang-switch-sub.js
// ============================================

async function loadLangSub(lang) {
  try {
    const res = await fetch("lang/sub-lang.json");
    const data = await res.json();
    const text = data[lang] || data["ja"];

    // カード内の data-lang-key を翻訳
    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.dataset.langKey;
      if (key && text[key]) {
        el.textContent = text[key];
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);

    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";

  } catch (e) {
    console.error("sub-lang.json 読み込みエラー:", e);
  }
}

function initLangSub() {
  const saved = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("en") ? "en" : "ja";
  const lang = saved || browserLang;

  loadLangSub(lang);

  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem("lang") === "ja") ? "en" : "ja";
      loadLangSub(next);
    });
  }
}

document.addEventListener("DOMContentLoaded", initLangSub);
