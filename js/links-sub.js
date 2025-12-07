// ============================================
// js/links-sub.js
// ============================================

let subLangData = {};

// ============================================
// リンク読み込み関数
// ============================================
async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
  const sheetName = "sub";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const sections = {
    portfolio: {
      container: document.getElementById("portfolioLinks"),
      name: "ポートフォリオ",
      default: "読み込み中..."
    },
    random: {
      container: document.getElementById("randomLinks"),
      name: "ランダム作品",
      default: "読み込み中..."
    },
    status: {
      container: document.getElementById("statusLinks"),
      name: "サービス稼働状況",
      default: "読み込み中..."
    },
    "mutual-links": {
      container: document.getElementById("mutualLinks"),
      name: "相互リンク",
      default: "読み込み中..."
    },
    sns: {
      container: document.getElementById("snsLinks"),
      name: "SNS",
      default: "読み込み中..."
    }
  };

  // 各セクションに読み込み中メッセージを表示
  Object.values(sections).forEach(sec => {
    if (sec.container) sec.container.innerHTML = `<p>${sec.default}</p>`;
  });

  try {
    // スプレッドシートからデータ取得
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    // セクションを空にする
    Object.values(sections).forEach(sec => {
      if (sec.container) sec.container.innerHTML = "";
    });

    // 季節リンク
    const seasonLinks = {
      spring: "https://home.hamusata.f5.si/spring",
      summer: "https://home.hamusata.f5.si/summer",
      autumn: "https://home.hamusata.f5.si/autumn",
      winter: "https://home.hamusata.f5.si/winter"
    };
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5
      ? "spring"
      : month >= 6 && month <= 8
        ? "summer"
        : month >= 9 && month <= 11
          ? "autumn"
          : "winter";

    // 現在の言語
    const currentLang = document.documentElement.lang || "ja";

    // 言語JSONを読み込む
    const langRes = await fetch("/lang/sub-lang.json");
    subLangData = await langRes.json();

    // 各行を処理
    rows.slice(1).forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;

      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
      const card = document.createElement("div");
      card.className = "work-card";
      card.dataset.langKey = title;

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

        // pwカード特殊処理
        if (title === "pw.link-s.f5.si – パスワード生成サービス") {
          a.href = link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = currentLang === "ja" ? "見る / View" : "View";
          card.appendChild(a);

          // note と APIなし版
          const noteDiv = document.createElement("div");
          noteDiv.className = "note";
          noteDiv.innerHTML = subLangData[currentLang]["pw_html_note"] || "";
          card.appendChild(noteDiv);

        } else {
          // 内部リンクの場合
          const isInternal = ["on","1","true"].includes(String(internalLinkFlag).toLowerCase());
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
          a.textContent = subLangData[currentLang]["link_view"] || "View";
          card.appendChild(a);
        }
      }

      container.appendChild(card);
    });

  } catch (e) {
    // エラー時
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
    const title = card.dataset.langKey;

    if (title === "pw.link-s.f5.si – パスワード生成サービス") {
      // タイトル
      const h3 = card.querySelector("h3");
      if (h3) h3.textContent = subLangData[lang][title] || title;

      // リンクボタン
      const a = card.querySelector("a");
      if (a) a.textContent = lang === "ja" ? "見る / View" : "View";

      // note
      const noteDiv = card.querySelector(".note");
      if (noteDiv) noteDiv.innerHTML = subLangData[lang]["pw_html_note"] || "";

    } else {
      // 一般カード
      const h3 = card.querySelector("h3");
      if (h3 && subLangData[lang][title]) h3.textContent = subLangData[lang][title];

      const desc = card.querySelector(".work-description");
      if (desc && subLangData[lang][title + "_desc"]) desc.innerHTML = subLangData[lang][title + "_desc"];

      const a = card.querySelector("a");
      if (a) a.textContent = subLangData[lang]["link_view"] || "View";
    }
  });
}

// ============================================
// 初期ロード
// ============================================
document.addEventListener("DOMContentLoaded", loadLinks);
