// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();


  // --- favicon.ico ---
  if (pathname === "/favicon.ico") return context.next();


  // --- 除外ファイル ---
  const EXCLUDED_EXTENSIONS = [
    '.webp', '.png', '.ico', '.svg', '.jpg', '.jpeg', '.gif',
    '.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv',
    '.mp3', '.wav', '.aac', '.ogg',
    '.woff', '.woff2', '.ttf', '.eot',
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
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  const baseWithoutWWW = hostname.replace(/^www\./, "");
  const hasM = baseWithoutWWW.startsWith("m.");
  const pureBase = baseWithoutWWW.replace(/^m\./, "");


  // ===== モバイル端末 / Mobile =====
  if (isMobile && !hasM) {
    url.hostname = "www.m." + pureBase;
    return Response.redirect(url.toString(), 301);
  }


  // ===== PC端末 / PC =====
  if (!isMobile && hasM) {
    url.hostname = "www." + pureBase;
    return Response.redirect(url.toString(), 301);
  }


  // それ以外はそのまま
  return context.next();
}
