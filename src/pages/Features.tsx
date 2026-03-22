import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function FonctionnalitésIAPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Fonctionnalités IA</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Découvrez comment notre technologie d'intelligence artificielle transforme la préparation de vos cours et allège votre charge mentale.</p>
      
      <h3>🚀 Génération automatique de Séquences</h3>
      <p>Créez des séquences pédagogiques structurées en quelques clics. Indiquez simplement votre niveau, votre discipline et le thème abordé, l'IA génère une proposition complète (objectifs, déroulement, évaluations).</p>
      
      <h3>🎯 Différenciation Pédagogique (Prochainement)</h3>
      <p>Adaptez automatiquement vos contenus pour les élèves à besoins particuliers (DYS, allophones, etc.) grâce à notre moteur de reformulation et d'adaptation de consignes.</p>

      <h3>📊 Analyse des Compétences</h3>
      <p>Évaluez rapidement les productions d'élèves en fonction des textes officiels. L'outil vous suggère des grilles critériées et facilite la construction de vos rubriques d'évaluation.</p>
    
        </div>
      </div>
    </motion.div>
  );
}