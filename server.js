import fs from "fs";
import express from "express";
import cors from "cors";
import { products } from "./src/products.js";

// .env file se API key padho
const env = fs.readFileSync(".env", "utf8").replace(/^\uFEFF/, "");
const API_KEY = env.match(/=\s*(.+)/)[1].trim();

const app = express();
app.use(cors());
app.use(express.json());

// React yahan user ki baat bhejta hai
app.post("/api/recommend", async (req, res) => {
  try {
    const query = req.body.query;

    // AI ko proDucts ki list aur user ki baat do

// AI ko poora JSON nahi, chhoti list bhej rahe hain (isse fast hota hai)
const smallList = products
  .map((p) => `${p.id} | ${p.name} | ${p.category} | $${p.price} | ${p.description}`)
  .join("\n");

    const prompt = `Here are our products: ${smallList}
User wants: "${query}"
Pick the matching products from the list only.
Reply with ONLY JSON like this: {"ids": [1, 2], "reason": "one short sentence"}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
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

    // AI ka text jawab Jsn me badlo aur React ko wapas bhejo
    const text = data.choices[0].message.content;
    const result = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));