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

  // 拡張子がある場合、または除外リストに含まれる場合はスルー
  // ただし .html と拡張子なし、および .well-known 以下のファイルは処理対象とする
  if (EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext)) && !pathname.endsWith('.html')) {
    if (!pathname.startsWith('/.well-known/')) {
      return context.next();
    }
  }


  // --- 対象ドメインのみ ---
  if (!hostname.endsWith("hamusata.f5.si")) {
    // サブドメイン系列以外はリダイレクトせずそのまま
    return context.next();
  }


  const ua = request.headers.get("user-agent") || "";
  const isBot = /bot|googlebot|bingbot|yandex|baidu|duckduckbot|slurp|ia_archiver/i.test(ua);


  // ===== モード1: モバイル/PC判定リダイレクト =====
  if (ENABLED === 1) {
    // BOTの場合はリダイレクトをスキップ
    if (isBot) {
      return context.next();
    }

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
    let md = "";
    
    if (pathname === "/" || pathname === "/index.html") {
      md = `# HAMUSATA – ホームページ

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
    } else if (pathname === "/terms.html" || pathname === "/terms") {
      md = `# 利用規約・プライバシーポリシー / Terms of Service & Privacy Policy

## 制定日 (Effective Date)
2025年

## 1. サービス内容 (Description of Service)
当サイトは、HAMUSATA関連の情報提供およびリンク集、コンテンツ閲覧サービスを提供します。
The Site provides information, link collections, and content browsing related to HAMUSATA.

## 2. 禁止事項 (Prohibited Activities)
法令・公序良俗に反する行為、他者や当サイトの運営に損害を与える行為、不正アクセス等を禁止します。

## 3. 免責事項 (Disclaimer)
情報の正確性に努めていますが、利用により生じた損害について一切責任を負いません。

## 4. 著作権 (Copyright)
コンテンツの著作権は運営者または各権利者に帰属します。

## 5. クッキー・アクセス解析 (Cookies & Analytics)
Google Analytics 等を利用する場合があります。データは匿名化されています。

## 6. プライバシーポリシー (Privacy Policy)
個人情報は原則取得しません。URL短縮サービス等ではアクセスログを記録します。

## 7. AI学習・スクレイピング (AI Training & Scraping)
生成AI等の学習データとしての利用、および網羅的なデータ収集を禁止します。

---
© 2025 @hamuzon / @hamusata`;
    } else {
      // その他のページはデフォルトのメッセージかホームへの誘導
      md = `# HAMUSATA – Markdown Mode
Requested path: ${pathname}

Sorry, a specific Markdown version for this page is not available yet.
Please visit the [Home Page](https://hamusata.f5.si/) for main content.`;
    }

    // トークン数の概算 (1トークン ≒ 4文字)
    const tokenCount = Math.ceil(md.length / 4);

    return new Response(md, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": tokenCount.toString(),
        "vary": "Accept",
        "Link": [
          '</.well-known/api-catalog>; rel="api-catalog"',
          '</.well-known/agent-skills/index.json>; rel="agent-skills"',
          '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
          '</.well-known/openid-configuration>; rel="openid-configuration"',
          '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
          '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"'
        ].join(", ")
      }
    });
  }

  // --- .well-known などのエージェント向けファイルをミドルウェアで直接ハンドリング（404対策） ---
  if (pathname === "/.well-known/api-catalog") {
    return new Response(JSON.stringify({
      "linkset": [
        {
          "anchor": "https://hamusata.f5.si/",
          "service-desc": [
            { "href": "https://hamusata.f5.si/lang/lang.json", "type": "application/json" },
            { "href": "https://hamusata.f5.si/.well-known/openid-configuration", "type": "application/json" },
            { "href": "https://hamusata.f5.si/.well-known/oauth-authorization-server", "type": "application/json" },
            { "href": "https://hamusata.f5.si/.well-known/oauth-protected-resource", "type": "application/json" }
          ],
          "service-doc": [{ "href": "https://github.com/hamuzon/hamusata.f5.si#readme", "type": "text/html" }],
          "agent-skills": [{ "href": "https://hamusata.f5.si/.well-known/agent-skills/index.json", "type": "application/json" }],
          "mcp-server-card": [{ "href": "https://hamusata.f5.si/.well-known/mcp/server-card.json", "type": "application/json" }]
        }
      ]
    }), { headers: { "Content-Type": "application/linkset+json; charset=utf-8" } });
  }

  if (pathname === "/.well-known/agent-skills/index.json") {
    // リンク先のハッシュ値を自動計算するヘルパー
    const getDynamicSha256 = async (path) => {
      try {
        const res = await context.env.ASSETS.fetch(new URL(path, request.url));
        if (!res.ok) return "hash-error";
        const buffer = await res.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        return "calculation-failed";
      }
    };

    const randomHash = await getDynamicSha256("/random/index.html");

    return new Response(JSON.stringify({
      "skills": [
        {
          "name": "Markdown Negotiation",
          "type": "negotiation",
          "description": "Supports Accept: text/markdown to provide structured content for agents.",
          "url": "https://hamusata.f5.si/",
          "methods": ["GET"]
        },
        {
          "name": "Random Work Discovery",
          "type": "discovery",
          "description": "Provides access to a collection of random tools and projects created by hamusata.",
          "url": "https://hamusata.f5.si/random/index.html",
          "methods": ["GET"],
          "sha256": randomHash
        },
        {
          "name": "OAuth Discovery",
          "type": "discovery",
          "description": "Exposes OAuth/OIDC metadata for server discovery.",
          "url": "https://hamusata.f5.si/.well-known/openid-configuration",
          "methods": ["GET"]
        },
        {
          "name": "OAuth Protected Resource",
          "type": "discovery",
          "description": "Exposes metadata for protected resources and their auth servers.",
          "url": "https://hamusata.f5.si/.well-known/oauth-protected-resource",
          "methods": ["GET"]
        }
      ]
    }), { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }

  if (pathname === "/.well-known/mcp/server-card.json") {
    return new Response(JSON.stringify({
      "serverInfo": {
        "name": "HAMUSATA WebMCP Server",
        "version": "1.0.0",
        "description": "Exposes site sections and tools for the HAMUSATA portal."
      },
      "capabilities": { "tools": { "listChanged": true } },
      "transport": { "type": "webmcp", "url": "https://hamusata.f5.si/" }
    }), { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }

  // --- OAuth/OIDC Discovery (RFC 8414 / OIDC Discovery 1.0) ---
  if (pathname === "/.well-known/openid-configuration" || pathname === "/.well-known/oauth-authorization-server") {
    return new Response(JSON.stringify({
      "issuer": "https://hamusata.f5.si",
      "authorization_endpoint": "https://hamusata.f5.si/auth/authorize",
      "token_endpoint": "https://hamusata.f5.si/auth/token",
      "jwks_uri": "https://hamusata.f5.si/.well-known/jwks.json",
      "response_types_supported": ["code", "token", "id_token"],
      "subject_types_supported": ["public"],
      "id_token_signing_alg_values_supported": ["RS256"],
      "grant_types_supported": ["authorization_code", "client_credentials"],
      "scopes_supported": ["openid", "profile", "email", "read", "write"]
    }), { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }

  // --- OAuth Protected Resource (RFC 9728) ---
  if (pathname === "/.well-known/oauth-protected-resource") {
    return new Response(JSON.stringify({
      "resource": "https://hamusata.f5.si/",
      "authorization_servers": ["https://hamusata.f5.si"],
      "scopes_supported": ["read", "write"]
    }), { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }

  // それ以外はそのまま。ただし HTML の場合は Link ヘッダーを付与してエージェント発見性を高める。
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    // 既存のレスポンスを変更せずにヘッダーを追加して新しいレスポンスを作成
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Link", [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</.well-known/agent-skills/index.json>; rel="agent-skills"',
      '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
      '</.well-known/openid-configuration>; rel="openid-configuration"',
      '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
      '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
      '<https://fonts.googleapis.com/css2?family=Potta+One&display=swap>; rel="preload"; as="style"'
    ].join(", "));
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }

  return response;
}
