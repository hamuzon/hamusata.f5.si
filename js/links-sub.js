// ============================================
// js/links-sub.js 
// ============================================

// 現在の言語 (初期値: ja)
let lang = 'ja';


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

    for (const key in sections) {
      if (sections[key].container) sections[key].container.innerHTML = "";
    }

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

      // タイトル
      const h3 = document.createElement("h3");
      const titleKey = mapTitleToKey(title); // lang.json のキーに変換
      h3.textContent = (window.langData && window.langData[lang][titleKey]) || title;
      card.appendChild(h3);

      // 説明文
      if (description) {
        const p = document.createElement("p");
        const descKey = mapDescToKey(titleKey); // desc キーは titleKey + "_desc"
        p.innerHTML = (window.langData && window.langData[lang][descKey]) || description;
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
        a.textContent = (window.langData && window.langData[lang]["link_view"]) || "見る";
        card.appendChild(a);
      }

      container.appendChild(card);
    });

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

// CSVタイトル → lang.json キーに変換
function mapTitleToKey(title) {
  const map = {
    "HAMUSATA – ホームページ": "w_main_title",
    "GitHub版 – ホームページ": "w_github_pages_title",
    "hamuzon – ホームページ": "w_hamuzon_title",
    "hamuzon (FC2)系 – ホームページ": "w_fc2_title",
    "link-s.f5.si – ショートカットリンクサービス": "w_link_s_title",
    "go.link-s.f5.si – カスタムパス対応版": "w_go_link_title",
    "pw.link-s.f5.si – パスワード生成サービス": "w_pw_title",
    "www.link-s.f5.si - ホームページ": "w_www_title",
    "利用規約・プライバシーポリシー": "w_terms_title",
    "ランダム作品": "random_card_title",
    "サービス稼働状況": "status_card_title",
    "相互リンクページ": "mutual_card_title",
    "Scratch (hamusata)": "sns_scratch1_title",
    "Scratch (hamuzon)": "sns_scratch2_title",
    "GitHub": "sns_github_title",
    "Bluesky": "sns_bsky_title",
    "Twitter (X)": "sns_x_title"
  };
  return map[title] || title;
}

// lang.json では説明文は titleKey + "_desc"
function mapDescToKey(titleKey) {
  return titleKey + "_desc";
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", loadLinks);
