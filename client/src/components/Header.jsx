import React, { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck, FaSun, FaMoon } from "react-icons/fa";
import { notifications as initialNotifications } from "../store/notifications";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications.filter((n) => !n.read).length
  );

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector('.notification-panel');
      const notificationButton = document.querySelector('.notification-button');
      
      if (showNotifications && notificationPanel && !notificationPanel.contains(event.target) && 
          !notificationButton.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const formatTime = (date) => 
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date) => 
    date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className={`shadow-md transition-colors duration-300 ${
      darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
        <h1 className={`text-2xl font-bold tracking-tight ${
          darkMode ? "text-sky-400" : "text-sky-600"
        }`}>
          Teacher Course Allotments System
        </h1></Link>

        <div className="flex items-center space-x-6">
          {/* Time */}
          <div className="hidden sm:block text-right">
            <div className={`text-lg font-medium ${
              darkMode ? "text-zinc-100" : "text-zinc-800"
            }`}>
              {formatTime(currentTime)}
            </div>
            <div className={`text-xs ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}>
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
              darkMode 
                ? "bg-zinc-700 text-sky-400 hover:bg-zinc-600" 
                : "bg-zinc-100 text-sky-600 hover:bg-zinc-200"
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className={`notification-button p-2 rounded-full transition-all duration-200 relative cursor-pointer ${
                darkMode 
                  ? showNotifications 
                    ? "bg-zinc-700 text-sky-400 hover:bg-zinc-600" 
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-sky-400"
                  : showNotifications 
                    ? "bg-zinc-100 text-sky-600 hover:bg-zinc-200"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-sky-600"
              }`}
              aria-label="Notifications"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Panel */}
            {showNotifications && (
              <div className={`notification-panel absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50 border transition-all duration-200 ${
                darkMode 
                  ? "bg-zinc-800 text-zinc-100 border-zinc-700" 
                  : "bg-white text-zinc-800 border-zinc-200"
              }`}>
                <div className={`p-4 border-b flex justify-between items-center rounded-t-lg ${
                  darkMode ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
                }`}>
                  <h3 className="font-bold text-lg flex items-center">
                    <FaBell className="mr-2 text-sky-500" /> Notifications
                  </h3>
                  <div className="flex space-x-3">
                    <button 
                      onClick={toggleNotifications}
                      className={`p-1 rounded-md transition-colors ${
                        darkMode 
                          ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300" 
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                      }`}
                      title="Close"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className="p-4 transition-colors"
                      >
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className={`text-xs mt-2 flex justify-between items-center ${
                          darkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          <span>{notification.time}</span>
                          {!notification.read && (
                            <span className={`inline-block h-2 w-2 rounded-full ${
                              darkMode ? "bg-sky-400" : "bg-sky-500"
                            }`}></span>
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className={`p-6 text-center ${
                      darkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      No notifications available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}