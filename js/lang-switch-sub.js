// ============================================
// lang-switch-sub.js
// ============================================

async function loadSubLang(lang) {
  try {
    // sub-lang.json を取得
    const res = await fetch("lang/sub-lang.json");
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
      if (key && text[key]) {
        el.textContent = text[key];
      }
    });

    // HTML lang 属性更新
    document.documentElement.lang = lang;

    // ボタン切替表示
    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";

    // 現在の言語を記憶
    localStorage.setItem("lang", lang);

  } catch (e) {
    console.error("sub-langファイル読み込みエラー:", e);
  }
}

function initSubLang() {
  const saved = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("en") ? "en" : "ja";
  const lang = saved || browserLang;

  loadSubLang(lang);

  // ボタンクリックで切替
  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem("lang") === "ja") ? "en" : "ja";
      loadSubLang(next);
    });
  }
}

// ページ読み込み時に初期化
document.addEventListener("DOMContentLoaded", initSubLang);
