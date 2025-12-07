// ============================================
// js/links-sub.js
// ============================================

let subLangData = {};

// ============================================
// スプレッドシート読み込み
// ============================================
async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
  const sheetName = "sub";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const sections = {
    portfolio: { container: document.getElementById("portfolioLinks"), name: "ポートフォリオ", default: "読み込み中..." },
    random: { container: document.getElementById("randomLinks"), name: "ランダム作品", default: "読み込み中..." },
    status: { container: document.getElementById("statusLinks"), name: "サービス稼働状況", default: "読み込み中..." },
    "mutual-links": { container: document.getElementById("mutualLinks"), name: "相互リンク", default: "読み込み中..." },
    sns: { container: document.getElementById("snsLinks"), name: "SNS", default: "読み込み中..." }
  };

  Object.values(sections).forEach(sec => {
    if (sec.container) sec.container.innerHTML = `<p>${sec.default}</p>`;
  });

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));
    Object.values(sections).forEach(sec => { if (sec.container) sec.container.innerHTML = ""; });

    const currentLang = document.documentElement.lang || "ja";

    // サブ言語JSONを読み込む
    const langRes = await fetch("/lang/sub-lang.json");
    subLangData = await langRes.json();

    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
      const card = document.createElement("div");
      card.className = "work-card";

      // pwカード専用処理
      if (title === "pw.link-s.f5.si – パスワード生成サービス") {
        card.dataset.langKey = title;
        card.innerHTML = subLangData[currentLang]["pw_html"];
      } else {
        // 画像
        if (image) {
          const img = document.createElement("img");
          img.src = image;
          img.alt = subLangData[currentLang][title] || title;
          img.loading = "lazy";
          img.decoding = "async";
          card.appendChild(img);
        }

        // タイトル
        const h3 = document.createElement("h3");
        h3.dataset.langKey = title;
        h3.textContent = subLangData[currentLang][title] || title;
        card.appendChild(h3);

        // 説明
        if (description) {
          const descDiv = document.createElement("div");
          descDiv.className = "work-description";
          descDiv.dataset.langKey = title + "_desc";
          descDiv.innerHTML = subLangData[currentLang][title + "_desc"] || description;
          card.appendChild(descDiv);
        }

        // リンク
        if (link) {
          const a = document.createElement("a");
          a.dataset.langKey = "link_view";
          const isInternal = ["on","1","true"].includes(String(internalLinkFlag).toLowerCase());

          if (isInternal) {
            const currentParams = new URLSearchParams(window.location.search);
            const themeParam = currentParams.get("theme");
            const newParams = new URLSearchParams();
            if (themeParam) newParams.set("theme", themeParam);
            a.href = link.split("?")[0] + (newParams.toString() ? "?" + newParams.toString() : "");
          } else {
            a.href = link;
          }

          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = subLangData[currentLang]["link_view"] || "View";
          card.appendChild(a);
        }
      }

      container.appendChild(card);
    });

    Object.values(sections).forEach(sec => {
      if (sec.container && sec.container.children.length === 0) {
        sec.container.innerHTML = `<p>${sec.name}の読み込みに失敗</p>`;
      }
    });

  } catch (e) {
    Object.values(sections).forEach(sec => {
      if (sec.container) sec.container.innerHTML = `<p>${sec.name}の読み込みに失敗</p>`;
    });
    console.error("スプレッドシート読み込み失敗:", e);
  }
}

// ============================================
// 言語切替関数
// ============================================
function switchSubLang(lang) {
  if (!subLangData[lang]) return;

  document.querySelectorAll(".work-card").forEach(card => {
    const key = card.dataset.langKey;

    // pwカードの場合はHTML入れ替え
    if (key === "pw.link-s.f5.si – パスワード生成サービス" && subLangData[lang]["pw_html"]) {
      card.innerHTML = subLangData[lang]["pw_html"];
    } else {
      card.querySelectorAll("[data-lang-key]").forEach(el => {
        const elKey = el.dataset.langKey;
        if (subLangData[lang][elKey]) {
          if (el.tagName === "IMG") {
            el.alt = subLangData[lang][elKey];
          } else if (el.classList.contains("work-description")) {
            el.innerHTML = subLangData[lang][elKey];
          } else {
            el.textContent = subLangData[lang][elKey];
          }
        }
      });
    }
  });
}

// ============================================
// 初期ロード
// ============================================
document.addEventListener("DOMContentLoaded", loadLinks);
