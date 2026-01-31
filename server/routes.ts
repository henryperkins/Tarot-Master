import type { Express } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Generate tarot reading narrative
  app.post("/api/readings/generate", async (req, res) => {
    try {
      const { spreadType, question, cards } = req.body;

      if (!cards) {
        return res.status(400).json({ error: "Cards data is required" });
      }

      const systemPrompt = `You are a wise and compassionate tarot reader with deep knowledge of the Rider-Waite-Smith tradition. You provide insightful, meaningful readings that help people gain clarity and perspective on their lives.

Your readings should:
- Be warm, supportive, and empowering
- Connect the cards meaningfully to create a cohesive narrative
- Acknowledge both challenges and opportunities
- Offer practical wisdom and actionable insights
- Use elegant, mystical language that feels authentic
- Be around 200-300 words

Never be fatalistic or frighten the querent. Focus on growth, potential, and self-empowerment.`;

      const userPrompt = `Please provide a tarot reading interpretation for the following:

Spread Type: ${spreadType}
Question: ${question}

Cards drawn:
${cards}

Weave these cards together into a meaningful narrative that addresses the question and provides guidance. Connect the positions and cards to tell a cohesive story.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 800,
      });

      const narrative = completion.choices[0]?.message?.content || "The cards hold their wisdom in mystery today.";

      res.json({ narrative });
    } catch (error) {
      console.error("Error generating reading:", error);
      res.status(500).json({ error: "Failed to generate reading" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
