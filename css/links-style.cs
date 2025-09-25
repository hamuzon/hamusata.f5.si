/* =========================
   リセット & 基本スタイル
========================= */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Potta One', sans-serif;
}

body {
    min-height: 100vh;
    line-height: 1.6;
    scroll-behavior: smooth;
    text-align: center;
    position: relative;
    overflow-x: hidden;
    transition: background-color 0.3s, color 0.3s;
}

/* =========================
   ライト・ダーク背景
========================= */
body.light {
    background: 
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175,109,255,0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255,100,180,0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255,235,170,0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120,190,255,0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%);
    color: #3b2f2f;
}

body.dark {
    background-color: #0a0a0a;
    background-image: 
        radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236,72,153,0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34,197,94,0.2) 0%, transparent 65%);
    color: #fff;
}

/* =========================
   ヘッダー & バナー
========================= */
header {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    background: transparent;
    position: relative;
    z-index: 10;
}

.banner-link {
    display: block;
    margin-bottom: 1rem;
}

.banner-link img {
    display: block;
    width: min(100%, 512px);
    height: auto;
    max-height: 120px;
    object-fit: contain;
    border-radius: 14px;
    box-shadow: 0 12px 28px rgba(0,0,0,0.2);
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(24px);
    transition: transform 0.3s, box-shadow 0.3s;
}

.banner-link img:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
}

/* =========================
   セクション & タイトル
========================= */
section {
    max-width: 1000px;
    margin: 3rem auto;
    padding: 2rem;
    border-radius: 20px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(28px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    color: inherit;
    transition: background-color 0.3s, color 0.3s;
}

section h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

/* =========================
   相互リンクカード
========================= */
.works {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
    gap: 1.5rem;
    justify-items: center;
}

.sougolink {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(20px);
    color: inherit;
    padding: 1rem;
    border-radius: 20px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.25);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    width: 100%;
}

.sougolink:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 45px rgba(0,0,0,0.35);
}

.sougolink img {
    max-width: 100%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
    display: block;
    transition: transform 0.3s;
}

.sougolink img:hover {
    transform: scale(1.05);
}

.sougolink h3 {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
    word-break: break-word;
}

.sougolink a {
    color: inherit;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}

/* =========================
   フッター
========================= */
footer {
    text-align: center;
    padding: 2rem 1rem;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
}

footer a {
    color: inherit;
    text-decoration: underline;
    transition: color 0.3s;
}

footer a:hover {
    color: #fff;
}

/* =========================
   レスポンシブ
========================= */
@media (max-width: 900px) {
    .works { grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); }
    section h2 { font-size: 1.7rem; }
}

@media (max-width: 600px) {
    .works { grid-template-columns: 1fr; }
    section h2 { font-size: 1.5rem; }
}
