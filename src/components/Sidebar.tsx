import React from 'react';
import { Settings, FileText, Sparkles, GraduationCap, FolderKanban, X, Library as LibraryIcon, LogOut, Zap, Crown, Gem, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { FREE_PLAN_LIMIT, normalizePlanKey } from '../utils/pricingPlans';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard/editor') {
      return location.pathname.startsWith('/dashboard/editor');
    }
    return location.pathname === path;
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

  const currentPlan = normalizePlanKey(profile?.tier);
  const lessonsCount = profile?.lessons_count || 0;
  const usagePercent = Math.min((lessonsCount / FREE_PLAN_LIMIT) * 100, 100);

  return (
    <>
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

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-64 bg-edu-dark text-edu-bg flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] h-full border-r border-edu-black/20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 text-edu-bg/70 hover:text-edu-bg p-2 -mr-2 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        <div className="p-6 lg:p-8 border-b border-edu-light/10">
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap size={28} className="text-edu-bg" />
            <h1 className="font-serif text-3xl tracking-wide text-edu-bg">EduPlan</h1>
          </div>
          <p className="text-[10px] font-mono tracking-widest opacity-60 uppercase">Assistant pédagogique IA</p>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold uppercase tracking-widest text-edu-bg/40 mb-3 px-4">Menu principal</p>

          <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red font-semibold' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FolderKanban size={18} strokeWidth={1.5} />
            <span className="text-sm">Tableau de bord</span>
          </Link>

          <Link to="/dashboard/library" onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/library') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red font-semibold' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <LibraryIcon size={18} strokeWidth={1.5} />
            <span className="text-sm">Ma bibliothèque</span>
          </Link>

          <Link to="/dashboard/editor/blank" onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/editor') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red font-semibold' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FileText size={18} strokeWidth={1.5} />
            <span className="text-sm">Éditeur de fiche</span>
          </Link>

          <Link to="/dashboard/learn-ai" onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/learn-ai') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red font-semibold' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <Sparkles size={18} strokeWidth={1.5} />
            <span className="text-sm">Apprendre l'IA</span>
          </Link>
          
          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-edu-bg/40 mb-3 px-4">Préférences</p>
            <Link to="/dashboard/settings" onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red font-semibold' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
              <Settings size={18} strokeWidth={1.5} />
              <span className="text-sm">Paramètres</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-edu-light/10 flex flex-col gap-4">
          <div className="px-4">
            <ThemeToggle />
          </div>

          {/* Plan Card - Reverting to simplified brand-aligned code */}
          <div className="px-5 py-5 bg-edu-black/30 rounded-lg border border-white/5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-edu-bg/60 uppercase tracking-widest flex items-center gap-1.5">
                {currentPlan === 'premium' ? <Crown size={12} className="text-amber-500" /> : currentPlan === 'standard' ? <Gem size={12} className="text-blue-400" /> : <Zap size={12} className="text-edu-red" />}
                Plan {currentPlan === 'premium' ? 'Premium' : currentPlan === 'standard' ? 'Standard' : 'Gratuit'}
              </span>
              {currentPlan === 'free' && (
                <Link to="/pricing" onClick={onClose} className="text-[9px] text-edu-red font-bold hover:underline tracking-widest">UPGRADE</Link>
              )}
            </div>

            {currentPlan === 'free' && (
              <>
                <div className="w-full bg-edu-bg/10 h-1 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-500 bg-edu-red shadow-[0_0_8px_rgba(126,11,11,0.5)]" style={{ width: `${usagePercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[9px] font-medium opacity-50 mb-4">
                  <span>{lessonsCount}/{FREE_PLAN_LIMIT} fiches</span>
                </div>
                <Link 
                  to="/pricing" 
                  onClick={onClose} 
                  className="block text-center px-4 py-2.5 rounded-[2px] bg-edu-red text-white text-[10px] font-bold uppercase tracking-widest hover:bg-edu-red-hover transition-colors shadow-lg shadow-black/20"
                >
                  Passer au Premium
                </Link>
              </>
            )}

            {currentPlan !== 'free' && (
              <div className="text-[10px] font-medium opacity-60 leading-relaxed">
                {currentPlan === 'premium' ? 'Accès illimité et complet activé.' : 'Usage étendu (30/mois) activé.'}
              </div>
            )}
          </div>

          <div className="mt-2 px-4 flex items-center justify-between group">
            <Link to="/dashboard/profile" onClick={onClose} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[2px] bg-edu-black/40 border border-edu-light/10 flex items-center justify-center font-serif text-sm">
                {profile?.firstname?.charAt(0) || 'U'}{profile?.lastname?.charAt(0) || ''}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[110px] group-hover:text-white transition-colors">
                  {profile ? `${profile.firstname} ${profile.lastname.charAt(0)}.` : 'Chargement...'}
                </span>
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                  {profile?.role === 'teacher' ? 'Enseignant' : profile?.role || 'Membre'}
                </span>
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 text-edu-bg/40 hover:text-edu-red transition-colors" title="Se déconnecter">
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
