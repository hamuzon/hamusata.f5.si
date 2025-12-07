// ============================================
// js/links-sub.js
// ============================================

let langData = {}; // 言語データをグローバルに保持
let currentLang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");
const sections = {
  portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
  random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
  status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
  "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
  sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
};
const seasonLinks = {
  spring: "https://home.hamusata.f5.si/spring",
  summer: "https://home.hamusata.f5.si/summer",
  autumn: "https://home.hamusata.f5.si/autumn",
  winter: "https://home.hamusata.f5.si/winter"
};

// ------------------------------
// カード作成関数
// ------------------------------
function createCard(row) {
  const [title, description, image, link, section, internalLinkFlag] = row;
  if (!section || !sections[section] || !sections[section].container) return null;

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
  h3.innerHTML = (langData[currentLang][keyTitle] || langData[currentLang][title] || title);
  h3.dataset.langKey = keyTitle;
  card.appendChild(h3);

  // 説明
  if (description) {
    const p = document.createElement("p");
    let keyDesc = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_desc";
    const descText = langData[currentLang][keyDesc] || langData[currentLang][description] || description;
    p.innerHTML = descText;
    p.dataset.langKey = keyDesc;
    card.appendChild(p);
  }

  // リンク
  if (link) {
    const a = document.createElement("a");
    const isInternal = ["on", "1", "true"].includes(String(internalLinkFlag).toLowerCase());
    if (isInternal) {
      const currentParams = new URLSearchParams(window.location.search);
      const themeParam = currentParams.get("theme");
      const newParams = new URLSearchParams();
      if (themeParam) newParams.set("theme", themeParam);
      a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
    } else if (title === "HAMUSATA – ホームページ" && section === "portfolio") {
      a.href = seasonLinks[getSeason()];
    } else {
      a.href = link;
    }

    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = langData[currentLang]["link_view"] || "View";
    a.dataset.langKey = "link_view";
    card.appendChild(a);
  }

  container.appendChild(card);
  return card;
}

// ------------------------------
// 季節取得
// ------------------------------
function getSeason() {
  const month = new Date().getMonth() + 1;
  return month >= 3 && month <= 5 ? "spring" :
         month >= 6 && month <= 8 ? "summer" :
         month >= 9 && month <= 11 ? "autumn" : "winter";
}

// ------------------------------
// リンク読み込み
// ------------------------------
async function loadLinks() {
  for (const key in sections) {
    if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
  }

  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg/gviz/tq?tqx=out:json&sheet=sub`);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));
    
    for (const key in sections) if (sections[key].container) sections[key].container.innerHTML = "";

    // カード作成
    rows.slice(1).forEach(row => createCard(row));

  } catch (e) {
    console.error("スプレッドシート読み込み失敗:", e);
    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
    }
  }
}

// ------------------------------
// 言語切替
// ------------------------------
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  // ページ内の data-lang-key を更新
  document.querySelectorAll("[data-lang-key]").forEach(el => {
    const key = el.dataset.langKey;
    if (!key) return;
    if (el.tagName === "A" || el.tagName === "P" || el.tagName === "H3") {
      el.innerHTML = langData[lang][key] || key;
    } else {
      el.textContent = langData[lang][key] || key;
    }
  });
}

// ------------------------------
// 初期化
// ------------------------------
async function initLinks() {
  // 言語データ取得
  const res = await fetch("lang/sub-lang.json");
  langData = await res.json();

  // リンク生成
  await loadLinks();

  // 言語切替ボタン
  const btn = document.getElementById("lang-switch");
  if (btn) {
    btn.textContent = currentLang === "ja" ? "🌐 English" : "🌐 日本語";
    btn.addEventListener("click", () => {
      const nextLang = currentLang === "ja" ? "en" : "ja";
      switchLanguage(nextLang);
      btn.textContent = nextLang === "ja" ? "🌐 English" : "🌐 日本語";
    });
  }
}

document.addEventListener("DOMContentLoaded", initLinks);