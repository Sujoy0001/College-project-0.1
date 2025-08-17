import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaBook, 
  FaUserFriends,
  FaFileDownload,
  FaChartLine,
  FaCog,
  FaCalendarAlt,
  FaBell
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function AdminDashboard() {
  const { darkMode } = useTheme();
  const [teacherCount, setTeacherCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const BASE_URL = import.meta.env.VITE_BASE_URL; // ✅ use from .env

  // Fetch stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teachers
        const teacherRes = await fetch(`${BASE_URL}/auth/list`);
        const teacherData = await teacherRes.json();
        setTeacherCount(teacherData.length || 0);

        // Fetch courses
       const courseRes = await fetch(`${BASE_URL}/add/courses/all`);
       const { courses } = await courseRes.json();
       setCourseCount((courses?.length) ?? 0);

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [BASE_URL]);

  const quickActions = [
    {
      name: "Manage Teachers",
      path: "/teacher/list",
      icon: <FaUsers className="text-xl" />,
      description: "View and manage all teacher accounts",
    },
    {
      name: "Course Catalog",
      path: "/course/all",
      icon: <FaBook className="text-xl" />,
      description: "Browse and edit course offerings",
    },
    {
      name: "Allotments",
      path: "/allotments/list",
      icon: <FaUserFriends className="text-xl" />,
      description: "Manage teacher-course assignments",
    },
    {
      name: "Generate Reports",
      path: "/reports",
      icon: <FaFileDownload className="text-xl" />,
      description: "Download system data and reports",
    },
  ];

  const adminTools = [
    {
      name: "Assign Courses",
      path: "/allotments",
      icon: <FaCog className="text-xl" />,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <FaChartLine className="text-xl" />,
    },
    {
      name: "Academic Calendar",
      path: "/admin/calendar",
      icon: <FaCalendarAlt className="text-xl" />,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: <FaBell className="text-xl" />,
    },
  ];

  return (
    <div className="min-h-full px-0 py-0">
      {/* Header */}
      <header className={`py-6 px-0 ${darkMode ? "bg-zinc-800" : "bg-white"} shadow-sm`}>
        <div className="max-w-7xl px-6 mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className={darkMode ? "text-blue-400" : "text-blue-600"}>Admin</span> Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-zinc-700 text-blue-400" : "bg-blue-100 text-blue-800"}`}>
              Administrator
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Teachers */}
          <div 
            className={`p-6 rounded-xl shadow-sm flex items-center gap-4 ${darkMode ? "bg-zinc-800" : "bg-white"}`}
          >
            <div className={`p-3 rounded-lg ${darkMode ? "bg-zinc-700 text-blue-400" : "bg-blue-100 text-blue-800"}`}>
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Active Teachers
              </h3>
              <p className="text-3xl font-bold mt-1">{teacherCount}</p>
            </div>
          </div>

          {/* Courses */}
          <div 
            className={`p-6 rounded-xl shadow-sm flex items-center gap-4 ${darkMode ? "bg-zinc-800" : "bg-white"}`}
          >
            <div className={`p-3 rounded-lg ${darkMode ? "bg-zinc-700 text-blue-400" : "bg-blue-100 text-blue-800"}`}>
              <FaBook className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Total Courses
              </h3>
              <p className="text-3xl font-bold mt-1">{courseCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                to={action.path} 
                key={index}
                className={`group block p-6 rounded-xl shadow-sm transition-all hover:shadow-md ${darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white hover:bg-gray-50"}`}
              >
                <div className={`p-3 rounded-lg inline-flex ${darkMode ? "bg-zinc-700 text-blue-400" : "bg-blue-100 text-blue-800"} group-hover:scale-105 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="mt-4 font-medium">{action.name}</h3>
                <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Admin Tools */}
        <section>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Admin Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminTools.map((tool, index) => (
              <Link
                to={tool.path}
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg ${darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white hover:bg-gray-100"} shadow-sm transition-colors`}
              >
                <div className={`p-3 rounded-full mb-2 ${darkMode ? "bg-zinc-700 text-blue-400" : "bg-blue-100 text-blue-800"}`}>
                  {tool.icon}
                </div>
                <span className="text-sm font-medium">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
