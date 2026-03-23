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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YouTube Link Service</title>
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Potta+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
}
section {
  margin: 0;
  width: 360px;
  max-width: 90%;
}
h1 {
  margin-bottom: 1rem;
}
input,
button {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  box-sizing: border-box;
}
input {
  background: rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
}
button {
  background: linear-gradient(90deg, #00bcd4, #26c6da);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: linear-gradient(90deg, #00acc1, #00bcd4);
}
#output {
  margin-top: 1rem;
  min-height: 1.5em;
}
#output a {
  color: #00bcd4;
  text-decoration: none;
  font-weight: 700;
  word-break: break-all;
  display: block;
  line-height: 1.4;
}
body.dark #output a {
  color: #80deea;
}
#copyBtn {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border-radius: 10px;
  background: #00bcd4;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
#copyBtn:hover {
  background: #0097a7;
}
#error {
  color: #b00020;
  font-weight: 700;
  margin-top: 0.5rem;
  min-height: 1.2em;
}
body.dark #error {
  color: #ff80ab;
}
</style>
</head>
<body class="light">
<section>
<h1>🎬 YouTube Link</h1>
<input type="text" id="videoInput" placeholder="動画IDまたはURLを入力" />
<input type="text" id="t" placeholder="再生開始時間 t=xx（任意）" />
<button id="generate">リンク生成</button>
<div id="error"></div>
<div id="output"></div>
<button id="copyBtn" style="display:none;">📋 コピー</button>
</section>
<script>
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');
function applyTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
}
if (themeParam === 'dark' || themeParam === 'light') {
  applyTheme(themeParam);
} else {
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(isDark ? 'dark' : 'light');
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!urlParams.get('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
const videoInput = document.getElementById("videoInput");
const tInput = document.getElementById("t");
const output = document.getElementById("output");
const error = document.getElementById("error");
const btn = document.getElementById("generate");
const copyBtn = document.getElementById("copyBtn");
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
  output.innerHTML = \`✅ <a href="\${link}" target="_blank">\${link}</a>\`;
  copyBtn.style.display = "inline-block";
});
copyBtn.addEventListener("click", () => {
  const a = output.querySelector("a");
  if (a && a.href) {
    navigator.clipboard.writeText(a.href).then(() => {
      const t = copyBtn.textContent;
      copyBtn.textContent = "✅ コピーしました";
      setTimeout(() => copyBtn.textContent = t, 2000);
    }).catch(() => {
      const t = copyBtn.textContent;
      copyBtn.textContent = "❌ コピー失敗";
      setTimeout(() => copyBtn.textContent = t, 2000);
    });
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
    redirectUrl = isMobile ? `https://m.youtube.com/watch?v=${v}` : `https://music.youtube.com/watch?v=${v}`;
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