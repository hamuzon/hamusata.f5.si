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

    // 有効なデータが空の場合の処理
    if (activeRows.length === 0) {
      if (container) container.innerHTML = "<p>現在お知らせはありません。</p>";
    }

    // 1. トップページの固定通知バー制御
    const topNotice = document.getElementById("top-notice");
    if (topNotice) {
      // 有効なデータの中から 緊急事態(E列/index 4)を最優先、次に固定(D列/index 3)を探す
      const emergencyItem = activeRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[4] || "")));
      const pinnedItem = emergencyItem || activeRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[3] || "")));

      if (pinnedItem) {
        const content = pinnedItem[1] || "";
        const textEl = topNotice.querySelector("[data-lang='top_notice_text']");

        if (textEl) textEl.textContent = (emergencyItem ? "⚠️ 緊急： " : "") + content;
        if (emergencyItem) topNotice.classList.add("emergency"); // 赤色アニメーション用
        topNotice.classList.add("show");
      } else {
        topNotice.classList.remove("show");
      }
    }

    // 2. お知らせページ (news.html) のリスト表示
    if (container) {
      container.innerHTML = "";
      [...activeRows].reverse().forEach(row => {
        const [code, content, tag, pinned, emergency, status] = row;
        if (!content) return; // 内容が空の行はスキップ

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
  } catch (e) { 
    console.error("News load failed:", e);
    const container = document.getElementById("news-list-container");
    if (container) container.innerHTML = "<p>お知らせの取得に失敗しました。時間をおいて再度お試しください。</p>";
  }
}
document.addEventListener("DOMContentLoaded", loadNewsData);