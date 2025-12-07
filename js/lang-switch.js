// js/lang-switch.js
const langSwitchButtons = document.querySelectorAll("#lang-switch button");
let currentLang = localStorage.getItem("lang") || "ja";

async function loadLang(lang) {
    const res = await fetch(`/lang/${lang}.json`);
    const data = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) el.textContent = data[key];
    });

    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
    currentLang = lang;
}

langSwitchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        loadLang(btn.dataset.lang);
    });
});

// 初期読み込み
loadLang(currentLang);
