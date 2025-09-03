// components/Modal.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

function Modal({ isOpen, onClose, children }) {
  const { darkMode } = useTheme(); // ✅ get dark/light state

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-colors duration-300 
        ${darkMode ? "bg-black/70" : "bg-black/50"}`}
    >
      <div
        className={`p-6 rounded-2xl shadow-xl w-full max-w-md relative transition-colors duration-300
          ${darkMode ? "bg-zinc-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 cursor-pointer transition-colors duration-200
            ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

export default Modal;
