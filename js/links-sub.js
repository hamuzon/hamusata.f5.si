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

  for (const key in sections) {
    if (sections[key].container) {
      sections[key].container.innerHTML = `<p>${sections[key].default}</p>`;
      sections[key].container.style.minHeight = "200px";
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
    const nowObj = new Date();
    const currentYear = nowObj.getFullYear();
    const month = nowObj.getMonth() + 1;
    const seasonYear = (month === 1 || month === 2) ? currentYear - 1 : currentYear;
    const season = month >= 3 && month <= 5 ? "spring" :
      month >= 6 && month <= 8 ? "summer" :
        month >= 9 && month <= 11 ? "autumn" : "winter";

    // JSONのlangキー取得
    const langDataRes = await fetch("/lang/sub-lang.json");
    const langData = await langDataRes.json();
    const lang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ja");

    const firstRow = rows[0] || [];
    const looksLikeHeader = String(firstRow[4] || "").toLowerCase() === "section";
    const dataRows = looksLikeHeader ? rows.slice(1) : rows;

    dataRows.forEach(row => {
      const [title, description, image, link, section, internalLinkFlag] = row;
      if (!section || !sections[section] || !sections[section].container) return;

      const container = sections[section].container;
      const card = document.createElement("div");
      card.className = "work-card";

      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.loading = "lazy";
        img.className = "work-card-image";
        img.decoding = "async";
        card.appendChild(img);
      }

      const h3 = document.createElement("h3");
      let keyTitle = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_title";
      if (!langData[lang][keyTitle]) keyTitle = title;
      h3.innerHTML = langData[lang][keyTitle] || title;
      h3.dataset.langKey = keyTitle;
      card.appendChild(h3);

      if (description) {
        const p = document.createElement("p");
        let keyDesc = "w_" + title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_desc";
        if (!langData[lang][keyDesc]) keyDesc = description;
        p.innerHTML = langData[lang][keyDesc] || description;
        p.dataset.langKey = keyDesc;
        card.appendChild(p);
      }

      if (link) {
        const a = document.createElement("a");
        const isInternalFlag = ["on", "1", "true"].includes(String(internalLinkFlag).toLowerCase());
        const isInternal = isInternalFlag && section !== "sns";

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

        const viewText = langData[lang]["link_view"] || "View";
        a.innerHTML = viewText;
        a.dataset.langKey = "link_view";
        const h3Text = h3.textContent || title;
        a.setAttribute("aria-label", `${h3Text} ${viewText.split('/')[0].trim()}`);
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

function registerWebMCP() {
  if (typeof navigator !== 'undefined' && navigator.modelContext && navigator.modelContext.provideContext) {
    navigator.modelContext.provideContext({
      tools: [
        {
          name: "open_random_work",
          description: "Opens a random project or tool from hamusata's collection.",
          inputSchema: {
            type: "object",
            properties: {}
          },
          execute: async () => {
            if (typeof openRandomLink === 'function') {
              openRandomLink();
              return { output: "Opened a random work." };
            }
            return { error: "openRandomLink function not found." };
          }
        }
      ]
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadLinks();
  registerWebMCP();
});
