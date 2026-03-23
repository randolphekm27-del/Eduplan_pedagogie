import { Bot, Upload, Edit3, ArrowLeft, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CreationOptions() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 flex flex-col items-center min-h-[80vh] justify-center">
      <div className="w-full mb-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-black transition-colors">
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl md:text-4xl text-edu-black mb-12 text-center"
      >
        Comment souhaitez-vous créer votre fiche technique ?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/dashboard/create/ai')}
          className="bg-[#F5F2ED] border border-edu-light p-8 rounded-xs transition-all duration-300 hover:border-edu-red hover:shadow-[0_10px_30px_rgba(126,11,11,0.1)] hover:scale-[1.02] cursor-pointer group flex flex-col h-full"
        >
          <div className="mb-6">
            <Bot size={64} className="text-edu-red" strokeWidth={1.2} />
          </div>
          <h3 className="font-serif text-xl font-bold mb-3 text-edu-black uppercase tracking-wide">Laisser l'IA s'occuper</h3>
          <p className="text-edu-dark text-sm leading-relaxed mb-6 flex-1">
            Décrivez votre cours en langage naturel, l'IA génère une fiche complète et structurée.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-edu-black font-medium">
            <li className="flex items-center gap-2">✓ Rapide (10 secondes)</li>
            <li className="flex items-center gap-2">✓ Idéal pour débuter</li>
          </ul>
          <button className="w-full py-2.5 border border-edu-dark text-edu-black rounded-xs group-hover:bg-edu-red group-hover:text-white group-hover:border-edu-red transition-colors font-medium">
            Choisir
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/dashboard/create/upload')}
          className="bg-[#F5F2ED] border border-edu-light p-8 rounded-xs transition-all duration-300 hover:border-edu-red hover:shadow-[0_10px_30px_rgba(126,11,11,0.1)] hover:scale-[1.02] cursor-pointer group flex flex-col h-full"
        >
          <div className="mb-6">
            <Upload size={64} className="text-edu-red" strokeWidth={1.2} />
          </div>
          <h3 className="font-serif text-xl font-bold mb-3 text-edu-black uppercase tracking-wide">Uploader un document</h3>
          <p className="text-edu-dark text-sm leading-relaxed mb-6 flex-1">
            Importez un PDF, DOCX ou TXT existant, l'IA le transforme en fiche structurée.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-edu-black font-medium">
            <li className="flex items-center gap-2">✓ Valorise vos documents</li>
            <li className="flex items-center gap-2">✓ Gain de temps</li>
          </ul>
          <button className="w-full py-2.5 border border-edu-dark text-edu-black rounded-xs group-hover:bg-edu-red group-hover:text-white group-hover:border-edu-red transition-colors font-medium">
            Choisir
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/dashboard/create/manual')}
          className="bg-[#F5F2ED] border border-edu-light p-8 rounded-xs transition-all duration-300 hover:border-edu-red hover:shadow-[0_10px_30px_rgba(126,11,11,0.1)] hover:scale-[1.02] cursor-pointer group flex flex-col h-full"
        >
          <div className="mb-6">
            <Edit3 size={64} className="text-edu-red" strokeWidth={1.2} />
          </div>
          <h3 className="font-serif text-xl font-bold mb-3 text-edu-black uppercase tracking-wide">Faire moi-même</h3>
          <p className="text-edu-dark text-sm leading-relaxed mb-6 flex-1">
            Remplissez le formulaire détaillé pas à pas pour créer votre fiche de A à Z.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-edu-black font-medium">
            <li className="flex items-center gap-2">✓ Contrôle total</li>
            <li className="flex items-center gap-2">✓ Personnalisation avancée</li>
          </ul>
          <button className="w-full py-2.5 border border-edu-dark text-edu-black rounded-xs group-hover:bg-edu-red group-hover:text-white group-hover:border-edu-red transition-colors font-medium">
            Choisir
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/dashboard/editor/blank')}
          className="bg-[#F5F2ED] border border-edu-light p-8 rounded-xs transition-all duration-300 hover:border-edu-red hover:shadow-[0_10px_30px_rgba(126,11,11,0.1)] hover:scale-[1.02] cursor-pointer group flex flex-col h-full"
        >
          <div className="mb-6">
            <div className="w-16 h-16 border-2 border-edu-red border-dashed rounded-sm flex items-center justify-center">
              <Plus size={32} className="text-edu-red" />
            </div>
          </div>
          <h3 className="font-serif text-xl font-bold mb-3 text-edu-black uppercase tracking-wide">Partir de zéro</h3>
          <p className="text-edu-dark text-sm leading-relaxed mb-6 flex-1">
            Une page blanche pour construire votre propre modèle de fiche, bloc par bloc.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-edu-black font-medium">
            <li className="flex items-center gap-2">✓ Page blanche</li>
            <li className="flex items-center gap-2">✓ Flexibilité absolue</li>
          </ul>
          <button className="w-full py-2.5 border border-edu-dark text-edu-black rounded-xs group-hover:bg-edu-red group-hover:text-white group-hover:border-edu-red transition-colors font-medium">
            Créer
          </button>
        </motion.div>
      </div>

      <div className="mt-12">
        <Link to="/dashboard" className="text-sm text-edu-dark hover:text-edu-red underline underline-offset-4 transition-colors">
          Voir mes brouillons
        </Link>
      </div>
    </div>
  );
}
