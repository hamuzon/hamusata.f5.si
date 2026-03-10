// ============================================
// js/script-sub.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // 年自動更新
  (function () {
    const baseYear = 2025;
    const now = new Date().getFullYear();
    const el = document.getElementById("year");
    if (el) el.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
  })();

  // テーマ監視 (適用自体はHEAD内のインラインスクリプトで実施済み、ここではシステム設定変更のみを追従)
  if (!new URLSearchParams(window.location.search).has('theme')) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.className = e.matches ? 'dark' : 'light';
    });
  }

  // ハンバーガーメニュー開閉
  (function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    let isAnimating = false;

    function closeMenu() {
      body.classList.remove('menu-open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      body.classList.add('menu-open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAnimating) return;
        isAnimating = true;
        const isOpen = body.classList.contains('menu-open');
        isOpen ? closeMenu() : openMenu();
        setTimeout(() => { isAnimating = false; }, 400);
      });
    }

    // オーバーレイクリックで閉じる
    if (menuOverlay) {
      menuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    // メニュー内リンクをクリックしたら閉じる
    if (mobileMenu) {
      // クリックがメニューの外（overlay）へ伝播しないようにする
      mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // すべてのナビリンクでメニューを閉じる
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
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
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.error('Service Worker registration failed:', error));
    });
  }

});
