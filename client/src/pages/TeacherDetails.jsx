import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Modal from "../components/Modal";
import ResetPasswordForm from "../components/ResetPasswordForm";

function TeacherDetails() {
  const { darkMode } = useTheme();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ new state for modal
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
          throw new Error("Failed to load teacher details");
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

  const handleOpenResetModal = () => setIsResetModalOpen(true);
  const handleCloseResetModal = () => setIsResetModalOpen(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-full py-8 px-4">
      {/* Profile */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{teacherData.teacher.name}</h1>
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
