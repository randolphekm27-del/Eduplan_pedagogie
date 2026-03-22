import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ModèlesdefichesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Modèles de fiches</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Inspirez-vous des trames partagées par la communauté et par nos experts pour structurer vos propres documents.</p>

      <div className="space-y-6 mt-8">
        <div className="flex gap-4 p-4 border border-edu-light/30 rounded hover:border-edu-red transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-edu-bg text-edu-red flex items-center justify-center font-serif text-xl group-hover:bg-edu-black group-hover:text-white transition-colors">📄</div>
          <div>
            <h4 className="m-0 text-edu-black">Fiche de Préparation Standard</h4>
            <p className="text-sm mt-1">Le classique intemporel pour définir enjeux, pré-requis, matériel, et la trace écrite visée.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 border border-edu-light/30 rounded hover:border-edu-red transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-edu-bg text-edu-red flex items-center justify-center font-serif text-xl group-hover:bg-edu-black group-hover:text-white transition-colors">📊</div>
          <div>
            <h4 className="m-0 text-edu-black">Grille d'Évaluation par Compétences</h4>
            <p className="text-sm mt-1">Idéal pour l'évaluation formative. Colonnes ajustables selon les indicateurs de réussite.</p>
          </div>
        </div>
      </div>
    
        </div>
      </div>
    </motion.div>
  );
}