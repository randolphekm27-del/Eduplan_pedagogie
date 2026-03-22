import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PolitiquedeConfidentialitéPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Politique de Confidentialité</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Nous prenons la protection de vos données très au sérieux. Voici comment nous les traitons de manière transparente.</p>

      <h3>1. Données Collectées</h3>
      <p>Nous collectons uniquement les données strictement nécessaires à l'utilisation de la plateforme : Nom, Prénom, Email, Établissement (facultatif), ainsi que les contenus des fiches que vous générez.</p>

      <h3>2. Hébergement de Sécurité</h3>
      <p>Vos données sont protégées par chiffrement et sont hébergées sur des serveurs sécurisés via Supabase (PostgreSQL), certifiés ISO-27001, localisés dans l'Union Européenne en conformité totale avec le RGPD.</p>

      <h3>3. Droit à l'oubli</h3>
      <p>Vous avez un droit d'accès complet et de suppression absolue de vos données, exerçable de manière autonome directement dans vos paramètres de compte.</p>
    
        </div>
      </div>
    </motion.div>
  );
}