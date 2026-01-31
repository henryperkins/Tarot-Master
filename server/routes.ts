import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";
import { storage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    replitId: string;
    username: string;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

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

      const narrative =
        completion.choices[0]?.message?.content ||
        "The cards hold their wisdom in mystery today.";

      res.json({ narrative });
    } catch (error) {
      console.error("Error generating reading:", error);
      res.status(500).json({ error: "Failed to generate reading" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting publishable key:", error);
      res.status(500).json({ error: "Failed to get Stripe configuration" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const rows = await stripeService.listProductsWithPrices();

      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error listing products:", error);
      res.status(500).json({ error: "Failed to list products" });
    }
  });

  app.post(
    "/api/checkout",
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const { priceId, tier } = req.body;
        if (!priceId) {
          return res.status(400).json({ error: "Price ID is required" });
        }

        const user = await storage.getUser(req.user.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripeService.createCustomer(
            `${user.username}@replit.user`,
            user.id,
            user.username,
          );
          await storage.updateUserStripeInfo(user.id, {
            stripeCustomerId: customer.id,
          });
          customerId = customer.id;
        }

        const protocol =
          req.header("x-forwarded-proto") || req.protocol || "https";
        const host = req.header("x-forwarded-host") || req.get("host");
        const baseUrl = `${protocol}://${host}`;

        const session = await stripeService.createCheckoutSession(
          customerId,
          priceId,
          `${baseUrl}/?checkout=success&tier=${tier || "plus"}`,
          `${baseUrl}/?checkout=cancelled`,
          user.id,
        );

        res.json({ url: session.url, sessionId: session.id });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
      }
    },
  );

  app.post(
    "/api/create-portal-session",
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const user = await storage.getUser(req.user.id);
        if (!user?.stripeCustomerId) {
          return res.status(400).json({ error: "No billing account found" });
        }

        const protocol =
          req.header("x-forwarded-proto") || req.protocol || "https";
        const host = req.header("x-forwarded-host") || req.get("host");
        const returnUrl = `${protocol}://${host}/`;

        const session = await stripeService.createCustomerPortalSession(
          user.stripeCustomerId,
          returnUrl,
        );

        res.json({ url: session.url });
      } catch (error) {
        console.error("Error creating portal session:", error);
        res.status(500).json({ error: "Failed to create portal session" });
      }
    },
  );

  app.get(
    "/api/subscription",
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.user) {
          return res.json({
            subscription: null,
            tier: "free",
            status: null,
          });
        }

        const user = await storage.getUser(req.user.id);
        if (!user) {
          return res.json({
            subscription: null,
            tier: "free",
            status: null,
          });
        }

        if (user.stripeCustomerId) {
          await stripeService.syncUserSubscriptionFromStripe(
            user.id,
            user.stripeCustomerId,
          );
          const updatedUser = await storage.getUser(user.id);
          if (updatedUser) {
            return res.json({
              subscription: updatedUser.stripeSubscriptionId
                ? {
                    id: updatedUser.stripeSubscriptionId,
                    status: updatedUser.subscriptionStatus,
                  }
                : null,
              tier: updatedUser.subscriptionTier || "free",
              status: updatedUser.subscriptionStatus,
            });
          }
        }

        res.json({
          subscription: user.stripeSubscriptionId
            ? {
                id: user.stripeSubscriptionId,
                status: user.subscriptionStatus,
              }
            : null,
          tier: user.subscriptionTier || "free",
          status: user.subscriptionStatus,
        });
      } catch (error) {
        console.error("Error getting subscription:", error);
        res.status(500).json({ error: "Failed to get subscription" });
      }
    },
  );

  const httpServer = createServer(app);
  return httpServer;
}
