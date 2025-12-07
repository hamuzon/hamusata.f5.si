// js/lang-switch.js

async function loadLang(lang) {
  try {
    // lang.json を取得
    const res = await fetch("lang/lang.json");
    const data = await res.json();

    // 指定言語がなければ日本語にフォールバック
    const text = data[lang] || data["ja"];

    // data-lang 属性の要素を書き換え
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (text[key]) {
        el.textContent = text[key];
      }
    });

    // HTML lang 属性更新
    document.documentElement.lang = lang;

    // ボタン切替表示
    const btn = document.getElementById("lang-switch");
    if (btn) {
      btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";
    }

    // 現在の言語を記憶
    localStorage.setItem("lang", lang);

  } catch (e) {
    console.error("言語ファイル読み込みエラー:", e);
  }
}

// 初期化
function initLang() {
  const saved = localStorage.getItem("lang");
  // ブラウザ言語が英語なら "en", それ以外は "ja"
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
initLang();
