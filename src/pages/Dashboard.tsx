import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, Tag, MoreVertical, FileText, Sparkles, ChevronRight, Crown, Layers3, Activity, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { storageService, Fiche } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { FREE_PLAN_LIMIT, STANDARD_PLAN_LIMIT, normalizePlanKey } from '../utils/pricingPlans';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [recentWorks, setRecentWorks] = useState<Fiche[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) setIsLoading(true);
      try {
        const allFiches = await storageService.getFiches();
        if (!isMounted) return;
        setFiches(allFiches);
        setRecentWorks(allFiches.slice(0, 3));
      } catch (error) {
        if (!isMounted) return;
        toast.error('Erreur de chargement', {
          description: 'Impossible de charger vos fiches.'
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (ficheId: string) => {
    navigate(`/dashboard/editor/${ficheId}`);
  };

  const filteredFiches = fiches.filter((fiche) =>
    fiche.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiche.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiche.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPlan = normalizePlanKey(profile?.tier);
  const lessonsCount = profile?.lessons_count || 0;
  const freeProgress = Math.min((lessonsCount / FREE_PLAN_LIMIT) * 100, 100);

  // Simple animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-edu-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-edu-dark italic">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto pb-16"
    >
      {/* Search & Actions Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="font-serif text-3xl text-edu-black">Tableau de bord</h2>
          <p className="text-sm text-edu-dark/60 mt-1 italic">Bienvenue sur votre espace de création{profile?.firstname ? `, ${profile.firstname}` : ''}.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
          <div className="relative group w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-edu-dark/40 group-focus-within:text-edu-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Chercher une fiche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red transition-all shadow-sm text-sm"
            />
          </div>
          
          <Link
            to="/pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-amber-500 text-amber-600 px-5 py-2 rounded-[2px] font-medium hover:bg-amber-500 hover:text-white transition-all text-xs uppercase tracking-widest whitespace-nowrap"
          >
            <Crown size={16} /> Offres
          </Link>

          <Link
            to="/dashboard/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-edu-red text-white px-5 py-2 rounded-[2px] font-medium hover:bg-edu-red-hover transition-all shadow-lg shadow-edu-red/20 whitespace-nowrap text-xs uppercase tracking-widest"
          >
            <Plus size={16} /> Nouvelle fiche
          </Link>
        </div>
      </motion.div>

      {/* Profile Overview / Plan Banner (Branding context) */}
      <motion.div variants={itemVariants}>
        {currentPlan === 'free' ? (
          <div className="mb-12 bg-white border border-edu-light/40 p-8 rounded-[2px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-edu-red/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-edu-red bg-edu-red/5 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Zap size={10} fill="currentColor" /> Plan Gratuit
                </div>
                <h3 className="font-serif text-2xl text-edu-black mb-3">Découvrez toute la puissance de l'IA pédagogique.</h3>
                <p className="text-edu-dark/70 text-sm leading-relaxed mb-6">
                  Vous explorez EduPlan avec {lessonsCount} fiches sur {FREE_PLAN_LIMIT}. 
                  Simplifiez-vous la vie en passant à un volume supérieur pour vos préparations quotidiennes.
                </p>
                
                <div className="w-full bg-edu-bg h-1 rounded-full overflow-hidden mb-2 max-w-sm">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${freeProgress}%` }}
                    className="h-full bg-edu-red shadow-[0_0_8px_rgba(126,11,11,0.4)]"
                  />
                </div>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">Usage: {lessonsCount}/{FREE_PLAN_LIMIT} fiches</p>
              </div>
              
              <Link
                to="/pricing"
                className="bg-edu-red hover:bg-edu-red-hover text-white px-8 py-3 rounded-[2px] font-bold uppercase tracking-widest text-xs transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Passer au Premium
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-amber-100 p-6 rounded-[2px] shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Layers3 size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Votre Abonnement</span>
              </div>
              <p className="font-serif text-3xl text-edu-black">{currentPlan === 'premium' ? 'Premium Illimité' : 'Standard 30/mois'}</p>
              <p className="text-xs text-edu-dark/60 mt-3 italic">Vous profitez déjà d'un accès étendu aux fonctionnalités.</p>
            </div>
            
            <Link to="/pricing" className="bg-[#FAF9F6] border border-edu-light/40 p-6 rounded-[2px] hover:border-edu-red/30 transition-all group">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-edu-red mb-2">Amélioration</p>
              <p className="font-serif text-2xl text-edu-black mb-2 flex items-center justify-between">
                Comparer les offres
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </p>
              <p className="text-xs text-edu-dark/60">Consultez les limites et les avantages de chaque niveau.</p>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Recents Section */}
      <motion.section variants={itemVariants} className="mb-16">
        <h3 className="font-serif text-xl text-edu-black mb-8 border-b border-edu-light/20 pb-2">Reprendre mes travaux</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentWorks.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              whileHover={{ y: -4 }}
              className="bg-white border border-edu-light/50 p-6 rounded-[2px] shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-edu-red bg-edu-red/5 px-2 py-0.5 rounded-sm">{item.class}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono opacity-40"><Clock size={12} /> {item.date}</span>
              </div>
              <h4 className="font-serif text-lg text-edu-black mb-6 group-hover:text-edu-red transition-colors line-clamp-2 leading-tight">{item.title}</h4>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-edu-bg h-1 rounded-full overflow-hidden">
                  <div className="bg-edu-black/10 h-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-[10px] font-bold text-edu-dark/40 uppercase tracking-tighter">Fiche</span>
              </div>
            </motion.div>
          ))}
          {recentWorks.length === 0 && (
            <div className="col-span-3 py-12 bg-white border border-dashed border-edu-light/50 text-center rounded-[2px]">
              <p className="text-edu-dark italic opacity-60">Aucun travail récent.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Main Library Library Section */}
      <motion.section variants={itemVariants} className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <h3 className="font-serif text-xl text-edu-black">Dernières fiches publiées</h3>
          <Link to="/dashboard/library" className="group flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-edu-dark/50 hover:text-edu-red transition-colors">
            Voir la bibliothèque <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        {filteredFiches.length === 0 ? (
          <div className="py-12 bg-white border border-dashed border-edu-light/50 text-center rounded-[2px]">
            <p className="text-edu-dark italic opacity-60 text-sm">Aucune fiche trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFiches.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleCardClick(item.id)}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-edu-light/40 p-6 rounded-[2px] shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                >
                  <button onClick={(e) => { e.stopPropagation(); navigate('/dashboard/library'); }} className="absolute top-5 right-5 text-edu-light hover:text-edu-red opacity-0 group-hover:opacity-100 transition-all" title="Options">
                    <MoreVertical size={16} />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-edu-red">{item.subject}</span>
                    <span className="text-[10px] font-medium text-edu-dark/40 bg-edu-bg px-2 py-0.5 rounded-sm">{item.class}</span>
                  </div>
                  
                  <h4 className="font-serif text-lg text-edu-black mb-3 group-hover:text-edu-red transition-colors line-clamp-2">{item.title}</h4>
                  
                  <p className="text-[10px] text-edu-dark/40 mb-6 font-mono">Modifié le {item.date}</p>
                  
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-edu-light/10">
                    {item.tags?.map((tag, j) => (
                      <span key={j} className="flex items-center gap-1 text-[10px] text-edu-dark/60 bg-edu-light/20 px-2 py-1 rounded-[2px] italic">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* Recommended Section (simplified models) */}
      <motion.section variants={itemVariants}>
        <h3 className="font-serif text-xl text-edu-black mb-8 border-b border-edu-light/20 pb-2">Modèles recommandés</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'template-1', name: 'Analyse Littéraire' },
            { id: 'template-2', name: 'TP Sciences Pratiques' },
            { id: 'template-3', name: 'Récit Historique' },
            { id: 'template-4', name: 'Exercices de Mathématiques' }
          ].map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -2 }}
              onClick={() => handleCardClick(template.id)}
              className="bg-white border border-edu-light/50 p-5 rounded-[2px] cursor-pointer hover:border-edu-red/40 transition-all text-center group shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-edu-bg flex items-center justify-center mx-auto mb-3 group-hover:bg-edu-red/5 transition-colors">
                <FileText size={18} className="text-edu-dark/40 group-hover:text-edu-red/60 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-edu-black tracking-tight uppercase leading-tight">{template.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
