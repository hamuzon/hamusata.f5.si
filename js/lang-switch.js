// js/lang-switch.js

let langData = {};

async function loadLang(lang) {
  try {
    if (Object.keys(langData).length === 0) {
      const res = await fetch("/lang/lang.json");
      langData = await res.json();
    }
    const text = langData[lang] || langData["ja"];

    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (text[key] && el.textContent !== text[key]) el.textContent = text[key];
    });

    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.dataset.langKey;

      if (key === "link_view" || key === "view") {
        const viewText = text["link_view"] || (lang === "en" ? "View" : "見る / View");
        if (el.textContent !== viewText) el.textContent = viewText;
      } else if (text[key] && el.textContent !== text[key]) {
        el.textContent = text[key];
      }
    });

    document.documentElement.lang = lang;

    const btn = document.getElementById("lang-switch");
    if (btn) {
      const btnText = lang === "ja" ? "🌐 English" : "🌐 日本語";
      if (btn.textContent !== btnText) btn.textContent = btnText;
    }

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
