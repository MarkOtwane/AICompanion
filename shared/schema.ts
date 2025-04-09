import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message schemas
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

// Chat session schema
export const chatSessionSchema = z.object({
  id: z.string(),
  username: z.string(),
  messages: z.array(messageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ChatSession = z.infer<typeof chatSessionSchema>;

// OpenAI request schema
export const openAIRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  username: z.string().min(1, "Username is required"),
});

export type OpenAIRequest = z.infer<typeof openAIRequestSchema>;
