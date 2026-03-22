import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLégalesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-red font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div className="bg-white border border-edu-light/30 p-8 md:p-12 rounded-[4px] shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-edu-black mb-8 border-b border-edu-light/30 pb-6">Mentions Légales</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-edu-black prose-p:text-edu-dark prose-a:text-edu-red prose-strong:text-edu-black hover:prose-a:text-edu-black prose-a:transition-colors">
          
      <p className="lead text-xl italic mb-8">Informations légales et obligatoires relatives à l'éditeur du site EduPlan.</p>
      
      <h3>Éditeur de la plateforme</h3>
      <p>
        <strong>Raison sociale :</strong> EduPlan Corporation (Fictive)<br/>
        <strong>Statut :</strong> SAS au capital de 10 000€<br/>
        <strong>Contact :</strong> contact@eduplan.exemple.com<br/>
        <strong>Directeur de publication :</strong> Le Directeur des Opérations Spéciales
      </p>
      
      <h3>Hébergement</h3>
      <p>
        <strong>Fournisseur principal :</strong> Vercel Inc.<br/>
        <strong>Bases de données :</strong> Supabase, Inc.<br/>
      </p>
      
      <p className="text-sm mt-8 opacity-70">En cas de plainte ou de requête légale, merci de vous adresser initialement par courrier électronique au service contact ci-dessus pour une médiation prioritaire.</p>
    
        </div>
      </div>
    </motion.div>
  );
}