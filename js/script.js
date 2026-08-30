// js/script.js

// ===== 年自動更新 =====
const baseYear = 2025;
const now = new Date().getFullYear();
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
}

// ===== 季節リンク自動設定 (Season Links) =====
(function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const seasonYear = (month === 1 || month === 2) ? year - 1 : year;

  const season = month >= 3 && month <= 5 ? "spring" :
    month >= 6 && month <= 8 ? "summer" :
      month >= 9 && month <= 11 ? "autumn" : "winter";

  const seasonLinks = {
    spring: "https://home.hamusata.f5.si/spring",
    summer: "https://home.hamusata.f5.si/summer",
    autumn: "https://home.hamusata.f5.si/autumn",
    winter: "https://home.hamusata.f5.si/winter"
  };

  const updateMainLink = () => {
    const mainTitle = document.querySelector('[data-lang="w_main_title"]');
    if (mainTitle) {
      const card = mainTitle.closest('.work-card');
      const link = card ? card.querySelector('a') : null;
      if (link && seasonLinks[season]) {
        link.href = seasonLinks[season];
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateMainLink);
  } else {
    updateMainLink();
  }
})();

if (!new URLSearchParams(window.location.search).has('theme')) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    document.documentElement.className = e.matches ? 'dark' : 'light';
  });
}


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

  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }
})();


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


(function () {
  const currentParams = window.location.search;
  if (!currentParams) return;

  const params = new URLSearchParams(currentParams);
  for (const key of Array.from(params.keys())) {
    if (key === '_gl' || key.startsWith('_ga')) {
      params.delete(key);
    }
  }
  const cleanQuery = params.toString() ? `?${params.toString()}` : '';
  if (!cleanQuery) return;

  const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
  links.forEach(link => {
    if (link.closest('#sns')) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.includes('?')) return;

    if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) return;

    if (href.startsWith('/')) {
      link.href = `${href}${cleanQuery}`;
      return;
    }

    link.href = `${href}${cleanQuery}`;
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
