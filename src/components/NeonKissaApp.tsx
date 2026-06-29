"use client";

import { useState, useEffect, useRef, useCallback, type ReactElement } from "react";

/* ── CONFIG ──────────────────────────────────────────── */
// Sign up free at formspree.io and replace with your actual form ID
const FORMSPREE_ID = "mwvdobgy";

/* ── TYPES ───────────────────────────────────────────── */
type Lang = "en" | "jp";
type Palette = "ruby" | "cyber" | "amber" | "jade";
type Glass = "highball" | "coupe" | "rocks" | "espresso";
interface MenuItem {
  glass: Glass;
  price: string;
  priceYen: number;
  base: string;
  sweetness: string;
  vibes: string[];
  tags: string[];
  en: { name: string; jp: string; desc: string };
  jp: { name: string; jp: string; desc: string };
}
interface ChatMsg { role: "user" | "bot"; text: string }

/* ── SCROLL REVEAL HOOK ──────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── GLASS SVGs ──────────────────────────────────────── */
const GlassSVG: Record<Glass, ReactElement> = {
  highball: (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10l-1 24H8z"/><path d="M8 12h8"/>
    </svg>
  ),
  coupe: (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16a8 8 0 0 1-16 0z"/><path d="M12 15v9"/><path d="M7 24h10"/>
    </svg>
  ),
  rocks: (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 13H7z"/><path d="M8 13h8"/>
    </svg>
  ),
  espresso: (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16a8 8 0 0 1-16 0z"/><path d="M6 9h12"/><path d="M12 15v9"/><path d="M7 24h10"/>
    </svg>
  ),
};

/* ── MENU DATA ───────────────────────────────────────── */
const MENU: MenuItem[] = [
  { glass:"highball", price:"¥1,200", priceYen:1200, base:"whiskey", sweetness:"balanced", vibes:["after-work","chill"], tags:["sparkling","refreshing","smoky"],
    en:{name:"Neon Highball", jp:"ネオン・ハイボール", desc:"Whiskey, citrus, soda, smoked ice"},
    jp:{name:"ネオン・ハイボール", jp:"Neon Highball", desc:"ウイスキー、柑橘、ソーダ、スモークアイス"} },
  { glass:"coupe", price:"¥1,600", priceYen:1600, base:"gin", sweetness:"balanced", vibes:["romantic","chill"], tags:["yuzu","floral","refreshing"],
    en:{name:"Shinjuku Bloom", jp:"新宿ブルーム", desc:"Gin, yuzu, tonic, floral bitters"},
    jp:{name:"新宿ブルーム", jp:"Shinjuku Bloom", desc:"ジン、ゆず、トニック、フローラルビターズ"} },
  { glass:"rocks", price:"¥1,400", priceYen:1400, base:"umeshu", sweetness:"sweet", vibes:["after-work","romantic","chill"], tags:["plum","smooth","spice"],
    en:{name:"Midnight Ume", jp:"ミッドナイト梅", desc:"Umeshu, plum, spice, lime"},
    jp:{name:"ミッドナイト梅", jp:"Midnight Ume", desc:"梅酒、プラム、スパイス、ライム"} },
  { glass:"espresso", price:"¥1,700", priceYen:1700, base:"vodka", sweetness:"balanced", vibes:["after-work","party"], tags:["coffee","smooth","dessert"],
    en:{name:"Cyber Espresso", jp:"サイバー・エスプレッソ", desc:"Vodka, coffee, cocoa, velvet foam"},
    jp:{name:"サイバー・エスプレッソ", jp:"Cyber Espresso", desc:"ウォッカ、コーヒー、カカオ、ベルベットフォーム"} },
];

/* ── PHOTO HELPER ────────────────────────────────────── */
const usp = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=80&w=${w}&auto=format&fit=crop`;

/* ── HERO POOL (14 IDs — rotates daily, new image every day) ── */
const HERO_POOL = [
  "photo-1683744129482-2cdd6645ed29",
  "photo-1610515660473-c11d4f3f7d37",
  "photo-1773188243990-b50e86881bd7",
  "photo-1655917080333-ab794719f842",
  "photo-1694021256251-ca1607500703",
  "photo-1608060146923-7b8ab13e22bb",
  "photo-1470256699805-a29e1b58598a",
  "photo-1500217052183-bc01eee1a74e",
  "photo-1597075687490-8f673c6c17f6",
  "photo-1525268323446-0505b6fe7778",
  "photo-1543007630-9710e4a00a20",
  "photo-1546171753-97d7676e4602",
  "photo-1514362545857-3bc16c4c7d1b",
  "photo-1572116469696-31de0f17cc34",
];

/* ── ATMOSPHERE POOLS (3 themed sets × 14 IDs each)
   Theme switches every week; within the week a 7-photo
   window slides forward one step each day for daily variety. ── */
const ATMOS_POOL: string[][] = [
  /* Set 0 — dim & intimate: counters, candlelit glassware, dark wood */
  [
    "photo-1772311698901-fe3fa07141be",
    "photo-1778104959337-5260c89e2293",
    "photo-1776775436942-948f84ed2fd2",
    "photo-1778104959469-0861d423de46",
    "photo-1776018396028-d40694777383",
    "photo-1778104959348-e630dabc34e3",
    "photo-1777791374515-372807e0228a",
    "photo-1550426735-c33c7ce414ff",
    "photo-1514361892635-6b07e31e75f9",
    "photo-1706925737212-869d063752c2",
    "photo-1589378938275-947b7adf8665",
    "photo-1583747073667-bef748231eea",
    "photo-1671053807715-675fa581f103",
    "photo-1638884896143-f1b2501e9a61",
  ],
  /* Set 1 — warm craft: cocktail pours, citrus, copper, amber liquid */
  [
    "photo-1607622750671-6cd9a99eabd1",
    "photo-1566417713940-fe7c737a9ef2",
    "photo-1509669803555-fd5edd8d5a41",
    "photo-1578553981438-cebe08c94b4e",
    "photo-1617524455617-ce1e266aa810",
    "photo-1615887023520-e20970765ef8",
    "photo-1611266353853-d370b67187ed",
    "photo-1681732500310-34637949518c",
    "photo-1535958636474-b021ee887b13",
    "photo-1644809818390-9a441722ae24",
    "photo-1574870111867-089730e5a72b",
    "photo-1560512823-829485b8bf24",
    "photo-1551024601-bec78aea704b",
    "photo-1615887023516-9b6bcd559e87",
  ],
  /* Set 2 — neon & Tokyo: neon signs, rain-wet streets, kanji, night exterior */
  [
    "photo-1534214526114-0ea4d47b04f2",
    "photo-1551641506-ee5bf4cb45f1",
    "photo-1542052125323-e69ad37a47c2",
    "photo-1536768139911-e290a59011e4",
    "photo-1559245718-212fba2d22e2",
    "photo-1608874973445-de098faf870f",
    "photo-1572491671626-ca1747c3cc57",
    "photo-1617870314635-fc819547ec11",
    "photo-1634714434666-ef41b76b9cc9",
    "photo-1571866735550-7b1ae3bdb144",
    "photo-1600506112440-cd3b52c88cfe",
    "photo-1579656592043-a20e25a4aa4b",
    "photo-1477763858572-cda7deaa9bc5",
    "photo-1506377247377-2a5b3b417ebb",
  ],
];

/* ── FEATURED COCKTAIL POOL (14 IDs — rotates daily) ── */
const FEAT_POOL = [
  "photo-1574870111867-089730e5a72b",
  "photo-1551024601-bec78aea704b",
  "photo-1514362545857-3bc16c4c7d1b",
  "photo-1607622750671-6cd9a99eabd1",
  "photo-1566417713940-fe7c737a9ef2",
  "photo-1509669803555-fd5edd8d5a41",
  "photo-1617524455617-ce1e266aa810",
  "photo-1560512823-829485b8bf24",
  "photo-1556881261-e41e8db21055",
  "photo-1681732488216-72dced97cac7",
  "photo-1644809818390-9a441722ae24",
  "photo-1556881261-e41e8db21055",
  "photo-1681732500310-34637949518c",
  "photo-1613577813834-5dbb5fd8ada6",
];

/* ── CONTENT ─────────────────────────────────────────── */
const T = {
  en: {
    navMenu:"Menu", navFinder:"Finder", navAtmos:"Atmosphere", navReserve:"Reserve", navAccess:"Access",
    kicker:"Shinjuku · Tokyo Nightlife",
    heroA:"A cyber-modern", heroB:"cocktail hideout.",
    heroSub1:"Bilingual, walk-in friendly, and built for the neon hours.",
    heroSub2:"Reservations recommended on weekends.",
    ctaP:"Reserve a seat", ctaS:"Find your cocktail",
    openLabel:"OPEN NOW · 18:00–03:00",
    openOpen:"OPEN NOW · until 03:00", openClosed:"OPENS TONIGHT · 18:00",
    rating:"4.9 / 5", reviews:"120+ guest reviews",
    badges:["English-friendly","Tourist approved","Cashless OK","Open till 3am"],
    menuTitle:"Signature Menu", menuSub:"A short, well-made list — easy to read, made to be remembered.",
    featLabel:"TONIGHT'S PICK",
    featDesc:"Gin, yuzu and tonic lifted with floral bitters — bright, fragrant, and unmistakably Shinjuku.",
    featNote:"house favourite",
    menuNote:"Allergy information available on request.",
    finderTitle:"Find Your Cocktail", finderSub:"Tell us the mood — our bartender will point you to the right glass.",
    fMood:"MOOD", fSweet:"SWEETNESS", fLikesLbl:"FLAVOURS YOU LIKE", fLikesPh:"citrus, floral",
    fAvoidLbl:"ANYTHING TO AVOID", fAvoidPh:"bitter, smoky",
    bestLabel:"Best match", rankLabel:"Also consider", askAI:"Ask Hana AI", aiPickLabel:"✦ Hana's pick",
    finderTip:"Your best match updates live as you choose. Tap Ask Hana AI for a personal suggestion.",
    moodOpts:[{v:"after-work",l:"After-work"},{v:"chill",l:"Chill"},{v:"romantic",l:"Romantic"},{v:"party",l:"Party"}] as {v:string;l:string}[],
    sweetOpts:[{v:"any",l:"Any"},{v:"dry",l:"Dry"},{v:"balanced",l:"Balanced"},{v:"sweet",l:"Sweet"}] as {v:string;l:string}[],
    atmosTitle:"The Atmosphere", atmosSub:"A red-lit counter tucked off the main street — see the vibe before you visit.",
    reserveTitle:"Reservations", reserveSub:"A quick request — we confirm by email within 24 hours.",
    fName:"Name", fEmail:"Email", fDate:"Date", fTime:"Time", fGuests:"Guests",
    fMsg:"Message (optional)", fSend:"Send request", fSending:"Sending…", fHint:"We'll reply by email within 24 hours. Walk-ins also welcome.",
    fError:"Submission failed. Please try again.",
    sentTitle:"Request received", sentMsg:"We'll confirm your booking by email within 24 hours. See you soon.",
    again:"Make another request", planLabel:"PLAN YOUR NIGHT",
    planRows:[{k:"Hours",v:"Daily 18:00–03:00"},{k:"Last entry",v:"02:00"},{k:"Walk-ins",v:"Always welcome"},{k:"Cover charge",v:"None"},{k:"Payment",v:"Cash & card"}],
    askHost:"Ask Hana about your visit",
    accessTitle:"Find Us", addrLabel:"ADDRESS", addr:"2-2-1 Kabukicho, Shinjuku-ku, Tokyo",
    hoursLabel:"HOURS", hours:"Daily 18:00–03:00 · Last entry 02:00", phoneLabel:"PHONE",
    mapsBtn:"Open in Google Maps",
    footer:"© 2024 Neon Kissa · Shinjuku, Tokyo",
    hanaName:"Hana", hanaRole:"Virtual host at Neon Kissa",
    chatLauncher:"Chat with Hana", chatPh:"Ask about cocktails, hours, or reservations…",
    chatSugg:["What's on tonight?","Best cocktail for me?","How do I get there?"],
    chatWelcome:"Irasshaimase! I'm Hana, your host at Neon Kissa. Ask me about cocktails, our hours, or finding a seat. ✦",
  },
  jp: {
    navMenu:"メニュー", navFinder:"カクテル", navAtmos:"雰囲気", navReserve:"予約", navAccess:"アクセス",
    kicker:"新宿・東京ナイトライフ",
    heroA:"サイバーモダンな", heroB:"カクテルの隠れ家。",
    heroSub1:"バイリンガル対応、ウォークイン歓迎、ネオンの夜のために。",
    heroSub2:"週末のご予約をおすすめします。",
    ctaP:"席を予約する", ctaS:"カクテルを探す",
    openLabel:"営業中 · 18:00–03:00",
    openOpen:"営業中 · 03:00まで", openClosed:"本日 18:00 オープン",
    rating:"4.9 / 5", reviews:"120件以上のレビュー",
    badges:["英語対応","観光客に人気","キャッシュレスOK","深夜3時まで"],
    menuTitle:"シグネチャーメニュー", menuSub:"厳選された短いリスト — 読みやすく、記憶に残る。",
    featLabel:"今夜のおすすめ",
    featDesc:"ジン、ゆず、トニックにフローラルビターズ — 明るく、香り高く、新宿らしい一杯。",
    featNote:"ハウスフェイバリット",
    menuNote:"アレルギー情報はご要望に応じてご提供します。",
    finderTitle:"カクテルを探す", finderSub:"気分を教えてください。バーテンダーが最適なグラスをご案内します。",
    fMood:"気分", fSweet:"甘さ", fLikesLbl:"好きなフレーバー", fLikesPh:"柑橘、フローラル",
    fAvoidLbl:"避けたいもの", fAvoidPh:"苦味、スモーキー",
    bestLabel:"おすすめ", rankLabel:"他にはこちら", askAI:"花AIに聞く", aiPickLabel:"✦ 花のおすすめ",
    finderTip:"リアルタイムで更新されます。花AIにパーソナル提案を聞いてみましょう。",
    moodOpts:[{v:"after-work",l:"仕事帰り"},{v:"chill",l:"リラックス"},{v:"romantic",l:"デート"},{v:"party",l:"盛り上がり"}] as {v:string;l:string}[],
    sweetOpts:[{v:"any",l:"指定なし"},{v:"dry",l:"ドライ"},{v:"balanced",l:"バランス"},{v:"sweet",l:"甘め"}] as {v:string;l:string}[],
    atmosTitle:"雰囲気", atmosSub:"大通りを外れた赤いカウンター — 訪れる前に雰囲気を感じてください。",
    reserveTitle:"予約", reserveSub:"簡単なリクエスト — 24時間以内にメールで確認します。",
    fName:"お名前", fEmail:"メールアドレス", fDate:"日付", fTime:"時間", fGuests:"人数",
    fMsg:"メッセージ（任意）", fSend:"リクエストを送る", fSending:"送信中…", fHint:"24時間以内にメールにてご返信いたします。",
    fError:"送信に失敗しました。再度お試しください。",
    sentTitle:"リクエスト受付完了", sentMsg:"24時間以内にご予約確認メールをお送りします。近いうちにお会いしましょう。",
    again:"別のリクエストをする", planLabel:"ご来店の計画",
    planRows:[{k:"営業時間",v:"毎日18:00〜03:00"},{k:"最終入場",v:"02:00"},{k:"ウォークイン",v:"いつでも歓迎"},{k:"カバーチャージ",v:"なし"},{k:"お支払い",v:"現金・カード"}],
    askHost:"花にご相談ください",
    accessTitle:"アクセス", addrLabel:"住所", addr:"東京都新宿区歌舞伎町2-2-1",
    hoursLabel:"営業時間", hours:"毎日18:00〜03:00・最終入場02:00", phoneLabel:"電話",
    mapsBtn:"Googleマップで開く",
    footer:"© 2024 ネオン喫茶・東京都新宿区",
    hanaName:"花", hanaRole:"ネオン喫茶のバーチャルホスト",
    chatLauncher:"花に話しかける", chatPh:"カクテル・営業時間・予約についてお尋ねください…",
    chatSugg:["今夜は何がある？","私へのおすすめは？","行き方を教えて"],
    chatWelcome:"いらっしゃいませ！ネオン喫茶のホスト、花です。カクテル・営業時間・お席のことなど、何でもお尋ねください。✦",
  },
};

/* ── UTILITIES ───────────────────────────────────────── */
function tokenize(s: string) {
  return (s || "").toLowerCase().split(/[,/| ]+/).map(x => x.trim()).filter(Boolean).slice(0, 10);
}

function scoreItem(item: MenuItem, mood: string, sweet: string, likes: string, avoid: string) {
  let s = 0;
  if (item.vibes.includes(mood)) s += 3;
  if (sweet !== "any") { if (item.sweetness === sweet) s += 2; else s -= 1; }
  for (const w of tokenize(likes)) {
    if (item.tags.includes(w)) s += 2;
    if (item.en.desc.toLowerCase().includes(w) || item.en.name.toLowerCase().includes(w)) s += 1;
  }
  for (const w of tokenize(avoid)) {
    if (item.tags.includes(w) || item.en.desc.toLowerCase().includes(w)) s -= 5;
  }
  return s;
}

function hanaResponse(q: string, lang: Lang): string {
  const text = q.toLowerCase();
  const jp = lang === "jp";
  if (/hours?|open|clos|time|営業|開|閉/.test(text))
    return jp ? "毎日18時から深夜3時まで営業しています。最終入場は2時です。✦" : "We're open daily 18:00–03:00, last entry 02:00. ✦";
  if (/address|where|location|direction|access|map|how.*get|find|住所|場所|アクセス|行き方|駅/.test(text))
    return jp ? "新宿区歌舞伎町にあります。新宿駅東口から徒歩5分です。✦" : "We're in Kabukicho, Shinjuku — 5 min walk from Shinjuku Station east exit. ✦";
  if (/reserv|book|seat|table|予約|席|テーブル/.test(text))
    return jp ? "ページ上の予約フォームからリクエストいただけます。24時間以内にメールで確認します。✦" : "Use the Reserve form on this page — we confirm by email within 24 hours. Walk-ins welcome too! ✦";
  if (/menu|cocktail|drink|whiskey|gin|vodka|umeshu|beer|メニュー|カクテル|飲|ウイスキー|梅酒/.test(text))
    return jp ? "シグネチャーカクテルは4種：ネオン・ハイボール¥1,200、新宿ブルーム¥1,600、ミッドナイト梅¥1,400、サイバー・エスプレッソ¥1,700。✦" : "Four cocktails: Neon Highball ¥1,200, Shinjuku Bloom ¥1,600, Midnight Ume ¥1,400, Cyber Espresso ¥1,700. ✦";
  if (/price|cost|how much|¥|値段|料金|いくら/.test(text))
    return jp ? "カクテルは¥1,200〜¥1,700。カバーチャージなし。✦" : "Cocktails are ¥1,200–¥1,700. No cover charge. ✦";
  if (/english|speak|language|英語/.test(text))
    return jp ? "英語対応スタッフがおります。お気軽にどうぞ。✦" : "Yes — English-friendly staff here, feel right at home! ✦";
  if (/cash|card|pay|cashless|支払|現金|クレジット/.test(text))
    return jp ? "現金・カード両方OK。キャッシュレスも対応。✦" : "Both cash and card accepted. Cashless is fine too. ✦";
  if (/recommend|suggest|best|what should|おすすめ|何がいい/.test(text))
    return jp ? "カクテルファインダーで気分を選ぶとおすすめが表示されます！✦" : "Try the Cocktail Finder above — pick your mood and I'll point you to the perfect glass! ✦";
  if (/hello|hi|hey|こんにちは|いらっしゃい/.test(text))
    return jp ? "いらっしゃいませ！何かお手伝いできますか？✦" : "Irasshaimase! How can I make your evening perfect? ✦";
  return jp
    ? "もう少し詳しく教えていただけますか？カクテル、予約、場所などについてお答えします。✦"
    : "For full details visit us or use the Reserve form — our team will take care of you. ✦";
}

/* ── MAIN APP ────────────────────────────────────────── */
export function NeonKissaApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [palette, setPalette] = useState<Palette>("jade");
  const [fMood, setFMood] = useState("after-work");
  const [fSweet, setFSweet] = useState("any");
  const [fLikes, setFLikes] = useState("");
  const [fAvoid, setFAvoid] = useState("");
  const [aiRec, setAiRec] = useState<{ name: string; reason: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const [heroUrl, setHeroUrl] = useState("");
  const [atmosPhotos, setAtmosPhotos] = useState<string[]>(ATMOS_POOL[0].slice(0, 7));
  const [featImg, setFeatImg] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openNow, setOpenNow] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  /* Scroll-reveal refs */
  const menuReveal    = useReveal();
  const finderReveal  = useReveal();
  const atmosReveal   = useReveal();
  const reserveReveal = useReveal();
  const accessReveal  = useReveal();

  const t = T[lang];

  useEffect(() => {
    try { const s = localStorage.getItem("nk-lang"); if (s === "en" || s === "jp") setLang(s as Lang); } catch {}
    try { const p = localStorage.getItem("nk-pal"); if (["ruby","cyber","amber","jade"].includes(p!)) setPalette(p as Palette); } catch {}
    // days since epoch → daily rotation; weeks → weekly theme switch
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    const weeksSinceEpoch = Math.floor(daysSinceEpoch / 7);
    setHeroUrl(usp(HERO_POOL[daysSinceEpoch % HERO_POOL.length], 2400));
    const themeIdx = weeksSinceEpoch % ATMOS_POOL.length;
    const dayOffset = daysSinceEpoch % 7; // slide 7-photo window forward each day
    setAtmosPhotos(ATMOS_POOL[themeIdx].slice(dayOffset, dayOffset + 7));
    setFeatImg(FEAT_POOL[daysSinceEpoch % FEAT_POOL.length]);
    const nowH = new Date().getHours() + new Date().getMinutes() / 60;
    setOpenNow(nowH >= 18 || nowH < 3); // open daily 18:00–03:00
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", palette);
    try { localStorage.setItem("nk-pal", palette); } catch {}
  }, [palette]);

  useEffect(() => {
    try { localStorage.setItem("nk-lang", lang); } catch {}
  }, [lang]);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMsgs, chatLoading]);

  /* Close mobile nav when a link is tapped */
  useEffect(() => {
    if (!navOpen) return;
    const close = () => setNavOpen(false);
    document.addEventListener("click", close, { once: true });
    return () => document.removeEventListener("click", close);
  }, [navOpen]);

  /* Scroll-to-top visibility + progress beam */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      setShowScrollTop(window.scrollY > 500);
      // Force access active when near page bottom (last section is short)
      if (max > 0 && window.scrollY >= max - 80) setActiveSection("access");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setActiveSection]);

  /* Active nav scroll-spy */
  useEffect(() => {
    const ids = ["top","menu","finder","atmosphere","reserve","access"];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Derived: full ranked list, best match stays as before for Hana AI */
  const rankedMatches = MENU
    .map(it => ({ it, score: scoreItem(it, fMood, fSweet, fLikes, fAvoid) }))
    .sort((a, b) => b.score - a.score);
  const bestMatch = rankedMatches[0].it;

  const askHanaAI = useCallback(async () => {
    setAiLoading(true);
    setAiRec(null);
    const d = lang === "jp" ? bestMatch.jp : bestMatch.en;
    try {
      const prompt = lang === "jp"
        ? `カクテルファインダーで「${d.name}」がおすすめされました。気分は${fMood}、甘さは${fSweet}です。このカクテルが今夜ぴったりな理由を一文で教えてください。`
        : `The Cocktail Finder matched "${d.name}" for mood: ${fMood}, sweetness: ${fSweet}${fLikes ? `, likes: ${fLikes}` : ""}. In one sentence, why is this the perfect pick for tonight?`;
      const res = await fetch("/api/hana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], lang }),
      });
      const data = await res.json();
      setAiRec({ name: d.name, reason: data.reply ?? (lang === "jp" ? "今夜ぴったりの一杯です。✦" : "A perfect match for tonight. ✦") });
    } catch {
      setAiRec({ name: d.name, reason: lang === "jp" ? "今の気分にぴったりの一杯です。✦" : "This one matches your mood perfectly — great choice for tonight. ✦" });
    }
    setAiLoading(false);
  }, [bestMatch, lang, fMood, fSweet, fLikes]);

  const sendChat = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", text: text.trim() };
    const history = [...chatMsgs, userMsg];
    setChatMsgs(history);
    setChatInput("");
    setShowSugg(false);
    setChatLoading(true);
    try {
      const res = await fetch("/api/hana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
          lang,
        }),
      });
      const data = await res.json();
      setChatMsgs(prev => [...prev, { role: "bot", text: data.reply ?? hanaResponse(text, lang) }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: "bot", text: hanaResponse(text, lang) }]);
    }
    setChatLoading(false);
  }, [chatLoading, lang, chatMsgs]);

  const openChat = useCallback(() => {
    setChatOpen(true);
    if (chatMsgs.length === 0) {
      setChatMsgs([{ role: "bot", text: t.chatWelcome }]);
      setShowSugg(true);
    }
  }, [chatMsgs.length, t.chatWelcome]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setFormSent(true);
      } else {
        setFormError(t.fError);
      }
    } catch {
      setFormError(t.fError);
    } finally {
      setFormSubmitting(false);
    }
  }, [t.fError]);

  const baseLabel: Record<string, Record<Lang, string>> = {
    whiskey:{en:"Whiskey",jp:"ウイスキー"}, gin:{en:"Gin",jp:"ジン"}, vodka:{en:"Vodka",jp:"ウォッカ"}, umeshu:{en:"Umeshu",jp:"梅酒"},
  };
  const sweetLabel: Record<string, Record<Lang, string>> = {
    dry:{en:"Dry",jp:"ドライ"}, balanced:{en:"Balanced",jp:"バランス"}, sweet:{en:"Sweet",jp:"甘め"},
  };

  const PALETTES: { key: Palette; color: string; label: string }[] = [
    { key:"ruby",  color:"#ff2e63", label:"Ruby"  },
    { key:"cyber", color:"#00e5ff", label:"Cyber" },
    { key:"amber", color:"#ff9d2e", label:"Amber" },
    { key:"jade",  color:"#2ee6a0", label:"Jade"  },
  ];

  const inputCls = "w-full bg-black/35 border border-white/10 rounded-[10px] px-[13px] py-[11px] text-white text-sm font-[inherit] outline-none transition-colors focus:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]";
  const NAV_LINKS = ["#menu","#finder","#atmosphere","#reserve","#access"] as const;
  const NAV_KEYS  = ["navMenu","navFinder","navAtmos","navReserve","navAccess"] as const;
  const NAV_IDS   = ["menu","finder","atmosphere","reserve","access"] as const;

  /* Current atmosphere tile IDs (updates once per day on mount) */
  const atmos = atmosPhotos;

  /* Live open/closed status (computed client-side to avoid hydration mismatch) */
  const openText = openNow === null ? t.openLabel : openNow ? t.openOpen : t.openClosed;
  const openDot  = openNow === false ? "#ff9d2e" : "#36e08a";

  /* ── RENDER ──────────────────────────────────────── */
  return (
    <>
      {/* SCROLL PROGRESS BEAM */}
      <div aria-hidden className="fixed top-0 left-0 h-[2px] z-[70] pointer-events-none"
        style={{ width:`${scrollProgress * 100}%`, background:"linear-gradient(90deg,var(--accent),var(--accent2))", boxShadow:"0 0 10px var(--accent),0 0 4px var(--accent)" }} />

      {/* GRAIN */}
      <div aria-hidden className="fixed inset-0 z-[60] pointer-events-none mix-blend-overlay opacity-[.06]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:"160px 160px" }} />

      {/* ── HEADER ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-[14px] bg-[rgba(11,8,9,.72)] border-b border-white/[.08]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 h-[60px] md:h-[68px] flex items-center justify-between gap-3">

          {/* Logo */}
          <a href="#top" className="flex items-center gap-[10px] no-underline flex-shrink-0" onClick={() => setNavOpen(false)}>
            <span className="w-[8px] h-[8px] rounded-full bg-[var(--accent)] flex-shrink-0"
              style={{ boxShadow:"0 0 10px var(--accent),0 0 20px color-mix(in srgb,var(--accent) 60%,transparent)", animation:"nkFlicker 4s infinite" }} />
            <span className="mono font-bold tracking-[.28em] text-[13px] md:text-[14px] text-white"
              style={{ textShadow:"0 0 14px color-mix(in srgb,var(--accent) 50%,transparent)" }}>NEON KISSA</span>
            <span className="hidden sm:inline text-[12px] tracking-[.12em]" style={{ color:"#8a7f78" }}>ネオン喫茶</span>
          </a>

          {/* Desktop nav — with active scroll-spy highlight */}
          <nav className="hidden md:flex items-center gap-[30px] text-[13px] tracking-[.05em]">
            {NAV_KEYS.map((k, i) => {
              const isActive = activeSection === NAV_IDS[i];
              return (
                <a key={k} href={NAV_LINKS[i]}
                  className="relative no-underline transition-all pb-[3px]"
                  style={{ color: isActive ? "#fff" : "var(--subtle)", textShadow: isActive ? "0 0 14px color-mix(in srgb,var(--accent) 60%,transparent)" : "none" }}>
                  {t[k]}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background:"var(--accent)", boxShadow:"0 0 8px var(--accent),0 0 3px var(--accent)" }} />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-[10px] md:gap-[14px]">
            {/* Palette swatches */}
            <div className="flex items-center gap-[6px] pr-[10px] md:pr-[14px] border-r border-white/10">
              {PALETTES.map(p => (
                <button key={p.key} onClick={() => setPalette(p.key)} aria-label={`${p.label} theme`}
                  className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-full border-none cursor-pointer p-0 outline-none transition-all hover:scale-[1.18]"
                  style={{ background:p.color, boxShadow:palette===p.key?"0 0 0 2.5px rgba(255,255,255,.7)":"none" }} />
              ))}
            </div>
            {/* Lang toggle */}
            <div className="flex border border-white/[.14] rounded-full overflow-hidden mono text-[11px] tracking-[.1em]">
              {(["en","jp"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-[14px] md:px-[18px] py-[6px] border-none cursor-pointer font-[inherit] text-[inherit] transition-all ${lang===l?"bg-white/10 text-white":"bg-transparent text-[var(--subtle)]"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {/* Reserve button — hidden on mobile */}
            <a href="#reserve"
              className="hidden sm:inline-flex items-center justify-center ml-[8px] mono text-[12px] tracking-[.14em] no-underline px-5 py-[9px] rounded-full transition-all"
              style={{ color:"var(--accent-text)", border:"1px solid color-mix(in srgb,var(--accent) 40%,transparent)", background:"color-mix(in srgb,var(--accent) 8%,transparent)" }}>
              {t.navReserve}
            </a>
            {/* Hamburger — mobile only */}
            <button
              onClick={e => { e.stopPropagation(); setNavOpen(o => !o); }}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              className="flex md:hidden flex-col justify-center items-center gap-[5px] w-[36px] h-[36px] bg-transparent border border-white/[.14] rounded-[8px] cursor-pointer p-0">
              <span className="block w-[16px] h-[1.5px] bg-white transition-all" style={{ transform: navOpen ? "rotate(45deg) translate(4.5px,4.5px)" : "none" }} />
              <span className="block w-[16px] h-[1.5px] bg-white transition-all" style={{ opacity: navOpen ? 0 : 1 }} />
              <span className="block w-[16px] h-[1.5px] bg-white transition-all" style={{ transform: navOpen ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {navOpen && (
          <nav className="md:hidden border-t border-white/[.08] bg-[rgba(11,8,9,.96)]"
            onClick={e => e.stopPropagation()}>
            {NAV_KEYS.map((k, i) => {
              const isActive = activeSection === NAV_IDS[i];
              return (
                <a key={k} href={NAV_LINKS[i]} onClick={() => setNavOpen(false)}
                  className="flex items-center px-5 py-[15px] text-[15px] tracking-[.03em] no-underline border-b border-white/[.06] transition-colors hover:bg-white/[.04]"
                  style={{ color: isActive ? "var(--accent-text)" : "var(--subtle)" }}>
                  <span className="flex-1">{t[k]}</span>
                  <span className="mono text-[11px]" style={{ color:"var(--accent-text)" }}>→</span>
                </a>
              );
            })}
            <div className="px-5 py-4">
              <a href="#reserve" onClick={() => setNavOpen(false)}
                className="block w-full text-center mono text-[13px] tracking-[.1em] no-underline px-4 py-[12px] rounded-full"
                style={{ color:"var(--accent-text)", border:"1px solid color-mix(in srgb,var(--accent) 40%,transparent)", background:"color-mix(in srgb,var(--accent) 8%,transparent)" }}>
                {t.navReserve}
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section id="top" className="relative min-h-[85vh] md:min-h-[90vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage:`linear-gradient(90deg,rgba(11,8,9,.96) 0%,rgba(11,8,9,.78) 32%,rgba(11,8,9,.32) 70%,rgba(11,8,9,.55) 100%),linear-gradient(0deg,#0b0809 2%,rgba(11,8,9,.05) 48%),url('${heroUrl}')` }}>
        <p aria-hidden className="absolute top-[120px] right-[42px] hidden lg:block"
          style={{ writingMode:"vertical-rl", fontSize:13, letterSpacing:".5em", color:"rgba(255,255,255,.24)" }}>
          新宿の夜にともる、ひとつの灯
        </p>
        <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-8 pb-[56px] md:pb-[92px]" style={{ animation:"nkRise .7s ease both" }}>
          <div className="flex items-center gap-[14px] mb-4 md:mb-5">
            <span className="w-[32px] md:w-[48px] h-px flex-shrink-0" style={{ background:"linear-gradient(90deg,var(--accent),transparent)" }} />
            <span className="mono text-[11px] md:text-[12px] tracking-[.28em] md:tracking-[.34em] uppercase" style={{ color:"var(--accent-text)" }}>{t.kicker}</span>
          </div>
          <h1 className="m-0 font-black leading-[.98] tracking-[-0.01em]"
            style={{ fontSize:"clamp(38px,8vw,92px)", textShadow:"0 2px 40px rgba(0,0,0,.6)", maxWidth:"14ch" }}>
            {t.heroA}<br/>
            <span style={{ color:"var(--accent)", textShadow:"0 0 22px color-mix(in srgb,var(--accent) 30%,transparent)" }}>{t.heroB}</span>
          </h1>
          <p className="mt-[20px] md:mt-[26px] text-[15px] md:text-[17px] leading-[1.65]" style={{ color:"#cdc3bc", maxWidth:"42ch" }}>
            {t.heroSub1}<br/><span style={{ color:"#8f857e" }}>{t.heroSub2}</span>
          </p>
          <div className="mt-[28px] md:mt-[34px] flex flex-wrap gap-[12px] md:gap-[14px] items-center">
            <a href="#reserve" className="inline-flex items-center gap-[10px] no-underline font-bold text-[14px] md:text-[15px] px-[22px] md:px-[26px] py-[13px] md:py-[15px] rounded-full text-white transition-all"
              style={{ background:"var(--accent)", boxShadow:"0 6px 22px color-mix(in srgb,var(--accent) 22%,transparent)" }}>
              {t.ctaP} <span className="mono">→</span>
            </a>
            <a href="#finder" className="inline-flex items-center gap-2 no-underline text-[var(--fg)] text-[14px] md:text-[15px] px-5 md:px-6 py-[13px] md:py-[15px] rounded-full border border-white/[.22] transition-all hover:border-white/50 hover:bg-white/[.05]">
              {t.ctaS}
            </a>
          </div>
          <div className="mt-[24px] md:mt-[30px]">
            <span className="inline-flex items-center gap-2 mono text-[11px] md:text-[12px] tracking-[.08em] px-[12px] md:px-[14px] py-[7px] rounded-full"
              style={{ color:"#cdc3bc", border:"1px solid rgba(255,255,255,.14)", background:"rgba(255,255,255,.03)" }}>
              <span className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background:openDot, boxShadow:`0 0 8px ${openDot}`, animation:"nkPulse 2.4s infinite" }} />
              {openText}
            </span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────── */}
      <div className="border-b border-white/[.07] bg-white/[.015]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-[18px] md:py-[22px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-[12px] md:gap-[14px]">
            <span className="text-[16px] md:text-[18px] tracking-[2px]" style={{ color:"#ffc24b" }}>★★★★★</span>
            <div>
              <div className="font-bold text-[14px] md:text-[15px]">{t.rating}</div>
              <div className="text-[11px] md:text-[12px]" style={{ color:"#8a7f78" }}>{t.reviews}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-[8px] md:gap-[10px]">
            {t.badges.map(b => (
              <span key={b} className="mono text-[10px] md:text-[11px] tracking-[.06em] px-[11px] md:px-[13px] py-[6px] md:py-[7px] rounded-[6px]"
                style={{ color:"var(--subtle)", border:"1px solid rgba(255,255,255,.12)" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MENU ────────────────────────────────────── */}
      <section id="menu"
        ref={menuReveal.ref as React.RefObject<HTMLElement>}
        className={`max-w-[1240px] mx-auto px-4 sm:px-8 pt-[64px] md:pt-[104px] pb-[40px] nk-reveal${menuReveal.visible?" is-visible":""}`}
        style={{ scrollMarginTop:68 }}>
        <SectionHead num="01" accent="accent" divider="normal" title={t.menuTitle} jp="献立" sub={t.menuSub} />

        {/* Featured — stacks on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[.9fr_1.1fr] border border-white/10 rounded-[18px] overflow-hidden mb-[24px] md:mb-[30px] bg-white/[.02]">
          <div className="relative h-[200px] md:min-h-[300px] md:h-auto bg-cover bg-center overflow-hidden"
            style={{ backgroundImage:`linear-gradient(0deg,rgba(11,8,9,.5),rgba(11,8,9,.02)),url('${usp(featImg || "photo-1514362545857-3bc16c4c7d1b", 1400)}')` }}>
            <span className="absolute top-[14px] left-[14px] md:top-[18px] md:left-[18px] mono text-[11px] tracking-[.18em] text-white px-3 py-[7px] rounded-[6px]"
              style={{ background:"color-mix(in srgb,var(--accent) 90%,transparent)" }}>{t.featLabel}</span>
          </div>
          <div className="p-[24px] md:p-[38px_40px] flex flex-col justify-center">
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ color:"var(--accent-text)" }}>{GlassSVG.coupe}</span>
              <h3 className="m-0 font-black text-[24px] md:text-[30px]">Shinjuku Bloom</h3>
              <span className="mono text-[13px] md:text-[14px]" style={{ color:"#8a7f78" }}>{lang==="jp"?"Shinjuku Bloom":"新宿ブルーム"}</span>
            </div>
            <p className="mt-[12px] md:mt-[14px] text-[14px] md:text-[15px] leading-[1.6]" style={{ color:"var(--subtle)", maxWidth:"42ch" }}>{t.featDesc}</p>
            <div className="mt-[18px] md:mt-[22px] flex items-center gap-[18px]">
              <span className="mono text-[20px] md:text-[22px]" style={{ color:"var(--accent)" }}>¥1,600</span>
              <span className="text-[12px] italic" style={{ color:"#8a7f78" }}>{t.featNote}</span>
            </div>
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] md:gap-[18px]">
          {MENU.filter(it => it.glass !== "coupe").map(item => {
            const d = lang === "jp" ? item.jp : item.en;
            return (
              <div key={item.glass}
                className="flex flex-col gap-3 p-[18px_20px] md:p-[24px_26px] border border-white/10 rounded-[14px] bg-white/[.025] overflow-hidden transition-all duration-[250ms] hover:-translate-y-[3px]"
                style={{ borderColor:"rgba(255,255,255,.1)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="color-mix(in srgb,var(--accent) 40%,transparent)"; e.currentTarget.style.boxShadow="0 10px 34px color-mix(in srgb,var(--accent) 14%,transparent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; e.currentTarget.style.boxShadow="none"; }}>
                <div className="flex gap-[12px] md:gap-[14px] items-start flex-1">
                  <span style={{ color:"var(--accent-text)", flexShrink:0 }}>{GlassSVG[item.glass]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-[8px] flex-wrap">
                      <p className="m-0 font-bold text-[16px] md:text-[17px]">{d.name}</p>
                      <span className="mono text-[11px]" style={{ color:"#8a7f78" }}>{d.jp}</span>
                    </div>
                    <p className="mt-[6px] md:mt-2 text-[13px] leading-[1.55]" style={{ color:"var(--muted)" }}>{d.desc}</p>
                  </div>
                </div>
                <p className="m-0 mono text-[16px] md:text-[17px] mt-auto pt-[10px]" style={{ color:"var(--accent)" }}>{item.price}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 md:mt-7 text-center text-[12px] md:text-[13px]" style={{ color:"#7a6f68" }}>{t.menuNote}</p>
      </section>

      {/* ── FINDER ──────────────────────────────────── */}
      <section id="finder"
        ref={finderReveal.ref as React.RefObject<HTMLElement>}
        className={`max-w-[1240px] mx-auto px-4 sm:px-8 pt-[64px] md:pt-[104px] pb-[64px] md:pb-[104px] nk-reveal${finderReveal.visible?" is-visible":""}`}
        style={{ scrollMarginTop:68 }}>
        <SectionHead num="02" accent="accent2" divider="dual" title={t.finderTitle} jp="一杯を探す" sub={t.finderSub} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] md:gap-[22px] items-stretch">
          {/* Controls */}
          <div className="border border-white/10 rounded-[18px] p-[22px] md:p-[30px] bg-white/[.025]">
            <FilterGroup label={t.fMood} options={t.moodOpts} value={fMood} onChange={setFMood} />
            <FilterGroup label={t.fSweet} options={t.sweetOpts} value={fSweet} onChange={setFSweet} />
            <p className="m-0 mb-[10px] text-[12px] tracking-[.04em]" style={{ color:"#8a7f78" }}>{t.fLikesLbl}</p>
            <input className={inputCls} style={{ marginBottom:16 }} placeholder={t.fLikesPh} value={fLikes} onChange={e => setFLikes(e.target.value)} />
            <p className="m-0 mb-2 text-[12px] tracking-[.04em]" style={{ color:"#8a7f78" }}>{t.fAvoidLbl}</p>
            <input className={inputCls} placeholder={t.fAvoidPh} value={fAvoid} onChange={e => setFAvoid(e.target.value)} />
            <p className="mt-[16px] md:mt-[18px] text-[12px] leading-[1.5]" style={{ color:"#6f655e" }}>{t.finderTip}</p>
          </div>

          {/* Best match + ranked list */}
          <div className="rounded-[18px] p-[22px] md:p-[30px]"
            style={{ border:"1px solid color-mix(in srgb,var(--accent) 28%,transparent)", background:"linear-gradient(180deg,color-mix(in srgb,var(--accent) 6%,transparent),rgba(255,255,255,.02))", boxShadow:"0 0 30px color-mix(in srgb,var(--accent) 8%,transparent) inset" }}>
            <div className="flex items-center justify-between gap-3 mb-[16px] md:mb-[18px]">
              <span className="mono text-[11px] tracking-[.2em] uppercase" style={{ color:"var(--accent-text)" }}>{t.bestLabel}</span>
              <span className="mono text-[16px]" style={{ color:"var(--accent)" }}>{bestMatch.price}</span>
            </div>
            <div className="flex items-start gap-4">
              <span style={{ color:"var(--accent-text)", transform:"scale(1.25)", transformOrigin:"top left", flexShrink:0 }}>{GlassSVG[bestMatch.glass]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-[10px] flex-wrap">
                  <h3 className="m-0 font-extrabold text-[20px] md:text-[22px]">{(lang==="jp"?bestMatch.jp:bestMatch.en).name}</h3>
                  <span className="mono text-[12px] md:text-[13px]" style={{ color:"#8a7f78" }}>{(lang==="jp"?bestMatch.jp:bestMatch.en).jp}</span>
                </div>
                <p className="mt-2 text-[13px] md:text-[14px] leading-[1.55]" style={{ color:"var(--subtle)" }}>{(lang==="jp"?bestMatch.jp:bestMatch.en).desc}</p>
                <p className="mt-2 text-[12px]" style={{ color:"#8a7f78" }}>
                  {(baseLabel[bestMatch.base]||{})[lang]||bestMatch.base} · {(sweetLabel[bestMatch.sweetness]||{})[lang]||bestMatch.sweetness}
                </p>
                <div className="mt-3 flex flex-wrap gap-[7px]">
                  {bestMatch.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-[10px] py-1 rounded-full"
                      style={{ color:"#8fd9ff", border:"1px solid rgba(10,170,221,.3)", background:"rgba(10,170,221,.1)" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={askHanaAI} disabled={aiLoading}
              className="mt-[20px] md:mt-[22px] w-full inline-flex items-center justify-center gap-2 text-[14px] font-[inherit] px-[18px] py-3 rounded-[12px] cursor-pointer transition-all disabled:opacity-60"
              style={{ border:"1px solid color-mix(in srgb,var(--accent2) 40%,transparent)", background:"color-mix(in srgb,var(--accent2) 12%,transparent)", color:"#d7b8ff" }}>
              <span>✦</span><span>{aiLoading ? (lang==="jp"?"確認中…":"Asking Hana…") : t.askAI}</span>
            </button>
            {aiRec && (
              <div className="mt-[14px] rounded-[12px] p-[14px_16px]" style={{ border:"1px solid color-mix(in srgb,var(--accent2) 28%,transparent)", background:"color-mix(in srgb,var(--accent2) 8%,transparent)", animation:"nkPop .3s ease both" }}>
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="mono text-[11px]" style={{ color:"#c79bff" }}>{t.aiPickLabel}</span>
                  <button onClick={() => setAiRec(null)} className="bg-transparent border-none text-[13px] cursor-pointer leading-none p-[2px]" style={{ color:"#8a7f78" }}>✕</button>
                </div>
                <p className="m-0 font-bold text-[15px] text-white">{aiRec.name}</p>
                <p className="mt-1 text-[13px] leading-[1.5]" style={{ color:"var(--subtle)" }}>{aiRec.reason}</p>
              </div>
            )}

            {/* Ranked 2nd & 3rd */}
            {rankedMatches.length > 1 && (
              <div className="mt-[20px] pt-[18px] border-t border-white/[.08]">
                <p className="m-0 mb-[12px] mono text-[11px] tracking-[.16em] uppercase" style={{ color:"#6f655e" }}>{t.rankLabel}</p>
                <div className="flex flex-col gap-[10px]">
                  {rankedMatches.slice(1, 3).map(({ it }, idx) => {
                    const d = lang === "jp" ? it.jp : it.en;
                    return (
                      <div key={it.glass} className="flex items-center gap-3 p-[12px_14px] rounded-[12px]"
                        style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)" }}>
                        <span className="mono text-[11px] font-bold w-[22px] text-center flex-shrink-0" style={{ color:"#6f655e" }}>#{idx + 2}</span>
                        <span style={{ color:"var(--subtle)", flexShrink:0 }}>{GlassSVG[it.glass]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="m-0 text-[13px] font-bold truncate">{d.name}</p>
                          <div className="flex gap-[6px] mt-[4px]">
                            {it.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] px-[8px] py-[3px] rounded-full"
                                style={{ color:"#8a7f78", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <span className="mono text-[13px] whitespace-nowrap flex-shrink-0" style={{ color:"var(--muted)" }}>{it.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ATMOSPHERE ──────────────────────────────── */}
      <section id="atmosphere"
        ref={atmosReveal.ref as React.RefObject<HTMLElement>}
        className={`max-w-[1240px] mx-auto px-4 sm:px-8 pt-[64px] md:pt-[104px] pb-[64px] md:pb-[104px] nk-reveal${atmosReveal.visible?" is-visible":""}`}
        style={{ scrollMarginTop:68 }}>
        <SectionHead num="03" accent="accent2" divider="dual" title={t.atmosTitle} jp="雰囲気" sub={t.atmosSub} />

        {isMobile ? (
          <div className="grid grid-cols-2 gap-[10px]" style={{ gridAutoRows:"140px" }}>
            <AtmosTile url={usp(atmos[0],800)} />
            <AtmosTile url={usp(atmos[1],800)} />
            <AtmosTile url={usp(atmos[2],800)} />
            <AtmosTile url={usp(atmos[3],800)} />
            <AtmosTile url={usp(atmos[4],800)} />
            <AtmosTile url={usp(atmos[5],800)} />
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns:"repeat(4,1fr)", gridAutoRows:"168px" }}>
            <AtmosTile url={usp(atmos[0],1600)} col="1/3" row="1/3" />
            <AtmosTile url={usp(atmos[1],800)} col="3" row="1" />
            <AtmosTile url={usp(atmos[2],800)} col="4" row="1/3" />
            <AtmosTile url={usp(atmos[3],800)} col="3" row="2" />
            <AtmosTile url={usp(atmos[4],800)} col="1" row="3" />
            <AtmosTile url={usp(atmos[5],1200)} col="2/4" row="3" />
            <AtmosTile url={usp(atmos[6],800)} col="4" row="3" />
          </div>
        )}
      </section>

      {/* ── RESERVE ─────────────────────────────────── */}
      <section id="reserve"
        ref={reserveReveal.ref as React.RefObject<HTMLElement>}
        className={`border-t border-b border-white/[.07] bg-white/[.015] nk-reveal${reserveReveal.visible?" is-visible":""}`}
        style={{ scrollMarginTop:68 }}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-[64px] md:pt-[104px] pb-[64px] md:pb-[104px]">
          <SectionHead num="04" accent="green" divider="green" title={t.reserveTitle} jp="予約" sub={t.reserveSub} />
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_.85fr] gap-[18px] md:gap-[22px] items-stretch">
            <div className="border border-white/[.12] rounded-[18px] p-[22px] md:p-8 bg-[rgba(11,8,9,.5)]">
              {!formSent ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fName}<input name="name" required className={inputCls} /></label>
                    <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fEmail}<input name="email" required type="email" className={inputCls} /></label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fDate}<input name="date" type="date" className={inputCls} style={{ colorScheme:"dark" }} /></label>
                    <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fTime}<input name="time" type="time" className={inputCls} style={{ colorScheme:"dark" }} /></label>
                    <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fGuests}<input name="guests" type="number" min="1" max="12" defaultValue="2" className={inputCls} /></label>
                  </div>
                  <label className="flex flex-col gap-[7px] text-[13px]" style={{ color:"var(--subtle)" }}>{t.fMsg}<textarea name="message" rows={3} className={inputCls + " resize-y"} /></label>
                  <div className="flex flex-col gap-2">
                    <button type="submit" disabled={formSubmitting}
                      className="self-start font-bold text-[15px] font-[inherit] border-none px-7 py-[14px] rounded-full cursor-pointer text-white transition-all disabled:opacity-60"
                      style={{ background:"var(--accent)", boxShadow:"0 0 22px color-mix(in srgb,var(--accent) 45%,transparent)" }}>
                      {formSubmitting ? t.fSending : t.fSend}
                    </button>
                    {formError && (
                      <p className="text-[13px]" style={{ color:"#ff6b7a" }}>{formError}</p>
                    )}
                  </div>
                  <p className="text-[12px]" style={{ color:"#7a6f68" }}>{t.fHint}</p>
                </form>
              ) : (
                <div className="text-center py-[34px]">
                  <div className="w-[62px] h-[62px] rounded-full mx-auto mb-[18px] flex items-center justify-center text-[30px]"
                    style={{ background:"rgba(54,224,138,.12)", border:"1px solid rgba(54,224,138,.45)", color:"#36e08a" }}>✓</div>
                  <h3 className="m-0 font-bold text-[21px]">{t.sentTitle}</h3>
                  <p className="mt-[10px] mb-[22px] text-[14px]" style={{ color:"var(--muted)" }}>{t.sentMsg}</p>
                  <button onClick={() => setFormSent(false)} className="bg-transparent border border-white/[.18] font-[inherit] text-[13px] px-5 py-[9px] rounded-full cursor-pointer transition-all hover:text-white hover:border-white/40"
                    style={{ color:"var(--subtle)" }}>{t.again}</button>
                </div>
              )}
            </div>
            <div className="border border-white/10 rounded-[18px] p-[22px] md:p-[30px] bg-white/[.02]">
              <div className="mono text-[11px] tracking-[.2em] uppercase mb-[16px] md:mb-[18px]" style={{ color:"var(--accent-text)" }}>{t.planLabel}</div>
              {t.planRows.map(r => (
                <div key={r.k} className="flex justify-between gap-[14px] py-[12px] md:py-[13px] border-b border-white/[.07]">
                  <span className="text-[13px]" style={{ color:"#8a7f78" }}>{r.k}</span>
                  <span className="text-[13px] text-right" style={{ color:"#e6ddd6" }}>{r.v}</span>
                </div>
              ))}
              <button onClick={openChat} className="inline-flex items-center gap-2 mt-5 mono text-[12px] tracking-[.08em] px-[14px] py-[9px] rounded-full cursor-pointer font-[inherit] transition-all"
                style={{ color:"#d7b8ff", background:"color-mix(in srgb,var(--accent2) 10%,transparent)", border:"1px solid color-mix(in srgb,var(--accent2) 30%,transparent)" }}>
                ✦ {t.askHost}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCESS ──────────────────────────────────── */}
      <section id="access"
        ref={accessReveal.ref as React.RefObject<HTMLElement>}
        className={`max-w-[1240px] mx-auto px-4 sm:px-8 pt-[64px] md:pt-[90px] pb-[48px] md:pb-[60px] nk-reveal${accessReveal.visible?" is-visible":""}`}
        style={{ scrollMarginTop:68 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[48px] items-center">
          <div>
            <div className="w-16 h-px mb-4" style={{ background:"linear-gradient(90deg,var(--accent),transparent)" }} />
            <h2 className="m-0 font-black mb-[18px] md:mb-[22px]" style={{ fontSize:"clamp(26px,3vw,40px)" }}>
              {t.accessTitle} <span className="font-medium" style={{ color:"#7a6f68", fontSize:".5em" }}>道案内</span>
            </h2>
            <div className="flex flex-col gap-[14px] md:gap-4 text-[14px] md:text-[15px]">
              <div>
                <div className="mono text-[11px] tracking-[.16em] uppercase mb-1" style={{ color:"#8a7f78" }}>{t.addrLabel}</div>
                <div>{t.addr}</div>
              </div>
              <div>
                <div className="mono text-[11px] tracking-[.16em] uppercase mb-1" style={{ color:"#8a7f78" }}>{t.hoursLabel}</div>
                <div>{t.hours}</div>
              </div>
              <div className="flex gap-[32px] md:gap-[40px]">
                <div>
                  <div className="mono text-[11px] tracking-[.16em] uppercase mb-1" style={{ color:"#8a7f78" }}>{t.phoneLabel}</div>
                  <a href="tel:+81353620000" className="hover:opacity-75 transition-opacity">+81 3-5362-XXXX</a>
                </div>
                <div>
                  <div className="mono text-[11px] tracking-[.16em] uppercase mb-1" style={{ color:"#8a7f78" }}>Email</div>
                  <a href="mailto:hello@neonkissa.jp" className="hover:opacity-75 transition-opacity">hello@neonkissa.jp</a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps link — replaces the old placeholder */}
          <a href="https://www.google.com/maps/search/?api=1&query=2-2-1+Kabukicho+Shinjuku+Tokyo"
            target="_blank" rel="noopener noreferrer"
            className="group no-underline h-[220px] md:h-[300px] rounded-[16px] overflow-hidden flex flex-col items-center justify-center gap-5 transition-all"
            style={{ border:"1px solid rgba(255,255,255,.12)", background:"rgba(255,255,255,.02)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor="color-mix(in srgb,var(--accent) 45%,transparent)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor="rgba(255,255,255,.12)")}>
            <svg width="36" height="44" viewBox="0 0 36 44" fill="none" aria-hidden>
              <path d="M18 2C10.268 2 4 8.268 4 16c0 10.5 14 26 14 26S32 26.5 32 16c0-7.732-6.268-14-14-14z"
                fill="color-mix(in srgb,var(--accent) 20%,transparent)"
                stroke="var(--accent)" strokeWidth="1.5"/>
              <circle cx="18" cy="16" r="5" fill="var(--accent)" opacity=".9"/>
            </svg>
            <div className="text-center px-6">
              <p className="m-0 text-[14px] font-medium" style={{ color:"var(--subtle)" }}>{t.addr}</p>
              <span className="inline-flex items-center gap-[6px] mt-3 mono text-[12px] tracking-[.1em] px-[16px] py-[9px] rounded-full transition-all"
                style={{ color:"var(--accent-text)", border:"1px solid color-mix(in srgb,var(--accent) 35%,transparent)", background:"color-mix(in srgb,var(--accent) 7%,transparent)" }}>
                {t.mapsBtn} ↗
              </span>
            </div>
          </a>
        </div>
      </section>

      <footer className="border-t border-white/[.08]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-[24px] md:py-[30px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-[10px]">
            <span className="w-2 h-2 rounded-full" style={{ background:"var(--accent)", boxShadow:"0 0 10px var(--accent)" }} />
            <span className="mono font-bold tracking-[.28em] text-[13px]">NEON KISSA</span>
          </div>
          <span className="text-[12px]" style={{ color:"#6f655e" }}>{t.footer}</span>
        </div>
      </footer>

      {/* ── SCROLL TO TOP ────────────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed left-[14px] md:left-[22px] bottom-[14px] md:bottom-[22px] z-[79] w-[46px] h-[46px] rounded-full border-none cursor-pointer flex items-center justify-center text-white text-[18px] font-bold"
          style={{ background:"var(--accent)", boxShadow:"0 4px 18px color-mix(in srgb,var(--accent) 45%,transparent)", animation:"nkPop .22s ease both" }}>
          ↑
        </button>
      )}

      {/* ── CHATBOT ─────────────────────────────────── */}
      <div className="fixed right-[14px] md:right-[22px] bottom-[14px] md:bottom-[22px] z-[80] flex flex-col items-end gap-[12px] md:gap-[14px]">
        {chatOpen && (
          <div
            className="flex flex-col rounded-[18px] md:rounded-[20px] overflow-hidden"
            style={{
              width: isMobile ? "calc(100vw - 28px)" : "368px",
              height: isMobile ? "calc(100vh - 120px)" : "540px",
              maxHeight: "calc(100vh - 120px)",
              background:"rgba(16,11,13,.97)", backdropFilter:"blur(16px)",
              border:"1px solid color-mix(in srgb,var(--accent) 28%,transparent)",
              boxShadow:"0 24px 70px rgba(0,0,0,.65),0 0 44px color-mix(in srgb,var(--accent) 16%,transparent)",
              animation:"nkPop .28s ease both"
            }}>
            <div className="flex items-center gap-3 p-[14px_16px] md:p-[16px_18px] border-b border-white/[.08]"
              style={{ background:"color-mix(in srgb,var(--accent) 6%,transparent)" }}>
              <div className="w-[38px] h-[38px] md:w-[40px] md:h-[40px] rounded-full flex-shrink-0 flex items-center justify-center text-[17px] md:text-[19px] text-white"
                style={{ background:"radial-gradient(circle at 35% 30%,var(--accent-text),var(--accent))", boxShadow:"0 0 16px color-mix(in srgb,var(--accent) 55%,transparent)" }}>花</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[7px]">
                  <span className="font-bold text-[14px] md:text-[15px]">{t.hanaName}</span>
                  <span className="w-[7px] h-[7px] rounded-full" style={{ background:"#36e08a", boxShadow:"0 0 7px #36e08a", animation:"nkPulse 2.4s infinite" }} />
                </div>
                <div className="text-[11px]" style={{ color:"#8a7f78" }}>{t.hanaRole}</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="bg-transparent border-none text-[20px] leading-none p-1 cursor-pointer" style={{ color:"#8a7f78" }}>✕</button>
            </div>

            <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-[14px] md:p-[18px] flex flex-col gap-[10px] md:gap-[11px]">
              {chatMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                  <div className="max-w-[85%] px-[12px] py-[9px] rounded-[13px] text-[14px] leading-[1.5] whitespace-pre-wrap"
                    style={ m.role==="user"
                      ? { background:"color-mix(in srgb,var(--accent) 20%,transparent)", color:"var(--fg)", border:"1px solid color-mix(in srgb,var(--accent) 35%,transparent)" }
                      : { background:"rgba(255,255,255,.06)", color:"var(--fg)", border:"1px solid rgba(255,255,255,.1)" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-[5px] px-[15px] py-3 rounded-[14px] bg-white/[.06] border border-white/10">
                    {[0,.2,.4].map((d,i) => <span key={i} className="w-[6px] h-[6px] rounded-full" style={{ background:"var(--accent-text)", animation:`nkDot 1.2s ${d}s infinite` }} />)}
                  </div>
                </div>
              )}
            </div>

            {showSugg && chatMsgs.length <= 1 && (
              <div className="flex flex-wrap gap-[7px] px-[14px] md:px-[18px] pb-3">
                {t.chatSugg.map(s => (
                  <button key={s} onClick={() => sendChat(s)}
                    className="text-[12px] px-3 py-[7px] rounded-full font-[inherit] cursor-pointer transition-all"
                    style={{ color:"#cdc3bc", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.14)" }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 p-[12px_14px] md:p-[14px_16px] border-t border-white/[.08]">
              <input className="flex-1 bg-black/40 border border-white/10 rounded-[12px] px-[14px] py-[11px] text-white text-[14px] font-[inherit] outline-none"
                value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && sendChat(chatInput)}
                placeholder={t.chatPh} />
              <button onClick={() => sendChat(chatInput)}
                className="w-[44px] rounded-[12px] border-none text-white text-[17px] flex-shrink-0 cursor-pointer"
                style={{ background:"var(--accent)", boxShadow:"0 0 16px color-mix(in srgb,var(--accent) 40%,transparent)" }}>→</button>
            </div>
          </div>
        )}

        <button onClick={openChat}
          className="inline-flex items-center gap-[8px] md:gap-[10px] border-none text-white font-[inherit] font-bold text-[13px] md:text-[14px] px-[16px] md:px-5 py-[11px] md:py-[13px] rounded-full cursor-pointer"
          style={{ background:"linear-gradient(135deg,var(--accent),var(--accent2))", boxShadow:"0 8px 30px color-mix(in srgb,var(--accent) 40%,transparent)" }}>
          <span className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-full bg-white/20 flex items-center justify-center text-[14px] md:text-[15px]">花</span>
          {t.chatLauncher}
        </button>
      </div>
    </>
  );
}

/* ── SUB-COMPONENTS ──────────────────────────────────── */
function SectionHead({ num, accent, divider, title, jp, sub }: { num:string; accent:"accent"|"accent2"|"green"; divider:"normal"|"dual"|"green"; title:string; jp:string; sub:string }) {
  const strokeColor = {
    accent: "color-mix(in srgb,var(--accent) 50%,transparent)",
    accent2: "color-mix(in srgb,var(--accent2) 50%,transparent)",
    green: "rgba(54,224,138,.5)",
  }[accent];
  const dividerBg = {
    normal: "linear-gradient(90deg,var(--accent),transparent)",
    dual: "linear-gradient(90deg,var(--accent),var(--accent2),transparent)",
    green: "linear-gradient(90deg,#36e08a,#0ad,transparent)",
  }[divider];
  return (
    <div className="flex items-start gap-4 md:gap-7 mb-8 md:mb-11">
      <span className="mono text-[36px] md:text-[52px] leading-none font-bold flex-shrink-0" style={{ color:"transparent", WebkitTextStroke:`1px ${strokeColor}` }}>{num}</span>
      <div>
        <div className="w-12 md:w-16 h-px mb-[12px] md:mb-[14px]" style={{ background:dividerBg }} />
        <h2 className="m-0 font-black leading-[1.04]" style={{ fontSize:"clamp(24px,3.4vw,44px)" }}>
          {title} <span className="font-medium" style={{ color:"#7a6f68", fontSize:".5em" }}>{jp}</span>
        </h2>
        <p className="mt-[8px] md:mt-[10px] text-[14px] md:text-[15px]" style={{ color:"var(--muted)", maxWidth:"52ch" }}>{sub}</p>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label:string; options:{v:string;l:string}[]; value:string; onChange:(v:string)=>void }) {
  return (
    <>
      <p className="m-0 mb-[10px] text-[12px] tracking-[.04em]" style={{ color:"#8a7f78" }}>{label}</p>
      <div className="flex flex-wrap gap-[8px] md:gap-[9px] mb-[18px] md:mb-[22px]">
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)}
            className="border rounded-full px-[13px] md:px-[15px] py-[8px] md:py-2 text-[13px] font-[inherit] cursor-pointer transition-all"
            style={ value===o.v
              ? { borderColor:"color-mix(in srgb,var(--accent) 60%,transparent)", background:"color-mix(in srgb,var(--accent) 12%,transparent)", color:"var(--accent-text)" }
              : { borderColor:"rgba(255,255,255,.14)", background:"none", color:"var(--subtle)" }}>
            {o.l}
          </button>
        ))}
      </div>
    </>
  );
}

function AtmosTile({ url, col, row }: { url:string; col?:string; row?:string }) {
  return (
    <div className="relative rounded-[12px] md:rounded-[14px] overflow-hidden border border-white/[.08] bg-[#0b0809]"
      style={{ gridColumn:col, gridRow:row }}>
      <div className="absolute inset-0 nk-shimmer" />
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{ backgroundImage:`url('${url}')`, transitionTimingFunction:"cubic-bezier(.2,.7,.2,1)" }}
        onMouseEnter={e => (e.currentTarget.style.transform="scale(1.06)")}
        onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} />
    </div>
  );
}
