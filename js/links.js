// js/links.js

async function loadLinks() {
  const sheetId = "1D99uRWiIvtncSVIWbYG-Ky8p81lywyCiUgZizXJznvU"; // スプレッドシートID

  // 各セクション初期値
  const sections = {
    portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
    random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
    status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
    mutualLinks: { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
    snsLinks: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
  };

  // 初期値セット
  for (const key in sections) {
    sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
  }

  // 共通処理
  async function fetchSheet(sheetName, containerKey) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
      const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

      const container = sections[containerKey].container;
      container.innerHTML = ""; // 読み込み成功なら空にする

      rows.slice(1).forEach(row => {
        const [title, description, image, link, section] = row;
        if (!title || !link) return;

        const card = document.createElement("div");
        card.className = "work-card";

        const imgEl = document.createElement("img");
        imgEl.src = image || "https://hamusata.f5.si/icon.webp";
        imgEl.alt = title;
        imgEl.loading = "lazy";
        imgEl.decoding = "async";
        card.appendChild(imgEl);

        const h3 = document.createElement("h3");
        h3.textContent = title;
        card.appendChild(h3);

        if (description) {
          const p = document.createElement("p");
          p.innerHTML = description;
          card.appendChild(p);
        }

        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.textContent = "見る / View";
        card.appendChild(a);

        container.appendChild(card);
      });
    } catch (e) {
      sections[containerKey].container.innerHTML = `<p>${sections[containerKey].name}の読み込みに失敗</p>`;
      console.error(`${sections[containerKey].name}の読み込みに失敗:`, e);
    }
  }

  // シート名とセクション対応
  await fetchSheet("ポートフォリオ", "portfolio");
  await fetchSheet("ランダム作品", "random");
  await fetchSheet("サービス稼働状況", "status");
  await fetchSheet("相互リンク", "mutualLinks");
  await fetchSheet("SNS", "snsLinks");
}

// ページ読み込み後に実行
document.addEventListener("DOMContentLoaded", loadLinks);
