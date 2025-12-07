// functions/_middleware.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  
  if (isMobile && url.hostname !== "m.hamusata.f5.si") {
    url.hostname = "m.hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  if (!isMobile && url.hostname !== "hamusata.f5.si") {
    url.hostname = "hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  return context.next();
}