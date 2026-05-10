import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer, useToast } from './components/Toast';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import ModuleDetail from './pages/ModuleDetail';
import LessonDetail from './pages/LessonDetail';
import AssignmentDetail from './pages/AssignmentDetail';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import Results from './pages/student/Results';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { toasts, remove } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} remove={remove} />
      <div className="min-h-screen bg-[#F0FDFA] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/modules/:id" element={<ModuleDetail />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/assignments/:id" element={
              <ProtectedRoute roles={['student']}>
                <AssignmentDetail />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute roles={['student']}>
                <Results />
              </ProtectedRoute>
            } />

            <Route path="/teacher" element={
              <ProtectedRoute roles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-sm text-slate-400 mt-auto">
          © 2025 <span className="gradient-text font-semibold">EduPortal</span> — Barcha huquqlar himoyalangan
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
