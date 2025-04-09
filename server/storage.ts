import { users, messages, chatSessions, type User, type InsertUser,
  type DBMessage, type InsertMessage, type ChatSession, type InsertChatSession, 
  type Message } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat session methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionsByUserId(userId: number): Promise<ChatSession[]>;
  getChatSessionById(id: number): Promise<ChatSession | undefined>;
  updateChatSession(id: number, title: string): Promise<ChatSession | undefined>;
  deleteChatSession(id: number): Promise<boolean>;
  
  // Message methods
  addMessage(message: InsertMessage): Promise<DBMessage>;
  getMessagesByChatSessionId(chatSessionId: number): Promise<DBMessage[]>;
  deleteMessages(chatSessionId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Chat session methods
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = await db.insert(chatSessions).values(session).returning();
    return newSession;
  }
  
  async getChatSessionsByUserId(userId: number): Promise<ChatSession[]> {
    return await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  }
  
  async getChatSessionById(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.id, id));
    return session;
  }
  
  async updateChatSession(id: number, title: string): Promise<ChatSession | undefined> {
    const [updatedSession] = await db.update(chatSessions)
      .set({ 
        title,
        updatedAt: new Date() 
      })
      .where(eq(chatSessions.id, id))
      .returning();
    return updatedSession;
  }
  
  async deleteChatSession(id: number): Promise<boolean> {
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
    return true;
  }
  
  // Message methods
  async addMessage(message: InsertMessage): Promise<DBMessage> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update the chat session's updatedAt field
    if (message.chatSessionId) {
      await db.update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(chatSessions.id, message.chatSessionId));
    }
    
    return newMessage;
  }
  
  async getMessagesByChatSessionId(chatSessionId: number): Promise<DBMessage[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.chatSessionId, chatSessionId))
      .orderBy(messages.timestamp);
  }
  
  async deleteMessages(chatSessionId: number): Promise<boolean> {
    await db.delete(messages).where(eq(messages.chatSessionId, chatSessionId));
    return true;
  }
}

export const storage = new DatabaseStorage();
