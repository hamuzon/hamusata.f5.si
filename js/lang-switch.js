<!-- js/lang-switch.js -->
document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll("[data-lang]");
  const elements = document.querySelectorAll("[data-i18n]");

  fetch("/lang/lang.json")
    .then(res => res.json())
    .then(data => {
      function switchLang(lang) {
        elements.forEach(el => {
          const key = el.getAttribute("data-i18n");
          if (data[lang] && data[lang][key]) {
            el.textContent = data[lang][key];
          }
        });
      }

      langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const lang = btn.dataset.lang;
          switchLang(lang);
        });
      });

      switchLang("ja");
    });
});