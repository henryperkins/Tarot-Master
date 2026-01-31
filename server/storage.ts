import { db } from "./db";
import { users, type User, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async upsertUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByReplitId(insertUser.replitId);
    
    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({
          username: insertUser.username,
          profileImage: insertUser.profileImage,
        })
        .where(eq(users.replitId, insertUser.replitId))
        .returning();
      return updatedUser;
    }

    const [newUser] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();
