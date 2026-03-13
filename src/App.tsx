import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
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

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'font-sans rounded-[2px]' }} />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
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
      </Routes>
    </Router>
    </>
  );
}
