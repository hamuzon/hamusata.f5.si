// functions/_middleware.js

export async function onRequest(context) {
  // 機能操作: 0 = OFF, 1 = ON, 2 = ON（all top Domain）
  const ENABLED = 2;

  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();


  // --- スイッチ判定 ---
  if (ENABLED === 0) {
    return context.next();
  }


  // --- favicon.ico ---
  if (pathname === "/favicon.ico") {
    return context.next();
  }


  // --- 除外ファイル ---
  const EXCLUDED_EXTENSIONS = [
    '.webp', '.png', '.ico', '.svg', '.jpg', '.jpeg', '.gif', '.avif',
    '.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv',
    '.mp3', '.wav', '.aac',
    '.woff', '.woff2', '.ttf', '.eot',
    '.css', '.js', '.json',
    '.zip', '.rar', '.7z', '.tar', '.gz'
  ];

  if (pathname.includes('.') || EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return context.next();
  }


  // --- 対象ドメインのみ ---
  if (!hostname.endsWith("hamusata.f5.si")) {
    // サブドメイン系列以外はリダイレクトせずそのまま
    return context.next();
  }


  const ua = request.headers.get("user-agent") || "";


  // --- BOT除外判定  ---
  const isBot = /bot|googlebot|bingbot|yandex|baidu|duckduckbot|slurp|ia_archiver/i.test(ua);
  if (isBot) {
    return context.next();
  }


  // ===== モード1: モバイル/PC判定リダイレクト =====
  if (ENABLED === 1) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(ua);

    const baseWithoutWWW = hostname.replace(/^www\./, "");
    const hasM = baseWithoutWWW.startsWith("m.");
    const pureBase = baseWithoutWWW.replace(/^m\./, "");

    // ===== モバイル端末 / Mobile =====
    if (isMobile && !hasM) {
      url.hostname = `www.m.${pureBase}`;
      return Response.redirect(url.toString(), 302);
    }

    // ===== PC端末 / PC =====
    if (!isMobile && hasM) {
      url.hostname = `www.${pureBase}`;
      return Response.redirect(url.toString(), 302);
    }
  }


  // ===== モード2 :　トップドメイン統一 / Unification of top domains =====
  if (ENABLED === 2) {
    if (hostname !== "hamusata.f5.si") {
      url.hostname = "hamusata.f5.si";
      return Response.redirect(url.toString(), 302);
    }
  }


  // ===== Markdown Negotiation =====
  const acceptHeader = request.headers.get("accept") || "";
  if (acceptHeader.includes("text/markdown")) {
    const md = `# HAMUSATA – ホームページ

## 自己紹介 (Profile)
こんにちは、hamusataです。webサイトを作ったりネットをしてるネットの海の住民。ハムスターを飼っています。

## ポートフォリオ (Portfolio)
- [HAMUSATA – ホームページ](https://home.hamusata.f5.si) - メインポータル
- [GitHub版 – ホームページ](https://hamuzon.github.io)
- [hamuzon – ホームページ](https://hamuzon-jp.f5.si/)
- [hamuzon (FC2)系](https://hamuzon.web.fc2.com/)
- [link-s.f5.si](https://link-s.f5.si) - 短縮URLサービス
- [go.link-s.f5.si](https://go.link-s.f5.si) - カスタムパス対応版
- [pw.link-s.f5.si](https://pw.link-s.f5.si) - パスワード生成

## SNSリンク (SNS)
- [Scratch (hamusata)](https://scratch.mit.edu/users/hamusata/)
- [Scratch (hamuzon)](https://scratch.mit.edu/users/hamuzon/)
- [GitHub](https://github.com/hamuzon)
- [Bluesky](https://bsky.app/profile/hamuzon-jp.f5.si)

## サービス稼働状況 (Status)
- [稼働状況を見る](https://stats.uptimerobot.com/tT7bs2uEHa)

---
© 2025 @hamuzon / @hamusata`;

    return new Response(md, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": "true"
      }
    });
  }

  // それ以外はそのまま
  return context.next();
}
