import React from 'react';
import { BookOpen, Settings, FileText, Sparkles, PlusSquare, GraduationCap, FolderKanban, X, Library as LibraryIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import { ThemeToggle } from './ThemeToggle';

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, profile } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Bientôt disponible', {
      description: 'Cette fonctionnalité est en cours de développement.'
    });
    if (window.innerWidth < 1024) onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-edu-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-64 bg-edu-dark text-edu-bg flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] h-full border-r border-edu-black/20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="lg:hidden absolute top-6 right-6 text-edu-bg/70 hover:text-edu-bg p-2 -mr-2 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Logo Area */}
        <div className="p-6 lg:p-8 border-b border-edu-light/30">
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap size={28} className="text-edu-bg" />
            <h1 className="font-serif text-3xl tracking-wide text-edu-bg">EduPlan</h1>
          </div>
          <p className="text-[10px] font-mono tracking-widest opacity-60 uppercase">Maintenance Ind. (MEL)</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-serif italic text-edu-light mb-2 px-4">Menu Principal</p>
          
          <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FolderKanban size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Tableau de bord</span>
          </Link>

          <Link to="/dashboard/library" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/library') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <LibraryIcon size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Ma Bibliothèque</span>
          </Link>
          
          <Link to="/dashboard/editor" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/editor') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FileText size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Éditeur de Fiche</span>
          </Link>
          
          <Link to="/dashboard/learn-ai" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/learn-ai') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <Sparkles size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Apprendre l'IA</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-edu-light/30 flex flex-col gap-4">
          <div className="px-4">
            <ThemeToggle />
          </div>
          <Link to="/dashboard/settings" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <Settings size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Paramètres</span>
          </Link>
          <div className="mt-4 px-4 flex items-center justify-between">
            <Link to="/dashboard/profile" onClick={onClose} className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-edu-black/40 border border-edu-light/30 flex items-center justify-center font-serif text-sm">
                {profile?.firstname?.charAt(0) || 'U'}{profile?.lastname?.charAt(0) || ''}
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-xs font-medium truncate max-w-[120px]">
                  {profile ? `${profile.firstname} ${profile.lastname.charAt(0)}.` : 'Chargement...'}
                </span>
                <span className="text-[10px] font-mono opacity-60 uppercase">
                  {profile?.role === 'teacher' ? 'Enseignant' : profile?.role || 'Utilisateur'}
                </span>
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 text-edu-bg/70 hover:text-edu-red hover:bg-edu-black/10 rounded-[2px] transition-colors" title="Se déconnecter">
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
