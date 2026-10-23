import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { ChatPage } from '../pages/student/ChatPage';
import { HistoryPage } from '../pages/student/HistoryPage';
import { ProfilePage } from '../pages/student/ProfilePage';

// Faculty Pages
import { FacultyDashboard } from '../pages/faculty/FacultyDashboard';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { DocumentsPage } from '../pages/admin/DocumentsPage';
import { UploadDocumentPage } from '../pages/admin/UploadDocumentPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { SystemLogsPage } from '../pages/admin/SystemLogsPage';

export const router = createBrowserRouter([
  // Public Routes with PublicLayout
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
    ],
  },

  // Student & Common Dashboard Routes
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Faculty Specific Dashboard Routes
  {
    path: '/faculty',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/faculty/dashboard" replace /> },
      { path: 'dashboard', element: <FacultyDashboard /> },
    ],
  },

  // Administrator Protected Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'documents/upload', element: <UploadDocumentPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'logs', element: <SystemLogsPage /> },
    ],
  },

  // Fallback 404 Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
