import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openAIRequestSchema } from "@shared/schema";
import { chatGptCompletion } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate request body
      const result = openAIRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: result.error.errors 
        });
      }
      
      const { message, username } = result.data;
      
      // Get AI response from OpenAI
      const aiResponse = await chatGptCompletion(message);
      
      // Return AI response
      return res.status(200).json({
        message: {
          id: Date.now().toString(),
          content: aiResponse,
          role: "assistant",
          timestamp: new Date(),
        }
      });
    } catch (error) {
      console.error("Error in /api/chat endpoint:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
