// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // 対象ドメインのみ処理
  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  // ドメイン構造を解析
  const hasWWW = hostname.startsWith("www.");
  const hasM = hostname.replace(/^www\./, "").startsWith("m.");

  // ---- Mobile redirect ----
  // モバイルで m. が付いていなければ追加
  if (isMobile && !hasM) {
    let base = hostname.replace(/^www\./, ""); // www. を一旦除去
    // base が m.hamusata でないことを保証
    base = base.replace(/^m\./, ""); // 万が一 m. があっても削除

    // www あり → www.m.hamusata.f5.si
    // www なし → m.hamusata.f5.si
    url.hostname = (hasWWW ? "www.m." : "m.") + base;
    return Response.redirect(url.toString(), 302);
  }

  // ---- PC redirect ----
  // PCで m. が付いていれば除去
  if (!isMobile && hasM) {
    let base = hostname.replace(/^www\./, ""); // www 除去
    base = base.replace(/^m\./, "");           // m. 除去 → hamusata.f5.si

    // www は元のまま維持
    url.hostname = (hasWWW ? "www." : "") + base;
    return Response.redirect(url.toString(), 302);
  }

  // その他はそのまま
  return context.next();
}