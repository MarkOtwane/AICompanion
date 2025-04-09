import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key"
});

// Function to get a response from OpenAI's ChatGPT
export async function chatGptCompletion(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model
      messages: [
        {
          role: "system",
          content: "You are a helpful, friendly AI assistant that provides concise and accurate responses. You're here to help the user with their questions and tasks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Handle different types of OpenAI errors
    if (error instanceof OpenAI.APIError) {
      // Handle API errors
      if (error.status === 429) {
        return "I'm experiencing high demand right now. Please try again in a moment.";
      } else if (error.status === 401) {
        return "There seems to be an authentication issue with the AI service. Please contact support.";
      }
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
}
