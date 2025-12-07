// ============================================
// links-sub.js
// ============================================

let subLangData = {}; 

async function loadLinks() {
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

  // 初期表示
  Object.values(sections).forEach(sec => {
    if (sec.container) sec.container.innerHTML = `<p>${sec.default}</p>`;
  });

  try {
    // スプレッドシート取得
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    Object.values(sections).forEach(sec => { if (sec.container) sec.container.innerHTML = ""; });

    // 季節リンク
    const seasonLinks = { spring: "https://home.hamusata.f5.si/spring", summer: "https://home.hamusata.f5.si/summer", autumn: "https://home.hamusata.f5.si/autumn", winter: "https://home.hamusata.f5.si/winter" };
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5 ? "spring" : month >= 6 && month <= 8 ? "summer" : month >= 9 && month <= 11 ? "autumn" : "winter";

    const currentLang = document.documentElement.lang || "ja";

    // サブ言語JSONを読み込む
    const langRes = await fetch("/lang/sub-lang.json");
    subLangData = await langRes.json();

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
        img.alt = subLangData[currentLang][title] || title;
        img.loading = "lazy";
        img.decoding = "async";
        card.appendChild(img);
      }

      // タイトル
      const h3 = document.createElement("h3");
      h3.dataset.langKey = title;
      h3.textContent = subLangData[currentLang][title] || title;
      card.appendChild(h3);

      // 説明
      if (description) {
        const descDiv = document.createElement("div");
        descDiv.className = "work-description";
        descDiv.dataset.langKey = description;
        descDiv.innerHTML = subLangData[currentLang][description] || description;
        card.appendChild(descDiv);
      }

      // リンクボタン
      if (link) {
        const a = document.createElement("a");
        a.dataset.langKey = "link_view";
        const isInternal = ["on","1","true"].includes(String(internalLinkFlag).toLowerCase());

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
        a.textContent = subLangData[currentLang]["link_view"] || "View";
        card.appendChild(a);
      }

      container.appendChild(card);
    });

    // パスワード生成サービス専用翻訳
    const pwDesc = document.getElementById("pwDescription");
    if (pwDesc) pwDesc.textContent = subLangData[currentLang]["APIベースのパスワード生成サービス。ログ保存等は一切ありません。"];

    const pwNote = document.getElementById("pwNote");
    if (pwNote) pwNote.innerHTML = subLangData[currentLang]["pw_note"];

    const pwNoAPI = document.getElementById("pwNoAPI");
    if (pwNoAPI) pwNoAPI.textContent = subLangData[currentLang]["APIなし版"] || "APIなし版";

    // データなしの場合
    Object.values(sections).forEach(sec => {
      if (sec.container && sec.container.children.length === 0) {
        sec.container.innerHTML = `<p>${sec.name}の読み込みに失敗</p>`;
      }
    });

  } catch (e) {
    Object.values(sections).forEach(sec => {
      if (sec.container) sec.container.innerHTML = `<p>${sec.name}の読み込みに失敗</p>`;
    });
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// ============================================
// 言語切替関数
// ============================================
function switchSubLang(lang) {
  if (!subLangData[lang]) return;

  document.querySelectorAll(".work-card [data-lang-key]").forEach(el => {
    const key = el.dataset.langKey;
    if (subLangData[lang][key]) {
      if (el.tagName === "IMG") {
        el.alt = subLangData[lang][key];
      } else {
        el.textContent = subLangData[lang][key];
      }
    }
  });

  // パスワード生成サービス翻訳
  const pwDesc = document.getElementById("pwDescription");
  if (pwDesc) pwDesc.textContent = subLangData[lang]["APIベースのパスワード生成サービス。ログ保存等は一切ありません。"];

  const pwNote = document.getElementById("pwNote");
  if (pwNote) pwNote.innerHTML = subLangData[lang]["pw_note"];

  const pwNoAPI = document.getElementById("pwNoAPI");
  if (pwNoAPI) pwNoAPI.textContent = subLangData[lang]["APIなし版"] || "APIなし版";
}

// ============================================
// 初期ロード
// ============================================
document.addEventListener("DOMContentLoaded", loadLinks);
