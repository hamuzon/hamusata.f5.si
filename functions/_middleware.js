// functions/_middleware.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // ユーザーエージェント取得
  const ua = request.headers.get("user-agent") || "";

  // モバイル判定
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // PC は hamusata.f5.si
  // モバイルは m.hamusata.f5.si
  if (isMobile && url.hostname !== "m.hamusata.f5.si") {
    url.hostname = "m.hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  } else if (!isMobile && url.hostname !== "hamusata.f5.si") {
    url.hostname = "hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  // リダイレクト不要ならそのままリクエストを通す
  return context.next();
}