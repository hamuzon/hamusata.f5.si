// js/news.js
async function loadNewsData() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
  const sheetName = "news";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));
    const dataRows = rows.slice(1); // スプレッドシートの1行目（ヘッダー）を飛ばす

    const container = document.getElementById("news-list-container");
    // 掲載状態(F列/index 5)が "1" ではないものを有効なデータとする
    const activeRows = dataRows.filter(row => String(row[5] || "") !== "1");

    let displayedInBarRow = null;

    // 1. トップページの固定通知バー制御
    const topNotice = document.getElementById("top-notice");
    if (topNotice) {
      // 最新（後ろの行）から、緊急(E)を最優先、次に固定(D)を1件だけ探す
      const reversedRows = [...activeRows].reverse();
      const emergencyItem = reversedRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[4] || "")));
      const pinnedItem = emergencyItem || reversedRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[3] || "")));

      if (pinnedItem) {
        displayedInBarRow = pinnedItem;
        const content = pinnedItem[1] || "";
        const textEl = topNotice.querySelector(".notice-text");

        if (textEl) textEl.textContent = (emergencyItem ? "⚠️ 緊急： " : "") + content;
        topNotice.classList.toggle("emergency", !!emergencyItem); // 緊急時のみ赤色
        topNotice.classList.add("show");
      } else {
        topNotice.classList.remove("show");
      }
    }

    // 2. お知らせページ (news.html) のリスト表示
    if (container) {
      // トップバーに出している記事はリストから除外して二重表示を防ぐ
      const listRows = activeRows.filter(row => row !== displayedInBarRow);

      if (listRows.length === 0) {
        container.innerHTML = "<p>お知らせはありませんでした。</p>";
      } else {
        container.innerHTML = "";
        [...listRows].reverse().forEach(row => {
          const [code, content, tag, pinned, emergency, status] = row;
          if (!content || String(content).trim() === "" || String(content).trim() === "0") return; // 内容が空、または「0」の場合はスキップ

          const statusTag = tag || (emergency ? "緊急" : "通知");

          const article = document.createElement("article");
          article.className = "news-item";
          if (emergency) article.style.borderLeft = "4px solid #ff5252";

          article.innerHTML = `
            <div class="news-header">
              <span class="news-tag">${statusTag}</span>
            </div>
            <p class="news-content">${content}</p>
          `;
          container.appendChild(article);
        });
      }
    }
  } catch (e) { 
    console.error("News load failed:", e);
    const container = document.getElementById("news-list-container");
    if (container) container.innerHTML = "<p>お知らせの取得に失敗しました。</p>";
  }
}
document.addEventListener("DOMContentLoaded", loadNewsData);