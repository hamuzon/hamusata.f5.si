// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // www を無視したホスト名で判定
  const host = url.hostname.replace(/^www\./, "");

  const PC_HOST = "hamusata.f5.si";
  const MOBILE_HOST = "m.hamusata.f5.si";

  // 対象外ドメインはそのまま
  if (!host.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  // モバイル端末で PC ホストにアクセスしている場合
  if (isMobile && host === PC_HOST) {
    url.hostname = MOBILE_HOST; // wwwなし統一
    return Response.redirect(url.toString(), 302);
  }

  // PC端末でモバイルホストにアクセスしている場合
  if (!isMobile && host === MOBILE_HOST) {
    url.hostname = PC_HOST; // wwwなし統一
    return Response.redirect(url.toString(), 302);
  }

  // それ以外はそのまま表示
  return context.next();
}