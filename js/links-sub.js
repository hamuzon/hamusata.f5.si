// ============================================
// js/links-sub.js
// ============================================

async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg"; // スプレッドシートID
  const sheetName = "sub"; // シート名
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const sections = {
    portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
    random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
    status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
    "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
    sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
  };

  // ローディング表示
  for (const key in sections) {
    if (sections[key].container) {
      sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
    }
  }

  try {
    // --- スプレッドシート読み込み ---
    const res = await fetch(url);
    if (!res.ok) throw new Error(`スプレッドシート取得失敗: ${res.status}`);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    // --- 言語JSON読み込み ---
    const langDataRes = await fetch("lang/sub-lang.json");
    if (!langDataRes.ok) throw new Error(`lang JSON取得失敗: ${langDataRes.status}`);
    const langData = await langDataRes.json();
    const lang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");

    // --- セクション初期化 ---
    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = "";
    }

    // --- 季節リンク設定 ---
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

    // --- カード作成 ---
    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;
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

      // タイトル（翻訳対応）
      const h3 = document.createElement("h3");
      const keyTitle = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_title";
      h3.innerHTML = langData[lang][keyTitle] || langData[lang][title] || title;
      h3.dataset.langKey = keyTitle;
      card.appendChild(h3);

      // 説明（タグ対応 & 翻訳）
      if (description) {
        const p = document.createElement("p");
        const keyDesc = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_desc";
        const descText = langData[lang][keyDesc] || langData[lang][description] || description;
        p.innerHTML = descText; // innerHTMLでタグ対応
        p.dataset.langKey = keyDesc;
        card.appendChild(p);
      }

      // リンク（タグ対応 & 翻訳）
      if (link) {
        const a = document.createElement("a");
        const isInternal = ["on", "1", "true"].includes(String(internalLinkFlag).toLowerCase());

        if (isInternal) {
          const currentParams = new URLSearchParams(window.location.search);
          const themeParam = currentParams.get("theme");
          const newParams = new URLSearchParams();
          if (themeParam) newParams.set("theme", themeParam);

          a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
        } else if (title === "HAMUSATA – ホームページ" && section === "portfolio") {
          a.href = seasonLinks[season] || link;
        } else {
          a.href = link;
        }

        a.target = "_blank";
        a.rel = "noopener noreferrer";

        // 翻訳対応
        a.innerHTML = langData[lang]["link_view"] || "View";
        a.dataset.langKey = "link_view";
        card.appendChild(a);
      }

      container.appendChild(card);
    });

    // データなし対応
    for (const key in sections) {
      if (sections[key].container && sections[key].container.children.length === 0) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }

  } catch (e) {
    console.error("スプレッドシート読み込み失敗:", e);
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", loadLinks);