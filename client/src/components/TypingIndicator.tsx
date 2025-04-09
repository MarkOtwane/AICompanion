export default function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="max-w-[80%]">
        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow">
          <div className="typing-animation flex space-x-1">
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
