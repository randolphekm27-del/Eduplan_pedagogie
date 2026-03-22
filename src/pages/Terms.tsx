import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ConditionsGénéralesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Conditions Générales</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Conditions d'utilisation de la plateforme EduPlan.</p>

      <h3>1. Accès au service</h3>
      <p>L'accès à la plateforme est conditionné à l'acceptation de ces conditions. Toute création de compte implique l'acceptation formelle et sans réserve de l'intégralité de la présente structure juridique.</p>

      <h3>2. Utilisation loyale</h3>
      <p>Vous vous engagez à ne pas détourner l'outil pour un usage frauduleux, illicite ou malveillant. Les requêtes abusives ou automatisées (bots) via notre interface peuvent entraîner la suspension temporaire ou définitive du compte sans préavis ni indemnité.</p>
      
      <h3>3. Évolution des règles</h3>
      <p>EduPlan se réserve le droit de modifier ponctuellement ses conditions, principalement pour s'adapter aux évolutions réglementaires et technologiques de l'intelligence artificielle en contexte éducatif.</p>
    
        </div>
      </div>
    </motion.div>
  );
}