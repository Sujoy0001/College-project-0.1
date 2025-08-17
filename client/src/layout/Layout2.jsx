import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import Header2 from "../components/Header2";

export default function Layout02() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-zinc-950"
      }`}
    >
      <Header />
      <Header2 />
      
      {/* Main content grows to fill remaining space */}
      <main className="flex-1 p-0">
        <Outlet />
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}
