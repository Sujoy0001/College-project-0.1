import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function Layout01() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"
      }`}
    >
      <Header />
      
      {/* Main content grows to fill remaining space */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}
