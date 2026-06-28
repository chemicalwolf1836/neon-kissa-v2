import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const client = new Anthropic();

const SYSTEM = `You are Hana (花), the host of Neon Kissa, a Tokyo cocktail bar in Kabukicho, Shinjuku. You are warm, knowledgeable about cocktails, and a little playful. Keep answers to 1–2 sentences. Always end with ✦.

Bar info:
- Hours: Daily 18:00–03:00, last entry 02:00
- Location: Kabukicho, Shinjuku — 5 min walk from Shinjuku Station east exit
- No cover charge. Cash and card accepted.
- Reservations via the form on this page; confirmed by email within 24 hours.
- English-friendly staff.

Cocktail menu (only recommend these four):
1. Neon Highball (ネオン・ハイボール) ¥1,200 — Whisky, yuzu soda, salt rim. Dry & refreshing.
2. Shinjuku Bloom (新宿ブルーム) ¥1,600 — Gin, elderflower, cucumber. Balanced & floral.
3. Midnight Ume (ミッドナイト梅) ¥1,400 — Umeshu, plum bitters, dark cherry. Sweet & complex.
4. Cyber Espresso (サイバー・エスプレッソ) ¥1,700 — Espresso martini with shochu. Bold & bitter.

Never invent menu items, prices, or hours beyond what is listed above. Respond in the same language as the user.`;

export async function POST(req: NextRequest) {
  let lang = "en";
  try {
    const body = await req.json() as {
      messages: { role: string; content: string }[];
      lang?: string;
    };
    lang = body.lang ?? "en";

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM,
      messages: body.messages.map(m => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch {
    const fallback = lang === "jp"
      ? "少し混んでいます。また後でお試しください。✦"
      : "I'm a little busy right now — try again in a moment! ✦";
    return NextResponse.json({ reply: fallback }, { status: 200 });
  }
}
