import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// Initialize an OpenAI client for your provider using env vars
const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

// Initialize messages array with system prompt
const messages = [
  {
    role: "system",
    content: `You are Duck.ai, a friendly and helpful AI assistant. 
    Your tone is clever, concise, and occasionally includes duck-related puns if appropriate, but you remain professional.
    Your output must be in structured Markdown.`,
  },
];

// Challenge: See challenge.md for instructions
app.post("/api/gift", async (req, res) => {
  // TODO: Step 2 — extract userPrompt from req.body and add to messages
  const { userPrompt, model } = req.body

  messages.push({
    role: "user",
    content: userPrompt
  })

  try {
    // TODO: Step 3 — send chat completions request
    const response = await openai.chat.completions.create({
      model: model || process.env.AI_MODEL,
      messages,
    });

    // TODO: Step 4 — extract content and send back as JSON
    const giftSuggestions = response.choices[0].message.content
    console.log(giftSuggestions)

    res.json({ giftSuggestions });
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: `It's not you, it's us. 
    Something went wrong on the server` })
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
