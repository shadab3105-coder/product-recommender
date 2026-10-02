import { products } from "../src/products.js";

// ye vercel pe server.js ki jagah chalega
export default async function handler(req, res) {
  // sirf POST chalega
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const userText = req.body.query;

    // products ki chhoti list banayi (isse fast hota hai)
    const smallList = products
      .map((p) => `${p.id} | ${p.name} | ${p.category} | $${p.price} | ${p.description}`)
      .join("\n");

    const prompt = `Here are our products:
${smallList}
User says: "${userText}"
Understand what the user actually needs (for example "I am hungry" means food).
Pick the products from the list that fit that need, and respect the budget if they mention one.
Pick ONLY from the list.
Reply with ONLY JSON like this: {"ids": [1, 2], "reason": "one short sentence"}`;

    // key vercel ke environment variable se aayegi
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0,
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API error");

    // AI ka text JSON me badlo
    const aiText = data.choices[0].message.content;
    const finalResult = JSON.parse(aiText.match(/\{[\s\S]*\}/)[0]);

    res.status(200).json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}