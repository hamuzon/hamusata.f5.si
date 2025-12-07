// ============================================
// js/links-sub.js 
// ============================================

let currentLang = localStorage.getItem("lang") || "ja";
let langSub = {}; // 言語JSON格納
let sheetRows = []; // スプレッドシートデータ

const sections = {
  portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
  random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
  status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
  "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
  sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
};

// -----------------------------
// 初期表示
// -----------------------------
for (const key in sections) {
  if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
}

// -----------------------------
// 言語JSON読み込み
// -----------------------------
async function loadLangJSON() {
  try {
    const res = await fetch("lang/sub-lang.json");
    langSub = await res.json();
  } catch (e) {
    console.error("言語JSON読み込み失敗:", e);
    langSub = {};
  }
}

// -----------------------------
// スプレッドシート読み込み
// -----------------------------
async function loadSheet() {
  try {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
    const sheetName = "sub";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    sheetRows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

  } catch (e) {
    console.error("スプレッドシート読み込み失敗:", e);
    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
    }
  }
}

// -----------------------------
// カード描画
// -----------------------------
function renderLinks() {
  if (!sheetRows.length) return;

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

  sheetRows.slice(1).forEach(row => {
    const [titleKey, descKey, image, link, section, internalFlag] = row;
    if (!section || !sections[section] || !sections[section].container) return;

    const container = sections[section].container;
    const card = document.createElement("div");
    card.className = "work-card";

    // 画像
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = langSub[currentLang]?.[titleKey] || titleKey;
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
    }

    // タイトル
    const h3 = document.createElement("h3");
    h3.textContent = langSub[currentLang]?.[titleKey] || titleKey;
    card.appendChild(h3);

    // 説明
    if (descKey) {
      const p = document.createElement("p");
      p.innerHTML = langSub[currentLang]?.[descKey] || descKey;
      card.appendChild(p);
    }

    // リンク
    if (link) {
      const a = document.createElement("a");
      const isInternal = ["on", "1", "true"].includes(String(internalFlag).toLowerCase());

      if (isInternal) {
        const currentParams = new URLSearchParams(window.location.search);
        const themeParam = currentParams.get("theme");
        const newParams = new URLSearchParams();
        if (themeParam) newParams.set("theme", themeParam);
        a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
      } else if (titleKey === "w_main_title" && section === "portfolio") {
        a.href = seasonLinks[season] || link;
      } else {
        a.href = link;
      }

      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = langSub[currentLang]?.view || "見る / View";
      card.appendChild(a);
    }

    container.appendChild(card);
  });

  // データがない場合
  for (const key in sections) {
    if (sections[key].container && sections[key].container.children.length === 0) {
      sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
    }
  }
}

// -----------------------------
// 言語切替時に再描画
// -----------------------------
function updateCardsLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  renderLinks();
}

// -----------------------------
// 初期化
// -----------------------------
document.addEventListener("DOMContentLoaded", async () => {
  await loadLangJSON();
  await loadSheet();
  renderLinks();

  // 言語切替ボタン
  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = currentLang === "ja" ? "en" : "ja";
      updateCardsLang(next);
      btn.textContent = next === "ja" ? "🌐 English" : "🌐 日本語";
    });
  }
});
