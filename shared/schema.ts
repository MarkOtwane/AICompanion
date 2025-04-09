import { pgTable, text, serial, timestamp, varchar, primaryKey, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chat sessions table
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").default("New Chat").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  title: true,
});

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: varchar("role", { length: 10 }).notNull(), // Either "user" or "assistant"
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  chatSessionId: integer("chat_session_id").references(() => chatSessions.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  role: true,
  userId: true,
  chatSessionId: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type DBMessage = typeof messages.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  chatSessions: many(chatSessions),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  chatSession: one(chatSessions, {
    fields: [messages.chatSessionId],
    references: [chatSessions.id],
  }),
}));

// For frontend compatibility - still use the existing Message type
export const messageSchema = z.object({
  id: z.string().or(z.number().transform(n => n.toString())),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.date().or(z.string().transform(str => new Date(str))),
});

export type Message = z.infer<typeof messageSchema>;

// Chat session schema for frontend
export const chatSessionSchema = z.object({
  id: z.string().or(z.number().transform(n => n.toString())),
  username: z.string(),
  messages: z.array(messageSchema),
  createdAt: z.date().or(z.string().transform(str => new Date(str))),
  updatedAt: z.date().or(z.string().transform(str => new Date(str))),
});

// OpenAI request schema
export const openAIRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  username: z.string().min(1, "Username is required"),
});

export type OpenAIRequest = z.infer<typeof openAIRequestSchema>;
