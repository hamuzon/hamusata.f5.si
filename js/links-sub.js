// ============================================
// js/links-sub.js
// ============================================

async function loadLinks(lang) {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; 
  const sheetName = "sub"; 
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const sections = {
    portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
    random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
    status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
    "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
    sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
  };

  for (const key in sections) {
    if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
  }

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = "";
    }

    const seasonLinks = {
      spring: "https://home.hamusata.f5.si/spring",
      summer: "https://home.hamusata.f5.si/summer",
      autumn: "https://home.hamusata.f5.si/autumn",
      winter: "https://home.hamusata.f5.si/winter"
    };
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5 ? "spring" :
                   month >= 6 && month <= 8 ? "summer" :
                   month >= 9 && month <= 11 ? "autumn" : "winter";

    // lang/sub-lang.json を取得
    const langDataRes = await fetch("lang/sub-lang.json");
    const langData = await langDataRes.json();
    lang = lang || localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");

    // カード翻訳用関数
    function translateCard(container, langText) {
      container.querySelectorAll("[data-lang], [data-lang-key]").forEach(el => {
        const key = el.dataset.lang || el.dataset.langKey;
        if (key && langText[key]) el.innerHTML = langText[key];
      });
    }

    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
      const card = document.createElement("div");
      card.className = "work-card";

      // 画像
      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.loading = "lazy";
        img.decoding = "async";
        card.appendChild(img);
      }

      // タイトル
      const h3 = document.createElement("h3");
      let keyTitle = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_title";
      h3.dataset.langKey = keyTitle;
      card.appendChild(h3);

      // 説明
      if (description) {
        const p = document.createElement("p");
        let keyDesc = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_desc";
        p.dataset.langKey = keyDesc;
        card.appendChild(p);
      }

      // リンク
      if (link) {
        const a = document.createElement("a");
        a.dataset.langKey = "link_view";
        const isInternal = ["on", "1", "true"].includes(String(internalLinkFlag).toLowerCase());

        if (isInternal) {
          const currentParams = new URLSearchParams(window.location.search);
          const themeParam = currentParams.get("theme");
          const newParams = new URLSearchParams();
          if (themeParam) newParams.set("theme", themeParam);
          a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
        } else if (title === "HAMUSATA – ホームページ" && section === "portfolio") {
          a.href = seasonLinks[season] || link;
        } else {
          a.href = link;
        }

        a.target = "_blank";
        a.rel = "noopener noreferrer";
        card.appendChild(a);
      }

      container.appendChild(card);

      // カード内翻訳
      translateCard(card, langData[lang]);
    });

    // データなし対応
    for (const key in sections) {
      if (sections[key].container && sections[key].container.children.length === 0) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }

    // HTML lang 属性更新
    document.documentElement.lang = lang;

    // 言語切替ボタン
    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";

    // 現在の言語を記憶
    localStorage.setItem("lang", lang);

    // 言語切替機能
    if (btn) {
      btn.onclick = () => {
        const nextLang = lang === "ja" ? "en" : "ja";
        loadLinks(nextLang);
      };
    }

  } catch (e) {
    console.error("スプレッドシート読み込み失敗:", e);
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }
  }
}

// ページ読み込み時に初期化
document.addEventListener("DOMContentLoaded", () => loadLinks());