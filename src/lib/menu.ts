/* ── MENU + BAR CLOCK ────────────────────────────────────
   Shared by the page and the Hana API route, so the menu cards,
   Tonight's Pick and Hana always describe the same drinks. */

export type Glass = "highball" | "coupe" | "rocks" | "espresso";

export interface MenuItem {
  glass: Glass;
  price: string;
  priceYen: number;
  base: string;
  sweetness: string;
  vibes: string[];
  tags: string[];
  en: { name: string; jp: string; desc: string; feat: string };
  jp: { name: string; jp: string; desc: string; feat: string };
}

export const MENU: MenuItem[] = [
  { glass:"highball", price:"¥1,200", priceYen:1200, base:"whiskey", sweetness:"balanced", vibes:["after-work","chill"], tags:["sparkling","refreshing","smoky"],
    en:{name:"Neon Highball", jp:"ネオン・ハイボール", desc:"Whiskey, citrus, soda, smoked ice",
      feat:"Whiskey and bright citrus topped with soda over smoked ice - crisp, a little smoky, and made for the first drink of the night."},
    jp:{name:"ネオン・ハイボール", jp:"Neon Highball", desc:"ウイスキー、柑橘、ソーダ、スモークアイス",
      feat:"ウイスキーと柑橘をソーダで割り、スモークアイスで - 爽快でほのかにスモーキー、夜の最初の一杯に。"} },
  { glass:"coupe", price:"¥1,600", priceYen:1600, base:"gin", sweetness:"balanced", vibes:["romantic","chill"], tags:["yuzu","floral","refreshing"],
    en:{name:"Shinjuku Bloom", jp:"新宿ブルーム", desc:"Gin, yuzu, tonic, floral bitters",
      feat:"Gin, yuzu and tonic lifted with floral bitters - bright, fragrant, and unmistakably Shinjuku."},
    jp:{name:"新宿ブルーム", jp:"Shinjuku Bloom", desc:"ジン、ゆず、トニック、フローラルビターズ",
      feat:"ジン、ゆず、トニックにフローラルビターズ - 明るく、香り高く、新宿らしい一杯。"} },
  { glass:"rocks", price:"¥1,400", priceYen:1400, base:"umeshu", sweetness:"sweet", vibes:["after-work","romantic","chill"], tags:["plum","smooth","spice"],
    en:{name:"Midnight Ume", jp:"ミッドナイト梅", desc:"Umeshu, plum, spice, lime",
      feat:"Umeshu and ripe plum warmed with spice and cut with lime - smooth, sweet, and best sipped slowly after midnight."},
    jp:{name:"ミッドナイト梅", jp:"Midnight Ume", desc:"梅酒、プラム、スパイス、ライム",
      feat:"梅酒と熟したプラムにスパイス、ライムで引き締めて - まろやかで甘く、真夜中にゆっくりと。"} },
  { glass:"espresso", price:"¥1,700", priceYen:1700, base:"vodka", sweetness:"balanced", vibes:["after-work","party"], tags:["coffee","smooth","dessert"],
    en:{name:"Cyber Espresso", jp:"サイバー・エスプレッソ", desc:"Vodka, coffee, cocoa, velvet foam",
      feat:"Vodka, fresh coffee and cocoa under a velvet foam - rich, bold, and the one that keeps the night going."},
    jp:{name:"サイバー・エスプレッソ", jp:"Cyber Espresso", desc:"ウォッカ、コーヒー、カカオ、ベルベットフォーム",
      feat:"ウォッカ、コーヒー、カカオにベルベットフォーム - 濃厚で力強く、夜を続けたくなる一杯。"} },
];

/* Tokyo has no daylight saving, so it is always UTC+9. */
const TOKYO_OFFSET_MS = 9 * 3600000;

/** Current hour in Tokyo as a fraction (e.g. 23.5), whatever the visitor's timezone. */
export function tokyoHour(now = Date.now()) {
  const d = new Date(now + TOKYO_OFFSET_MS);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
}

/** Open daily 18:00–03:00 Tokyo time. */
export function isOpenNow(now = Date.now()) {
  const h = tokyoHour(now);
  return h >= 18 || h < 3;
}

/** Today's date in Tokyo as YYYY-MM-DD, for the reservation date picker. */
export function tokyoDateISO(now = Date.now()) {
  return new Date(now + TOKYO_OFFSET_MS).toISOString().slice(0, 10);
}

/** Days since epoch - the index the daily photo rotation already uses.
    It rolls over at 09:00 Tokyo, so a night's pick never changes mid-service. */
export function daysSinceEpoch(now = Date.now()) {
  return Math.floor(now / 86400000);
}

/** Tonight's Pick rotates through the menu, one drink per night. */
export function tonightsPick(now = Date.now()): MenuItem {
  return MENU[daysSinceEpoch(now) % MENU.length];
}
