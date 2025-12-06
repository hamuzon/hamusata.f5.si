// js/script.js

// ===== 年自動更新 =====
const baseYear = 2025;
const now = new Date().getFullYear();
document.getElementById("year").textContent = 
  now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;


// ===== URLパラメータ取得 & テーマ適用 =====
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');

if (themeParam === 'dark' || themeParam === 'light') {
  document.body.className = themeParam;
} else {
  function applyTheme() {
    document.body.className = 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme();

  window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', applyTheme);
}


// ===== ハンバーガーメニュー開閉 =====
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');

menuToggle.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

menuOverlay.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
});


// ===== #home スクロール処理 =====
function menuScrollToHome(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', ' ');
  document.body.classList.remove('menu-open');
}

document.querySelectorAll('.nav-home')
        .forEach(el => el.addEventListener('click', menuScrollToHome));


// ===== PWA Service Worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(r => console.log('Service Worker registered with scope:', r.scope))
      .catch(e => console.error('Service Worker registration failed:', e));
  });
}


// ===== 内部リンクURLパラメータ維持 =====
(function() {
  const currentParams = window.location.search;
  if (!currentParams) return;

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const url = new URL(link.href, window.location.origin);

    // 外部リンクを除外
    if (url.origin !== window.location.origin) return;

    // すでにクエリがある場合は追加せず
    if (url.search) return;

    url.search = currentParams;
    link.href = url.pathname + url.search + url.hash;
  });
})();
