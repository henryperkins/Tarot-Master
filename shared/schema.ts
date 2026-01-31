import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export chat models for AI integrations
export * from "./models/chat";

// Users table for Replit Auth with Stripe subscription fields
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  replitId: text("replit_id").notNull().unique(),
  username: text("username").notNull(),
  profileImage: text("profile_image"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionStatus: text("subscription_status"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Subscription tier definitions
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Seeker",
    label: "Free",
    price: 0,
    monthlyReadings: 5,
    monthlyTTS: 3,
    spreads: ["single", "threeCard", "fiveCard"],
    cloudJournal: false,
    advancedInsights: false,
    adFree: false,
    apiAccess: false,
  },
  plus: {
    name: "Enlightened",
    label: "Plus",
    price: 7.99,
    monthlyReadings: 50,
    monthlyTTS: 50,
    spreads: "all",
    cloudJournal: true,
    advancedInsights: true,
    adFree: true,
    apiAccess: false,
  },
  pro: {
    name: "Mystic",
    label: "Pro",
    price: 19.99,
    monthlyReadings: Infinity,
    monthlyTTS: Infinity,
    spreads: "all+custom",
    cloudJournal: true,
    advancedInsights: true,
    adFree: true,
    apiAccess: true,
    apiCallsPerMonth: 1000,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Tarot readings table
export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  spreadType: text("spread_type").notNull(),
  question: text("question"),
  cards: jsonb("cards").notNull(),
  narrative: text("narrative"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertReadingSchema = createInsertSchema(readings).omit({
  id: true,
  createdAt: true,
});

export type Reading = typeof readings.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  readingId: integer("reading_id").references(() => readings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  notes: text("notes"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
