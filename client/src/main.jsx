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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout1 />,
    children: [
      { index: true, element: <Home /> },
      { path: "/teacher/login", element: <TeacherLogin /> },
      { path: "/teacher/register", element: <TeacherRegister /> },
      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/teacher/list", element: <TeacherList /> },
      { path: "/course/all", element: <CourseList /> },
      { path: "/allotments/list", element: <AllotmentsListView /> },
      { path: "/dowload/list", element: <DownloadList />}
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);