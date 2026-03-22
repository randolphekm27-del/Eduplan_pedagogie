import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NouveautésPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Nouveautés</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Suivez l'évolution d'EduPlan. Nous déployons régulièrement de nouvelles mises à jour pour vous offrir la meilleure expérience utilisateur.</p>
      
      <div className="border-l-4 border-edu-red pl-6 mb-8 mt-8">
        <h4 className="text-edu-red font-bold uppercase tracking-widest text-xs mb-2">Avril 2026</h4>
        <h3 className="mt-0">Moteur de Recherche Intégral</h3>
        <p>Retrouvez n'importe quelle fiche ou concept dans votre bibliothèque en une fraction de seconde, avec le support de la recherche sémantique.</p>
      </div>

      <div className="border-l-4 border-edu-light pl-6 mb-8 opacity-70">
        <h4 className="text-edu-dark font-bold uppercase tracking-widest text-xs mb-2">Mars 2026</h4>
        <h3 className="mt-0">Refonte de l'interface et mode Sombre</h3>
        <p>Introduction d'un design Premium, plus aéré, et d'un mode sombre élégant pour ménager vos yeux lors des préparations de cours nocturnes.</p>
      </div>
    
        </div>
      </div>
    </motion.div>
  );
}