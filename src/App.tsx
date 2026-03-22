import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts - remain static as they are wraps
import DashboardLayout from './layouts/DashboardLayout';
import PublicPageLayout from './layouts/PublicPageLayout';

// Pages - Code Splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreationOptions = lazy(() => import('./pages/CreationOptions'));
const AIPrompt = lazy(() => import('./pages/AIPrompt'));
const DocumentUpload = lazy(() => import('./pages/DocumentUpload'));
const ManualForm = lazy(() => import('./pages/ManualForm'));
const SheetEditor = lazy(() => import('./components/SheetEditor'));
const Preview = lazy(() => import('./pages/Preview'));
const LearnAI = lazy(() => import('./pages/LearnAI'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Library = lazy(() => import('./pages/Library'));
const Pricing = lazy(() => import('./pages/Pricing'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const Features = lazy(() => import('./pages/Features'));
const WhatsNew = lazy(() => import('./pages/WhatsNew'));
const Blog = lazy(() => import('./pages/Blog'));
const Guides = lazy(() => import('./pages/Guides'));
const TemplatesGallery = lazy(() => import('./pages/TemplatesGallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Legal = lazy(() => import('./pages/Legal'));

// Loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
    <div className="w-12 h-12 border-4 border-edu-red/20 border-t-edu-red rounded-full animate-spin"></div>
    <p className="text-edu-dark/40 font-medium animate-pulse">Chargement d'EduPlan...</p>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'font-sans rounded-[2px]' }} />
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public routes ─────────────────────────────── */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout-success" element={<CheckoutSuccess />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/templates-gallery" element={<TemplatesGallery />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/legal" element={<Legal />} />

                  {/* ── Protected dashboard routes ────────────────── */}
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

                  {/* ── Fallback ───────────────────────────────────── */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}
