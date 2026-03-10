// js/script.js

document.addEventListener('DOMContentLoaded', () => {

  // ===== 年自動更新 =====
  (function() {
    const baseYear = 2025;
    const now = new Date().getFullYear();
    const el = document.getElementById("year");
    if (el) el.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
  })();

  // ===== URLパラメータ取得 & テーマ適用 =====
  (function() {
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
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
  })();

  // ===== ハンバーガーメニュー開閉 =====
  (function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuToggle && menuOverlay) {
      menuToggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
      menuOverlay.addEventListener('click', () => document.body.classList.remove('menu-open'));
    }
  })();

  // ===== #home スクロール処理 =====
  (function() {
    function menuScrollToHome(event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', ' ');
      document.body.classList.remove('menu-open');
    }
    document.querySelectorAll('.nav-home').forEach(el => el.addEventListener('click', menuScrollToHome));
  })();

  // ===== PWA Service Worker =====
  (function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(r => console.log('Service Worker registered with scope:', r.scope))
          .catch(e => console.error('Service Worker registration failed:', e));
      });
    }
  })();

  // ===== 内部リンクURLパラメータ維持 =====
  (function() {
    const currentParams = window.location.search;
    if (!currentParams) return;
    document.querySelectorAll('a[href]').forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin || url.search) return;
        url.search = currentParams;
        link.href = url.pathname + url.search + url.hash;
      } catch (e) {
        // 無効なhref値は無視
      }
    });
  })();
});
