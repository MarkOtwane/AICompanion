import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import UsernameModal from "@/components/UsernameModal";
import ChatContainer from "@/components/ChatContainer";

export default function ChatPage() {
  const { user } = useChat();
  const [showModal, setShowModal] = useState<boolean>(true);

  useEffect(() => {
    // Hide modal if user exists
    if (user.name) {
      setShowModal(false);
    }
  }, [user.name]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-violet-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium">AI Chat</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{user.name || "Guest"}</span>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="text-sm font-medium">{user.initial || "G"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main chat area */}
      <ChatContainer />

      {/* Username modal */}
      {showModal && <UsernameModal />}
    </div>
  );
}
