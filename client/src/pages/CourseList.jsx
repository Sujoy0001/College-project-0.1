import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaBook, FaHashtag, FaClock, FaSpinner, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const CourseList = () => {
  const { darkMode } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/add/courses/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle the specific API response format
        const formattedCourses = data.courses.map(course => ({
            id: course.id,
            name: course.course_name,
            code: course.course_code,
            hours: course.hours
        }));


        setCourses(formattedCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-3">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 ${darkMode ? 'bg-zinc-900 text-red-400' : 'bg-gray-100 text-red-600'}`}>
        <FaExclamationTriangle className="text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Courses</h2>
        <p className="text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className={`max-w-6xl mx-auto rounded shadow-md overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaBook className="text-blue-500" />
                Course Catalog
              </h2>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? 'text-zinc-400' : 'text-zinc-500'} />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${darkMode ? 'bg-zinc-700' : 'bg-gray-100'}`}>
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
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-zinc-700' : 'divide-gray-200'}`}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr 
                    key={course.id}
                    className={`${darkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {course.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {course.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {course.hours} {course.hours === 1 ? 'hour' : 'hours'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center">
                    <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {searchTerm ? 'No matching courses found' : 'No courses available'}
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

export default CourseList;