// /js/style-links.js

async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
    const sheetName = "links";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    // 表示対象セクションの初期値
    const containers = {
        portfolio: document.getElementById("portfolioLinks"),
        random: document.getElementById("randomLinks"),
        status: document.getElementById("statusLinks"),
        "mutual-links": document.getElementById("mutualLinks"),
        sns: document.getElementById("snsLinks")
    };

    // 初期表示「読み込み中」
    Object.values(containers).forEach(container => {
        if (container) {
            container.innerHTML = "<p>読み込み中…</p>";
        }
    });

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(
            text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]
        );

        const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

        // 1行目はヘッダーなので除く
        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;
            if (!section || !containers[section]) return;

            const container = containers[section];

            const card = document.createElement("div");
            card.className = "sougolink";

            if (image) {
                const img = document.createElement("img");
                img.src = image;
                img.alt = title || "";
                img.loading = "lazy";
                img.decoding = "async";
                card.appendChild(img);
            }

            if (title) {
                const h3 = document.createElement("h3");
                h3.textContent = title;
                card.appendChild(h3);
            }

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
                a.textContent = "開く / Open";
                card.appendChild(a);
            }

            container.appendChild(card);
        });

    } catch (e) {
        console.error("links の読み込みに失敗:", e);
        Object.values(containers).forEach(container => {
            if (container) {
                container.innerHTML = "<p>links の読み込みに失敗</p>";
            }
        });
    }
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", loadLinks);


// ===== 内部リンクURLパラメータ維持 =====
(function() {
    const currentParams = window.location.search;
    if (!currentParams) return;

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const url = new URL(link.href, window.location.origin);

        if (url.origin !== window.location.origin) return;
        if (url.search) return;

        url.search = currentParams;
        link.href = url.pathname + url.search + url.hash;
    });
})();
