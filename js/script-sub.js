// ============================================
// js/script-sub.js 
// ============================================

let currentLang = localStorage.getItem("lang") || "ja";
let langSub = {};

document.addEventListener('DOMContentLoaded', () => {

  // 年自動更新
  (function () {
    const baseYear = 2025;
    const now = new Date().getFullYear();
    const el = document.getElementById("year");
    if (el) el.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
  })();

  // テーマ自動切替
  (function () {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');

    function applyTheme(theme) {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);
    }

    if (themeParam === 'dark' || themeParam === 'light') {
      applyTheme(themeParam);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e) => {
        const tp = new URLSearchParams(window.location.search).get('theme');
        if (tp !== 'dark' && tp !== 'light') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };
      mediaQuery.addEventListener('change', handleThemeChange);
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
    }
  })();

  // ハンバーガーメニュー開閉
  (function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;
    const path = window.location.pathname.toLowerCase();
    const isHiddenPage = path.endsWith('/404') || path.endsWith('/404.html') || path.includes('/teams') || path.includes('teamspage');

    if (isHiddenPage) {
      if (menuToggle) menuToggle.style.display = 'none';
      if (mobileMenu) mobileMenu.style.display = 'none';
      if (menuOverlay) menuOverlay.style.display = 'none';
      body.classList.remove('menu-open');
      return;
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const open = body.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        body.classList.remove('menu-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      });
    }
  })();

  // メニュー内 #home スクロール
  (function () {
    function menuScrollToHome(event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', location.pathname + location.search);
      document.body.classList.remove('menu-open');
      const toggle = document.getElementById('menu-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    document.querySelectorAll('.nav-home').forEach(el => el.addEventListener('click', menuScrollToHome));
  })();

  // PWA: Service Worker 登録
  (function () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.error('Service Worker registration failed:', error));
    }
  })();

});
