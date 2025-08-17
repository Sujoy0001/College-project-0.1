import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL; // ✅ load from .env

const CourseRegister = () => {
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    hours: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Use global dark mode from ThemeContext
  const { darkMode } = useTheme();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hours" ? Number(value) : value,
    }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/add/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to register course");
      }

      await res.json();
      setMessage("✅ Course registered successfully!");
      setFormData({ course_name: "", course_code: "", hours: 0 });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error registering course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-full flex items-center justify-center">
      <div
        className={`max-w-md w-full mt-10 p-6 rounded-xl shadow-lg border ${
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            Register Course
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Course Name</label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded-lg focus:ring ${
                darkMode
                  ? "bg-zinc-700 border-zinc-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-black focus:ring-blue-300"
              }`}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Course Code</label>
            <input
              type="text"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded-lg focus:ring ${
                darkMode
                  ? "bg-zinc-700 border-zinc-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-black focus:ring-blue-300"
              }`}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Hours</label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded-lg focus:ring ${
                darkMode
                  ? "bg-zinc-700 border-zinc-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-black focus:ring-blue-300"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition ${
              darkMode
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Registering..." : "Register Course"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseRegister;
