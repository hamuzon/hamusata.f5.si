// /js/style-links.js

// =========================
// スプレッドシートからリンク読み込み
// =========================
async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
    const sheetName = "links";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    // 表示対象セクション
    const containers = {
        "mutual-links": document.querySelector(".works")
        // 他のセクションが増えたらここに追加可能
    };

    // 読み込み中表示
    Object.values(containers).forEach(c => {
        if(c) c.innerHTML = "<p>読み込み中…</p>";
    });

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(
            text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]
        );

        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        // 1行目はヘッダーなので除く
        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;
            if (!section || !containers[section]) return;

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
                h3.className = "zenmaru";
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

            containers[section].appendChild(card);
        });

    } catch (e) {
        console.error("links の読み込みに失敗:", e);
        Object.values(containers).forEach(c => {
            if(c) c.innerHTML = "<p>links の読み込みに失敗</p>";
        });
    }
}

// =========================
// 内部リンクURLパラメータ維持
// =========================
function maintainInternalParams() {
    const currentParams = window.location.search;
    if (!currentParams) return;

    document.querySelectorAll('a[href]').forEach(link => {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.search) return;
        url.search = currentParams;
        link.href = url.pathname + url.search + url.hash;
    });
}

// =========================
// 年自動更新
// =========================
function updateYear() {
    const baseYear = 2025;
    const currentYear = new Date().getFullYear();
    const el = document.getElementById("year");
    if(el) el.textContent = currentYear > baseYear ? `${baseYear}~${currentYear}` : baseYear;
}

// =========================
// テーマ適用
// =========================
function applyThemeFromParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');

    if(themeParam === 'dark' || themeParam === 'light'){
        document.body.className = themeParam;
    } else {
        const applyTheme = () => {
            document.body.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };
        applyTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
}

// =========================
// ページ読み込み時に実行
// =========================
document.addEventListener("DOMContentLoaded", () => {
    loadLinks();
    maintainInternalParams();
    updateYear();
    applyThemeFromParam();
});
