import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";

function TeacherRegister() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "CSE",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const departments = ["CSE", "IT", "ME", "CE", "ECE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Registration data:", formData);
      setSuccess(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "bg-zinc-900 text-zinc-100" : "bg-gray-50 text-zinc-900"
      }`}>
        <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          darkMode ? "bg-zinc-800 shadow-zinc-950" : "bg-white shadow-gray-200"
        }`}>
          <div className="p-8 text-center">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
            }`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium">Registration Successful!</h3>
            <p className={`mt-2 text-sm ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}>
              Your account has been created. Please check your email for verification.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setSuccess(false)}
                className={`px-4 py-2 rounded-md font-medium ${
                  darkMode 
                    ? "bg-zinc-700 hover:bg-zinc-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Register Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        darkMode ? "bg-zinc-800 shadow-zinc-950" : "bg-white shadow-gray-200"
      }`}>
        {/* Header */}
        <div className={`p-6 text-center border-b ${
          darkMode ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-gray-100"
        }`}>
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <FaUser className="text-blue-500" />
            Teacher Registration
          </h2>
          <p className={`mt-1 text-sm ${
            darkMode ? "text-zinc-400" : "text-zinc-500"
          }`}>
            Create your teaching account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              darkMode ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-800"
            }`}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className={`block text-sm font-medium ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}>
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="John Doe"
              />
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <FaUser className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className={`block text-sm font-medium ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}>
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="teacher@school.edu"
              />
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <FaEnvelope className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label htmlFor="department" className={`block text-sm font-medium ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}>
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <FaUniversity className="h-4 w-4" />
              </div>
              <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className={`block text-sm font-medium ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="••••••••"
              />
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <FaLock className="h-4 w-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  darkMode ? "text-zinc-400 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
            <p className={`text-xs ${
              darkMode ? "text-zinc-500" : "text-gray-500"
            }`}>
              Must be at least 8 characters
            </p>
          </div>
          

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            } ${
              darkMode ? "focus:ring-offset-zinc-800" : "focus:ring-offset-white"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={`px-6 py-4 text-center border-t ${
          darkMode ? "border-zinc-700 bg-zinc-900/50" : "border-gray-200 bg-gray-50"
        }`}>
          <p className={`text-sm ${
            darkMode ? "text-zinc-400" : "text-zinc-600"
          }`}>
            Already have an account?{' '}
            <Link to="/teacher/login" className={`font-medium hover:underline ${
              darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
            }`}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherRegister;