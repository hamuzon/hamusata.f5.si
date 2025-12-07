// 言語ファイル読み込み
async function loadLang(lang) {
  try {
    const res = await fetch("./lang.json");
    const data = await res.json();

    // 対象言語
    const text = data[lang] || data["ja"];

    // data-lang 属性の要素を書き換え
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (text[key]) {
        el.textContent = text[key];
      }
    });

    // HTMLのlang属性更新
    document.documentElement.lang = lang;

    // localStorage 保存
    localStorage.setItem("lang", lang);

    // ボタンの表示切り替え
    const btn = document.getElementById("lang-switch");
    if (btn) {
      btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";
    }

  } catch (e) {
    console.error("言語ファイル読み込みエラー:", e);
  }
}

// 言語初期設定
function initLang() {
  const saved = localStorage.getItem("lang");

  // ブラウザ言語
  const browserLang = navigator.language.startsWith("en") ? "en" : "ja";

  const lang = saved || browserLang;
  loadLang(lang);

  // ボタンクリックで切替
  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem("lang") === "ja") ? "en" : "ja";
      loadLang(next);
    });
  }
}

// 実行
initLang();
