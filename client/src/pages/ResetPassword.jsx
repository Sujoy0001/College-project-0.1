// components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Eye, EyeOff, Loader } from "lucide-react";

function ResetPasswordForm({ email, token, onSuccess }) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!validatePassword()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting...");
      setFormData({ password: "", confirmPassword: "" });

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Reset Your Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              darkMode
                ? "bg-zinc-800 border-zinc-600 text-white placeholder-gray-400 focus:ring-green-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              darkMode
                ? "bg-zinc-800 border-zinc-600 text-white placeholder-gray-400 focus:ring-green-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg text-white font-medium transition flex items-center justify-center cursor-pointer ${
            darkMode
              ? "bg-green-600 hover:bg-green-700 disabled:bg-green-900"
              : "bg-green-500 hover:bg-green-600 disabled:bg-green-300"
          } ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default ResetPasswordForm;
