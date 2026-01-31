// Stripe product seeding script
// Run with: npx tsx server/seed-products.ts
import { getUncachableStripeClient } from "./stripeClient";

async function seedProducts() {
  console.log("Starting product seeding...");

  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.search({
    query: "name~'Tableu'",
  });

  if (existingProducts.data.length > 0) {
    console.log("Products already exist:");
    existingProducts.data.forEach((p) => console.log(`  - ${p.name} (${p.id})`));
    console.log("\nTo recreate, delete existing products first in Stripe Dashboard.");
    return;
  }

  console.log("Creating Plus subscription product...");
  const plusProduct = await stripe.products.create({
    name: "Tableu Plus",
    description:
      "Enhanced tarot readings with 50 monthly readings, all spreads, cloud journal sync, and advanced insights.",
    metadata: {
      tier: "plus",
    },
  });

  const plusPrice = await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 799,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: {
      tier: "plus",
    },
  });

  console.log(`Created: ${plusProduct.name} (${plusProduct.id})`);
  console.log(`  Price: $7.99/month (${plusPrice.id})`);

  console.log("\nCreating Pro subscription product...");
  const proProduct = await stripe.products.create({
    name: "Tableu Pro",
    description:
      "Unlimited tarot readings, all spreads including custom, cloud journal, advanced insights, and API access.",
    metadata: {
      tier: "pro",
    },
  });

  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 1999,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: {
      tier: "pro",
    },
  });

  console.log(`Created: ${proProduct.name} (${proProduct.id})`);
  console.log(`  Price: $19.99/month (${proPrice.id})`);

  console.log("\n--- Product seeding complete! ---");
  console.log("\nProducts will be synced to the database via webhook.");
  console.log("You can verify in Stripe Dashboard: https://dashboard.stripe.com/products");
}

seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding products:", error);
    process.exit(1);
  });
