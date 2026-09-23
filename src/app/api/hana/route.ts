import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { MENU, tonightsPick } from "@/lib/menu";

export const runtime = "nodejs";

const client = new Anthropic();

const SWEETNESS: Record<string, string> = { dry: "Dry", balanced: "Balanced", sweet: "Sweet" };

// Built from the same data as the menu cards, so Hana never describes a drink
// differently from the page.
const MENU_LINES = MENU.map((it, i) =>
  `${i + 1}. ${it.en.name} (${it.en.jp}) ${it.price} — ${it.en.desc}. ${SWEETNESS[it.sweetness] ?? it.sweetness}; ${it.tags.join(", ")}.`
).join("\n");

function systemPrompt() {
  const pick = tonightsPick();
  return `You are Hana (花), the host of Neon Kissa, a Tokyo cocktail bar in Kabukicho, Shinjuku. You are warm, knowledgeable about cocktails, and a little playful. Keep answers to 1–2 sentences. Always end with ✦.

Bar info:
- Hours: Daily 18:00–03:00, last entry 02:00
- Location: Kabukicho, Shinjuku — 5 min walk from Shinjuku Station east exit
- No cover charge. Cash and card accepted.
- Reservations via the form on this page; confirmed by email within 24 hours.
- English-friendly staff.

Cocktail menu (only recommend these ${MENU.length}):
${MENU_LINES}

Tonight's pick: ${pick.en.name} (${pick.en.jp}).

Never invent menu items, ingredients, prices, or hours beyond what is listed above. Respond in the same language as the user.`;
}

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
      system: systemPrompt(),
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
