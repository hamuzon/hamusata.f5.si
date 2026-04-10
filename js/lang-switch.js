// js/lang-switch.js

let langData = {}; 

async function loadLang(lang) {
  try {
    // 言語ファイルを取得
    if (Object.keys(langData).length === 0) {
      const res = await fetch("/lang/lang.json");
      langData = await res.json();
    }
    const text = langData[lang] || langData["ja"];

    // data-lang 属性の要素を書き換え
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (text[key] && el.textContent !== text[key]) el.textContent = text[key];
    });

    // カード内 data-lang-key を書き換え
    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.dataset.langKey;

      // "view" は汎用ボタン対応
      if (key === "link_view" || key === "view") {
        const viewText = text["link_view"] || (lang === "en" ? "View" : "見る / View");
        if (el.textContent !== viewText) el.textContent = viewText;
      } else if (text[key] && el.textContent !== text[key]) {
        el.textContent = text[key];
      }
    });

    // HTML lang 属性更新
    document.documentElement.lang = lang;

    // ボタン切替表示
    const btn = document.getElementById("lang-switch");
    if (btn) {
      const btnText = lang === "ja" ? "🌐 English" : "🌐 日本語";
      if (btn.textContent !== btnText) btn.textContent = btnText;
    }

    // 現在の言語を記憶
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

  // ボタンで切替
  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem("lang") === "ja") ? "en" : "ja";
      loadLang(next);
    });
  }
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", initLang);
