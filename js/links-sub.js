// ============================================
// js/links-sub.js
// ============================================

async function fetchLangData() {
  const res = await fetch("lang/sub-lang.json");
  return await res.json();
}

async function fetchSheetRows() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; 
  const sheetName = "sub"; 
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
  return json.table.rows.map(r => r.c.map(c => (c ? c.v : ""))).slice(1);
}

function createCard(row) {
  const [title, description, image, link, section, internalLinkFlag] = row;
  const card = document.createElement("div");
  card.className = "work-card";

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    img.loading = "lazy";
    img.decoding = "async";
    card.appendChild(img);
  }

  const h3 = document.createElement("h3");
  h3.dataset.langKey = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_title";
  card.appendChild(h3);

  if (description) {
    const p = document.createElement("p");
    p.dataset.langKey = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_desc";
    card.appendChild(p);
  }

  if (link) {
    const a = document.createElement("a");
    a.dataset.langKey = "link_view";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.dataset.originalLink = link;
    a.dataset.internal = internalLinkFlag;
    card.appendChild(a);
  }

  return { card, section };
}

function translateCards(langData, lang) {
  document.querySelectorAll(".work-card").forEach(card => {
    card.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.dataset.langKey;
      if (key && langData[lang][key]) {
        el.innerHTML = langData[lang][key];
      }
    });

    // リンクも翻訳
    const a = card.querySelector("a[data-lang-key='link_view']");
    if (a) {
      a.innerHTML = langData[lang]["link_view"] || "View";
    }
  });
}

async function loadLinks(lang) {
  const sections = {
    portfolio: document.getElementById("portfolioLinks"),
    random: document.getElementById("randomLinks"),
    status: document.getElementById("statusLinks"),
    "mutual-links": document.getElementById("mutualLinks"),
    sns: document.getElementById("snsLinks")
  };

  // 「読み込み中」を表示
  for (const key in sections) {
    if (sections[key]) sections[key].innerHTML = "<p>読み込み中...</p>";
  }

  try {
    const langData = await fetchLangData();
    const rows = await fetchSheetRows();

    // セクションごとにカード生成
    for (const key in sections) if (sections[key]) sections[key].innerHTML = "";
    rows.forEach(row => {
      const { card, section } = createCard(row);
      if (sections[section]) sections[section].appendChild(card);
    });

    // 翻訳適用
    translateCards(langData, lang);

    // 言語切替ボタン
    const btn = document.getElementById("lang-switch");
    if (btn) {
      btn.textContent = lang === "ja" ? "🌐 English" : "🌐 日本語";
      btn.onclick = () => {
        const nextLang = lang === "ja" ? "en" : "ja";
        translateCards(langData, nextLang);
        localStorage.setItem("lang", nextLang);
        document.documentElement.lang = nextLang;
        btn.textContent = nextLang === "ja" ? "🌐 English" : "🌐 日本語";
      };
    }

    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);

  } catch (e) {
    console.error("読み込み失敗:", e);
    for (const key in sections) {
      if (sections[key]) sections[key].innerHTML = "<p>読み込みに失敗</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");
  loadLinks(lang);
});