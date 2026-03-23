import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, Tag, MoreVertical, FileText, Sparkles, ChevronRight, Crown, Layers3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-edu-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-edu-dark">Chargement de votre tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="font-serif text-3xl text-edu-black">Tableau de bord</h2>
          <p className="text-sm text-edu-dark/60 mt-1">Un accès premium visible pour convertir au bon moment.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative group flex-1 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-edu-dark group-focus-within:text-edu-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une fiche, un thème..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all shadow-sm"
            />
          </div>
          <Link
            to="/pricing"
            className="flex items-center justify-center gap-2 border border-edu-red text-edu-red px-5 py-2.5 rounded-[2px] font-medium hover:bg-edu-red hover:text-white transition-all whitespace-nowrap"
          >
            <Crown size={18} /> Voir les offres
          </Link>
          <Link
            to="/dashboard/create"
            className="flex items-center justify-center gap-2 bg-edu-red text-white px-5 py-2.5 rounded-[2px] font-medium hover:bg-[#5a0808] transition-all shadow-[0_4px_14px_rgba(126,11,11,0.2)] hover:shadow-[0_6px_20px_rgba(126,11,11,0.3)] whitespace-nowrap"
          >
            <Plus size={18} /> Nouvelle fiche
          </Link>
        </div>
      </div>

      {currentPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 relative overflow-hidden bg-edu-dark rounded-2xl p-6 md:p-8 text-white shadow-xl border border-edu-red/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-edu-red/10 blur-[80px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-edu-red/10 blur-[60px] -ml-24 -mb-24"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-edu-red px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                <Sparkles size={12} fill="white" />
                Passage au payant
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-2">Vos 5 fiches gratuites sont un point de départ, pas une limite durable</h3>
              <p className="text-edu-bg/70 text-sm md:text-base">
                Vous avez utilisé <strong>{lessonsCount}</strong> fiche(s) sur {FREE_PLAN_LIMIT} ce mois-ci. Passez au plan Standard pour aller jusqu'à {STANDARD_PLAN_LIMIT} fiches par mois, ou choisissez Premium pour supprimer toute contrainte et débloquer l'accès avancé.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                to="/pricing"
                className="bg-edu-red hover:bg-edu-red/90 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-edu-red/20 flex items-center justify-center gap-2 group"
              >
                Découvrir Standard et Premium
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-edu-red h-full rounded-full" style={{ width: `${freeProgress}%` }}></div>
            </div>
            <p className="text-xs text-white/60">Progression du quota gratuit: {lessonsCount}/{FREE_PLAN_LIMIT} fiches</p>
          </div>
        </motion.div>
      )}

      {currentPlan !== 'free' && (
        <div className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <Layers3 size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Plan actif</span>
            </div>
            <p className="font-serif text-2xl text-edu-black">{currentPlan === 'premium' ? 'Premium' : 'Standard'}</p>
            <p className="text-sm text-edu-dark/70 mt-2">Vous profitez déjà des fonctionnalités payantes. Vous pouvez revoir les offres à tout moment pour comparer les niveaux.</p>
          </div>
          <Link to="/pricing" className="rounded-2xl border border-edu-light/40 bg-white p-5 hover:border-edu-red transition-colors">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-edu-red mb-2">Comparer les plans</p>
            <p className="font-serif text-2xl text-edu-black mb-2">Voir les différences</p>
            <p className="text-sm text-edu-dark/70">Retrouvez les limites, bénéfices et le détail des offres Standard et Premium.</p>
          </Link>
        </div>
      )}

      <section className="mb-12">
        <h3 className="font-serif text-xl text-edu-black mb-6">Reprendre mes travaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentWorks.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              whileHover={{ y: -4 }}
              className="bg-white border border-edu-light/50 p-5 rounded-[2px] shadow-sm hover:shadow-md hover:border-edu-light transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-edu-dark bg-edu-bg px-2 py-1 rounded-sm">{item.class}</span>
                <span className="flex items-center gap-1 text-xs text-edu-dark"><Clock size={12} /> {item.date}</span>
              </div>
              <h4 className="font-medium text-edu-black mb-4 group-hover:text-edu-red transition-colors line-clamp-2">{item.title}</h4>
              <div className="w-full bg-edu-bg h-1.5 rounded-full overflow-hidden">
                <div className="bg-edu-red h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </motion.div>
          ))}
          {recentWorks.length === 0 && (
            <div className="col-span-3 py-10 bg-white border border-dashed border-edu-light text-center rounded-[2px]">
              <p className="text-edu-dark italic">Aucune fiche récente.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-serif text-xl text-edu-black">Mes dernières fiches pédagogiques</h3>
          <Link to="/dashboard/library" className="text-sm text-edu-dark hover:text-edu-red transition-colors">Voir tout</Link>
        </div>
        {filteredFiches.length === 0 ? (
          <div className="py-10 bg-white border border-dashed border-edu-light text-center rounded-[2px]">
            <p className="text-edu-dark italic">Aucune fiche trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiches.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                whileHover={{ y: -4 }}
                className="bg-white border border-edu-light/50 p-6 rounded-[2px] shadow-sm hover:shadow-md hover:border-edu-light transition-all cursor-pointer group relative"
              >
                <button onClick={(e) => { e.stopPropagation(); navigate('/dashboard/library'); }} className="absolute top-4 right-4 text-edu-light hover:text-edu-black opacity-0 group-hover:opacity-100 transition-opacity" title="Plus d'options">
                  <MoreVertical size={18} />
                </button>
                <div className="flex gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-edu-red">{item.subject}</span>
                  <span className="text-[10px] font-mono text-edu-dark border-l border-edu-light/50 pl-2">{item.class}</span>
                </div>
                <h4 className="font-bold text-edu-black mb-2 group-hover:text-edu-red transition-colors">{item.title}</h4>
                <p className="text-xs text-edu-dark mb-4">Modifié le {item.date}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.tags?.map((tag, j) => (
                    <span key={j} className="flex items-center gap-1 text-[10px] bg-edu-bg text-edu-dark px-2 py-1 rounded-sm">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl text-edu-black mb-6">Modèles pédagogiques populaires</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'template-1', name: 'Analyse Littéraire' },
            { id: 'template-2', name: 'TP Sciences' },
            { id: 'template-3', name: 'Séquence Histoire' },
            { id: 'template-4', name: 'Exercices Maths' }
          ].map((template) => (
            <div
              key={template.id}
              onClick={() => handleCardClick(template.id)}
              className="bg-[#F5F2ED] border border-edu-light/40 p-4 rounded-[2px] hover:border-edu-red/50 cursor-pointer transition-colors text-center"
            >
              <FileText size={24} className="mx-auto mb-2 text-edu-dark" strokeWidth={1.5} />
              <h4 className="text-sm font-medium text-edu-black">{template.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
