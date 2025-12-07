// ============================================
// js/script-sub.js 
// ============================================

let currentLang = localStorage.getItem("lang") || "ja";
let langSub = {};

// 言語用JSON読み込み
fetch("lang/sub-lang.json")
  .then(res => res.json())
  .then(json => {
    langSub = json;
    loadLinks(); // 言語JSON読み込み後にリンク読み込み
  });

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

    rows.slice(1).forEach(row => {
      let [title, description, image, link, section, internalLinkFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
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
      h3.textContent = title;
      card.appendChild(h3);

      if (description) {
        const p = document.createElement("p");
        p.innerHTML = description;
        card.appendChild(p);
      }

      if (link) {
        const a = document.createElement("a");
        const isInternal = ["on", "1", "true"].includes(String(internalLinkFlag).toLowerCase());

        if (isInternal) {
          const currentParams = new URLSearchParams(window.location.search);
          const themeParam = currentParams.get("theme");
          const newParams = new URLSearchParams();
          if (themeParam) newParams.set("theme", themeParam);
          a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
        } else if (title.includes("HAMUSATA – ホームページ") && section === "portfolio") {
          a.href = seasonLinks[season] || link;
        } else {
          a.href = link;
        }

        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = langSub[currentLang]?.view || "View";
        card.appendChild(a);

        if (title.includes("pw.link-s.f5.si")) {
          const note = document.createElement("p");
          note.className = "note";
          note.innerHTML = langSub[currentLang]?.pw_note || "";
          card.appendChild(note);

          const apiLink = document.createElement("a");
          apiLink.href = "https://password-create.link-s.f5.si/";
          apiLink.textContent = langSub[currentLang]?.no_api || "Non-API version";
          apiLink.target = "_blank";
          apiLink.rel = "noopener noreferrer";
          card.appendChild(apiLink);
        }
      }

      container.appendChild(card);
    });

    for (const key in sections) {
      if (sections[key].container && sections[key].container.children.length === 0) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }

  } catch (e) {
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// 言語切替時に再レンダリング
function updateCardsLang(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  loadLinks();
}

// 言語切替ボタンと同期
document.addEventListener("DOMContentLoaded", ()=>{
  const langBtn = document.getElementById("lang-switch");
  langBtn.addEventListener("click", ()=>{
    const newLang = currentLang === "ja" ? "en" : "ja";
    updateCardsLang(newLang);
    langBtn.textContent = newLang==="ja"?"🌐 English":"🌐 日本語";
  });
});
