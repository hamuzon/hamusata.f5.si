// ============================================
// js/links-sub.js
// ============================================

let currentLang = localStorage.getItem("lang") || "ja";
let sheetRows = [];
let langData = {};

// 各セクション DOM
const sections = {
  portfolio: { container: document.getElementById("portfolioLinks"), default: "読み込み中..." },
  random: { container: document.getElementById("randomLinks"), default: "読み込み中..." },
  status: { container: document.getElementById("statusLinks"), default: "読み込み中..." },
  "mutual-links": { container: document.getElementById("mutualLinks"), default: "読み込み中..." },
  sns: { container: document.getElementById("snsLinks"), default: "読み込み中..." }
};

// 初期表示
for (const key in sections) {
  if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
}

// スプレッドシート読み込み
async function loadSheet() {
  try {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
    const sheetName = "sub";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    // 言語JSON取得
    langData = await fetch("lang/sub-lang.json").then(res => res.json());

    const res = await fetch(sheetUrl);
    const text = await res.text();

    // JSONP → JSON 変換
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    sheetRows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    renderLinks();

  } catch (e) {
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].default}の読み込みに失敗</p>`;
      }
    }
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// カード描画
function renderLinks() {
  if (!sheetRows.length) return;

  // セクション初期化
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
    const [titleKey, descKey, image, link, section, insideFlag] = row;
    if (!section || !sections[section] || !sections[section].container) return;

    const container = sections[section].container;
    const card = document.createElement("div");
    card.className = "work-card";

    // 画像
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = langData[currentLang][titleKey] || titleKey;
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
    }

    // タイトル
    const h3 = document.createElement("h3");
    h3.textContent = langData[currentLang][titleKey] || titleKey;
    card.appendChild(h3);

    // 説明
    if (descKey) {
      const p = document.createElement("p");
      p.innerHTML = langData[currentLang][descKey] || descKey;
      card.appendChild(p);
    }

    // リンク
    if (link) {
      const a = document.createElement("a");
      const isInternal = ["on", "1", "true"].includes(String(insideFlag).toLowerCase());

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
      a.textContent = langData[currentLang]["link_view"] || "View";

      card.appendChild(a);

      // pw.link-s.f5.si 特殊処理
      if (titleKey.includes("pw.link-s.f5.si")) {
        const note = document.createElement("p");
        note.className = "note";
        note.innerHTML = langData[currentLang]["pw_note"] || "";
        card.appendChild(note);

        const apiLink = document.createElement("a");
        apiLink.href = "https://password-create.link-s.f5.si/";
        apiLink.textContent = langData[currentLang]["link_noapi"] || "Non-API version";
        apiLink.target = "_blank";
        apiLink.rel = "noopener noreferrer";
        card.appendChild(apiLink);
      }
    }

    container.appendChild(card);
  });
}

// 言語切替時に再レンダリング
function updateCardsLang(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  renderLinks();
}

// ページ読み込み時にスプレッドシート読み込み
document.addEventListener("DOMContentLoaded", loadSheet);
