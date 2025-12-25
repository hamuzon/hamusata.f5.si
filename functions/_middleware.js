// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();


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

  if (EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return context.next();
  }


  // --- 対象ドメインのみ ---
  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }


  const ua = request.headers.get("user-agent") || "";

  // --- BOT除外判定 ---
  const isBot = /bot|googlebot|bingbot|yandex|baidu|duckduckbot|slurp|ia_archiver/i.test(ua);
  if (isBot) {
    return context.next();
  }


  // モバイル判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const baseWithoutWWW = hostname.replace(/^www\./, "");
  const hasM = baseWithoutWWW.startsWith("m.");
  const pureBase = baseWithoutWWW.replace(/^m\./, "");


  // ===== モバイル端末 / Mobile =====
  if (isMobile && !hasM) {
    url.hostname = `www.m.${pureBase}`;
    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      redirect: "follow"
    });
    return fetch(newRequest);
  }


  // ===== PC端末 / PC =====
  if (!isMobile && hasM) {
    url.hostname = `www.${pureBase}`;
    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      redirect: "follow"
    });
    return fetch(newRequest);
  }


  // それ以外はそのまま
  return context.next();
}
