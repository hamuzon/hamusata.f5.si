export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.toLowerCase();

  // ===== リダイレクトリスト =====
  const redirects = [
    // ===== X / Twitter =====
    { from: "/x", to: "https://x.com/hamu_sata" },
    { from: "/x-1", to: "https://x.com/hamu_sata" },
    { from: "/twt", to: "https://x.com/hamu_sata" },
    { from: "/twitter", to: "https://x.com/hamu_sata" },
    { from: "/twitter-1", to: "https://x.com/hamu_sata" },

    // ===== Scratch =====
    { from: "/s", to: "https://scratch.mit.edu/users/hamu_sata" },
    { from: "/s-1", to: "https://scratch.mit.edu/users/hamu_sata" },
    { from: "/s-2", to: "https://scratch.mit.edu/users/hamuzon" },
    { from: "/scratch", to: "https://scratch.mit.edu/users/hamu_sata" },
    { from: "/scratch-1", to: "https://scratch.mit.edu/users/hamu_sata" },
    { from: "/scratch-2", to: "https://scratch.mit.edu/users/hamuzon" },

    // ===== GitHub =====
    { from: "/g", to: "https://github.com/hamuzon" },
    { from: "/g-1", to: "https://github.com/hamuzon" },
    { from: "/github", to: "https://github.com/hamuzon" },
    { from: "/github-1", to: "https://github.com/hamuzon" },

    // ===== Bluesky =====
    { from: "/b", to: "https://bsky.app/profile/hamusata.f5.si" },
    { from: "/b-1", to: "https://bsky.app/profile/hamuzon-jp.f5.si" },
    { from: "/bs", to: "https://bsky.app/profile/hamusata.f5.si" },
    { from: "/bs-1", to: "https://bsky.app/profile/hamuzon-jp.f5.si" },
    { from: "/bluesky", to: "https://bsky.app/profile/hamusata.f5.si" },
    { from: "/bluesky-1", to: "https://bsky.app/profile/hamuzon-jp.f5.si" },

    // ===== Device Info =====
    { from: "/d", to: "https://device-info.hamusata.f5.si/" },
    { from: "/d-1", to: "https://device-info.hamusata.f5.si/" },
    { from: "/device", to: "https://device-info.hamusata.f5.si/" },
    { from: "/device-info", to: "https://device-info.hamusata.f5.si/" },

    // ===== internal links =====
    { from: "/index.html", to: "/" },
    { from: "/license", to: "/" },
    { from: "/readme.md", to: "/" },
    { from: "/go", to: "/links" },
    { from: "/link", to: "/links" },
    { from: "/mutual_links", to: "/links" }
  ];

  // ===== 該当リダイレクトを検索 =====
  const match = redirects.find(r => r.from === path);

  if (match) {
    return Response.redirect(match.to, 301);
  }

  return new Response("Not Found", { status: 404 });
}