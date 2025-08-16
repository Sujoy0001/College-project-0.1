import React from "react";

export default function Footer({ darkMode }) {
  return (
    <footer
      className={`p-4 text-center transition-colors duration-300 border-top-2 ${
        darkMode
          ? "bg-zinc-900 text-gray-300"
          : "bg-gray-200 text-zinc-900"
      }`}
    >
      <p>© 2025 Teacher Course Allotments System</p>
    </footer>
  );
}
