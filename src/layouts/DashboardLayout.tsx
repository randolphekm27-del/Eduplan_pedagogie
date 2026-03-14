import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

import { ThemeToggle } from '../components/ThemeToggle';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-edu-bg transition-colors duration-500">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-edu-bg/90 backdrop-blur-md border-b border-edu-light/30 z-20 sticky top-0 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 text-edu-black hover:bg-edu-light/20 rounded-md transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <Link to="/dashboard" className="font-serif text-xl tracking-wide text-edu-black">EduPlan</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-edu-dark text-edu-bg flex items-center justify-center font-serif text-xs">
              PR
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
