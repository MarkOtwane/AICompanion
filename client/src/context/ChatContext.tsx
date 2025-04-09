import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Message } from "@shared/schema";

type User = {
  name: string;
  initial: string;
};

interface ChatContextProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  user: User;
  setUser: (user: User) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useLocalStorage<Message[]>("chat-messages", []);
  const [user, setUser] = useLocalStorage<User>("chat-user", { name: "", initial: "" });
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        user,
        setUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
