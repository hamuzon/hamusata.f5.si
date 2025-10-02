// js/style-links.js

// ===== 年自動更新 =====
const baseYear = 2025;
const now = new Date().getFullYear();
document.getElementById("year").textContent = now > baseYear ? `${baseYear}~${now}` : baseYear;

// ===== URLパラメータ取得 & テーマ適用 =====
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');

if(themeParam === 'dark' || themeParam === 'light'){
    document.body.className = themeParam;
} else {
    function applyTheme() {
        document.body.className =
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', applyTheme);
}

// ===== 相互リンク読み込み =====
async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
    const sheetName = "相互リンク";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    const container = document.getElementById("mutualLinks");

    container.innerHTML = '<div class="sougolink">読み込み中...</div>';

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        container.innerHTML = ""; // 初期値削除

        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;
            if (!link && !title) return;

            const card = document.createElement("div");
            card.className = "sougolink";

            if (image) {
                const img = document.createElement("img");
                img.src = image;
                img.alt = title;
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
                a.textContent = "リンクを開く / Open";
                card.appendChild(a);
            }

            container.appendChild(card);
        });

        if (container.children.length === 0) {
            container.innerHTML = '<div class="sougolink">相互リンクの読み込みに失敗</div>';
        }

    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="sougolink">相互リンクの読み込みに失敗</div>';
    }
}

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
