// js/script.js

document.addEventListener('DOMContentLoaded', () => {

  // ===== 年自動更新 =====
  (function () {
    const baseYear = 2025;
    const now = new Date().getFullYear();
    const el = document.getElementById("year");
    if (el) el.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
  })();

  // ===== テーマ判定 & 同期 (URL優先 -> 端末設定) =====
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

  // ===== ハンバーガーメニュー開閉 =====
  (function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuToggle && mobileMenu && menuOverlay) {
      let lock = false;

      function setMenuState(isOpen) {
        if (lock) return;
        lock = true;
        document.body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        window.setTimeout(() => { lock = false; }, 220);
      }

      menuToggle.setAttribute('aria-controls', 'mobile-menu');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');

      menuToggle.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setMenuState(!document.body.classList.contains('menu-open'));
      });

      menuOverlay.addEventListener('click', () => setMenuState(false));
      mobileMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenuState(false);
      });
    }
  })();

  // ===== #home スクロール処理 =====
  (function () {
    function menuScrollToHome(event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', ' ');
      document.body.classList.remove('menu-open');
    }
    document.querySelectorAll('.nav-home').forEach(el => el.addEventListener('click', menuScrollToHome));
  })();

  // ===== PWA Service Worker =====
  (function () {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(r => console.log('Service Worker registered with scope:', r.scope))
          .catch(e => console.error('Service Worker registration failed:', e));
      });
    }
  })();

  // ===== 内部リンクURLパラメータ維持 =====
  (function () {
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
