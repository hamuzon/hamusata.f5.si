// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  // --- 除外ファイル ---
  const EXCLUDED_EXTENSIONS = [
    '.webp', '.png', '.ico', '.svg', '.jpg', '.jpeg', '.gif',
    '.mp4', '.webm', '.ogg', '.mov', '.avi'
  ];
  const pathname = url.pathname.toLowerCase();
  if (EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return context.next();
  }

  // --- 対象ドメインのみ ---
  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // m. と www. を分解
  const baseWithoutWWW = hostname.replace(/^www\./, "");
  const hasM = baseWithoutWWW.startsWith("m.");
  const pureBase = baseWithoutWWW.replace(/^m\./, "");

  // ============================
  // モバイル → www.m. に統一
  // ============================
  if (isMobile && !hasM) {
    url.hostname = "www.m." + pureBase;
    return Response.redirect(url.toString(), 302);
  }

  // ============================
  // PC → www. に統一
  // ============================
  if (!isMobile && hasM) {
    url.hostname = "www." + pureBase;
    return Response.redirect(url.toString(), 302);
  }

  // それ以外はそのまま
  return context.next();
}