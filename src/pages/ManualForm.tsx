import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { storageService, Fiche } from '../services/storageService';

export default function ManualForm() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>('header');
  const [templateType, setTemplateType] = useState('classic');
  const [formData, setFormData] = useState({
    subject: '',
    theme: '',
    class: '',
    date: new Date().toISOString().split('T')[0]
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.theme || !formData.subject) {
      toast.error('Veuillez remplir au moins le thème et la matière.');
      return;
    }

    const newFiche: Fiche = {
      id: Date.now().toString(),
      title: formData.theme,
      subject: formData.subject,
      class: formData.class,
      date: "Aujourd'hui",
      tags: [templateType === 'tp' ? 'Pratique' : templateType === 'literature' ? 'Analyse' : 'Cours'],
      progress: 10,
      theme: formData.theme,
      content: {
        enTete: {
          matiere: formData.subject,
          classe: formData.class,
          theme: formData.theme,
          temps: '1H',
          objectif: '',
          date: formData.date
        },
        miseEnSituation: {
          rappel: '',
          prerequis: [],
          motivation: ''
        },
        sequences: [
          {
            id: '1',
            title: 'Séquence I',
            duree: 15,
            objectif: '',
            strategie: '',
            modalites: [],
            contenu: ''
          }
        ],
        documentEleve: { title: 'Document élève', contenu: '', schema: null, formules: [], taches: [] },
        synthese: { title: 'Synthèse', content: '' },
        evaluation: { title: 'Évaluation', content: '' },
        ficheSynthese: {
          title: 'Fiche de synthèse',
          content: ''
        }
      }
    };

    storageService.saveFiche(newFiche);
    toast.success('Fiche créée avec succès !');
    navigate(`/dashboard/editor/${newFiche.id}`);
  };

  const handleDraft = () => {
    toast.success('Brouillon enregistré');
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Bientôt disponible', {
      description: 'Cette fonctionnalité est en cours de développement.'
    });
  };

  const getSectionTitles = () => {
    switch (templateType) {
      case 'tp':
        return {
          situation: 'Problématique & Hypothèses',
          sequences: 'Protocole Expérimental',
          synthesis: 'Analyse des Résultats'
        };
      case 'literature':
        return {
          situation: 'Contexte & Auteur',
          sequences: 'Axes de Lecture',
          synthesis: 'Bilan & Ouverture'
        };
      case 'revision':
        return {
          situation: 'Notions Clés',
          sequences: 'Points Essentiels',
          synthesis: 'Quiz Rapide'
        };
      default:
        return {
          situation: 'Mise en situation',
          sequences: 'Séquences pédagogiques',
          synthesis: 'Synthèse & Évaluation'
        };
    }
  };

  const titles = getSectionTitles();

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-8 flex flex-col lg:flex-row gap-8 h-full">
      
      {/* Left Column - Form (70%) */}
      <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-col h-full">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/dashboard/create" className="inline-flex items-center gap-2 text-sm text-edu-dark hover:text-edu-black transition-colors">
            <ArrowLeft size={16} /> Retour aux options
          </Link>
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-edu-dark uppercase tracking-wider">Modèle :</label>
            <select 
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="px-3 py-1.5 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm font-serif text-edu-black cursor-pointer"
            >
              <option value="classic">Séquence de cours classique</option>
              <option value="tp">Travaux Pratiques / Sciences</option>
              <option value="literature">Analyse Littéraire / Langues</option>
              <option value="revision">Fiche de Révision</option>
            </select>
          </div>
        </div>

        <h2 className="font-serif text-3xl text-edu-black mb-8">Créez votre fiche pas à pas</h2>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-20">
          
          {/* Card 1 - En-tête */}
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('header')}
              className="w-full px-6 py-4 flex justify-between items-center bg-[#F5F2ED]/50 hover:bg-[#F5F2ED] transition-colors"
            >
              <h3 className="font-serif text-lg font-bold text-edu-black">En-tête de la fiche</h3>
              {openSection === 'header' ? <ChevronUp size={20} className="text-edu-dark" /> : <ChevronDown size={20} className="text-edu-dark" />}
            </button>
            <AnimatePresence>
              {openSection === 'header' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 py-5 border-t border-edu-light/30"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Matière</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" placeholder="Ex: Français, Mathématiques, MEL" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Code matière</label>
                      <input type="text" className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Classe</label>
                      <input type="text" name="class" value={formData.class} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" placeholder="Ex: 2nde, Terminale, BTS" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Effectif</label>
                      <input type="number" className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-medium text-edu-black">Thème principal</label>
                      <input type="text" name="theme" value={formData.theme} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-medium text-edu-black">Objectif général</label>
                      <textarea className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm resize-none h-20" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Temps imparti</label>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="H" className="w-16 px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm text-center" />
                        <span className="text-edu-dark">h</span>
                        <input type="number" placeholder="Min" className="w-16 px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm text-center" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-edu-black">Date</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card 2 - Mise en situation */}
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('situation')}
              className="w-full px-6 py-4 flex justify-between items-center bg-[#F5F2ED]/50 hover:bg-[#F5F2ED] transition-colors"
            >
              <h3 className="font-serif text-lg font-bold text-edu-black">{titles.situation} <span className="text-sm font-sans font-normal text-edu-dark ml-2">(5 min recommandé)</span></h3>
              {openSection === 'situation' ? <ChevronUp size={20} className="text-edu-dark" /> : <ChevronDown size={20} className="text-edu-dark" />}
            </button>
            <AnimatePresence>
              {openSection === 'situation' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 py-5 border-t border-edu-light/30 space-y-5"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-edu-black">Rappel</label>
                    <textarea className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm resize-none h-16" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-edu-black">Prérequis</label>
                    <div className="flex items-center gap-2">
                      <input type="text" className="flex-1 px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" placeholder="Ex: Révolution Française, Théorème de Pythagore" />
                      <button className="p-2 border border-edu-light/50 rounded-[2px] text-edu-dark hover:text-edu-red hover:border-edu-red transition-colors"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-edu-black">Motivation / Accroche</label>
                    <textarea className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm resize-none h-16" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card 3 - Séquences */}
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden border-l-4 border-l-edu-red">
            <button 
              onClick={() => toggleSection('sequences')}
              className="w-full px-6 py-4 flex justify-between items-center bg-[#F5F2ED]/50 hover:bg-[#F5F2ED] transition-colors"
            >
              <h3 className="font-serif text-lg font-bold text-edu-black">{titles.sequences}</h3>
              {openSection === 'sequences' ? <ChevronUp size={20} className="text-edu-dark" /> : <ChevronDown size={20} className="text-edu-dark" />}
            </button>
            <AnimatePresence>
              {openSection === 'sequences' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 py-5 border-t border-edu-light/30"
                >
                  <div className="border border-edu-light/50 rounded-[2px] p-4 mb-4 bg-white">
                    <div className="flex justify-between items-center mb-4 border-b border-edu-light/30 pb-2">
                      <span className="font-serif font-bold text-edu-red">Séquence I</span>
                      <span className="text-xs font-mono text-edu-dark">Durée: <input type="number" className="w-12 border-b border-edu-light outline-none text-center" /> min</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono">Objectif de la séquence</label>
                        <input type="text" className="w-full px-3 py-2 bg-[#F5F2ED]/50 border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                      </div>
                      
                      <div className="bg-edu-bg/30 p-3 rounded-[2px] border border-edu-light/30">
                        <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono mb-2 block">Stratégie Pédagogique</label>
                        <div className="flex flex-col gap-3">
                          <input type="text" placeholder="Tâches proposées aux élèves" className="w-full px-3 py-2 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm" />
                          <div className="flex flex-wrap gap-4 text-sm">
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-edu-red" /> Travail Individuel</label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-edu-red" /> Travail de Groupe</label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-edu-red" /> Plénière</label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-edu-red" /> TD</label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="accent-edu-red" /> TP</label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-edu-dark font-mono">Contenu / Savoirs associés</label>
                        <textarea className="w-full px-3 py-2 bg-[#F5F2ED]/50 border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red text-sm resize-y min-h-[80px]" />
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 border border-dashed border-edu-dark/50 text-edu-dark rounded-[2px] hover:border-edu-red hover:text-edu-red transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus size={16} /> Ajouter une séquence
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other cards would go here (Synthèse, Évaluation, Document élève) - simplified for brevity */}
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden opacity-70">
            <div className="w-full px-6 py-4 flex justify-between items-center bg-[#F5F2ED]/50">
              <h3 className="font-serif text-lg font-bold text-edu-black">{titles.synthesis}</h3>
              <ChevronDown size={20} className="text-edu-dark" />
            </div>
          </div>
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden opacity-70">
            <div className="w-full px-6 py-4 flex justify-between items-center bg-[#F5F2ED]/50">
              <h3 className="font-serif text-lg font-bold text-edu-black">Document Élève</h3>
              <ChevronDown size={20} className="text-edu-dark" />
            </div>
          </div>

        </div>

        {/* Global Buttons */}
        <div className="mt-auto pt-6 border-t border-edu-light/30 flex justify-between items-center bg-edu-bg z-10">
          <button onClick={handleDraft} className="px-6 py-2.5 border border-edu-dark text-edu-black rounded-[2px] hover:bg-edu-dark/5 transition-colors font-medium text-sm">
            Enregistrer comme brouillon
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-edu-red text-white rounded-[2px] hover:bg-[#5a0808] transition-all shadow-[0_4px_14px_rgba(126,11,11,0.3)] font-medium text-sm"
          >
            Créer la fiche
          </button>
        </div>
      </div>

      {/* Right Column - Live Preview (30%) */}
      <div className="hidden lg:flex lg:w-[35%] xl:w-[30%] flex-col h-full sticky top-0">
        <h3 className="font-serif text-xl text-edu-black mb-6">Aperçu en direct</h3>
        
        <div className="flex-1 bg-white border border-edu-light shadow-xl rounded-[2px] p-6 flex flex-col items-center justify-start overflow-hidden relative">
          {/* Miniature Sheet */}
          <div className="w-full aspect-[1/1.414] bg-[#F5F2ED] border border-edu-light/50 shadow-sm p-4 flex flex-col text-[8px] font-sans relative overflow-hidden">
            <div className="border-b border-edu-black pb-2 mb-3 flex justify-between items-end">
              <div className="font-serif text-sm font-bold truncate pr-2">
                {formData.theme || "Titre de la fiche"}
              </div>
              <div className="text-right font-mono text-[6px] text-edu-dark leading-tight">
                {formData.subject || "MATIÈRE"}<br/>
                {formData.class || "CLASSE"}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="font-serif text-edu-red text-[8px] mb-1 border-b border-edu-light/50">I. OBJECTIFS</div>
              <div className="h-2 w-full bg-edu-light/20 rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-edu-light/20 rounded-sm"></div>
            </div>
            
            <div className="flex-1">
              <div className="font-serif text-edu-red text-[8px] mb-1 border-b border-edu-light/50">II. SÉQUENCES</div>
              <div className="w-full h-4 bg-edu-light/10 border border-edu-light/30 mb-1"></div>
              <div className="w-full h-8 bg-edu-light/10 border border-edu-light/30 mb-1"></div>
              <div className="w-full h-6 bg-edu-light/10 border border-edu-light/30"></div>
            </div>

            {/* Flash animation overlay when typing */}
            <motion.div 
              key={formData.theme + formData.subject + formData.class}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-edu-red/5 pointer-events-none"
            />
          </div>

          <button onClick={handleComingSoon} className="mt-6 text-sm text-edu-dark hover:text-edu-red underline underline-offset-4 transition-colors">
            Voir l'aperçu complet
          </button>
        </div>
      </div>

    </div>
  );
}
