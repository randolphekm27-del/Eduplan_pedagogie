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
import { FicheData, Sequence, generateDocumentHTML } from '../utils/documentTemplate';

// interfaces and types moved to documentTemplate.ts
interface Section {
  id: string;
  label: string;
  type: 'main' | 'sub';
  parentId?: string;
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
  const [isStandardMode, setIsStandardMode] = useState(true);

  // Charger la fiche depuis le storage
  useEffect(() => {
    const loadFiche = async () => {
      if (!id) {
          setIsLoading(false);
          setFicheData(null);
          return;
      }

      setIsLoading(true);
      try {
        if (id === 'blank') {
          const blankData: FicheData = {
            id: 'new',
            titre: 'Nouveau Modèle Personnalisé',
            numeroFiche: '',
            enTete: { matiere: '', theme: '', objectifGeneral: '', classe: '', temps: '', date: new Date().toISOString().split('T')[0] },
            miseEnSituation: { rappel: '', prerequis: '', motivation: '' },
            sequences: [],
            syntheseLecon: '',
            evaluationFormative: '',
            documentEleve: { activite: '', objectifGeneral: '', consigne: '', texte: '', support: '', taches: '', strategie: { travailGroupe: '', pleniere: '' } },
            ficheSynthese: { point1: '', point2: '', point3: '' },
            extraPages: []
          };
          setFicheData(blankData);
          setSections([]);
          setIsStandardMode(false);
          setIsLoading(false);
          setActiveSection('blank-start');
          return;
        }

        const content = await storageService.getFicheById(id);

        if (content) {
          setIsStandardMode(content.sequences.length > 0 || content.enTete.matiere !== ''); 
          const adaptedData: FicheData = {
            ...content,
            id: content.id || id,
            titre: content.titre || '',
            sequences: content.sequences || [],
            extraPages: content.extraPages || []
          };
          setFicheData(adaptedData);

          // Construire les sections à partir des données chargées
          const newSections: any[] = [];
          
          if (content.sequences.length > 0 || content.enTete.matiere !== '') {
            newSections.push(
              { id: 'page1', label: '1. Fiche Pédagogique', type: 'main' },
              { id: 'en-tete', label: 'En-tête', type: 'sub', parentId: 'page1' },
              { id: 'situation', label: 'Mise en situation', type: 'sub', parentId: 'page1' },
              { id: 'sequences', label: 'Séquences (Tableau)', type: 'sub', parentId: 'page1' },
              { id: 'page2', label: '2. Document Élève', type: 'main' },
              { id: 'page3', label: '3. Fiche de Synthèse', type: 'main' },
              { id: 'page4', label: '4. Évaluation Formative', type: 'main' }
            );
          }

          if (adaptedData.extraPages) {
            adaptedData.extraPages.forEach((p: any) => {
              newSections.push({ id: p.id, label: p.title, type: 'main' });
            });
          }

          setSections(newSections);

        } else {
          toast.error("Fiche non trouvée");
          navigate('/dashboard/library');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erreur de chargement');
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
      const savedId = await storageService.saveFiche(ficheData);
      setIsSaved(true);
      toast.success('Fiche enregistrée avec succès');

      // Si c'était une nouvelle fiche sans ID dans l'URL, on met à jour l'URL
      if (!id || id === 'new') {
        navigate(`/dashboard/editor/${savedId}`, { replace: true });
      }
    } catch (error) {
      toast.error('Erreur de sauvegarde', { description: error instanceof Error ? error.message : 'Impossible de sauvegarder les modifications.' });
    }
  };

  const updateFicheData = (path: string[], value: any) => {
    if (!ficheData) return;

    setFicheData(prev => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
    setIsSaved(false);
  };

  // Ajouter une nouvelle page (extra)
  const addNewSection = () => {
    if (!ficheData) return;
    const newId = `extra-${Date.now()}`;
    const newPage = { id: newId, title: 'Nouvelle Page', content: 'Contenu de la page...' };
    
    updateFicheData(['extraPages'], [...(ficheData.extraPages || []), newPage]);
    
    const newSection: Section = {
      id: newId,
      label: newPage.title,
      type: 'main'
    };
    setSections([...sections, newSection]);
    setIsSaved(false);
    setActiveSection(newId);
    toast.success('Page ajoutée');
  };


  // Supprimer une section (page extra)
  const deleteSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Vérifier si ce sont des sections protégées
    const protectedSections = ['page1', 'en-tete', 'situation', 'sequences', 'page2', 'page3', 'page4'];
    if (protectedSections.includes(sectionId)) {
      toast.error('Page protégée', {
        description: 'Cette page fait partie du socle obligatoire.'
      });
      return;
    }

    if (window.confirm('Supprimer cette page ?')) {
      if (ficheData?.extraPages) {
        updateFicheData(['extraPages'], ficheData.extraPages.filter(p => p.id !== sectionId));
      }
      setSections(sections.filter(s => s.id !== sectionId));
      setIsSaved(false);
      if (activeSection === sectionId) setActiveSection('page1');
      toast.success('Page supprimée');
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
      organisations: 'TI, TG',
      savoirs: "Savoirs associés",
      materiel: "Matériel",
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
    const currentTasks = ficheData.documentEleve.taches || "";
    const newTasks = currentTasks + (currentTasks ? "\n" : "") + "Nouvelle tâche";
    updateFicheData(['documentEleve', 'taches'], newTasks);
  };

  // Supprimer une tâche (adapted for string-based tasks)
  const deleteTask = (index: number) => {
    if (!ficheData) return;
    const taskList = ficheData.documentEleve.taches.split('\n');
    const newTasks = taskList.filter((_, i) => i !== index).join('\n');
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
              <span className="text-edu-red font-bold">{ficheData.enTete?.matiere || 'Sans matière'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-edu-light/20 p-1 rounded-[4px] gap-1">
            <button
              onClick={() => {
                navigate(`/dashboard/preview/${id}`, { state: { draft: ficheData } });
              }}
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
            <Save size={14} /> ENREGISTRER
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
                {/* Empty State / Blank Start */}
                {sections.length === 0 && (
                  <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-edu-light rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-edu-light/10 rounded-full flex items-center justify-center mb-6">
                      <FileText size={32} className="text-edu-dark" />
                    </div>
                    <h2 className="font-serif text-2xl text-edu-black mb-4">Votre page est prête.</h2>
                    <p className="text-edu-dark mb-8 max-w-md">Commencez à construire votre modèle en ajoutant des sections personnalisées. Chaque section peut contenir du texte, des tableaux ou des images.</p>
                    <button 
                      onClick={addNewSection}
                      className="flex items-center gap-2 px-8 py-3 bg-edu-red text-white font-bold rounded-[2px] hover:bg-[#5a0808] transition-all shadow-lg"
                    >
                      <Plus size={18} /> CRÉER MA PREMIÈRE PARTIE
                    </button>
                  </div>
                )}
                {/* Sections Standard (uniquement en mode standard) */}
                {isStandardMode && ficheData && (
                  <>
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
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Numéro Fiche</label>
                      <input
                        type="text"
                        value={ficheData.numeroFiche || ''}
                        onChange={(e) => updateFicheData(['numeroFiche'], e.target.value)}
                        className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 font-serif text-lg transition-colors"
                      />
                    </div>
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
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Objectif général</label>
                      <input
                        type="text"
                        value={ficheData.enTete?.objectifGeneral || ''}
                        onChange={(e) => updateFicheData(['enTete', 'objectifGeneral'], e.target.value)}
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
                      <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Pré-requis</label>
                      <textarea
                        value={ficheData.miseEnSituation.prerequis}
                        onChange={(e) => updateFicheData(['miseEnSituation', 'prerequis'], e.target.value)}
                        className="w-full bg-transparent border border-edu-light/50 focus:border-edu-red outline-none p-3 text-sm min-h-[80px] transition-colors"
                        placeholder="Pré-requis nécessaires..."
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
                  </div>

                  <div className="space-y-6">
                    {ficheData.sequences.map((seq, idx) => (
                      <div key={seq.id} className="border border-edu-light/50 p-6 rounded-[2px] bg-white shadow-sm relative group">
                        <button
                          onClick={() => deleteSequence(seq.id)}
                          className="absolute -right-3 -top-3 w-8 h-8 bg-white border border-red-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-6 gap-4">
                          <div className="col-span-1 border-r border-edu-light/50 pr-4">
                            <label className="text-[10px] font-bold uppercase block mb-1">Seq</label>
                            <input
                              className="w-full font-bold text-center bg-gray-50 border border-gray-200 py-1"
                              value={seq.numero}
                              onChange={(e) => updateSequence(idx, 'numero', e.target.value)}
                            />
                            <label className="text-[10px] font-bold uppercase block mt-3 mb-1">Durée</label>
                            <input
                              className="w-full text-center text-xs bg-gray-50 border border-gray-200 py-1"
                              value={seq.duree}
                              onChange={(e) => updateSequence(idx, 'duree', e.target.value)}
                            />
                          </div>
                          <div className="col-span-5 space-y-4">
                            <div>
                              <label className="text-[10px] font-bold uppercase block mb-1">Objectif opérationnel</label>
                              <RichTextEditor
                                content={seq.objectif}
                                onChange={(html) => updateSequence(idx, 'objectif', html)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold uppercase block mb-1">Tâches (Élèves)</label>
                                <RichTextEditor
                                  content={seq.taches}
                                  onChange={(html) => updateSequence(idx, 'taches', html)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase block mb-1">Organisation</label>
                                <input
                                  className="w-full text-xs p-2 border border-gray-200"
                                  value={seq.organisations}
                                  onChange={(e) => updateSequence(idx, 'organisations', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold uppercase block mb-1">Savoirs associés</label>
                                <RichTextEditor
                                  content={seq.savoirs}
                                  onChange={(html) => updateSequence(idx, 'savoirs', html)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase block mb-1">Matériel</label>
                                <input
                                  className="w-full text-xs p-2 border border-gray-200"
                                  value={seq.materiel}
                                  onChange={(e) => updateSequence(idx, 'materiel', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addSequence}
                      className="w-full py-4 border-2 border-dashed border-edu-light hover:border-edu-red hover:bg-edu-red/5 text-edu-dark hover:text-edu-red transition-all flex items-center justify-center gap-2 font-bold text-xs rounded"
                    >
                      <Plus size={16} /> AJOUTER UNE SÉQUENCE
                    </button>
                  </div>
                </div>

                {/* Synthèse & Évaluation */}
                <div id="synthese-eval" className="grid grid-cols-1 gap-12 mb-16">
                  <div className={`relative group p-6 border-2 transition-all ${activeSection === 'synthese-eval' ? 'border-edu-black bg-edu-light/5' : 'border-transparent hover:border-edu-light/50'
                    }`} onClick={() => setActiveSection('synthese-eval')}>
                    <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mb-4 flex items-center gap-4">
                      <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">03</span>
                      SYNTHÈSE DE LA LEÇON
                    </h3>
                    <RichTextEditor
                      content={ficheData.syntheseLecon}
                      onChange={(html) => updateFicheData(['syntheseLecon'], html)}
                    />

                    <h3 className="text-xs font-bold text-edu-black uppercase tracking-[0.2em] mt-8 mb-4 flex items-center gap-4">
                      <span className="bg-edu-black text-white w-6 h-6 flex items-center justify-center text-[10px]">04</span>
                      ÉVALUATION FORMATIVE
                    </h3>
                    <RichTextEditor
                      content={ficheData.evaluationFormative}
                      onChange={(html) => updateFicheData(['evaluationFormative'], html)}
                    />
                  </div>
                </div>

                {/* PAGE 2 : DOCUMENT ÉLÈVE */}
                <div id="page2" className={`relative group mb-16 p-8 border-t-8 border-edu-black pt-16 transition-all ${activeSection === 'page2' ? 'bg-edu-light/5' : ''
                  }`} onClick={() => setActiveSection('page2')}>
                  <h2 className="text-xl font-bold text-center underline mb-12">PAGE 2 : DOCUMENT ÉLÈVE</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest">Activité</label>
                        <input
                          type="text"
                          value={ficheData.documentEleve.activite}
                          onChange={(e) => updateFicheData(['documentEleve', 'activite'], e.target.value)}
                          className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest">Objectif Général</label>
                        <input
                          type="text"
                          value={ficheData.documentEleve.objectifGeneral}
                          onChange={(e) => updateFicheData(['documentEleve', 'objectifGeneral'], e.target.value)}
                          className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest">Consigne</label>
                        <input
                          type="text"
                          value={ficheData.documentEleve.consigne}
                          onChange={(e) => updateFicheData(['documentEleve', 'consigne'], e.target.value)}
                          className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest">ORIENTATION / CONTEXTE</label>
                      <RichTextEditor
                        content={ficheData.documentEleve.texte}
                        onChange={(html) => updateFicheData(['documentEleve', 'texte'], html)}
                      />

                      <label className="text-[10px] font-bold uppercase tracking-widest block mt-4">SUPPORTS DE TRAVAIL</label>
                      <RichTextEditor
                        content={ficheData.documentEleve.support}
                        onChange={(html) => updateFicheData(['documentEleve', 'support'], html)}
                      />

                      <label className="text-[10px] font-bold uppercase tracking-widest block mt-4">TRAVAIL À FAIRE</label>
                      <RichTextEditor
                        content={ficheData.documentEleve.taches}
                        onChange={(html) => updateFicheData(['documentEleve', 'taches'], html)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest">Travail en groupe</label>
                        <input
                          type="text"
                          value={ficheData.documentEleve.strategie.travailGroupe}
                          onChange={(e) => updateFicheData(['documentEleve', 'strategie', 'travailGroupe'], e.target.value)}
                          className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest">Restitution / Plénière</label>
                        <input
                          type="text"
                          value={ficheData.documentEleve.strategie.pleniere}
                          onChange={(e) => updateFicheData(['documentEleve', 'strategie', 'pleniere'], e.target.value)}
                          className="w-full bg-transparent border-b border-edu-light/50 focus:border-edu-red outline-none py-1 text-sm transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAGE 3 : FICHE DE SYNTHÈSE */}
                <div id="page3" className={`relative group p-8 border-t-8 border-edu-red pt-16 transition-all ${activeSection === 'page3' ? 'bg-edu-red/[0.02]' : ''
                  }`} onClick={() => setActiveSection('page3')}>
                  <h2 className="text-xl font-bold text-center underline text-edu-red mb-12">PAGE 3 : FICHE DE SYNTHÈSE</h2>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-edu-red">Contenu de la synthèse (Zone 1)</label>
                      <RichTextEditor
                        content={ficheData.ficheSynthese.point1}
                        onChange={(html) => updateFicheData(['ficheSynthese', 'point1'], html)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-edu-red">Contenu de la synthèse (Zone 2)</label>
                      <RichTextEditor
                        content={ficheData.ficheSynthese.point2}
                        onChange={(html) => updateFicheData(['ficheSynthese', 'point2'], html)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-edu-red">Contenu de la synthèse (Zone 3)</label>
                      <RichTextEditor
                        content={ficheData.ficheSynthese.point3}
                        onChange={(html) => updateFicheData(['ficheSynthese', 'point3'], html)}
                      />
                    </div>
                  </div>
                </div>

                {/* PAGE 4 : ÉVALUATION FORMATIVE */}
                <div id="page4" className={`relative group p-8 border-t-8 border-edu-black pt-16 transition-all shadow-sm ${activeSection === 'page4' ? 'bg-edu-light/5' : ''
                  }`} onClick={() => setActiveSection('page4')}>
                  <h2 className="text-xl font-bold text-center underline mb-12">PAGE 4 : ÉVALUATION FORMATIVE</h2>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest block">Contenu de l'évaluation</label>
                    <RichTextEditor
                      content={ficheData.evaluationFormative}
                      onChange={(html) => updateFicheData(['evaluationFormative'], html)}
                    />
                  </div>
                    </div>
                  </>
                )}

                {/* EXTRA PAGES */}
                {(ficheData.extraPages || []).map((page, index) => (
                   <div key={page.id} id={page.id} className={`relative group p-8 border-t-8 border-edu-light pt-16 transition-all ${activeSection === page.id ? 'bg-edu-light/10' : ''
                  }`} onClick={() => setActiveSection(page.id)}>
                    <div className="flex justify-between items-center mb-12">
                      <button
                         onClick={(e) => deleteSection(page.id, e)}
                         className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                         <Trash2 size={18} />
                      </button>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => {
                          const newPages = [...(ficheData.extraPages || [])];
                          newPages[index] = { ...newPages[index], title: e.target.value };
                          updateFicheData(['extraPages'], newPages);

                          // Update sidebar label too
                          setSections(sections.map(s => s.id === page.id ? { ...s, label: e.target.value } : s));
                        }}
                        className="text-xl font-bold text-center underline uppercase outline-none bg-transparent focus:text-edu-red transition-colors"
                      />
                      <button 
                        onClick={(e) => deleteSection(page.id, e)}
                        className="p-2 text-edu-red hover:bg-edu-red/10 rounded-full transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <RichTextEditor
                        content={page.content}
                        onChange={(html) => {
                          const newPages = [...(ficheData.extraPages || [])];
                          newPages[index] = { ...newPages[index], content: html };
                          updateFicheData(['extraPages'], newPages);
                        }}
                      />
                    </div>
                  </div>
                ))}

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