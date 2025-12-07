export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // /index.html のとき → ルートに移動
  if (url.pathname === "/index.html") {
    return Response.redirect(url.origin + "/", 301);
  }

  return context.next();
}