// js/script.js

// ===== 年自動更新 =====
const baseYear = 2025;
const now = new Date().getFullYear();
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = now > baseYear ? `${baseYear}~${now}` : `${baseYear}`;
}

(function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const seasonYear = (month === 1 || month === 2) ? year - 1 : year;

  const season = month >= 3 && month <= 5 ? "spring" :
    month >= 6 && month <= 8 ? "summer" :
      month >= 9 && month <= 11 ? "autumn" : "winter";

  const getSpecialEventPath = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (month === 1 && day <= 3) return "newyear";
    if (month === 2 && day === 14) return "chocolate";
    if (month === 3 && day === 14) return "whiteday";
    if (month === 4 && day === 1) return "aprilfool";
    if (month === 12 && (day === 24 || day === 25)) return "christmas";

    const setsubunRanges = [
      [1873, 1884, 3, 3, 3, 3],
      [1885, 1900, 2, 3, 3, 3],
      [1901, 1917, 3, 4, 4, 4],
      [1918, 1954, 3, 3, 4, 4],
      [1955, 1987, 3, 3, 3, 4],
      [1988, 2020, 3, 3, 3, 3],
      [2021, 2057, 2, 3, 3, 3],
      [2058, 2090, 2, 2, 3, 3],
      [2091, 2100, 2, 2, 2, 3],
      [2101, 2123, 3, 3, 3, 4]
    ];
    const range = setsubunRanges.find(([startYear, endYear]) => year >= startYear && year <= endYear);
    if (month === 2 && range) {
      const remainder = year % 4;
      const setsubunDay = range[remainder === 0 ? 5 : remainder + 1];
      if (day === setsubunDay) return "Setsubun";
    }

    return null;
  };
  const specialEventPath = getSpecialEventPath(date);

  const seasonLinksMap = {
    w_main_title: {
      spring: "https://home.hamusata.f5.si/spring",
      summer: "https://home.hamusata.f5.si/summer",
      autumn: "https://home.hamusata.f5.si/autumn",
      winter: "https://home.hamusata.f5.si/winter",
      chocolate: "https://home.hamusata.f5.si/chocolate",
      whiteday: "https://home.hamusata.f5.si/whiteday",
      aprilfool: "https://home.hamusata.f5.si/aprilfool",
      christmas: "https://home.hamusata.f5.si/christmas",
      newyear: "https://home.hamusata.f5.si/newyear",
      Setsubun: "https://home.hamusata.f5.si/Setsubun"
    },
    w_github_pages_title: {
      spring: "https://hamuzon.github.io/spring",
      summer: "https://hamuzon.github.io/summer",
      autumn: "https://hamuzon.github.io/autumn",
      winter: "https://hamuzon.github.io/winter",
      chocolate: "https://hamuzon.github.io/chocolate",
      whiteday: "https://hamuzon.github.io/whiteday",
      aprilfool: "https://hamuzon.github.io/aprilfool",
      christmas: "https://hamuzon.github.io/christmas",
      newyear: "https://hamuzon.github.io/newyear",
      Setsubun: "https://hamuzon.github.io/Setsubun"
    },
    w_hamuzon_title: {
      spring: "https://hamuzon-jp.f5.si/spring",
      summer: "https://hamuzon-jp.f5.si/summer",
      autumn: "https://hamuzon-jp.f5.si/autumn",
      winter: "https://hamuzon-jp.f5.si/winter",
      chocolate: "https://hamuzon-jp.f5.si/chocolate",
      whiteday: "https://hamuzon-jp.f5.si/whiteday",
      aprilfool: "https://hamuzon-jp.f5.si/aprilfool",
      christmas: "https://hamuzon-jp.f5.si/christmas",
      newyear: "https://hamuzon-jp.f5.si/newyear",
      Setsubun: "https://hamuzon-jp.f5.si/Setsubun"
    }
  };

  const updateSeasonLinks = () => {
    for (const [key, links] of Object.entries(seasonLinksMap)) {
      const titleEl = document.querySelector(`[data-lang="${key}"]`);
      if (titleEl) {
        const card = titleEl.closest('.work-card');
        const link = card ? card.querySelector('a') : null;
        const path = specialEventPath || season;
        if (link && links[path]) {
          link.href = links[path];
        }
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateSeasonLinks);
  } else {
    updateSeasonLinks();
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
    if (key === '_gl' || key.startsWith('_ga') || key.startsWith('utm_') ||
        key === 'gclid' || key === 'dclid' || key === 'gbraid' || key === 'wbraid') {
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

(function () {
  const analyticsParams = [
    '_gl',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id',
    'utm_source_platform',
    'utm_creative_format',
    'utm_marketing_tactic',
    'gclid',
    'dclid',
    'gbraid',
    'wbraid'
  ];

  if (typeof window !== "undefined" && window.location && window.location.search) {
    setTimeout(() => {
      try {
        const currentUrl = new URL(window.location.href);
        let changed = false;

        for (const key of Array.from(currentUrl.searchParams.keys())) {
          if (
            analyticsParams.includes(key) ||
            key.startsWith('_ga')
          ) {
            currentUrl.searchParams.delete(key);
            changed = true;
          }
        }

        if (changed) {
          const cleanUrl =
            currentUrl.pathname +
            (currentUrl.search ? currentUrl.search : "") +
            currentUrl.hash;

          window.history.replaceState(null, "", cleanUrl);
        }
      } catch (e) {}
    }, 5000);
  }
})();
