// components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function ResetPasswordForm({ email, token, onSuccess }) {
  const { darkMode } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      setMessage("Password reset successfully!");
      setPassword("");
      setConfirmPassword("");

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
            darkMode
              ? "bg-zinc-700 border-zinc-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
            darkMode
              ? "bg-zinc-700 border-zinc-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
            darkMode
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Reset Password
        </button>
      </form>

      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default ResetPasswordForm;
