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

    // URLパラメータからID(認識コード)を取得 (?id=... または ?ID=...)
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('id') || params.get('ID');
    // ID指定がある場合は全データから検索（内容が有効なもの）
    const idItem = targetId ? dataRows.find(row => 
      String(row[0]) === targetId && row[1] && String(row[1]).trim() !== "" && String(row[1]).trim() !== "0"
    ) : null;

    const container = document.getElementById("news-list-container");
    // 掲載状態(F列)が "1" ではない、かつ内容(B列)が空や"0"ではないものを有効なデータとする
    const activeRows = dataRows.filter(row => 
      String(row[5] || "") !== "1" && row[1] && String(row[1]).trim() !== "" && String(row[1]).trim() !== "0"
    );

    let displayedInBarRow = null;

    // 1. トップページの固定通知バー制御
    const topNotice = document.getElementById("top-notice");
    if (topNotice) {
      // ID指定を最優先、次に緊急(E)、最後に固定(D)を1件だけ探す
      const reversedRows = [...activeRows].reverse();
      const emergencyItem = reversedRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[4] || "")));
      const pinnedItem = idItem || emergencyItem || reversedRows.find(row => ["1", "true", "TRUE", "on"].includes(String(row[3] || "")));

      if (pinnedItem) {
        displayedInBarRow = pinnedItem;
        const content = pinnedItem[1] || "";
        const textEl = topNotice.querySelector(".notice-text");
        // 表示中アイテムが「緊急」かどうか判定
        const isEmergency = ["1", "true", "TRUE", "on"].includes(String(pinnedItem[4] || ""));

        if (textEl) textEl.textContent = (isEmergency ? "⚠️ 緊急： " : "") + content;
        topNotice.classList.toggle("emergency", isEmergency); // 緊急時のみ赤色
        topNotice.classList.add("show");
      } else {
        topNotice.classList.remove("show");
      }
    }

    // 2. お知らせページ (news.html) のリスト表示
    if (container) {
      // ID指定がある場合はその1件のみ、なければ通常リスト（バー表示分は除く）を表示
      const listRows = idItem ? [idItem] : activeRows.filter(row => row !== displayedInBarRow);

      if (listRows.length === 0) {
        container.innerHTML = `<p>${targetId ? "指定されたお知らせは見つかりませんでした。" : "現在表示できるお知らせはありません。"}</p>`;
      } else {
        container.innerHTML = "";
        [...listRows].reverse().forEach(row => {
          const [code, content, tag, pinned, emergency, status] = row;

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