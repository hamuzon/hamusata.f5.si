// ============================================
// js/links-sub.js
// ============================================

async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
  const sheetName = "sub"; // シート名
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  // セクション初期値設定
  const sections = {
    portfolio: { container: document.getElementById("portfolioLinks"), default: "読み込み中..." },
    random: { container: document.getElementById("randomLinks"), default: "読み込み中..." },
    status: { container: document.getElementById("statusLinks"), default: "読み込み中..." },
    "mutual-links": { container: document.getElementById("mutualLinks"), default: "読み込み中..." },
    sns: { container: document.getElementById("snsLinks"), default: "読み込み中..." }
  };

  // 初期表示
  for (const key in sections) {
    if (sections[key].container) {
      sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
    }
  }

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    // セクション初期化
    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = "";
    }

    // 季節リンク定義
    const seasonLinks = {
      spring: "https://home.hamusata.f5.si/spring",
      summer: "https://home.hamusata.f5.si/summer",
      autumn: "https://home.hamusata.f5.si/autumn",
      winter: "https://home.hamusata.f5.si/winter"
    };
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5 ? "spring" :
                   month >= 6 && month <= 8 ? "summer" :
                   month >= 9 && month <= 11 ? "autumn" : "winter";

    // リンクカード生成
    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, insideFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
      const card = document.createElement("div");
      card.className = "work-card";

      // 画像
      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.loading = "lazy";
        img.decoding = "async";
        card.appendChild(img);
      }

      // タイトル
      const h3 = document.createElement("h3");
      h3.textContent = title;
      card.appendChild(h3);

      // 説明文
      if (description) {
        const p = document.createElement("p");
        p.innerHTML = description;
        card.appendChild(p);
      }

      // リンク
      if (link) {
        const a = document.createElement("a");
        const isInternal = ["on", "1", "true"].includes(String(insideFlag).toLowerCase());

        if (isInternal) {
          // 内部リンクは ?theme= パラメータ保持
          const currentParams = new URLSearchParams(window.location.search);
          const themeParam = currentParams.get("theme");
          const newParams = new URLSearchParams();
          if (themeParam) newParams.set("theme", themeParam);
          a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
        } else if (title.includes("HAMUSATA – ホームページ") && section === "portfolio") {
          a.href = seasonLinks[season] || link;
        } else {
          a.href = link;
        }

        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "見る / View";
        card.appendChild(a);

        // pw.link-s.f5.si 特殊処理
        if (title.includes("pw.link-s.f5.si")) {
          const note = document.createElement("p");
          note.className = "note";
          note.innerHTML = "※リダイレクトがうまくできない場合はこちらを利用してください。";
          card.appendChild(note);

          const apiLink = document.createElement("a");
          apiLink.href = "https://password-create.link-s.f5.si/";
          apiLink.textContent = "APIなし版 / Non-API version";
          apiLink.target = "_blank";
          apiLink.rel = "noopener noreferrer";
          card.appendChild(apiLink);
        }
      }

      container.appendChild(card);
    });

    // データがない場合
    for (const key in sections) {
      if (sections[key].container && sections[key].container.children.length === 0) {
        sections[key].container.innerHTML = `<p>${sections[key].default}の読み込みに失敗</p>`;
      }
    }

  } catch (e) {
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].default}の読み込みに失敗</p>`;
      }
    }
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", loadLinks);
