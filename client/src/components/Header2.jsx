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
    // Clear authentication (example: remove token)
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header
      className={`py-6 px-0 ${
        darkMode ? "bg-zinc-800" : "bg-gray-200/50"
      } shadow-sm`}
    >
      <div className="max-w-7xl px-6 mx-auto flex justify-between items-center">
        <Link to="/admin">
          <h1 className="text-2xl font-bold">
            <span className={darkMode ? "text-blue-400" : "text-blue-600"}>
              Admin
            </span>{" "}
            Dashboard
          </h1>
        </Link>

        

        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              darkMode
                ? "bg-zinc-700 text-blue-400"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Administrator
          </span>
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`px-4 py-2 flex justify-center items-center gap-2 rounded-lg font-medium cursor-pointer ${
              darkMode
                ? "bg-zinc-700 text-blue-400 hover:bg-zinc-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            <FaArrowAltCircleLeft /> Back
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`px-4 py-2 flex justify-center items-center gap-2 rounded-lg font-medium cursor-pointer ${
              darkMode
                ? "bg-red-600/30 text-white hover:bg-red-500"
                : "bg-red-400 text-white hover:bg-red-500"
            }`}
          >
            <FaSignOutAlt /> Logout
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header2;
