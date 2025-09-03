import React, { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Allotments = () => {
  const { darkMode } = useTheme();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [courseSelectValue, setCourseSelectValue] = useState(""); // NEW


  // Fetch teachers
  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/list`);
      const raw = await res.json();
      console.log("Teacher API response:", raw);

      // Normalize depending on what backend gives
      let list = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (Array.isArray(raw.teachers)) {
        list = raw.teachers;
      } else if (Array.isArray(raw.users)) {
        list = raw.users;
      } else if (Array.isArray(raw.data)) {
        list = raw.data;
      }

      // Shape into { name, email }
      const normalized = list.map((t, i) => ({
        email: t.email || t.user_email || `teacher${i}@example.com`,
        name:
          t.name ||
          t.full_name ||
          `${t.first_name || ""} ${t.last_name || ""}`.trim() ||
          t.email,
      }));

      setTeachers(normalized);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/add/courses/all`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  fetchTeachers();
  fetchCourses();
}, []);


  const handleCourseSelect = (e) => {
    const courseId = parseInt(e.target.value);
    if (!selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || selectedCourses.length === 0) {
      setMessage("⚠️ Please select a teacher and at least one course.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/allotments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_email: selectedTeacher,
          course_ids: selectedCourses,
        }),
      });

      if (!res.ok) throw new Error("Failed to assign courses");

      setMessage("✅ Courses successfully assigned!");
      setSelectedCourses([]);
      setSelectedTeacher("");
    } catch (err) {
      setMessage("❌ Error assigning courses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Allotments</h2>

      {/* Teacher Dropdown */}
      <label className="block font-medium">Select Teacher:</label>
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">-- Select a Teacher --</option>
        {teachers.map((teacher) => (
          <option key={teacher.email} value={teacher.email} className={`cursor-pointer ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            {teacher.name} ({teacher.email})
          </option>
        ))}
      </select>

      {/* Course Dropdown */}
      <label className="block font-medium">Select Courses:</label>
      <select
        value={courseSelectValue}  // controlled
        onChange={(e) => {
            const courseId = parseInt(e.target.value);
            setCourseSelectValue(""); // reset dropdown immediately
            if (!selectedCourses.includes(courseId) && courseId) {
            setSelectedCourses([...selectedCourses, courseId]);
            }
        }}
        className="w-full border rounded p-2 mb-4"
        >
        <option value="">-- Select a Course --</option>
        {courses.map((course) => (
            <option key={course.id} value={course.id} className={`cursor-pointer ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            {course.course_name} ({course.course_code})
            </option>
        ))}
      </select>


      {/* Selected Courses */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Assigned Courses:</h3>
        {selectedCourses.length > 0 ? (
          <ul className="list-disc pl-6">
            {selectedCourses.map((id) => {
              const course = courses.find((c) => c.id === id);
              return (
                <li key={id} className="flex items-center justify-between">
                  {course?.course_name} ({course?.course_code})
                  <button
                    onClick={() => handleRemoveCourse(id)}
                    className="ml-4 text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No courses selected.</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Assigning..." : "Submit Allotment"}
      </button>

      {/* Message */}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Allotments;
