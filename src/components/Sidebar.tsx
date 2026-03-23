import React from 'react';
import { Settings, FileText, Sparkles, GraduationCap, FolderKanban, X, Library as LibraryIcon, LogOut, Zap, Crown, Gem } from 'lucide-react';
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

        <div className="p-6 lg:p-8 border-b border-edu-light/30">
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap size={28} className="text-edu-bg" />
            <h1 className="font-serif text-3xl tracking-wide text-edu-bg">EduPlan</h1>
          </div>
          <p className="text-[10px] font-mono tracking-widest opacity-60 uppercase">Parcours gratuit vers premium</p>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-serif italic text-edu-light mb-2 px-4">Menu principal</p>

          <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FolderKanban size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Tableau de bord</span>
          </Link>

          <Link to="/dashboard/library" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/library') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <LibraryIcon size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Ma bibliothèque</span>
          </Link>

          <Link to="/dashboard/editor/blank" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/editor') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <FileText size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Éditeur de fiche</span>
          </Link>

          <Link to="/dashboard/learn-ai" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/learn-ai') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <Sparkles size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Apprendre l'IA</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-edu-light/30 flex flex-col gap-4">
          <div className="px-4">
            <ThemeToggle />
          </div>
          <Link to="/dashboard/settings" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-[2px] transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-edu-black/20 text-edu-bg border-l-2 border-edu-red' : 'text-edu-bg/70 hover:text-edu-bg hover:bg-edu-black/10'}`}>
            <Settings size={18} strokeWidth={1.5} />
            <span className="font-sans text-sm font-medium">Paramètres</span>
          </Link>

          <div className="px-4 py-4 bg-edu-black/20 rounded-xl mb-2 mt-2 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-edu-bg/60 uppercase tracking-widest flex items-center gap-1">
                {currentPlan === 'premium' ? <Crown size={10} className="text-amber-400" /> : currentPlan === 'standard' ? <Gem size={10} className="text-amber-300" /> : <Zap size={10} className="text-edu-red" />}
                Plan {currentPlan === 'premium' ? 'Premium' : currentPlan === 'standard' ? 'Standard' : 'Gratuit'}
              </span>
              {currentPlan === 'free' && (
                <Link to="/pricing" onClick={onClose} className="text-[10px] text-edu-red font-bold hover:underline">UPGRADE</Link>
              )}
            </div>

            {currentPlan === 'free' && (
              <>
                <div className="w-full bg-edu-bg/10 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-500 bg-edu-red shadow-[0_0_8px_rgba(126,11,11,0.5)]" style={{ width: `${usagePercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono opacity-60 mb-3">
                  <span>{lessonsCount}/{FREE_PLAN_LIMIT} fiches ce mois-ci</span>
                </div>
                <Link to="/pricing" onClick={onClose} className="block text-center px-3 py-2 rounded-lg bg-edu-red text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-edu-red/90 transition-colors">
                  Voir Standard et Premium
                </Link>
              </>
            )}

            {currentPlan === 'standard' && (
              <div className="text-[10px] font-mono text-edu-bg/70 leading-relaxed">
                Jusqu'à 30 fiches par mois, IA, import et export HD.
              </div>
            )}

            {currentPlan === 'premium' && (
              <div className="text-[10px] font-mono text-edu-bg/70 leading-relaxed">
                Fiches illimitées et accès complet aux fonctionnalités avancées.
              </div>
            )}
          </div>

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
