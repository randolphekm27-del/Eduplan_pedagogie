import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreationOptions from './pages/CreationOptions';
import AIPrompt from './pages/AIPrompt';
import DocumentUpload from './pages/DocumentUpload';
import ManualForm from './pages/ManualForm';
import SheetEditor from './components/SheetEditor';
import Preview from './pages/Preview';
import LearnAI from './pages/LearnAI';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'font-sans rounded-[2px]' }} />
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="library" element={<Library />} />
                <Route path="create" element={<CreationOptions />} />
                <Route path="create/ai" element={<AIPrompt />} />
                <Route path="create/upload" element={<DocumentUpload />} />
                <Route path="create/manual" element={<ManualForm />} />
                <Route path="editor/:id?" element={<SheetEditor />} />
                <Route path="preview/:id" element={<Preview />} />
                <Route path="learn-ai" element={<LearnAI />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
