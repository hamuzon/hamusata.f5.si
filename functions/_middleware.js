// functions/_middleware.js

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // --- ファイル拡張子の除外設定 ---
  // 画像や動画など、リダイレクト処理をスキップしたいファイル拡張子のリスト
  const EXCLUDED_EXTENSIONS = [
    '.webp', '.png', '.ico', '.svg', '.jpg', '.jpeg', '.gif',
    '.mp4', '.webm', '.ogg', '.mov', '.avi' 
  ];
  
  const pathname = url.pathname.toLowerCase();
  
  // 除外対象のファイルであれば、リダイレクト処理をスキップ
  if (EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return context.next();
  }
  // ---------------------------------
  
  const ua = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // 対象ドメインのみ処理
  if (!hostname.endsWith("hamusata.f5.si")) {
    return context.next();
  }

  // ドメイン構造とユーザーエージェントの解析
  const hasWWW = hostname.startsWith("www.");
  // m. や www. を取り除いたベースドメインを取得
  const currentBase = hostname.replace(/^www\./, "").replace(/^m\./, ""); 
  const hasM = hostname.replace(/^www\./, "").startsWith("m.");

  // ---- Mobile redirect ----
  // モバイルで m. が付いていなければ www.m. または m. へリダイレクト
  if (isMobile && !hasM) {
    url.hostname = (hasWWW ? "www.m." : "m.") + currentBase;
    return Response.redirect(url.toString(), 302);
  }

  // ---- PC redirect ----
  // PCで m. が付いていれば m. を除去してリダイレクト
  if (!isMobile && hasM) {
    url.hostname = (hasWWW ? "www." : "") + currentBase;
    return Response.redirect(url.toString(), 302);
  }

  // その他はそのまま
  return context.next();
}
