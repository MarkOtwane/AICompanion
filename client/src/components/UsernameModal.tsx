import { useState, FormEvent } from "react";
import { useChat } from "@/context/ChatContext";
import { Message } from "@shared/schema";

export default function UsernameModal() {
  const [username, setUsername] = useState("");
  const { setUser, addMessage } = useChat();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    const initial = username.charAt(0).toUpperCase();
    setUser({ name: username, initial });
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello ${username}! I'm your AI assistant. How can I help you today?`,
      role: "assistant",
      timestamp: new Date(),
    };
    
    // Add with slight delay for better UX
    setTimeout(() => {
      addMessage(welcomeMessage);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="px-6 py-4">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-primary to-violet-500 p-3 rounded-full inline-flex mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome to AI Chat</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Please enter your name to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <button 
                type="submit"
                disabled={!username.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Start Chatting
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Your name is stored locally on your device and is only used to personalize your chat experience.
          </p>
        </div>
      </div>
    </div>
  );
}
