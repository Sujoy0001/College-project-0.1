import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (type, text, duration = 4000) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, type, text }]);

    // Auto remove after duration
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, duration);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  // Type -> Color mapping
  const typeColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };

  return (
    <NotificationContext.Provider value={{ addMessage }}>
      {children}

      {/* Top-left notification container */}
      <div className="fixed top-4 left-4 space-y-3 z-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-white w-72 transform transition-all duration-300 ease-in-out animate-slide-in`}
          >
            <span className={`${typeColors[msg.type] || "bg-gray-700"} px-3 py-2 rounded-lg flex-1`}>
              {msg.text}
            </span>
            <button
              onClick={() => removeMessage(msg.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
