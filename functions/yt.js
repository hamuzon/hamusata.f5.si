export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const v = url.searchParams.get("v");
  const typeParam = url.searchParams.get("type") || "";
  const t = url.searchParams.get("t") || "";

  if (!v) {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>YouTube Link Service – HAMUSATA</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon.png">

<script>
  (function () {
    var tp = new URLSearchParams(window.location.search).get('theme');
    var theme = (tp === 'dark' || tp === 'light') ? tp
      : (localStorage.getItem('site-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    document.documentElement.className = theme;
  })();
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Potta+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/foldable.css">
<link rel="stylesheet" href="/css/dark.css" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="/css/light.css" media="(prefers-color-scheme: light)">

<style>
* {
  box-sizing: border-box;
}
body {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: max(20px, calc(env(safe-area-inset-top, 0px) + 16px))
           max(16px, calc(env(safe-area-inset-right, 0px) + 16px))
           max(20px, calc(env(safe-area-inset-bottom, 0px) + 16px))
           max(16px, calc(env(safe-area-inset-left, 0px) + 16px));
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.yt-card {
  margin: auto;
  width: 100%;
  max-width: min(92vw, 460px);
  padding: clamp(1.2rem, 4.5vw, 2.2rem);
  border-radius: clamp(16px, 3.5vw, 24px);
  background: rgba(255, 255, 255, 0.22);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  text-align: center;
  transition: padding 0.2s ease, border-radius 0.2s ease;
}
html.dark .yt-card, body.dark .yt-card, .dark .yt-card {
  background: rgba(18, 20, 24, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}
h1 {
  font-size: clamp(1.3rem, 4vw, 1.85rem);
  margin-top: 0;
  margin-bottom: 1.2rem;
  line-height: 1.3;
  word-break: break-word;
}
input,
button {
  width: 100%;
  min-height: 44px;
  padding: clamp(0.7rem, 2vw, 0.9rem) 1rem;
  margin: 0.5rem 0;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 16px; /* Prevents auto-zoom on iOS */
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: inherit;
}
input {
  background: rgba(255, 255, 255, 0.7);
  color: inherit;
}
input:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.25);
  background: rgba(255, 255, 255, 0.95);
}
html.dark input, body.dark input, .dark input {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}
html.dark input:focus, body.dark input:focus, .dark input:focus {
  background: rgba(255, 255, 255, 0.14);
  border-color: #80deea;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.35);
}
button {
  background: linear-gradient(90deg, #00bcd4, #26c6da);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 188, 212, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
@media (hover: hover) {
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 188, 212, 0.4);
    background: linear-gradient(90deg, #00acc1, #00bcd4);
  }
}
button:active {
  transform: scale(0.98);
}
#output {
  margin-top: 0.75rem;
  word-break: break-all;
  overflow-wrap: anywhere;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}
#output:empty {
  display: none;
  margin: 0;
}
#output a {
  color: #008ba3;
  text-decoration: underline;
  font-weight: 700;
  display: inline-block;
  line-height: 1.4;
  word-break: break-all;
  overflow-wrap: anywhere;
}
html.dark #output a, body.dark #output a, .dark #output a {
  color: #80deea;
}
#copyBtn {
  margin-top: 0.75rem;
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  background: #00bcd4;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.25);
  min-height: 42px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
}
@media (hover: hover) {
  #copyBtn:hover {
    background: #0097a7;
  }
}
#copyBtn:active {
  transform: scale(0.98);
}
#error {
  color: #d32f2f;
  font-weight: 700;
  margin-top: 0.6rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}
#error:empty {
  display: none;
  margin: 0;
}
html.dark #error, body.dark #error, .dark #error {
  color: #ff80ab;
}


/* Small mobile devices (e.g. iPhone SE, compact Android, foldable cover screen) */
@media (max-width: 400px) {
  body {
    padding: max(14px, calc(env(safe-area-inset-top, 0px) + 8px))
             max(10px, calc(env(safe-area-inset-right, 0px) + 8px))
             max(14px, calc(env(safe-area-inset-bottom, 0px) + 8px))
             max(10px, calc(env(safe-area-inset-left, 0px) + 8px));
  }
  .yt-card {
    padding: 1.1rem 0.9rem;
    border-radius: 16px;
    max-width: 100%;
  }
  h1 {
    font-size: 1.3rem;
    margin-bottom: 0.9rem;
  }
  input, button {
    margin: 0.4rem 0;
    padding: 0.65rem 0.8rem;
    border-radius: 12px;
  }
  #copyBtn {
    width: 100%;
    border-radius: 12px;
  }
}

/* Ultra-compact screens (<= 320px) */
@media (max-width: 320px) {
  .yt-card {
    padding: 0.9rem 0.75rem;
    border-radius: 14px;
  }
  h1 {
    font-size: 1.15rem;
  }
  input, button {
    font-size: 15px;
    padding: 0.6rem 0.7rem;
  }
}

/* Mobile landscape orientation */
@media (orientation: landscape) and (max-height: 520px) {
  body {
    padding-top: max(10px, env(safe-area-inset-top, 0px));
    padding-bottom: max(10px, env(safe-area-inset-bottom, 0px));
    justify-content: flex-start;
  }
  .yt-card {
    margin: auto;
    padding: 1rem 1.6rem;
    max-width: min(94vw, 540px);
  }
  h1 {
    font-size: 1.35rem;
    margin-bottom: 0.7rem;
  }
  input, button {
    margin: 0.3rem 0;
    min-height: 38px;
    padding: 0.5rem 0.8rem;
  }
}

/* Foldable dual-screen support */
@media (horizontal-viewport-segments: 2) {
  .yt-card {
    max-width: min(45vw, 480px);
  }
}
</style>
</head>
<body>
<section class="yt-card">
<h1>🎬 YouTube Link</h1>
<input type="text" id="videoInput" placeholder="動画IDまたはURLを入力" />
<input type="text" id="t" placeholder="再生開始時間 t=xx（任意）" />
<button id="generate">リンク生成</button>
<div id="error"></div>
<div id="output"></div>
<button id="copyBtn" style="display:none;">📋 コピー</button>
</section>
<script>
if (!new URLSearchParams(window.location.search).has('theme')) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    document.documentElement.className = e.matches ? 'dark' : 'light';
  });
}
const videoInput = document.getElementById("videoInput");
const tInput = document.getElementById("t");
const output = document.getElementById("output");
const error = document.getElementById("error");
const btn = document.getElementById("generate");
const copyBtn = document.getElementById("copyBtn");

[videoInput, tInput].forEach(el => {
  el.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      btn.click();
    }
  });
});

btn.addEventListener("click", () => {
  let input = videoInput.value.trim();
  let time = tInput.value.trim();
  error.textContent = "";
  output.innerHTML = "";
  copyBtn.style.display = "none";
  if (!input) {
    error.textContent = "⚠️ 入力してください";
    return;
  }
  let v = input;
  let type = "";
  let paramT = "";
  try {
    if (input.startsWith("http")) {
      const urlObj = new URL(input);
      const host = urlObj.hostname;
      if (host.includes("youtube.com") || host.includes("music.youtube.com")) {
        if (urlObj.pathname.startsWith("/watch")) {
          v = urlObj.searchParams.get("v") || "";
        }
        if (host.includes("music.youtube.com")) {
          type = "m";
        }
        if (urlObj.pathname.startsWith("/shorts/")) {
          v = urlObj.pathname.split("/shorts/")[1].split("/")[0];
          type = "s";
        }
        paramT = urlObj.searchParams.get("t") || "";
      } else if (host === "youtu.be") {
        v = urlObj.pathname.replace("/", "");
        paramT = urlObj.searchParams.get("t") || "";
      }
    }
  } catch (e) {}
  let finalT = time || paramT;
  let link = \`\${location.origin}/yt/?v=\${v}\`;
  if (type) link += \`&type=\${type}\`;
  if (finalT) link += \`&t=\${encodeURIComponent(finalT)}\`;
  output.innerHTML = \`✅ <a href="\${link}" target="_blank" rel="noopener noreferrer">\${link}</a>\`;
  copyBtn.style.display = "inline-flex";
});

copyBtn.addEventListener("click", async () => {
  const a = output.querySelector("a");
  if (a && a.href) {
    const text = a.href;
    const origText = copyBtn.textContent;
    const showSuccess = () => {
      copyBtn.textContent = "✅ コピーしました";
      setTimeout(() => copyBtn.textContent = origText, 2000);
    };
    const showError = () => {
      copyBtn.textContent = "❌ コピー失敗";
      setTimeout(() => copyBtn.textContent = origText, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showSuccess();
        return;
      } catch (e) {}
    }

    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      tempInput.style.position = "fixed";
      tempInput.style.opacity = "0";
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(tempInput);
      if (successful) {
        showSuccess();
      } else {
        showError();
      }
    } catch (e) {
      showError();
    }
  }
});
</script>
</body>
</html>`;
    const encoder = new TextEncoder();
    const data = encoder.encode(html);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const etag = `"${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}"`;

    if (request.headers.get('If-None-Match') === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "ETag": etag,
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "ETag": etag,
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

  let redirectUrl;
  if (typeParam === "m") {
    redirectUrl = `https://music.youtube.com/watch?v=${v}`;
  } else if (typeParam === "s") {
    redirectUrl = isMobile ? `https://m.youtube.com/shorts/${v}` : `https://www.youtube.com/shorts/${v}`;
  } else {
    redirectUrl = `https://youtu.be/${v}`;
  }

  if (t) {
    const separator = redirectUrl.includes("?") ? "&" : "?";
    redirectUrl += `${separator}t=${encodeURIComponent(t)}`;
  }

  return Response.redirect(redirectUrl, 302);
}

export const handleYt = (request) => onRequest({ request });