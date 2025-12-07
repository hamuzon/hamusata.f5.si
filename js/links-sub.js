// ============================================
// js/links-sub.js
// ============================================

let langSub = {};

async function loadLangSub() {
  try {
    const res = await fetch("lang/lang-sub.json");
    langSub = await res.json();
  } catch (e) {
    console.error("lang-sub.json の読み込みに失敗", e);
  }
}

async function loadLinks() {
  await loadLangSub(); // まず翻訳データを読み込む

  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
  const sheetName = "sub";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const currentLang = localStorage.getItem("lang") || "ja";

  const sections = {
    portfolio: document.getElementById("portfolioLinks"),
    random: document.getElementById("randomLinks"),
    status: document.getElementById("statusLinks"),
    "mutual-links": document.getElementById("mutualLinks"),
    sns: document.getElementById("snsLinks")
  };

  for (const key in sections) {
    if (sections[key]) sections[key].innerHTML = "<p>読み込み中...</p>";
  }

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    for (const key in sections) {
      if (sections[key]) sections[key].innerHTML = "";
    }

    rows.slice(1).forEach(row => {
      let [title, description, image, link, section, inside] = row;
      if (!section || !sections[section]) return;

      const container = sections[section];
      const card = document.createElement("div");
      card.className = "work-card";

      // IDを作る（例: portfolio_HAMUSATA）
      const id = section + "_" + title.replace(/\s|\(|\)|–/g, "_").replace(/_+/g, "");

      // 翻訳対応
      if (langSub[currentLang] && langSub[currentLang][id]) {
        title = langSub[currentLang][id].title || title;
        description = langSub[currentLang][id].desc || description;
      }

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
      h3.textContent = title;
      card.appendChild(h3);

      // 説明
      if (description) {
        const p = document.createElement("p");
        p.innerHTML = description;
        card.appendChild(p);
      }

      // リンクボタン
      if (link) {
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = currentLang === "ja" ? "見る / View" : "View";
        card.appendChild(a);
      }

      container.appendChild(card);
    });

  } catch (e) {
    console.error("スプレッドシート読み込み失敗", e);
    for (const key in sections) {
      if (sections[key]) sections[key].innerHTML = `<p>${currentLang === "ja" ? "読み込みに失敗" : "Failed to load"}</p>`;
    }
  }
}

// ページ読み込み時
document.addEventListener("DOMContentLoaded", loadLinks);
