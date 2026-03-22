import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GuidesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Guides d'utilisation</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Apprenez à maîtriser toutes les subtilités d'EduPlan pour en tirer le meilleur parti.</p>

      <h3>1. Vos premiers pas</h3>
      <p>Commencez par <Link to="/signup">créer un compte sécurisé</Link>. Une fois connecté, vous serez invité à renseigner votre matière de prédilection, afin que l'IA adapte son lexique à votre discipline.</p>

      <h3>2. Le Générateur de Séquences</h3>
      <p>Cliquez sur <strong>"Créer une Fiche"</strong> depuis le Menu de navigation de gauche. Laissez-vous guider par notre assistant conversationnel. Astuce : soyez précis sur vos objectifs terminaux pour un résultat optimal.</p>

      <h3>3. Organiser son espace de travail</h3>
      <p>Utilisez les dossiers de la page <strong>"Ma Bibliothèque"</strong> pour trier vos créations par classe ou par période de l'année scolaire.</p>
    
        </div>
      </div>
    </motion.div>
  );
}