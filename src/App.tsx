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
import PublicPageLayout from './layouts/PublicPageLayout';
import Features from './pages/Features';
import WhatsNew from './pages/WhatsNew';
import Blog from './pages/Blog';
import Guides from './pages/Guides';
import TemplatesGallery from './pages/TemplatesGallery';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Legal from './pages/Legal';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'font-sans rounded-[2px]' }} />
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/pricing" element={<Pricing />} />
              
              <Route element={<PublicPageLayout />}>
                <Route path="/features" element={<Features />} />
                <Route path="/whats-new" element={<WhatsNew />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/templates-gallery" element={<TemplatesGallery />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/legal" element={<Legal />} />
              </Route>

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
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}
