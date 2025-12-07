export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // モバイルは m.hamusata.f5.si へ、パスとクエリは保持
  if (isMobile && !hostname.startsWith("m.")) {
    url.hostname = "m.hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  // PCは hamusata.f5.si へ、パスとクエリは保持
  if (!isMobile && hostname.startsWith("m.")) {
    url.hostname = "hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  return context.next();
}