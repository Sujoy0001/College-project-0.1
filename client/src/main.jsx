import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from "./context/ThemeContext.jsx"; // import provider
import Layout1 from './layout/Layout01.jsx';
import Home from "./pages/Home.jsx";
import TeacherLogin from './pages/TeacherLogin.jsx';
import TeacherRegister from './pages/TeacherRegister.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import TeacherList from './pages/TeacherList.jsx';
import CourseList from './pages/CourseList.jsx';
import DownloadList from './pages/DownloadList.jsx';
import AllotmentsListView from './pages/AllotmentsListView.jsx';
import TeacherDetails from './pages/TeacherDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Allotments from './pages/Allotments.jsx';
import EditAllotments from './pages/EditAllotments.jsx';
import Layout02 from './layout/Layout2.jsx';
import CourseRegister from './pages/CourseRegister.jsx';
import AdminTeacherList from './pages/AdminTeacherDetails.jsx';
import AdminCourseList from './pages/AdminCourseList.jsx';
import DownloadPDF from './pages/DownloadList.jsx';
import AdminAllotmentsListView from './pages/AdminAllotmentsListView.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { NotificationProvider } from "./context/NotificationContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout1 />,
    children: [
      { index: true, element: <Home /> },
      { path: "/teacher/login", element: <TeacherLogin /> },
      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/teacher/list", element: <TeacherList /> },
      { path: "/course/all", element: <CourseList /> },
      { path: "/allotments/list", element: <AllotmentsListView /> },
      { path: "/dowload/list", element: <DownloadList /> },
      { path: "/teacher", element: <TeacherDetails /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ]
  },
  {
    path: "/admin",
    element: (
      <Layout02 />
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "allotments", element: <Allotments /> },
      { path: "allotments/edit", element: <EditAllotments /> },
      { path: "teacher/register", element: <TeacherRegister /> },
      { path: "add", element: <CourseRegister /> },
      { path: "teacher/edit", element: <AdminTeacherList /> },
      { path: "courses/edit", element: <AdminCourseList /> },
      { path: "dowload/list", element: <DownloadList /> },
      { path: "allotmentslist/edit", element: <AdminAllotmentsListView /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);