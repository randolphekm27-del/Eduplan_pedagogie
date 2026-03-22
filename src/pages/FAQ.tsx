import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function FoireAuxQuestionsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Foire Aux Questions</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Les réponses aux questions les plus courantes sur notre outil et ses méthodes.</p>

      <h3 className="border-t border-edu-light/40 pt-6">Est-ce que l'IA remplace mon travail de conception ?</h3>
      <p>Absolument pas. EduPlan agit comme un "assistant brouillon" très performant. Vous restez le garant de la cohérence didactique et de la transposition pédagogique. L'outil vous fait simplement gagner du temps sur la rédaction et l'idéation.</p>

      <h3 className="border-t border-edu-light/40 pt-6">Mes données sont-elles utilisées pour entraîner l'IA ?</h3>
      <p>Non. Vos fiches et vos contenus personnels restent strictement confidentiels. Nous n'utilisons aucun de vos documents pour entraîner des modèles de langage externes.</p>

      <h3 className="border-t border-edu-light/40 pt-6">Que se passe-t-il si je supprime mon compte ?</h3>
      <p>Conformément à nos CGV et au RGPD, toutes vos données (fiches, informations personnelles, etc.) sont effacées définitivement et de manière irréversible de l'ensemble de nos serveurs sécurisés.</p>
    
        </div>
      </div>
    </motion.div>
  );
}