// js/links.js

async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    // ===== セクション定義 =====
    const sections = {
        portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
        random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
        status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
        "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
        sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
    };

    // ===== 初期値セット =====
    for (const key in sections) {
        if (sections[key].container) {
            sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
        }
    }

    try {
        // ===== スプレッドシート取得 =====
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        // ===== セクション初期化 =====
        for (const key in sections) {
            if (sections[key].container) sections[key].container.innerHTML = "";
        }

        // ===== データ行をカード化 =====
        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;
            if (!section || !sections[section] || !sections[section].container) return;

            const container = sections[section].container;

            // カード全体をリンク化
            const cardLink = document.createElement("a");
            cardLink.className = "sougolink";
            cardLink.href = link || "#";
            cardLink.target = "_blank";
            cardLink.rel = "noopener noreferrer";

            // 画像
            if (image) {
                const img = document.createElement("img");
                img.src = image;
                img.alt = title;
                img.loading = "lazy";
                img.decoding = "async";
                cardLink.appendChild(img);
            }

            // タイトル
            const hTitle = document.createElement("h3");
            hTitle.textContent = title;
            hTitle.className = "zenmaru";
            cardLink.appendChild(hTitle);

            // 説明
            if (description) {
                const hDesc = document.createElement("h3");
                hDesc.textContent = description;
                hDesc.className = "zenmaru";
                cardLink.appendChild(hDesc);
            }

            container.appendChild(cardLink);
        });

        // ===== データがない場合の表示 =====
        for (const key in sections) {
            if (sections[key].container && sections[key].container.children.length === 0) {
                sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
            }
        }

    } catch (e) {
        // ===== 読み込み失敗時 =====
        for (const key in sections) {
            if (sections[key].container) {
                sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
            }
        }
        console.error("スプレッドシート読み込み失敗:", e);
    }
}

// ===== ページ読み込み時に実行 =====
document.addEventListener("DOMContentLoaded", loadLinks);
