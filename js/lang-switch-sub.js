// ============================================
// lang-switch-sub.js
// ============================================

async function loadSubLang(lang) {
  try {
    // sub-lang.json を取得
    const res = await fetch("/lang/sub-lang.json");
    const data = await res.json();
    const text = data[lang] || data["ja"];

    if (!text) {
      console.warn(`No translation found for language: ${lang}`);
      return;
    }

    document.querySelectorAll("[data-lang], [data-lang-key]").forEach(el => {
      const key = el.dataset.lang || el.dataset.langKey;
      if (key && text[key]) {
        el.innerHTML = text[key];
      }
    });

    document.documentElement.lang = lang;

    // 言語切替ボタン表示
    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";

    localStorage.setItem("lang", lang);

  } catch (e) {
    console.error("sub-lang.json 読み込みエラー:", e);
  }
}


function initSubLang() {
  const saved = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("en") ? "en" : "ja";
  const lang = saved || browserLang;

  loadSubLang(lang);

  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", async () => {
      const current = localStorage.getItem("lang") || lang;
      const next = current === "ja" ? "en" : "ja";
      await loadSubLang(next);
    });
  }
}

initSubLang();
