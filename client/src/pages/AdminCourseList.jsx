// src/components/AdminCourseList.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  FaBook,
  FaHashtag,
  FaClock,
  FaSpinner,
  FaSearch,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminCourseList = () => {
  const { darkMode } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/add/courses/all`);
        if (!res.ok) {
          throw new Error(`Fetch courses failed (HTTP ${res.status})`);
        }
        const raw = await res.json();

        // Normalize a few possible shapes
        const list =
          Array.isArray(raw) ? raw :
          Array.isArray(raw.courses) ? raw.courses :
          Array.isArray(raw.data) ? raw.data :
          [];

        const formatted = list.map((c) => ({
          id: c.id ?? c.course_id ?? c._id ?? c.code ?? c.course_code, // try common id fields
          name: c.course_name ?? c.name,
          code: c.course_code ?? c.code,
          hours: typeof c.hours === "number" ? c.hours : Number(c.hours ?? 0),
        })).filter((c) => c.id != null);

        setCourses(formatted);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const tryDeleteEndpoints = async (id) => {
    // Try the exact path you specified first, then sensible fallbacks.
    const attempts = [
      { url: `${BASE_URL}/couses/delete/${id}`, init: { method: "DELETE" }, label: "DELETE /couses/delete/:id" },
      { url: `${BASE_URL}/courses/delete/${id}`, init: { method: "DELETE" }, label: "DELETE /courses/delete/:id" },
      { url: `${BASE_URL}/add/courses/delete/${id}`, init: { method: "DELETE" }, label: "DELETE /add/courses/delete/:id" },
      { // Some servers require body payload for delete
        url: `${BASE_URL}/couses/delete`,
        init: {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        },
        label: "DELETE /couses/delete (body { id })",
      },
    ];

    const errors = [];
    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, attempt.init);
        if (res.ok || res.status === 204) {
          return { ok: true, label: attempt.label, status: res.status };
        }
        // read any text for debugging
        let txt = "";
        try { txt = await res.text(); } catch {}
        errors.push(`${attempt.label} -> HTTP ${res.status}${txt ? `, ${txt}` : ""}`);
      } catch (e) {
        errors.push(`${attempt.label} -> ${e.message}`);
      }
    }
    return { ok: false, errors };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setDeletingId(id);
    setNote("");

    const result = await tryDeleteEndpoints(id);

    if (result.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setNote(`✅ Deleted (via ${result.label}, HTTP ${result.status || 200}).`);
    } else {
      setNote("❌ Delete failed.\n" + result.errors.join("\n"));
      console.error("Delete attempts:\n" + result.errors.join("\n"));
      alert("Delete failed. See console for details.");
    }

    setDeletingId(null);
  };

  const filteredCourses = courses.filter(
    (course) =>
      (course.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-full">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-3">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-full p-6 "
      >
        <FaExclamationTriangle className="text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Courses</h2>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-4 py-2 rounded-md ${
            darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-8">
      <div
        className={`max-w-6xl mx-auto rounded shadow-md overflow-hidden ${
          darkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <div
          className={`p-4 border-b ${
            darkMode ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaBook className="text-blue-500" />
                Course Management
              </h2>
              <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? "text-zinc-400" : "text-zinc-500"} />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500"
                    : "border-gray-300 bg-white text-zinc-900 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${darkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaBook className="mr-2" />
                    Course Name
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaHashtag className="mr-2" />
                    Course Code
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    Credit Hours
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-zinc-700" : "divide-gray-200"}`}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`${darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{course.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-mono ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {course.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {course.hours} {course.hours === 1 ? "hour" : "hours"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deletingId === course.id}
                        className={`flex items-center gap-2 p-2 rounded-md transition-colors cursor-pointer ${
                            deletingId === course.id
                            ? "bg-red-100 text-red-400 cursor-not-allowed"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                        title="Delete course"
                        >
                        {deletingId === course.id ? (
                            <>
                            <FaSpinner className="animate-spin" />
                            <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                            <FaTrash />
                            <span>Delete</span>
                            </>
                        )}
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      {searchTerm ? "No matching courses found" : "No courses available"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseList;
