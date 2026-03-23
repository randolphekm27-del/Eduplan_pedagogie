import React, { useState } from 'react';
import { Upload, ArrowLeft, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { storageService } from '../services/storageService';
import { deepseekAIService } from '../services/deepseekAIService';
import { useAuth } from '../context/AuthContext';

export default function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<any | null>(null);
  const [pastedText, setPastedText] = useState('');
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Restriction Plan Gratuit
    if (profile?.tier === 'free') {
      toast.error("Fonctionnalité Premium", {
        description: "L'import de documents est réservé aux abonnés Pro. Gagnez du temps en passant au niveau supérieur !",
        action: {
          label: "Voir les offres",
          onClick: () => navigate('/pricing')
        }
      });
      return;
    }

    setIsAnalyzing(true);
    setDetectedInfo(null);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const analysis = await deepseekAIService.analyzeDocument(base64, file.type);
          setDetectedInfo(analysis);
          toast.success('Document analysé par Deepseek avec succès !');
        } catch (err) {
          toast.error("Échec de l'analyse du document.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lecture fichier:", error);
      toast.error("Échec de la lecture du fichier.");
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!pastedText.trim()) return;

    // Restriction Plan Gratuit
    if (profile?.tier === 'free') {
      toast.error("Fonctionnalité Premium", {
        description: "L'analyse de texte par IA est réservée aux abonnés Pro.",
        action: {
          label: "Voir les offres",
          onClick: () => navigate('/pricing')
        }
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await deepseekAIService.generateCompletePedagogicalContent(`Analyse ce texte et crée une fiche : ${pastedText}`);
      const analysis = result.fichesPedagogique;
      setDetectedInfo(analysis);
      toast.success('Texte analysé par Deepseek avec succès !');
    } catch (error) {
      toast.error("Échec de l'analyse du texte.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!detectedInfo) return;
    
    try {
      const ficheContent: any = {
        id: '', // Sera généré par la DB
        titre: detectedInfo.titre || detectedInfo.title || "Fiche importée",
        numeroFiche: "",
        enTete: {
          matiere: detectedInfo.matiere || detectedInfo.subject || "Non spécifié",
          classe: detectedInfo.classe || detectedInfo.class || "Non spécifié",
          theme: detectedInfo.titre || detectedInfo.title || detectedInfo.theme || "Import",
          temps: detectedInfo.dureeTotale || "1H",
          objectifGeneral: detectedInfo.objectifGeneral || detectedInfo.theme || "",
          date: new Date().toLocaleDateString('fr-FR')
        },
        miseEnSituation: {
          rappel: "",
          prerequis: Array.isArray(detectedInfo.preRequis) ? detectedInfo.preRequis.join(', ') : (detectedInfo.preRequis || ""),
          motivation: ""
        },
        sequences: (detectedInfo.sequences || []).map((seq: any, idx: number) => ({
          id: `seq-${Date.now()}-${idx}`,
          numero: seq.numero || String.fromCharCode(65 + idx),
          objectif: seq.objectif || "",
          taches: seq.taches || "",
          organisations: Array.isArray(seq.organisations) ? seq.organisations.join(', ') : (seq.organisations || ""),
          savoirs: seq.savoirs || "",
          materiel: seq.materiel || "",
          duree: seq.duree || "10 min"
        })),
        syntheseLecon: "",
        evaluationFormative: "",
        documentEleve: {
          activite: "Document élève",
          objectifGeneral: "",
          consigne: "",
          texte: "",
          support: "",
          taches: Array.isArray(detectedInfo.materiel) ? detectedInfo.materiel.join('\n') : (detectedInfo.materiel || ""),
          strategie: { travailGroupe: "Oui", pleniere: "Oui" }
        },
        ficheSynthese: {
          point1: "",
          point2: "",
          point3: ""
        }
      };

      const savedId = await storageService.saveFiche(ficheContent);
      toast.success('Fiche générée à partir du document !');
      navigate(`/dashboard/editor/${savedId}`);
    } catch (error) {
       console.error(error);
       toast.error('Erreur lors de la création de la fiche');
    }
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
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-edu-black mb-3">
            Transformez vos documents existants en fiches structurées
          </h2>
          <p className="text-edu-dark">
            L'IA analyse votre contenu et le reformate selon le modèle pédagogique adapté.
          </p>
        </div>

        {/* Upload Zone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-[4px] p-12 text-center transition-all duration-300 mb-8 ${
            isDragging 
              ? 'border-edu-red bg-edu-red/5' 
              : 'border-edu-light bg-[#F5F2ED] hover:border-edu-dark/50 hover:bg-[#F5F2ED]/80'
          }`}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-edu-red/10 text-edu-red' : 'bg-white border border-edu-light text-edu-dark'}`}>
              <Upload size={32} />
            </div>
            <h3 className="font-serif text-xl text-edu-black mb-4">Glissez-déposez votre fichier ici</h3>
            <label 
              htmlFor="file-upload" 
              className="px-6 py-2.5 bg-edu-red text-white rounded-[2px] font-medium hover:bg-[#5a0808] transition-colors cursor-pointer pointer-events-auto shadow-sm mb-4"
            >
              Parcourir les fichiers
            </label>
            <p className="text-xs text-edu-dark font-mono">Formats supportés : PDF, DOCX, TXT (max 10 Mo)</p>
          </div>

          {/* Analyzing Overlay */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#F5F2ED]/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[4px]"
              >
                <Loader2 size={40} className="text-edu-red animate-spin mb-4" />
                <p className="font-serif text-lg text-edu-black">Analyse du document en cours...</p>
                <div className="w-48 h-1 bg-edu-light/30 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="h-full bg-edu-red"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Alternative Text Area */}
        <div className="mb-8">
          <p className="text-sm font-medium text-edu-black mb-2">Ou collez votre texte directement :</p>
          <div className="relative">
            <textarea 
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Collez ici le contenu de votre cours, vos notes, un chapitre..."
              className="w-full p-4 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red transition-colors font-sans text-sm resize-none min-h-[150px]"
            />
            {pastedText.trim() && (
              <button 
                onClick={handleTextAnalysis}
                className="absolute bottom-4 right-4 px-4 py-2 bg-edu-black text-white text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-edu-red transition-colors"
              >
                Analyser le texte
              </button>
            )}
          </div>
        </div>

        {/* Detected Info */}
        <AnimatePresence>
          {detectedInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-10 overflow-hidden"
            >
              <div className="bg-white border border-edu-light/50 p-6 rounded-[2px] shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-edu-black font-medium">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Informations détectées par l'IA :
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Titre détecté</label>
                    <input type="text" readOnly value={detectedInfo.titre || detectedInfo.title || "Document"} className="w-full px-3 py-2 bg-[#F5F2ED] border border-edu-light/30 rounded-[2px] outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Matière</label>
                    <input type="text" readOnly value={detectedInfo.matiere || detectedInfo.subject || "Détection..."} className="w-full px-3 py-2 bg-[#F5F2ED] border border-edu-light/30 rounded-[2px] outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono ml-1">Classe</label>
                    <input type="text" readOnly value={detectedInfo.classe || detectedInfo.class || "Détection..."} className="w-full px-3 py-2 bg-[#F5F2ED] border border-edu-light/30 rounded-[2px] outline-none text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-auto">
          <Link 
            to="/dashboard/create" 
            className="w-full sm:w-auto px-6 py-3 border border-edu-dark text-edu-black rounded-[2px] hover:bg-edu-dark/5 transition-colors font-medium text-center"
          >
            Annuler
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={!detectedInfo}
            className="w-full sm:w-auto px-8 py-3 bg-edu-red text-white rounded-[2px] hover:bg-[#5a0808] transition-all shadow-[0_4px_14px_rgba(126,11,11,0.3)] font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transformer le document →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
