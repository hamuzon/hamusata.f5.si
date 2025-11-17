// ============================================
// js/script-sub.js
// ============================================

// ページ読み込み後に処理
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

    if (themeParam === 'dark' || themeParam === 'light') {
      document.body.className = themeParam;
    } else {
      function applyTheme() {
        document.body.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      applyTheme();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
  })();

  // ハンバーガーメニュー開閉処理（aria更新）
  (function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

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

  // メニュー内 #home 用（スクロール＆ハッシュ削除）
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

  // Cookieバナー制御 & GA
  (function () {
    const cookieBanner = document.getElementById('cookie-banner');
    if (!cookieBanner) return;

    function showCookieBanner() {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) cookieBanner.style.display = 'block';
    }

    function loadGA(minimal) {
      if (window.__GA_LOADED__) return;
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.setAttribute('data-cfasync', 'false');
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-E3VWGLZJ27';
      document.head.appendChild(gtagScript);

      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        if (minimal) {
          gtag('config', 'G-E3VWGLZJ27', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        } else {
          gtag('config', 'G-E3VWGLZJ27');
        }
        window.__GA_LOADED__ = true;
      };
    }

    function acceptCookies(type) {
      localStorage.setItem('cookieConsent', type);
      cookieBanner.style.display = 'none';
      if (type === 'all') loadGA(false);
      else if (type === 'minimal') loadGA(true);
    }

    const btnMinimal = document.getElementById('minimal-cookie');
    const btnAll = document.getElementById('accept-all-cookie');
    const btnReject = document.getElementById('reject-cookie');

    if (btnMinimal) btnMinimal.addEventListener('click', () => acceptCookies('minimal'));
    if (btnAll) btnAll.addEventListener('click', () => acceptCookies('all'));
    if (btnReject) btnReject.addEventListener('click', () => acceptCookies('reject'));

    // 初期表示
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'minimal') loadGA(true);
    else if (consent === 'all') loadGA(false);
    else if (consent === 'reject') cookieBanner.style.display = 'none';
    else showCookieBanner();
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