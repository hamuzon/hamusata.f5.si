async function loadLinks() {
    const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const sections = {
        portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
        random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
        status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
        "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
        sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
    };

    // 初期値セット
    for (const key in sections) {
        if (sections[key].container) {
            sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
        }
    }

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        // セクションごとに初期化
        for (const key in sections) {
            if (sections[key].container) sections[key].container.innerHTML = "";
        }

        rows.slice(1).forEach(row => {
            const [title, description, image, link, section] = row;
            if (!section || !sections[section] || !sections[section].container) return;

            const container = sections[section].container;

            const card = document.createElement("div");
            card.className = "sougolink"; 

            if (link) {
                const a = document.createElement("a");
                a.href = link;
                a.target = "_blank";
                a.rel = "noopener noreferrer";

                if (image) {
                    const img = document.createElement("img");
                    img.src = image;
                    img.alt = title;
                    img.loading = "lazy";
                    img.decoding = "async";
                    a.appendChild(img);
                }

                const hTitle = document.createElement("h3");
                hTitle.textContent = title;
                hTitle.className = "zenmaru";
                a.appendChild(hTitle);

                if (description) {
                    const hDesc = document.createElement("h3");
                    hDesc.textContent = description;
                    hDesc.className = "zenmaru";
                    a.appendChild(hDesc);
                }

                card.appendChild(a);
            } else {
                if (image) {
                    const img = document.createElement("img");
                    img.src = image;
                    img.alt = title;
                    img.loading = "lazy";
                    img.decoding = "async";
                    card.appendChild(img);
                }

                const hTitle = document.createElement("h3");
                hTitle.textContent = title;
                hTitle.className = "zenmaru";
                card.appendChild(hTitle);

                if (description) {
                    const hDesc = document.createElement("h3");
                    hDesc.textContent = description;
                    hDesc.className = "zenmaru";
                    card.appendChild(hDesc);
                }
            }

            container.appendChild(card);
        });

        // データがない場合の表示
        for (const key in sections) {
            if (sections[key].container && sections[key].container.children.length === 0) {
                sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
            }
        }

    } catch (e) {
        for (const key in sections) {
            if (sections[key].container) {
                sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
            }
        }
        console.error("スプレッドシート読み込み失敗:", e);
    }
}

document.addEventListener("DOMContentLoaded", loadLinks);
