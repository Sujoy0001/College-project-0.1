import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      // Store email (and optionally token if API returns one)
      localStorage.setItem("teacherEmail", email);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to dashboard (or any page you want)
      navigate("/teacher");
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div
        className={`w-full max-w-md rounded shadow-lg overflow-hidden transition-all duration-300 ${
          darkMode ? "bg-zinc-800 shadow-zinc-950" : "bg-white shadow-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 text-center border-b ${
            darkMode
              ? "border-zinc-700 bg-zinc-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <FaUser className="text-blue-500" />
            Teacher Portal
          </h2>
          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Access your courses and teaching materials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                darkMode
                  ? "bg-red-900/50 text-red-200"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                darkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="teacher@school.edu"
              />
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                darkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="••••••••"
              />
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                <FaLock className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  darkMode
                    ? "text-zinc-400 hover:text-zinc-300"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            } ${
              darkMode ? "focus:ring-offset-zinc-800" : "focus:ring-offset-white"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                    0 0 5.373 0 12h4zm2 5.291A7.962 
                    7.962 0 014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          className={`px-6 py-4 text-center border-t ${
            darkMode
              ? "border-zinc-700 bg-zinc-900/50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Don't have an account?{" "}
            <a
              href="#"
              className={`font-medium hover:underline ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Contact admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;
