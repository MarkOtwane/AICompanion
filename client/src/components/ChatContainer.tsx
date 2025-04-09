import { useRef, useEffect, useState, FormEvent } from "react";
import { useChat } from "@/context/ChatContext";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function ChatContainer() {
  const { messages, addMessage, clearMessages, user, isLoading, setIsLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/chat", {
        message,
        username: user.name
      }).then(res => res.json());
    },
    onSuccess: (data: { message: Message }) => {
      addMessage(data.message);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user.name) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };
    addMessage(userMessage);
    
    // Clear input and set loading
    setInputValue("");
    setIsLoading(true);
    
    // Send to API
    sendMessageMutation.mutate(inputValue);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all chat messages?")) {
      clearMessages();
      toast({
        title: "Chat Cleared",
        description: "All chat messages have been cleared.",
      });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full max-w-5xl mx-auto px-4 py-4 flex flex-col">
        {/* Header with clear button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Chat</h2>
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearChat}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Clear Chat
            </Button>
          )}
        </div>
        
        {/* Chat messages container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-center p-8">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-lg font-medium">Your chat is empty</p>
                <p className="text-sm mt-2">Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
          
          {isLoading && <TypingIndicator />}
        </div>
        
        {/* Message input form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center p-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
              placeholder="Type your message..."
              disabled={isLoading || !user.name}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputValue.trim() || !user.name}
              className="ml-2 bg-primary text-white rounded-full p-2 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="px-3 pb-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Messages are processed using OpenAI. Your chat history is stored in the database.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
