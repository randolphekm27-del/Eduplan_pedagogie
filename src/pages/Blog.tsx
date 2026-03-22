import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BlogPédagogiquePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Blog Pédagogique</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Ressources, dossiers et retours d'expériences d'enseignants passionnés par l'innovation éducative.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-edu-bg/50 p-6 rounded-[2px] border border-edu-light/20">
          <span className="text-[10px] font-bold uppercase tracking-widest text-edu-red">Méthodologie</span>
          <h4 className="font-serif mt-2 mb-4 text-xl">L'IA, alliée de la classe inversée</h4>
          <p className="text-sm">Découvrez comment générer facilement des capsules vidéo de qualité grâce à des scripts co-construits.</p>
          <a href="#" className="font-bold text-xs uppercase tracking-widest mt-4 inline-block">Lire l'article &rarr;</a>
        </div>
        <div className="bg-edu-bg/50 p-6 rounded-[2px] border border-edu-light/20">
          <span className="text-[10px] font-bold uppercase tracking-widest text-edu-red">Témoignage</span>
          <h4 className="font-serif mt-2 mb-4 text-xl">De 15h à 5h de préparation hebdo</h4>
          <p className="text-sm">L'interview exclusive d'un enseignant en Histoire-Géo qui a divisé par 3 son temps de préparation formelle.</p>
          <a href="#" className="font-bold text-xs uppercase tracking-widest mt-4 inline-block">Lire l'article &rarr;</a>
        </div>
      </div>
    
        </div>
      </div>
    </motion.div>
  );
}