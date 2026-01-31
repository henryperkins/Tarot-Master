import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    userId: string;
    replitId: string;
  }
}

export interface ReplitUser {
  id: string;
  name: string;
  profileImage?: string;
}

const PgSession = connectPg(session);

export function setupAuth(app: Express) {
  const sessionMiddleware = session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "replit-auth-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  });

  app.use(sessionMiddleware);

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { replitUser } = req.body;

      if (!replitUser || !replitUser.id || !replitUser.name) {
        return res.status(400).json({ error: "Invalid user data" });
      }

      const user = await storage.upsertUser({
        replitId: replitUser.id,
        username: replitUser.name,
        profileImage: replitUser.profileImage || null,
      });

      req.session.userId = user.id;
      req.session.replitId = user.replitId;

      res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.json({ user: null });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      res.json({ user: user || null });
    } catch (error) {
      console.error("Auth check error:", error);
      res.json({ user: null });
    }
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
