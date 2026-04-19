// js/script.js

// ===== 年自動更新 =====
const baseYear = 2025;
const now = new Date().getFullYear();
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
}


// ===== テーマ監視 (適用自体はHEAD内のインラインスクリプトで行い、ここではシステム設定変更のみを追従) =====
if (!new URLSearchParams(window.location.search).has('theme')) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    document.documentElement.className = e.matches ? 'dark' : 'light';
  });
}


// ===== ハンバーガーメニュー開閉 =====
(function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  let isAnimating = false;

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      isAnimating = true;
      const isOpen = document.body.classList.contains('menu-open');
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
  // (ナビリンクはクリックで遷移 or スクロールするためメニューを閉じる)
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


// ===== #home スクロール処理 =====
document.querySelectorAll('.nav-home').forEach(el => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
    document.body.classList.remove('menu-open');
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
});


// ===== 内部リンクURLパラメータ維持 =====
(function() {
  const currentParams = window.location.search;
  if (!currentParams) return;

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    // SNSセクション内のリンクは除外
    if (link.closest('#sns')) return;

    const url = new URL(link.href, window.location.origin);

    // 外部リンクを除外
    if (url.origin !== window.location.origin) return;

    // すでにクエリがある場合は追加せず
    if (url.search) return;

    url.search = currentParams;
    link.href = url.pathname + url.search + url.hash;
  });
})();

// ===== WebMCP Implementation =====
if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "get_site_info",
        description: "Get general information about HAMUSATA homepage and available sections.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        execute: async () => {
          return {
            title: document.title,
            owner: "@hamuzon / @hamusata",
            sections: [
              { id: "profile", name: "Profile / Self-introduction" },
              { id: "portfolio", name: "Portfolio / Work Links" },
              { id: "random", name: "Random Works" },
              { id: "status", name: "Project Status" },
              { id: "mutual-links", name: "Mutual Links" },
              { id: "sns", name: "SNS Links (Scratch, GitHub, Bluesky)" }
            ]
          };
        }
      },
      {
        name: "scroll_to_section",
        description: "Smoothly scrolls the page to a specific section.",
        inputSchema: {
          type: "object",
          properties: {
            sectionId: {
              type: "string",
              enum: ["profile", "portfolio", "random", "status", "mutual-links", "sns"],
              description: "The ID of the section to scroll to."
            }
          },
          required: ["sectionId"]
        },
        execute: async ({ sectionId }) => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return { success: true, message: `Scrolled to ${sectionId}` };
          }
          return { success: false, message: `Section ${sectionId} not found` };
        }
      }
    ]
  });
}
