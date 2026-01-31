// Stripe service for checkout and billing operations
import { getUncachableStripeClient } from "./stripeClient";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export class StripeService {
  async createCustomer(email: string, userId: string, username: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      name: username,
      metadata: { userId, replitUsername: username },
    });
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    userId: string,
  ) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`,
    );
    return result.rows[0] || null;
  }

  async listProducts(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = ${active} LIMIT ${limit} OFFSET ${offset}`,
    );
    return result.rows;
  }

  async listProductsWithPrices(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`
        WITH paginated_products AS (
          SELECT id, name, description, metadata, active
          FROM stripe.products
          WHERE active = ${active}
          ORDER BY id
          LIMIT ${limit} OFFSET ${offset}
        )
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active,
          pr.metadata as price_metadata
        FROM paginated_products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        ORDER BY p.id, pr.unit_amount
      `,
    );
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`,
    );
    return result.rows[0] || null;
  }

  async getCustomerSubscription(customerId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE customer = ${customerId} ORDER BY created DESC LIMIT 1`,
    );
    return result.rows[0] || null;
  }

  async updateUserSubscription(
    userId: string,
    data: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string | null;
      subscriptionTier?: string;
      subscriptionStatus?: string | null;
    },
  ) {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async syncUserSubscriptionFromStripe(userId: string, customerId: string) {
    try {
      const subscription = await this.getCustomerSubscription(customerId);
      
      if (subscription) {
        const status = subscription.status as string;
        let tier = "free";
        
        const priceId = subscription.items?.[0]?.price?.id || subscription.items?.[0]?.price;
        if (priceId) {
          const price = await db.execute(
            sql`SELECT metadata FROM stripe.prices WHERE id = ${priceId}`,
          );
          const priceMetadata = price.rows[0]?.metadata as Record<string, string> | null;
          tier = priceMetadata?.tier || "plus";
        }

        const isActive = ["active", "trialing", "past_due"].includes(status);
        
        return await this.updateUserSubscription(userId, {
          stripeSubscriptionId: subscription.id as string,
          subscriptionTier: isActive ? tier : "free",
          subscriptionStatus: status,
        });
      }
      
      return null;
    } catch (error) {
      console.error("Error syncing subscription:", error);
      return null;
    }
  }
}

export const stripeService = new StripeService();
