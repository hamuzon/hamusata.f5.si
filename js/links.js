// js/links.js

async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

    // 1行目はヘッダーなので除く
    rows.slice(1).forEach(row => {
      const [title, description, image, link, section] = row;
      if (!section) return;

      const containerMap = {
        portfolio: "portfolioLinks",
        random: "randomLinks",
        status: "statusLinks",
        "mutual-links": "mutualLinks",
        sns: "snsLinks"
      };
      const container = document.getElementById(containerMap[section]);
      if (!container) return;

      const card = document.createElement("div");
      card.className = "work-card";

      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.loading = "lazy";
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
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "見る / View";
        card.appendChild(a);
      }

      container.appendChild(card);
    });

  } catch (e) {
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", loadLinks);
