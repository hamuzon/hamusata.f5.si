// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);


  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  // mobile: m.hamusata.f5.si 
  if (isMobile && hostname !== "m.hamusata.f5.si") {
    url.hostname = "m.hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  // PC : hamusata.f5.si 
  if (!isMobile && hostname !== "hamusata.f5.si") {
    url.hostname = "hamusata.f5.si";
    return Response.redirect(url.toString(), 302);
  }

  // 
  return context.next();
}