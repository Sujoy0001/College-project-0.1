// src/components/AdminAllotmentsListView.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  FaUser,
  FaBook,
  FaHashtag,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaSearch,
  FaTrash
} from 'react-icons/fa';

const AdminAllotmentsListView = () => {
  const { darkMode } = useTheme();
  const [allotments, setAllotments] = useState([]);
  const [filteredAllotments, setFilteredAllotments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTeachers, setExpandedTeachers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingEmail, setDeletingEmail] = useState(null);

  // Fetch allotments
  useEffect(() => {
    const fetchAllotments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/view-all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllotments(data.allotments || []);
        setFilteredAllotments(data.allotments || []);
      } catch (err) {
        console.error('Failed to fetch allotments:', err);
        setError(err.message || 'Failed to load allotment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllotments();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAllotments(allotments);
    } else {
      const filtered = allotments.filter((teacher) =>
        teacher.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacher_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAllotments(filtered);
    }
  }, [searchTerm, allotments]);

  const toggleTeacherExpansion = (teacherEmail) => {
    setExpandedTeachers((prev) => ({
      ...prev,
      [teacherEmail]: !prev[teacherEmail],
    }));
  };

  const calculateTotalHours = (courses) => {
    return courses.reduce((total, course) => total + (course.hours || 0), 0);
  };

  // Handle delete allotments
  const handleDelete = async (teacherEmail) => {
    if (!window.confirm(`Are you sure you want to delete allotments for ${teacherEmail}?`)) {
      return;
    }

    try {
      setDeletingEmail(teacherEmail);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/allotments/delete/${teacherEmail}`,
        { method: 'DELETE' }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }

      // Remove teacher allotment from list
      setAllotments((prev) => prev.filter((t) => t.teacher_email !== teacherEmail));
      setFilteredAllotments((prev) => prev.filter((t) => t.teacher_email !== teacherEmail));
    } catch (err) {
      console.error('Error deleting allotment:', err);
      alert('Failed to delete allotment');
    } finally {
      setDeletingEmail(null);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-3">Loading allotments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen p-6 ${
          darkMode ? 'bg-zinc-900 text-red-400' : 'bg-gray-100 text-red-600'
        }`}
      >
        <h2 className="text-2xl font-bold mb-2">Error Loading Allotments</h2>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-4 py-2 rounded-md ${
            darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-8">
      <div className={`max-w-6xl mx-auto rounded shadow-md overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Teacher Course Allotments
              </h2>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Showing {filteredAllotments.length} of {allotments.length} teacher allotments
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? 'text-zinc-400' : 'text-zinc-500'} />
              </div>
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'border-zinc-700 bg-zinc-800 text-white focus:ring-blue-500'
                    : 'border-gray-300 bg-white text-zinc-900 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${darkMode ? 'bg-zinc-700' : 'bg-gray-100'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-zinc-700' : 'divide-gray-200'}`}>
              {filteredAllotments.length > 0 ? (
                filteredAllotments.map((teacher, index) => (
                  <React.Fragment key={`${teacher.teacher_email}-${index}`}>
                    <tr className={`${darkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.teacher_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.teacher_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">{calculateTotalHours(teacher.courses)} hrs</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.courses.length} courses</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        {/* Expand button */}
                        <button
                          onClick={() => toggleTeacherExpansion(teacher.teacher_email)}
                          className={`flex items-center gap-1 text-sm cursor-pointer ${
                            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {expandedTeachers[teacher.teacher_email] ? (
                            <>
                              <FaChevronUp className="text-xs" /> Hide
                            </>
                          ) : (
                            <>
                              <FaChevronDown className="text-xs" /> View
                            </>
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(teacher.teacher_email)}
                          disabled={deletingEmail === teacher.teacher_email}
                          className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm transition-colors ${
                            deletingEmail === teacher.teacher_email
                              ? 'bg-red-100 text-red-400 cursor-not-allowed'
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                        >
                          {deletingEmail === teacher.teacher_email ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded courses */}
                    {expandedTeachers[teacher.teacher_email] && (
                      <tr className={`${darkMode ? 'bg-zinc-800/50' : 'bg-gray-50'}`}>
                        <td colSpan="5" className="px-6 py-4">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className={`${darkMode ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    <FaBook className="inline mr-2" /> Course Name
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    <FaHashtag className="inline mr-2" /> Code
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    <FaClock className="inline mr-2" /> Hours
                                  </th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${darkMode ? 'divide-zinc-700' : 'divide-gray-200'}`}>
                                {teacher.courses.map((course, courseIndex) => (
                                  <tr key={`${course.course_code}-${courseIndex}`} className={`${darkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'}`}>
                                    <td className="px-4 py-2 whitespace-nowrap">{course.course_name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap font-mono">{course.course_code}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{course.hours} hrs</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {searchTerm ? 'No matching teachers found' : 'No allotments found'}
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

export default AdminAllotmentsListView;
