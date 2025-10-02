// js/links-sub.js

async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
    const sheetName = "sub"; // スプレッドシート名
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const container = document.getElementById("mutualLinks"); // 表示先

    // 初期表示
    if (container) container.innerHTML = `<p>読み込み中...</p>`;

    try {
        const res = await fetch(url);
        const text = await res.text();

        // Google Visualization JSON 形式をパース
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        // コンテナ初期化
        if (container) container.innerHTML = "";

        // 1行目はヘッダーなので除外
        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;

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
                a.href = link;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = "見る / View";
                card.appendChild(a);
            }

            if (container) container.appendChild(card);
        });

        // データがない場合の表示
        if (container && container.children.length === 0) {
            container.innerHTML = `<p>読み込みに失敗しました</p>`;
        }

    } catch (e) {
        if (container) container.innerHTML = `<p>読み込みに失敗しました</p>`;
        console.error("スプレッドシート読み込み失敗:", e);
    }
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", loadLinks);
