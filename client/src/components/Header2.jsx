// src/components/Header2.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowAltCircleLeft, FaSignOutAlt } from "react-icons/fa";

const Header2 = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  return (
    <header
      className={`py-4 px-0 ${
        darkMode ? "bg-zinc-800" : "bg-gray-200/50"
      } shadow-sm`}
    >
      <div className="max-w-7xl px-4 md:px-6 mx-auto flex flex-wrap justify-between items-center gap-4">
        {/* Logo / Title */}
        <Link to="/admin" className="w-full sm:w-auto text-center sm:text-left">
          <h1 className="text-xl md:text-2xl font-bold">
            <span className={darkMode ? "text-blue-400" : "text-blue-600"}>
              Admin
            </span>{" "}
            Dashboard
          </h1>
        </Link>

        {/* Right section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
              darkMode
                ? "bg-zinc-700 text-blue-400"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Administrator
          </span>

          <div className="grid grid-cols-2 gap-4 justify-center items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 flex justify-center items-center gap-2 rounded-lg font-medium cursor-pointer text-sm ${
              darkMode
                ? "bg-zinc-700 text-blue-400 hover:bg-zinc-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            <FaArrowAltCircleLeft className="text-lg" /> Back
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 flex justify-center items-center gap-2 rounded-lg font-medium cursor-pointer text-sm ${
              darkMode
                ? "bg-red-600/30 text-white hover:bg-red-500"
                : "bg-red-400 text-white hover:bg-red-500"
            }`}
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </button></div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
