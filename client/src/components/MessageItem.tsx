import { Message } from "@shared/schema";
import { formatTimestamp } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const { user } = useChat();
  const isUser = message.role === "user";
  
  return (
    <div className={`flex items-start ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      
      <div className="max-w-[80%]">
        <div className={`${isUser ? "bg-primary text-white" : "bg-white dark:bg-gray-800"} rounded-lg px-4 py-2 shadow`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : ""}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 ml-2">
          <span className="text-sm font-medium">{user.initial}</span>
        </div>
      )}
    </div>
  );
}
