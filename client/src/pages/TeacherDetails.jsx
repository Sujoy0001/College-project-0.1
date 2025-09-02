import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Modal from "../components/Modal";
import ResetPasswordForm from "./ResetPassword";

function TeacherDetails() {
  const { darkMode } = useTheme();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ new state for forgot password + modal
  const [forgotMessage, setForgotMessage] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const email = localStorage.getItem("teacherEmail");
        if (!email) {
          throw new Error("Teacher session expired. Please login again.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/teacher/view/${email}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Teacher profile not found"
              : "Failed to load teacher details"
          );
        }

        const data = await response.json();
        setTeacherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, []);

  const handleRefresh = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => window.location.reload(), 500);
  };

  // ✅ Download function
  const handleDownload = async () => {
    try {
      const email = teacherData.teacher.email;
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/teacher/download/${email}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download teacher details");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${teacherData.teacher.name}_details.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenResetModal = () => setIsResetModalOpen(true);
  const handleCloseResetModal = () => setIsResetModalOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full px-4">
        <div
          className={`max-w-md w-full p-6 rounded-lg text-center ${
            darkMode ? "bg-zinc-800" : "bg-white"
          } shadow-md`}
        >
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">
            Oops! Something went wrong
          </h3>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className={`px-4 py-2 rounded-md font-medium ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div
          className={`mb-8 p-6 rounded-xl shadow-sm ${
            darkMode ? "bg-zinc-800" : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div
                className={`h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold ${
                  darkMode ? "bg-zinc-700" : "bg-gray-200"
                } text-sky-500`}
              >
                {teacherData.teacher.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">
                  {teacherData.teacher.name}
                </h1>
                <p
                  className={`mt-1 ${
                    darkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  {teacherData.teacher.email}
                </p>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      darkMode ? "bg-zinc-700" : "bg-gray-200"
                    }`}
                  >
                    {teacherData.courses.length}{" "}
                    {teacherData.courses.length === 1 ? "Course" : "Courses"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* ✅ Download Button */}
              <button
                onClick={handleDownload}
                className={`px-4 py-2 rounded-lg font-medium shadow cursor-pointer ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition`}
              >
                Download
              </button>

              {/* ✅ Forgot Password Button */}
              <button
                onClick={handleOpenResetModal}
                className={`px-4 py-2 rounded-lg font-medium shadow cursor-pointer ${
                  darkMode
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                } text-white transition`}
              >
                Forgot Password
              </button>

              {forgotMessage && (
                <p className="text-sm mt-2 text-green-500 text-center">
                  {forgotMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            My Courses
          </h2>

          {teacherData.courses.length === 0 ? (
            <div
              className={`p-8 text-center rounded-xl ${
                darkMode ? "bg-zinc-800" : "bg-white"
              } shadow-sm`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 font-medium">No courses assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                You currently don't have any courses assigned to you.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {teacherData.courses.map((course) => (
                <div
                  key={course.course_code}
                  className={`p-5 rounded-xl transition-all hover:shadow-md ${
                    darkMode
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-gray-50 hover:bg-gray-50"
                  } border ${
                    darkMode ? "border-zinc-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{course.course_name}</h3>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? "text-zinc-400" : "text-gray-600"
                        }`}
                      >
                        {course.course_code}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        darkMode
                          ? "bg-blue-900 text-blue-200"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {course.hours} hrs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Reset Password Modal */}
      <Modal isOpen={isResetModalOpen} onClose={handleCloseResetModal}>
        <ResetPasswordForm
          email={teacherData.teacher.email}
          token="frontend_generated_or_backend_provided"
          onSuccess={handleCloseResetModal}
        />
      </Modal>
    </div>
  );
}

export default TeacherDetails;
