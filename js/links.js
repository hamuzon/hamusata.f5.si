// js/links.js

async function loadSheetLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID

 
  const sectionMap = {
    portfolio: "portfolio-cards",
    mutual: "mutualLinks",
    sns: "sns-cards",
    random: "random-cards",
    status: "status-cards"
  };

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=リンク一覧`;
    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    const header = rows[0].map(h => h.trim());
    const data = rows.slice(1);

    data.forEach(row => {
      const item = {};
      header.forEach((key, i) => item[key] = row[i]);

      const containerId = sectionMap[item.section];
      if (!containerId) return; 

      const container = document.getElementById(containerId);
      if (!container) return;

      const card = document.createElement("div");
      card.className = "work-card";

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title} icon" loading="lazy" decoding="async">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a href="${item.link}" target="_blank"><span>見る</span> / <span>View</span></a>
      `;

      container.appendChild(card);
    });

  } catch (e) {
    console.error("スプレッドシート読み込みエラー:", e);
  }
}

document.addEventListener("DOMContentLoaded", loadSheetLinks);
