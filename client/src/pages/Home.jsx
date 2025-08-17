import React from "react";
import { Link } from "react-router-dom";
import { 
  FaChalkboardTeacher, 
  FaUserShield, 
  FaUsers, 
  FaBook, 
  FaUserFriends,
  FaFileDownload 
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const { darkMode } = useTheme();

  // Array containing all navigation items
  const navItems = [
    {
      name: "Teachers Login",
      path: "/teacher/login",
      icon: <FaChalkboardTeacher className="mr-3 text-xl" />,
    },
    {
      name: "Admin Login",
      path: "/admin/login",
      icon: <FaUserShield className="mr-3 text-xl" />,
    },
    {
      name: "View All Teachers",
      path: "/teacher/list",
      icon: <FaUsers className="mr-3 text-xl" />,
    },
    {
      name: "View All Courses",
      path: "/course/all",
      icon: <FaBook className="mr-3 text-xl" />,
    },
    {
      name: "View All Allotments",
      path: "/allotments/list",
      icon: <FaUserFriends className="mr-3 text-xl" />,
    },
    {
      name: "Download Allotments",
      path: "/dowload/list",
      icon: <FaFileDownload className="mr-3 text-xl" />,
    },
  ];

  return (
    <div className="min-h-full flex flex-col transition-colors duration-300">
      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to the Teacher Course Allotments System
        </h2>
        <p className={`mb-10 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          Manage teachers, courses, and allotments efficiently with this system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {navItems.map((item, index) => (
            <Link to={item.path}>
              <div key={index} className={`flex flex-col items-center w-full font-medium py-8 px-4 rounded-md shadow-md transition duration-300 text-center cursor-pointer ${
                    darkMode ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-white hover:bg-sky-50 text-black"
                  }`}>
                {/* Icon container with circular background */}
                <div className={`mb-3 p-4 rounded-full ${
                  darkMode ? "bg-gray-800 text-blue-400" : "bg-blue-100 text-blue-800"
                }`}>
                  {React.cloneElement(item.icon, { className: "text-2xl" })}
                </div>
                
                {/* Button with text only */}
                
                  {item.name}
              </div>
            </Link >
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;