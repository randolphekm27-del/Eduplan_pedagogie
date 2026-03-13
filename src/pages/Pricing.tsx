import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Puis-je changer de forfait à tout moment ?",
      a: "Oui, vous pouvez passer à la formule Pro ou annuler votre abonnement à tout moment depuis les paramètres de votre compte. Tout mois entamé reste dû."
    },
    {
      q: "Comment fonctionne la facturation pour les établissements ?",
      a: "Pour les établissements, nous proposons une facturation annuelle avec un tarif dégressif selon le nombre d'enseignants. Contactez-nous pour un devis personnalisé."
    },
    {
      q: "Mes fiches sont-elles privées ?",
      a: "Absolument. Vos fiches pédagogiques restent strictement confidentielles. Vous pouvez choisir de les partager avec vos collègues si vous le souhaitez."
    }
  ];

  return (
    <div className="min-h-screen bg-edu-bg font-sans selection:bg-edu-red/20 selection:text-edu-black">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-wide text-edu-black">EduPlan</Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-edu-dark hover:text-edu-black transition-colors">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl text-edu-black mb-6 leading-tight"
          >
            Choisissez la formule adaptée à vos besoins
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-edu-dark"
          >
            Gratuit pour découvrir, abordable pour un usage professionnel
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-start">
          {/* Gratuit */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FDFCFB] border border-edu-light/60 rounded-[2px] p-8 relative flex flex-col h-full"
          >
            <div className="inline-block px-3 py-1 bg-edu-light/30 text-edu-dark text-xs font-bold tracking-widest uppercase mb-6 rounded-sm w-fit">
              Découverte
            </div>
            <div className="mb-6">
              <span className="text-4xl font-serif font-bold text-edu-black">0 XOF</span>
              <span className="text-edu-dark">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>5 fiches techniques par mois</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Export PDF basique</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Bibliothèque personnelle</span></li>
              <li className="flex items-start gap-3 text-edu-dark/50"><X size={20} className="shrink-0" /> <span>Génération d'exercices IA</span></li>
              <li className="flex items-start gap-3 text-edu-dark/50"><X size={20} className="shrink-0" /> <span>Formules mathématiques avancées</span></li>
              <li className="flex items-start gap-3 text-edu-dark/50"><X size={20} className="shrink-0" /> <span>Export Word/LaTeX</span></li>
            </ul>
            <Link to="/signup" className="block w-full py-3 px-4 border border-edu-light text-edu-black text-center font-medium rounded-[2px] hover:bg-edu-light/20 transition-colors">
              Commencer
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#9F9A95] rounded-[2px] p-8 relative flex flex-col h-full shadow-xl transform md:-translate-y-4"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-edu-red text-white px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-sm shadow-md whitespace-nowrap">
              Populaire
            </div>
            <div className="mb-6 mt-2">
              <span className="text-4xl font-serif font-bold text-white">3000 XOF</span>
              <span className="text-white/80">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Fiches illimitées</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Export PDF professionnel</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Export Word et LaTeX</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Génération d'exercices IA</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Formules mathématiques avancées</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Bibliothèque de schémas techniques</span></li>
              <li className="flex items-start gap-3 text-white"><Check size={20} className="text-edu-red shrink-0" /> <span>Collaboration (5 collègues)</span></li>
            </ul>
            <Link to="/signup" className="block w-full py-3 px-4 bg-edu-red text-white text-center font-medium rounded-[2px] hover:bg-[#5a0808] transition-colors shadow-md">
              Choisir Pro
            </Link>
          </motion.div>

          {/* Établissement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FDFCFB] border border-edu-light/60 rounded-[2px] p-8 relative flex flex-col h-full"
          >
            <div className="inline-block px-3 py-1 bg-edu-light/30 text-edu-dark text-xs font-bold tracking-widest uppercase mb-6 rounded-sm w-fit">
              Sur mesure
            </div>
            <div className="mb-6">
              <span className="text-4xl font-serif font-bold text-edu-black">Sur devis</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Comptes illimités</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Administration centralisée</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Bibliothèque commune</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Formation des enseignants</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Support prioritaire</span></li>
              <li className="flex items-start gap-3 text-edu-black"><Check size={20} className="text-edu-red shrink-0" /> <span>Intégration LMS</span></li>
            </ul>
            <a href="mailto:contact@eduplan.com" className="block w-full py-3 px-4 border border-edu-light text-edu-black text-center font-medium rounded-[2px] hover:bg-edu-light/20 transition-colors">
              Nous contacter
            </a>
          </motion.div>
        </div>

        {/* Guarantee */}
        <div className="max-w-2xl mx-auto bg-edu-light/20 border border-edu-light/50 rounded-[2px] p-6 text-center mb-24">
          <p className="font-serif text-lg text-edu-black flex items-center justify-center gap-3">
            <span className="text-2xl">🛡️</span> Garantie satisfait ou remboursé sous 30 jours
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-edu-black mb-10 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-edu-light/50 rounded-[2px] bg-white overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-edu-light/10 transition-colors"
                >
                  <span className="font-medium text-edu-black">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} className="text-edu-dark shrink-0" /> : <ChevronDown size={20} className="text-edu-dark shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-edu-dark"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
