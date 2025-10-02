// js/script.js

// 年自動更新
const baseYear = 2025;
const now = new Date().getFullYear();
document.getElementById("year").textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;

// URLパラメータ取得
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');

// URL指定があればそれを優先
if (themeParam === 'dark' || themeParam === 'light') {
  document.body.className = themeParam;
} else {
  // URL指定がなければOS設定で自動切替
  function applyTheme() {
    document.body.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
}

// ハンバーガーメニュー開閉処理
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
menuToggle.addEventListener('click', () => { document.body.classList.toggle('menu-open'); });
menuOverlay.addEventListener('click', () => { document.body.classList.remove('menu-open'); });

// メニュー内 #home 用（スクロール＆ハッシュ削除）
function menuScrollToHome(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', ' ');
  document.body.classList.remove('menu-open');
}
document.querySelectorAll('.nav-home').forEach(el => el.addEventListener('click', menuScrollToHome));

// Cookieバナー制御
const cookieBanner = document.getElementById('cookie-banner');

function showCookieBanner() {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    cookieBanner.style.display = 'block';
  }
}

function loadGA(minimal) {
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
  };
}

function acceptCookies(type) {
  localStorage.setItem('cookieConsent', type);
  cookieBanner.style.display = 'none';

  if (type === 'all') {
    loadGA(false);
  } else if (type === 'minimal') {
    loadGA(true);
  }
}

document.getElementById('minimal-cookie').addEventListener('click', () => acceptCookies('minimal'));
document.getElementById('accept-all-cookie').addEventListener('click', () => acceptCookies('all'));
document.getElementById('reject-cookie').addEventListener('click', () => acceptCookies('reject'));

const consent = localStorage.getItem('cookieConsent');
if (consent === 'minimal') {
  loadGA(true);
} else if (consent === 'all') {
  loadGA(false);
} else if (consent === 'reject') {
  // 拒否は何もしない
} else {
  showCookieBanner();
}

// PWA: Service Worker 登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}