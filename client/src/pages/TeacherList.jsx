import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaEnvelope, FaUniversity, FaSpinner } from 'react-icons/fa';

const TeacherList = () => {
  const { darkMode } = useTheme();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/list`);
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-6 transition-colors duration-300">
      <div className={`max-w-6xl mx-auto rounded shadow-md overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        <div className={`p-4 border-b rounded-t transition-colors duration-300 ${darkMode ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUser className="text-blue-500" /> Teacher List
          </h2>
          <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            All registered teachers in the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 transition-colors duration-300">
            <thead className={`transition-colors duration-300 ${darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-gray-100 text-gray-700'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${darkMode ? 'divide-zinc-700' : 'divide-gray-200'}`}>
              {teachers.map((teacher, index) => (
                <tr key={index} className={`transition-colors duration-300 ${index % 2 === 0 ? (darkMode ? 'bg-zinc-800' : 'bg-white') : (darkMode ? 'bg-zinc-700/50' : 'bg-gray-50')}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-zinc-600' : 'bg-gray-200'}`}>
                        <FaUser className={darkMode ? 'text-zinc-300' : 'text-zinc-600'} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{teacher.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEnvelope className={`mr-2 transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div className="text-sm">{teacher.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUniversity className={`mr-2 transition-colors duration-300 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <div className="text-sm">{teacher.dept}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teachers.length === 0 && (
          <div className={`p-8 text-center transition-colors duration-300 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            No teachers found in the system
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
