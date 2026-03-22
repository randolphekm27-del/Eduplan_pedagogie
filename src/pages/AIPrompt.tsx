import React, { useState } from 'react';
import { Mic, Paperclip, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { storageService } from '../services/storageService';
import { deepseekAIService } from '../services/deepseekAIService';
import { useAuth } from '../context/AuthContext';

export default function AIPrompt() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [duration, setDuration] = useState('');
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Restriction Plan Gratuit
    if (profile?.tier === 'free') {
      if (profile.lessons_count >= 3) {
        toast.error("Limite atteinte", {
          description: "Vous avez atteint la limite de 3 fiches pour le plan Gratuit. Passez au plan Pro pour continuer !",
          action: {
            label: "Voir les tarifs",
            onClick: () => navigate('/pricing')
          }
        });
        return;
      }
      
      // Note: In the user request, AI is strictly for PRO.
      // So even if they have < 3 fiches, AI is restricted.
      toast.error("Fonctionnalité Premium", {
        description: "La génération par IA est réservée aux abonnés Pro. Passez au niveau supérieur pour en profiter !",
        action: {
          label: "Devenir Pro",
          onClick: () => navigate('/pricing')
        }
      });
      return;
    }

    setIsGenerating(true);

    try {
      const loadingToast = toast.loading('Génération par l\'IA Deepseek...', {
        description: 'Veuillez patienter pendant que Deepseek crée vos documents pédagogiques...'
      });

      // Générer TOUS les contenus avec Deepseek en une seule requête
      const result = await deepseekAIService.generateCompletePedagogicalContent(
        prompt.trim(),
        subject,
        grade,
        duration
      );

      toast.dismiss(loadingToast);
      toast.success('Génération réussie !', {
        description: 'Votre fiche pédagogique a été créée par Deepseek.'
      });

      // Construire la fiche complète selon le modèle FicheData
      const ficheContent: any = {
        id: '', // Sera généré par la DB
        titre: result.fichesPedagogique.titre,
        numeroFiche: "",
        enTete: {
          matiere: result.fichesPedagogique.matiere || subject || "Non spécifié",
          classe: result.fichesPedagogique.classe || grade || "Non spécifié",
          theme: result.fichesPedagogique.titre,
          temps: result.fichesPedagogique.dureeTotale || duration || "1H",
          objectifGeneral: result.fichesPedagogique.objectifGeneral || "",
          date: new Date().toLocaleDateString('fr-FR')
        },
        miseEnSituation: {
          rappel: result.documentEleve.miseEnSituation.contexte || "",
          prerequis: Array.isArray(result.fichesPedagogique.preRequis) ? result.fichesPedagogique.preRequis.join(', ') : (result.fichesPedagogique.preRequis || ""),
          motivation: result.documentEleve.miseEnSituation.texte || ""
        },
        sequences: (result.fichesPedagogique.sequences || []).map((seq: any, idx: number) => ({
          id: `seq-${Date.now()}-${idx}`,
          numero: seq.numero || String.fromCharCode(65 + idx),
          objectif: seq.objectif || "",
          taches: seq.taches || "",
          organisations: Array.isArray(seq.organisations) ? seq.organisations.join(', ') : (seq.organisations || ""),
          savoirs: seq.savoirs || "",
          materiel: seq.materiel || "",
          duree: seq.duree || "10 min"
        })),
        syntheseLecon: result.ficheSynthese.resume || result.ficheSynthese.ideesImportantes || "",
        evaluationFormative: result.evaluationFormative.questions?.map((q: any) => `Q: ${q.question}\nR: ${q.reponse}`).join('\n\n') || "",
        documentEleve: {
          activite: result.documentEleve.title || "Activité",
          objectifGeneral: result.documentEleve.tache.objectif || "",
          consigne: Array.isArray(result.documentEleve.consignes) ? result.documentEleve.consignes.join(', ') : (result.documentEleve.consignes || ""),
          texte: result.documentEleve.miseEnSituation.texte || "",
          support: result.documentEleve.supportPedagogique.contenu || "",
          taches: Array.isArray(result.documentEleve.tache.enonce) ? result.documentEleve.tache.enonce.join('\n') : (result.documentEleve.tache.enonce || ""),
          strategie: {
            travailGroupe: "Oui",
            pleniere: "Oui"
          }
        },
        ficheSynthese: {
          point1: result.ficheSynthese.notionsPrincipales?.[0] || "",
          point2: result.ficheSynthese.notionsPrincipales?.[1] || "",
          point3: result.ficheSynthese.notionsPrincipales?.[2] || ""
        }
      };

      const savedId = await storageService.saveFiche(ficheContent);
      await refreshProfile(); // Refresh usage stats
      navigate(`/dashboard/editor/${savedId}`);
    } catch (error) {
      console.error("Erreur génération IA:", error);
      toast.error("Erreur lors de la génération", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la génération."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Bientôt disponible', {
      description: 'Cette fonctionnalité est en cours de développement.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 flex flex-col min-h-[80vh]">
      <div className="w-full mb-8">
        <Link to="/dashboard/create" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-black transition-colors">
          <ArrowLeft size={16} /> Retour aux options
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <h2 className="font-serif text-3xl md:text-4xl text-edu-black mb-8 text-center">
          Décrivez votre cours en langage naturel
        </h2>

        {/* Main Text Area */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-edu-red/0 via-edu-red/20 to-edu-red/0 rounded-[4px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative bg-[#F5F2ED] border border-edu-light/50 rounded-[4px] overflow-hidden flex flex-col shadow-inner">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Exemple : Créer une séquence sur la Révolution Française pour une classe de 4ème. La séance dure 2h. Je veux une analyse de texte, un travail de groupe sur les causes, et une évaluation formative à la fin."
              className="w-full p-6 bg-transparent outline-none font-sans text-edu-black leading-relaxed resize-none min-h-[200px] placeholder-edu-dark/50"
            />
            <div className="flex justify-end gap-3 p-4 border-t border-edu-light/20 bg-white/30">
              <button onClick={handleComingSoon} className="p-2 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-full transition-colors" title="Joindre un fichier">
                <Paperclip size={20} />
              </button>
              <button onClick={handleComingSoon} className="p-2 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-full transition-colors" title="Dictée vocale">
                <Mic size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Matière (Optionnel)</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red transition-colors appearance-none text-sm"
            >
              <option value="">Sélectionner...</option>
              <option value="Français">Français</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Hist-Géo">Histoire-Géo</option>
              <option value="Physique-Chimie">Physique-Chimie</option>
              <option value="SVT">SVT</option>
              <option value="Langues">Langues</option>
              <option value="Techno">Technologie / Pro</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Classe (Optionnel)</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red transition-colors appearance-none text-sm"
            >
              <option value="">Sélectionner...</option>
              <option value="6ème">6ème</option>
              <option value="5ème">5ème</option>
              <option value="4ème">4ème</option>
              <option value="3ème">3ème</option>
              <option value="2nde">2nde</option>
              <option value="1ère">1ère</option>
              <option value="Terminale">Terminale</option>
              <option value="BTS">BTS / Supérieur</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Durée (Optionnel)</label>
            <input
              type="text"
              placeholder="Ex: 2H"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red transition-colors text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mb-12">
          <Link
            to="/dashboard/create"
            className="w-full sm:w-auto px-6 py-3 border border-edu-dark text-edu-black rounded-[2px] hover:bg-edu-dark/5 transition-colors font-medium text-center"
          >
            Annuler
          </Link>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto px-8 py-3 bg-edu-red text-white rounded-[2px] hover:bg-[#5a0808] transition-all shadow-[0_4px_14px_rgba(126,11,11,0.3)] font-medium flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                L'IA analyse votre demande...
              </>
            ) : (
              'Générer la fiche →'
            )}
          </button>
        </div>

        {/* Quick Examples */}
        <div className="mt-auto">
          <p className="text-xs font-serif italic text-edu-dark mb-3">Exemples rapides :</p>
          <div className="flex flex-wrap gap-2">
            {["La Révolution Française", "Théorème de Pythagore", "Analyse de Madame Bovary", "Loi d'Ohm"].map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(`Créer une fiche sur : ${ex}`)}
                className="text-xs bg-white border border-edu-light/50 text-edu-dark px-3 py-1.5 rounded-full hover:border-edu-red hover:text-edu-red transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
