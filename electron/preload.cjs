
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const buttons = {
    back: "hamusata:back",
    forward: "hamusata:forward",
    reload: "hamusata:reload",
    home: "hamusata:home",
    minimize: "hamusata:minimize",
    maximize: "hamusata:maximize",
    close: "hamusata:close"
  };

  // ボタンイベント
  Object.entries(buttons).forEach(([id, channel]) => {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", () => {
      ipcRenderer.send(channel);
    });
  });

  // 最大化状態のアイコン変更
  ipcRenderer.on("hamusata:window-state", (_, isMaximized) => {
    const button = document.getElementById("maximize");
    const icon = document.getElementById("maximize-icon");

    if (!button || !icon) return;

    if (isMaximized) {
      button.title = "元に戻す";

      icon.innerHTML = `
        <rect x="7" y="7" width="12" height="12" rx="1"/>
        <path d="M5 15V5h10"/>
      `;
    } else {
      button.title = "最大化";

      icon.innerHTML = `
        <rect x="5" y="5" width="14" height="14" rx="1"/>
      `;
    }
  });

  // ローカルサイトのツールバー分の余白
  if (
    location.hostname === "127.0.0.1" &&
    location.protocol === "http:"
  ) {
    const style = document.createElement("style");

    style.textContent = `
      html {
        scroll-padding-top: 52px !important;
      }

      body {
        padding-top: 52px !important;
      }
    `;

    document.head.appendChild(style);
  }
});
