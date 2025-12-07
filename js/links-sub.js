// ============================================
// js/links-sub.js
// ============================================

let subLangData = {};

// ============================================
// リンク読み込み関数
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

  // 読み込み中表示
  for (const key in sections) {
    if (sections[key].container) {
      sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
    }
  }

  try {
    // スプレッドシート取得
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    // 各セクション初期化
    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = "";
    }

    // 季節リンク
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

    // 言語データ取得
    const langRes = await fetch("lang/sub-lang.json");
    subLangData = await langRes.json();
    const lang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");

    // 各行処理
    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;

      // pwカード特殊処理
      if (title === "pw.link-s.f5.si – パスワード生成サービス") {
        const pwHTML = subLangData[lang]["pw_html"] || "";
        const div = document.createElement("div");
        div.innerHTML = pwHTML;
        container.appendChild(div.firstElementChild); // 1枚のカードだけ追加
        return;
      }

      // 通常カード
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
      h3.innerHTML = langDataOrDefault(title, lang, subLangData);
      h3.dataset.langKey = title;
      card.appendChild(h3);

      // 説明
      if (description) {
        const p = document.createElement("p");
        p.innerHTML = langDataOrDefault(title + "_desc", lang, subLangData, description);
        p.dataset.langKey = title + "_desc";
        card.appendChild(p);
      }

      // リンク
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
        a.innerHTML = langDataOrDefault("link_view", lang, subLangData, "View");
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
    for (const key in sections) {
      if (sections[key].container) {
        sections[key].container.innerHTML = `<p>${sections[key].name}の読み込みに失敗</p>`;
      }
    }
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// ============================================
// 言語切替用ヘルパー
// ============================================
function langDataOrDefault(key, lang, data, defaultText) {
  if (!data[lang]) return defaultText || key;
  return data[lang][key] || defaultText || key;
}

// ============================================
// 初期ロード
// ============================================
document.addEventListener("DOMContentLoaded", loadLinks);