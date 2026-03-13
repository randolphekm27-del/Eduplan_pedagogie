// SheetEditor.tsx (corrigé)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bold, Italic, Underline, List, ListOrdered, Table as TableIcon, Image as ImageIcon, Sigma, Eye,
  Sparkles, Search, Maximize2, Target, FileText, HelpCircle, Wrench, BarChart,
  ChevronDown, Check, Download, Share2, Save, Plus, GripVertical, Trash2, Columns, Rows
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import SectionEditor from './SectionEditor';
import { storageService, Fiche } from '../services/storageService';

// Types pour les données de fiche
interface Sequence {
  id: string;
  numero: string;
  objectif: string;
  taches: string;
  organisations: string[];
  savoirs: string;
  duree: string;
}

interface Section {
  id: string;
  label: string;
  type: 'main' | 'sub';
  parentId?: string;
  content?: any;
}

interface FicheData {
  id: string;
  titre: string;
  enTete: {
    matiere: string;
    classe: string;
    theme: string;
    temps: string;
    objectif: string;
    date: string;
  };
  miseEnSituation: {
    rappel: string;
    prerequis: string[];
    motivation: string;
  };
  sequences: Sequence[];
  documentEleve: {
    title: string;
    contenu?: string;
    schema?: string | null;
    formules?: string[];
    taches?: string[];
    miseEnSituation?: {
      texte: string;
      contexte: string;
    };
    tache?: {
      enonce: string;
      objectif: string;
    };
    supportPedagogique?: {
      titre: string;
      contenu: string;
    };
    consignes?: string[];
  };
  synthese: {
    title: string;
    content?: string;
    notionsPrincipales?: string[];
    pointsCles?: string[];
    ideesImportantes?: string;
    resume?: string;
  };
  evaluation: {
    title: string;
    content?: string;
    objectifEvaluation?: string;
    questions?: Array<{
      numero: number;
      question: string;
      typeQuestion: string;
    }>;
    critereEvaluation?: string[];
    corrige?: {
      reponsesAttendues: string[];
    };
  };
  ficheSynthese: {
    title: string;
    content: string;
  };
}

export default function SheetEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('en-tete');
  const [activeAITab, setActiveAITab] = useState('ameliorer');
  const [isSaved, setIsSaved] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Données de la fiche
  const [ficheData, setFicheData] = useState<FicheData | null>(null);

  // Structure des sections
  const [sections, setSections] = useState<Section[]>([]);

  // Charger la fiche depuis le storage
  useEffect(() => {
    const loadFiche = async () => {
      setIsLoading(true);
      try {
        const allFiches = storageService.getFiches();
        const existingFiche = allFiches.find(f => f.id === id);

        if (existingFiche && existingFiche.content) {
          setFicheData(existingFiche.content);

          // Construire les sections à partir des données chargées
          const newSections: Section[] = [
            { id: 'en-tete', label: 'En-tête', type: 'main' },
            { id: 'situation', label: 'Mise en situation', type: 'main' },
            { id: 'sequences', label: 'Séquences', type: 'main' },
            ...(existingFiche.content.sequences || []).map((seq: Sequence) => ({
              id: seq.id,
              label: `${seq.numero}. ${seq.objectif.substring(0, 30)}...`,
              type: 'sub' as const,
              parentId: 'sequences'
            })),
            { id: 'synthese', label: 'Synthèse', type: 'main' },
            { id: 'evaluation', label: 'Évaluation', type: 'main' },
            { id: 'document', label: 'Document élève', type: 'main' },
            { id: 'fiche', label: 'Fiche de synthèse', type: 'main' }
          ];
          setSections(newSections);
        } else {
          // Données par défaut si pas de contenu stocké
          const defaultData: FicheData = {
            id: id || Date.now().toString(),
            titre: existingFiche?.title || "Nouvelle fiche pédagogique",
            enTete: {
              matiere: existingFiche?.subject || '',
              classe: existingFiche?.class || '',
              theme: existingFiche?.title || '',
              temps: '1H',
              objectif: '',
              date: new Date().toLocaleDateString('fr-FR')
            },
            miseEnSituation: {
              rappel: "",
              prerequis: [],
              motivation: ""
            },
            sequences: [],
            documentEleve: {
              title: "Document élève",
              contenu: "",
              schema: null,
              formules: [],
              taches: []
            },
            synthese: {
              title: "Synthèse",
              content: ""
            },
            evaluation: {
              title: "Évaluation",
              content: ""
            },
            ficheSynthese: {
              title: "Corrigé",
              content: ""
            }
          };
          setFicheData(defaultData);

          const initialSections: Section[] = [
            { id: 'en-tete', label: 'En-tête', type: 'main' },
            { id: 'situation', label: 'Mise en situation', type: 'main' },
            { id: 'sequences', label: 'Séquences', type: 'main' },
            { id: 'synthese', label: 'Synthèse', type: 'main' },
            { id: 'evaluation', label: 'Évaluation', type: 'main' },
            { id: 'document', label: 'Document élève', type: 'main' },
            { id: 'fiche', label: 'Fiche de synthèse', type: 'main' }
          ];
          setSections(initialSections);
        }
      } catch (error) {
        toast.error('Erreur de chargement', {
          description: 'Impossible de charger la fiche.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFiche();
  }, [id]);

  // Défilement vers une section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleComingSoon = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast.info('Bientôt disponible', {
      description: 'Cette fonctionnalité est en cours de développement.'
    });
  };

  const handleSave = async () => {
    if (!ficheData) return;
    try {
      const allFiches = storageService.getFiches();
      const existingFiche = allFiches.find(f => f.id === ficheData.id);

      const updatedFiche: Fiche = {
        id: ficheData.id,
        title: ficheData.titre,
        subject: ficheData.enTete?.matiere || '',
        class: ficheData.enTete?.classe || '',
        date: existingFiche?.date || new Date().toLocaleDateString('fr-FR'),
        tags: existingFiche?.tags || ["Cours"],
        progress: existingFiche?.progress || 50,
        theme: ficheData.enTete?.theme || '',
        folderId: existingFiche?.folderId,
        content: ficheData
      };

      storageService.saveFiche(updatedFiche);
      setIsSaved(true);

      // Si c'était une nouvelle fiche sans ID dans l'URL, on met à jour l'URL
      if (!id) {
        navigate(`/dashboard/editor/${ficheData.id}`, { replace: true });
      }

      toast.success('Sauvegardé', {
        description: 'Vos modifications ont été enregistrées avec succès.'
      });
    } catch (error) {
      toast.error('Erreur de sauvegarde', {
        description: 'Impossible de sauvegarder les modifications.'
      });
    }
  };

  const updateFicheData = (path: string[], value: any) => {
    if (!ficheData) return;

    // Mise à jour profonde de l'objet
    const newData = { ...ficheData };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    setFicheData(newData);
    setIsSaved(false);
  };

  // Ajouter une nouvelle section
  const addNewSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection: Section = {
      id: newId,
      label: 'Nouvelle section',
      type: 'main'
    };
    setSections([...sections, newSection]);
    setIsSaved(false);
    setActiveSection(newId);
    toast.success('Section ajoutée', {
      description: 'Vous pouvez maintenant personnaliser cette section.'
    });
  };

  // Supprimer une section
  const deleteSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Vérifier si ce sont des sections protégées
    const protectedSections = ['en-tete', 'situation', 'sequences', 'synthese', 'evaluation', 'document', 'fiche'];
    if (protectedSections.includes(sectionId)) {
      toast.error('Section protégée', {
        description: 'Cette section ne peut pas être supprimée.'
      });
      return;
    }

    // Demander confirmation
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      setSections(sections.filter(s => s.id !== sectionId));
      setIsSaved(false);

      // Si la section supprimée était active, activer la première section
      if (activeSection === sectionId) {
        setActiveSection(sections[0]?.id || '');
      }

      toast.success('Section supprimée');
    }
  };

  // Ajouter une séquence
  const addSequence = () => {
    if (!ficheData) return;

    const newSequence: Sequence = {
      id: `seq-${Date.now()}`,
      numero: String.fromCharCode(65 + ficheData.sequences.length), // A, B, C...
      objectif: "Nouvel objectif opérationnel",
      taches: "Activité à définir",
      organisations: ['TI', 'TG'],
      savoirs: "Savoirs associés",
      duree: "10 min"
    };

    updateFicheData(['sequences'], [...ficheData.sequences, newSequence]);

    // Ajouter la sous-section dans le sommaire
    setSections([
      ...sections.slice(0, sections.findIndex(s => s.id === 'sequences') + 1),
      {
        id: newSequence.id,
        label: `${newSequence.numero}. ${newSequence.objectif.substring(0, 30)}...`,
        type: 'sub',
        parentId: 'sequences'
      },
      ...sections.slice(sections.findIndex(s => s.id === 'sequences') + 1)
    ]);
  };

  // Supprimer une séquence
  const deleteSequence = (sequenceId: string) => {
    if (!ficheData) return;

    if (window.confirm('Supprimer cette séquence ?')) {
      updateFicheData(['sequences'], ficheData.sequences.filter(s => s.id !== sequenceId));
      setSections(sections.filter(s => s.id !== sequenceId));
      setIsSaved(false);
    }
  };

  // Ajouter une tâche dans document élève
  const addTask = () => {
    if (!ficheData) return;
    const newTasks = [...(ficheData.documentEleve.taches || []), "Nouvelle tâche"];
    updateFicheData(['documentEleve', 'taches'], newTasks);
  };

  // Supprimer une tâche
  const deleteTask = (index: number) => {
    if (!ficheData) return;
    const newTasks = ficheData.documentEleve.taches.filter((_, i) => i !== index);
    updateFicheData(['documentEleve', 'taches'], newTasks);
  };

  // Modifier le tableau des séquences
  const updateSequence = (index: number, field: keyof Sequence, value: string | string[]) => {
    if (!ficheData) return;
    const newSequences = [...ficheData.sequences];
    newSequences[index] = { ...newSequences[index], [field]: value };
    updateFicheData(['sequences'], newSequences);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-edu-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-edu-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-edu-dark">Chargement de la fiche...</p>
        </div>
      </div>
    );
  }

  if (!ficheData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-edu-bg">
        <div className="text-center">
          <p className="text-edu-dark mb-4">Fiche non trouvée</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-edu-red text-white rounded-[2px] hover:bg-[#5a0808]"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#F5F2ED] z-10 font-sans">
      {/* Header Premium */}
      <header className="flex-none h-16 bg-white border-b border-edu-light/50 flex items-center justify-between px-8 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard/library')}
            className="p-2 hover:bg-edu-light/30 rounded-full transition-colors text-edu-dark"
          >
            <ChevronDown className="rotate-90" size={20} />
          </button>
          <div className="h-8 w-[1px] bg-edu-light/50"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={ficheData.titre}
                onChange={(e) => {
                  updateFicheData(['titre'], e.target.value);
                  setIsSaved(false);
                }}
                className="font-serif text-xl text-edu-black outline-none bg-transparent w-96 focus:border-b border-edu-red/50 px-1 transition-all"
                placeholder="Titre de la fiche..."
              />
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${isSaved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isSaved ? 'Enregistré' : 'Modifié'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-edu-dark uppercase tracking-tighter">
              <span>Bibliothèque</span>
              <span>/</span>
              <span className="text-edu-red font-bold">{ficheData.enTete?.matiere || 'Sans matière'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-edu-light/20 p-1 rounded-[4px] gap-1">
            <button
              onClick={() => navigate(`/dashboard/preview/${id}`)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-edu-dark hover:text-edu-black hover:bg-white rounded-[2px] transition-all"
            >
              <Eye size={14} /> APERÇU
            </button>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-[2px] transition-all ${showAIPanel ? 'bg-edu-red text-white' : 'text-edu-dark hover:text-edu-black hover:bg-white'
                }`}
            >
              <Sparkles size={14} /> ASSISTANT AI
            </button>
          </div>

          <div className="h-8 w-[1px] bg-edu-light/50 mx-2"></div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold bg-edu-black text-white hover:bg-edu-red rounded-[2px] transition-all shadow-lg active:scale-95"
          >
            <Save size={14} /> SAUVEGARDER
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar Navigation - Style "Table of Contents" */}
        <aside className="hidden xl:flex w-64 bg-white border-r border-edu-light/50 flex-col overflow-y-auto custom-scrollbar">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-bold text-edu-dark tracking-[0.2em] uppercase">Navigation</h3>
              <div className="w-8 h-[1px] bg-edu-red"></div>
            </div>

            <nav className="space-y-1">
              {sections.map((section, idx) => (
                <div key={section.id} className="relative">
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-[4px] transition-all group ${activeSection === section.id
                      ? 'text-edu-red bg-edu-red/5'
                      : 'text-edu-dark hover:bg-edu-light/20'
                      }`}
                  >
                    <span className={`text-[10px] font-mono opacity-40 ${activeSection === section.id ? 'opacity-100' : ''}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs uppercase tracking-wider ${activeSection === section.id ? 'font-bold' : 'font-medium'}`}>
                      {section.label}
                    </span>

                    {activeSection === section.id && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-6 bg-edu-red rounded-r-full"
                      />
                    )}
                  </button>
                </div>
              ))}
            </nav>

            <div className="mt-12 pt-8 border-t border-edu-light/50">
              <button
                onClick={addNewSection}
                className="w-full group flex items-center justify-between px-4 py-3 text-[10px] font-bold text-edu-dark hover:text-edu-red border border-dashed border-edu-dark/20 hover:border-edu-red/50 rounded-[4px] transition-all"
              >
                <span>AJOUTER SECTION</span>
                <Plus size={14} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </aside>

        {/* Editor Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F5F2ED] p-12 custom-scrollbar scroll-smooth relative">
          <div className="max-w-[850px] mx-auto">
            {/* Paper Sheet Effect */}
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-edu-light/30 min-h-[1200px] relative overflow-hidden">
              {/* Decorative side line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-edu-red/10"></div>

              <div className="p-16">
                {/* En-tête */}
                <div
                  id="en-tete"
                  className={`relative group mb-12 p-6 transition-all border-2 ${activeSection === 'en-tete' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`}
                  onClick={() => setActiveSection('en-tete')}
                >
                  <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-edu-black text-white text-[10px] font-bold px-2 py-1 rotate-[-90deg] origin-right">EN-TÊTE</div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8 border-b-2 border-edu-black pb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Matière</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.matiere || ''}
                        onChange={(e) => updateFicheData(['enTete', 'matiere'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 font-serif text-lg transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Classe / Niveau</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.classe || ''}
                        onChange={(e) => updateFicheData(['enTete', 'classe'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 font-serif text-lg transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 mb-8 border-b-2 border-edu-black pb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Thème du cours</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.theme || ''}
                        onChange={(e) => updateFicheData(['enTete', 'theme'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 font-serif text-xl font-bold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Durée estimée</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.temps || ''}
                        onChange={(e) => updateFicheData(['enTete', 'temps'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Objectif global</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.objectif || ''}
                        onChange={(e) => updateFicheData(['enTete', 'objectif'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm italic transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Mise en situation */}
                <div
                  id="situation"
                  className={`relative group mb-16 p-6 transition-all border-2 ${activeSection === 'situation' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`}
                  onClick={() => setActiveSection('situation')}
                >
                  <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-edu-black text-white text-[10px] font-bold px-2 py-1 rotate-[-90deg] origin-right">SITUATION</div>
                  </div>

                  <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">01</span>
                    MISE EN SITUATION
                  </h3>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Rappel du cours précédent</label>
                      <textarea
                        value={ficheData.miseEnSituation.rappel}
                        onChange={(e) => updateFicheData(['miseEnSituation', 'rappel'], e.target.value)}
                        className="w-full bg-transparent border border-edu-light/50 focus:border-edu-red outline-none p-3 text-sm min-h-[80px] transition-colors"
                        placeholder="Qu'avons-nous vu la dernière fois ?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Motivation / Problématique</label>
                      <textarea
                        value={ficheData.miseEnSituation.motivation}
                        onChange={(e) => updateFicheData(['miseEnSituation', 'motivation'], e.target.value)}
                        className="w-full bg-transparent border border-edu-light/50 focus:border-edu-red outline-none p-3 text-sm min-h-[80px] transition-colors"
                        placeholder="Pourquoi ce cours est-il important ?"
                      />
                    </div>
                  </div>
                </div>

                {/* Séquences */}
                <div
                  id="sequences"
                  className={`relative group mb-16 p-6 transition-all border-2 ${activeSection === 'sequences' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`}
                  onClick={() => setActiveSection('sequences')}
                >
                  <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-edu-black text-white text-[10px] font-bold px-2 py-1 rotate-[-90deg] origin-right">SÉQUENCES</div>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] flex items-center gap-4">
                      <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">02</span>
                      DÉROULEMENT PÉDAGOGIQUE
                    </h3>
                    <button
                      onClick={addSequence}
                      className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-edu-red border border-edu-red/30 hover:bg-edu-red hover:text-white rounded-[2px] transition-all"
                    >
                      <Plus size={14} /> AJOUTER SÉQUENCE
                    </button>
                  </div>

                  <div className="space-y-8">
                    {ficheData.sequences.map((seq, idx) => (
                      <div key={seq.id} id={seq.id} className="border border-edu-light/50 p-6 rounded-[2px] relative group/seq">
                        <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-edu-black flex items-center justify-center font-bold text-xs shadow-sm">
                          {seq.numero}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Objectif opérationnel</label>
                            <input
                              type="text"
                              value={seq.objectif}
                              onChange={(e) => {
                                const newSeqs = [...ficheData.sequences];
                                newSeqs[idx].objectif = e.target.value;
                                updateFicheData(['sequences'], newSeqs);
                              }}
                              className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm font-bold transition-colors"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Activités / Tâches</label>
                              <textarea
                                value={seq.taches}
                                onChange={(e) => {
                                  const newSeqs = [...ficheData.sequences];
                                  newSeqs[idx].taches = e.target.value;
                                  updateFicheData(['sequences'], newSeqs);
                                }}
                                className="w-full bg-transparent border border-edu-light/50 focus:border-edu-red outline-none p-3 text-xs min-h-[60px] transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Savoirs associés</label>
                              <textarea
                                value={seq.savoirs}
                                onChange={(e) => {
                                  const newSeqs = [...ficheData.sequences];
                                  newSeqs[idx].savoirs = e.target.value;
                                  updateFicheData(['sequences'], newSeqs);
                                }}
                                className="w-full bg-transparent border border-edu-light/50 focus:border-edu-red outline-none p-3 text-xs min-h-[60px] transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const newSeqs = ficheData.sequences.filter(s => s.id !== seq.id);
                            updateFicheData(['sequences'], newSeqs);
                          }}
                          className="absolute top-4 right-4 text-edu-dark hover:text-edu-red opacity-0 group-hover/seq:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synthèse & Évaluation */}
                <div className="grid grid-cols-1 gap-16 mb-16">
                  <div id="synthese" className={`relative group p-6 border-2 transition-all ${activeSection === 'synthese' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`} onClick={() => setActiveSection('synthese')}>
                    <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                      <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">03</span>
                      SYNTHÈSE DU COURS
                    </h3>

                    {/* Afficher les notions principales si disponibles */}
                    {ficheData.synthese.notionsPrincipales && ficheData.synthese.notionsPrincipales.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Notions principales</h4>
                        <div className="flex flex-wrap gap-2">
                          {ficheData.synthese.notionsPrincipales.map((notion, i) => (
                            <span key={i} className="bg-edu-red/10 text-edu-red px-3 py-1.5 text-[11px] font-semibold rounded-full">
                              {notion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Afficher les points clés si disponibles */}
                    {ficheData.synthese.pointsCles && ficheData.synthese.pointsCles.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Points clés à retenir</h4>
                        <ul className="space-y-2">
                          {ficheData.synthese.pointsCles.map((point, i) => (
                            <li key={i} className="flex gap-3 text-sm text-edu-black">
                              <span className="text-edu-red font-bold">✓</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Afficher les idées importantes si disponibles */}
                    {ficheData.synthese.ideesImportantes && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Idées importantes</h4>
                        <p className="text-sm text-edu-black leading-relaxed">{ficheData.synthese.ideesImportantes}</p>
                      </div>
                    )}

                    {/* Contenu éditable additionnelle */}
                    {ficheData.synthese.content && (
                      <div className="border-t border-edu-light/50 pt-6">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Contenu détaillé</h4>
                        <RichTextEditor
                          content={ficheData.synthese.content}
                          onChange={(html) => updateFicheData(['synthese', 'content'], html)}
                        />
                      </div>
                    )}
                  </div>

                  <div id="evaluation" className={`relative group p-6 border-2 transition-all ${activeSection === 'evaluation' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`} onClick={() => setActiveSection('evaluation')}>
                    <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                      <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">04</span>
                      ÉVALUATION FORMATIVE
                    </h3>

                    {/* Afficher l'objectif d'évaluation si disponible */}
                    {ficheData.evaluation.objectifEvaluation && (
                      <div className="mb-8 p-4 bg-edu-light/20 border border-edu-light/50 rounded-[4px]">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-2">Objectif</h4>
                        <p className="text-sm text-edu-black">{ficheData.evaluation.objectifEvaluation}</p>
                      </div>
                    )}

                    {/* Afficher les questions si disponibles */}
                    {ficheData.evaluation.questions && ficheData.evaluation.questions.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Questions</h4>
                        <div className="space-y-4">
                          {ficheData.evaluation.questions.map((q, i) => (
                            <div key={i} className="border border-edu-light/50 p-4 rounded-[2px]">
                              <div className="flex items-start gap-3 mb-2">
                                <span className="bg-edu-black text-white w-6 h-6 min-w-6 flex items-center justify-center text-[10px] font-bold rounded-full">{q.numero}</span>
                                <div className="flex-1">
                                  <p className="text-sm text-edu-black font-semibold">{q.question}</p>
                                  <p className="text-[10px] text-edu-dark mt-1 italic">Type: {q.typeQuestion}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Afficher les critères d'évaluation si disponibles */}
                    {ficheData.evaluation.critereEvaluation && ficheData.evaluation.critereEvaluation.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Critères d'évaluation</h4>
                        <ul className="space-y-2">
                          {ficheData.evaluation.critereEvaluation.map((crit, i) => (
                            <li key={i} className="flex gap-3 text-sm text-edu-black">
                              <span className="text-edu-red font-bold">●</span>
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Afficher les réponses attendues si disponibles */}
                    {ficheData.evaluation.corrige?.reponsesAttendues && ficheData.evaluation.corrige.reponsesAttendues.length > 0 && (
                      <div className="mb-8 p-4 bg-edu-red/5 border border-edu-red/30 rounded-[4px]">
                        <h4 className="text-[10px] font-bold text-edu-red uppercase tracking-widest mb-4">Réponses attendues / Corrigé</h4>
                        <div className="space-y-3">
                          {ficheData.evaluation.corrige.reponsesAttendues.map((rep, i) => (
                            <div key={i} className="text-sm text-edu-black">
                              <span className="font-semibold text-edu-red">Q{i + 1}: </span>
                              <span>{rep}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contenu éditable additionnel */}
                    {ficheData.evaluation.content && (
                      <div className="border-t border-edu-light/50 pt-6">
                        <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-4">Contenu supplémentaire</h4>
                        <RichTextEditor
                          content={ficheData.evaluation.content}
                          onChange={(html) => updateFicheData(['evaluation', 'content'], html)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Élève */}
                <div id="document" className={`relative group mb-16 p-6 border-2 transition-all ${activeSection === 'document' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                  }`} onClick={() => setActiveSection('document')}>
                  <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">05</span>
                    DOCUMENT ÉLÈVE
                  </h3>

                  <div className="space-y-12">
                    {/* Mise en situation */}
                    {ficheData.documentEleve && (
                      <>
                        {ficheData.documentEleve.miseEnSituation && (
                          <div className="border-l-4 border-edu-red pl-6">
                            <h4 className="text-xs font-bold text-edu-black uppercase tracking-widest mb-4">Mise en situation</h4>
                            {ficheData.documentEleve.miseEnSituation.contexte && (
                              <div className="mb-4">
                                <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-2">Contexte</p>
                                <p className="text-sm text-edu-black leading-relaxed">{ficheData.documentEleve.miseEnSituation.contexte}</p>
                              </div>
                            )}
                            {ficheData.documentEleve.miseEnSituation.texte && (
                              <div>
                                <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-2">Texte de mise en situation</p>
                                <p className="text-sm text-edu-black leading-relaxed bg-white p-4 border border-edu-light/50 rounded-[2px]">{ficheData.documentEleve.miseEnSituation.texte}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tâche */}
                        {ficheData.documentEleve.tache && (
                          <div className="border-l-4 border-edu-red pl-6">
                            <h4 className="text-xs font-bold text-edu-black uppercase tracking-widest mb-4">Tâche à réaliser</h4>
                            {ficheData.documentEleve.tache.enonce && (
                              <div className="mb-4 p-4 bg-edu-red/5 border border-edu-red/30 rounded-[2px]">
                                <p className="text-[10px] font-bold text-edu-red uppercase tracking-widest mb-2">Énoncé</p>
                                <p className="text-base font-semibold text-edu-black">{ficheData.documentEleve.tache.enonce}</p>
                              </div>
                            )}
                            {ficheData.documentEleve.tache.objectif && (
                              <div>
                                <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest mb-2">Objectif</p>
                                <p className="text-sm text-edu-black">{ficheData.documentEleve.tache.objectif}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Support pédagogique */}
                        {ficheData.documentEleve.supportPedagogique && (
                          <div className="border-l-4 border-edu-red pl-6">
                            <h4 className="text-xs font-bold text-edu-black uppercase tracking-widest mb-4">Support pédagogique</h4>
                            {ficheData.documentEleve.supportPedagogique.titre && (
                              <h5 className="text-sm font-bold text-edu-black mb-3">{ficheData.documentEleve.supportPedagogique.titre}</h5>
                            )}
                            {ficheData.documentEleve.supportPedagogique.contenu && (
                              <div className="bg-white p-6 border border-edu-light/50 rounded-[2px] text-sm text-edu-black leading-relaxed whitespace-pre-wrap">
                                {ficheData.documentEleve.supportPedagogique.contenu}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Consignes */}
                        {ficheData.documentEleve.consignes && Array.isArray(ficheData.documentEleve.consignes) && ficheData.documentEleve.consignes.length > 0 && (
                          <div className="border-l-4 border-edu-red pl-6">
                            <h4 className="text-xs font-bold text-edu-black uppercase tracking-widest mb-4">Consignes</h4>
                            <ol className="space-y-3">
                              {ficheData.documentEleve.consignes.map((consigne, i) => (
                                <li key={i} className="flex gap-4 text-sm text-edu-black">
                                  <span className="bg-edu-black text-white w-6 h-6 min-w-6 flex items-center justify-center text-[10px] font-bold rounded-full">{i + 1}</span>
                                  <span className="pt-0.5">{consigne}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Fiche de synthèse finale */}
                <div id="fiche" className={`relative group p-6 border-2 transition-all ${activeSection === 'fiche' ? 'border-edu-red/50 bg-edu-red/[0.02]' : 'border-edu-red/20 bg-edu-red/[0.02]'
                  }`} onClick={() => setActiveSection('fiche')}>
                  <h3 className="text-xs font-bold text-edu-red uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    <span className="bg-edu-red text-white w-6 h-6 flex items-center justify-center text-[10px]">06</span>
                    FICHE DE SYNTHÈSE (CORRIGÉ)
                  </h3>
                  <RichTextEditor
                    content={ficheData.ficheSynthese.content}
                    onChange={(html) => updateFicheData(['ficheSynthese', 'content'], html)}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* AI Assistant Slide-out Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[400px] bg-white border-l border-edu-light/50 flex flex-col shadow-2xl z-30"
            >
              <div className="p-6 border-b border-edu-light/50 flex items-center justify-between bg-edu-black text-white">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-edu-red" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Assistant IA Premium</h3>
                </div>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronDown className="-rotate-90" size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Action rapide</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-4 bg-edu-light/10 hover:bg-edu-red/5 border border-edu-light/50 hover:border-edu-red/30 rounded-[4px] text-left transition-all group">
                      <Sparkles size={16} className="text-edu-red mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-[10px] font-bold uppercase">Améliorer</div>
                      <div className="text-[9px] text-edu-dark mt-1">Optimiser la rédaction</div>
                    </button>
                    <button className="p-4 bg-edu-light/10 hover:bg-edu-red/5 border border-edu-light/50 hover:border-edu-red/30 rounded-[4px] text-left transition-all group">
                      <Target size={16} className="text-edu-red mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-[10px] font-bold uppercase">Simplifier</div>
                      <div className="text-[9px] text-edu-dark mt-1">Adapter le niveau</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Demande personnalisée</h4>
                  <div className="relative">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      placeholder="Ex: Génère 3 questions d'évaluation pour cette section..."
                      className="w-full bg-edu-light/10 border border-edu-light/50 focus:border-edu-red outline-none p-4 text-xs min-h-[120px] rounded-[4px] transition-all"
                    />
                    <button
                      className="absolute bottom-3 right-3 p-2 bg-edu-black text-white rounded-[4px] hover:bg-edu-red transition-all"
                      disabled={!aiPrompt || isAIGenerating}
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Historique & Suggestions</h4>
                  <div className="space-y-2">
                    {[
                      "Générer un document élève à partir de la synthèse",
                      "Créer une grille d'évaluation",
                      "Ajouter des exemples concrets pour le thème"
                    ].map((suggestion, i) => (
                      <button key={i} className="w-full text-left p-3 text-[10px] text-edu-dark hover:text-edu-black hover:bg-edu-light/20 border border-transparent hover:border-edu-light/50 rounded-[4px] transition-all flex items-center gap-3">
                        <Plus size={12} />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-edu-light/50 bg-edu-light/5">
                <div className="flex items-center gap-3 text-[9px] text-edu-dark uppercase tracking-tighter">
                  <HelpCircle size={12} />
                  <span>Besoin d'aide pour utiliser l'IA ?</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}