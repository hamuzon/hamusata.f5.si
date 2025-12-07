// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
// hamusata.f5.si 系列以外はそのまま
  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  // Mobile redirect
  if (isMobile && !hostname.startsWith("m.")) {
    url.hostname = hostname.replace(/^www\./, '').replace(/^/, hostname.startsWith('www.') ? 'www.m.' : 'm.');
    return Response.redirect(url.toString(), 302);
  }

  // PC redirect
  if (!isMobile && hostname.startsWith("m.")) {
    url.hostname = hostname.replace(/^m\./, '');
    return Response.redirect(url.toString(), 302);
  }

  // 正しいサブドメインの場合は通常通り表示
  return context.next();
}