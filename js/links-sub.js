// ============================================
// js/links-sub.js - 言語対応版
// ============================================

let langSub = {};
let currentLang = localStorage.getItem("lang") || "ja";
let rowsData = []; // スプレッドデータ保持

// lang-sub.json 読み込み
fetch("lang/sub-lang.json")
  .then(res => res.json())
  .then(json => langSub = json);

async function loadLinks() {
  const sheetId = "1qmVe96zjuYFmwdvvdAaVTxcFdT7BfytFXSUM6SPb5Qg";
  const sheetName = "sub";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const sections = {
    portfolio: document.getElementById("portfolioLinks"),
    random: document.getElementById("randomLinks"),
    status: document.getElementById("statusLinks"),
    "mutual-links": document.getElementById("mutualLinks"),
    sns: document.getElementById("snsLinks")
  };

  for(const key in sections){
    if(sections[key]) sections[key].innerHTML = "<p>読み込み中...</p>";
  }

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/)[1]);
    rowsData = json.table.rows.map(r => r.c.map(c => (c?c.v:"")));

    renderLinks(currentLang, sections);

  } catch(e){
    console.error("読み込み失敗", e);
  }
}

// カード描画
function renderLinks(lang, sections) {
  if(!rowsData.length) return;

  for(const key in sections){
    if(sections[key]) sections[key].innerHTML = "";
  }

  rowsData.slice(1).forEach(row => {
    let [title, description, image, link, section, inside] = row;
    if(!section || !sections[section]) return;

    const container = sections[section];
    const card = document.createElement("div");
    card.className = "work-card";

    if(langSub[lang] && langSub[lang][title]){
      title = langSub[lang][title].title;
      description = langSub[lang][title].desc;
    }

    if(image){
      const img = document.createElement("img");
      img.src = image;
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = title;
    card.appendChild(h3);

    if(description){
      const p = document.createElement("p");
      p.innerHTML = description;
      card.appendChild(p);
    }

    if(link){
      const a = document.createElement("a");
      a.href = link;
      a.target="_blank";
      a.rel="noopener noreferrer";
      a.textContent = lang==="ja"?"見る / View":"View";
      card.appendChild(a);
    }

    container.appendChild(card);
  });
}

// 言語切替用
function switchLinksLang(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  const sections = {
    portfolio: document.getElementById("portfolioLinks"),
    random: document.getElementById("randomLinks"),
    status: document.getElementById("statusLinks"),
    "mutual-links": document.getElementById("mutualLinks"),
    sns: document.getElementById("snsLinks")
  };
  renderLinks(currentLang, sections);
}

// ページ読み込み時
document.addEventListener("DOMContentLoaded", loadLinks);
