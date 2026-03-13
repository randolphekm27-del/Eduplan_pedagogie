import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ChevronLeft, Printer, FileText, Users, BookOpen, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import * as docx from 'docx';
import { storageService } from '../services/storageService';

interface Sequence {
  id: string;
  numero: string;
  objectif: string;
  taches: string;
  organisations: string[];
  savoirs: string;
  duree: string;
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
    contenu: string;
    schema: string | null;
    formules: string[];
    taches: string[];
  };
  synthese: {
    title: string;
    content: string;
  };
  evaluation: {
    title: string;
    content: string;
  };
  ficheSynthese: {
    title: string;
    content: string;
  };
}

type PageType = 'pedagogique' | 'document-eleve' | 'synthese' | 'evaluation';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ficheData, setFicheData] = useState<FicheData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<PageType>('pedagogique');
  const [isExporting, setIsExporting] = useState(false);

  // Charger les données depuis localStorage
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const allFiches = storageService.getFiches();
        const existingFiche = allFiches.find(f => f.id === id);
        
        if (existingFiche && existingFiche.content) {
          setFicheData(existingFiche.content);
        } else {
          toast.error('Données non trouvées', {
            description: 'Veuillez d\'abord éditer la fiche.'
          });
          navigate(`/dashboard/editor/${id}`);
        }
      } catch (error) {
        toast.error('Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // Rendu de toutes les pages pour l'export
  const renderAllPages = () => {
    return (
      <div className="space-y-8">
        {renderActivePage('pedagogique')}
        {renderActivePage('document-eleve')}
        {renderActivePage('synthese')}
        {renderActivePage('evaluation')}
      </div>
    );
  };

  // Exporter en PDF
  const exportToPDF = async () => {
    if (!ficheData) return;
    
    setIsExporting(true);
    const loadingToast = toast.loading('Préparation du PDF...');
    
    try {
      // 1. Récupérer l'élément visible
      const element = document.getElementById('preview-content');
      if (!element) throw new Error('Contenu introuvable');

      // 2. Créer une copie pour l'export (évite de modifier l'original)
      const container = element.cloneNode(true) as HTMLElement;
      container.style.padding = '40px';
      container.style.background = 'white';
      container.style.width = '800px'; // Largeur fixe pour la cohérence du PDF

      // 3. Configuration html2pdf
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `fiche-${ficheData.titre.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'in', format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      // 4. Génération
      await html2pdf().set(opt).from(container).save();
      
      toast.dismiss(loadingToast);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.dismiss(loadingToast);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Exporter en Word
  const exportToWord = async () => {
    if (!ficheData) return;
    
    setIsExporting(true);
    const loadingToast = toast.loading('Préparation du document Word...');

    try {
      const element = document.getElementById('preview-content');
      if (!element) throw new Error('Contenu introuvable');
      
      const content = element.innerHTML;
      
      const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${ficheData.titre}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h1 { text-align: center; text-transform: uppercase; text-decoration: underline; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
      saveAs(blob, `fiche-${ficheData.titre.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`);
      
      toast.dismiss(loadingToast);
      toast.success('Document Word exporté');
    } catch (error) {
      console.error('Word Export Error:', error);
      toast.dismiss(loadingToast);
      toast.error('Erreur lors de l\'export Word');
    } finally {
      setIsExporting(false);
    }
  };

  // Rendu de la page active
  const renderActivePage = (pageType: PageType) => {
    if (!ficheData) return null;

    switch (pageType) {
      case 'pedagogique':
        return (
          <div className="bg-white p-12 shadow-lg min-h-[1000px] border border-edu-light/20 mb-8">
            <h1 className="text-2xl font-serif font-bold mb-8 text-center underline">FICHE PÉDAGOGIQUE</h1>
            
            {/* En-tête */}
            <div className="border-2 border-black p-4 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4 border-b border-black pb-4">
                <div className="flex items-center">
                  <span className="font-bold uppercase mr-2">MATIÈRE :</span>
                  <span>{ficheData.enTete?.matiere}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold uppercase mr-2">CLASSE :</span>
                  <span>{ficheData.enTete?.classe}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4 border-b border-black pb-4">
                <div className="col-span-3 flex items-center">
                  <span className="font-bold uppercase mr-2">THÈME :</span>
                  <span>{ficheData.enTete?.theme}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold uppercase mr-2">TEMPS :</span>
                  <span>{ficheData.enTete?.temps}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 flex">
                  <span className="font-bold uppercase mr-2 whitespace-nowrap">OBJECTIF GÉNÉRAL :</span>
                  <span>{ficheData.enTete?.objectif}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold uppercase mr-2">DATE :</span>
                  <span>{ficheData.enTete?.date}</span>
                </div>
              </div>
            </div>

            {/* Mise en situation */}
            <div className="mb-8">
              <h2 className="font-serif text-lg font-bold uppercase mb-4">MISE EN SITUATION (5 min)</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-bold underline">Rappel :</span>
                  <p className="mt-1">{ficheData.miseEnSituation.rappel}</p>
                </div>
                <div>
                  <span className="font-bold underline">Prérequis :</span>
                  <ul className="list-disc pl-6 mt-1">
                    {ficheData.miseEnSituation.prerequis.map((pre, idx) => (
                      <li key={idx}>{pre}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold underline">Motivation :</span>
                  <p className="mt-1">{ficheData.miseEnSituation.motivation}</p>
                </div>
              </div>
            </div>

            {/* Tableau des séquences */}
            <div className="mb-8">
              <h2 className="font-serif text-lg font-bold uppercase mb-4">SÉQUENCES</h2>
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2">N°</th>
                    <th className="border border-black p-2">OBJECTIF OPÉRATIONNEL</th>
                    <th className="border border-black p-2">STRATÉGIE PÉDAGOGIQUE</th>
                    <th className="border border-black p-2">SAVOIRS ASSOCIÉS</th>
                    <th className="border border-black p-2">DURÉE</th>
                  </tr>
                </thead>
                <tbody>
                  {ficheData.sequences.map((seq) => (
                    <tr key={seq.id}>
                      <td className="border border-black p-2 text-center font-bold">{seq.numero}</td>
                      <td className="border border-black p-2">{seq.objectif}</td>
                      <td className="border border-black p-2">
                        <div>{seq.taches}</div>
                        <div className="mt-1">{seq.organisations.map(o => `-${o}`).join(' ')}</div>
                      </td>
                      <td className="border border-black p-2">{seq.savoirs}</td>
                      <td className="border border-black p-2 text-center">{seq.duree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Synthèse et Évaluation dans la fiche pédagogique */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              {ficheData.synthese?.content && (
                <div>
                  <h2 className="font-serif text-lg font-bold uppercase mb-2">{ficheData.synthese.title || 'SYNTHÈSE'} (15 min)</h2>
                  <div dangerouslySetInnerHTML={{ __html: ficheData.synthese.content }} />
                </div>
              )}
              {ficheData.evaluation?.content && (
                <div>
                  <h2 className="font-serif text-lg font-bold uppercase mb-2">{ficheData.evaluation.title || 'ÉVALUATION FORMATIVE'} (5 min)</h2>
                  <div dangerouslySetInnerHTML={{ __html: ficheData.evaluation.content }} />
                </div>
              )}
            </div>
          </div>
        );

      case 'document-eleve':
        if (!ficheData.documentEleve.contenu && ficheData.documentEleve.taches.length === 0) return null;
        return (
          <div className="bg-white p-12 shadow-lg min-h-[1000px] border border-edu-light/20 mb-8">
            <h1 className="text-2xl font-serif font-bold mb-8 text-center underline">DOCUMENT ÉLÈVE</h1>
            
            {/* Contexte */}
            {ficheData.documentEleve.contenu && (
              <div className="mb-8">
                <h2 className="font-serif text-lg font-bold mb-4">Contexte</h2>
                <div className="p-4 bg-gray-50 rounded-[2px]" 
                     dangerouslySetInnerHTML={{ __html: ficheData.documentEleve.contenu }} />
              </div>
            )}

            {/* Support (si présent) */}
            {ficheData.documentEleve.schema && (
              <div className="mb-8">
                <h2 className="font-serif text-lg font-bold mb-4">Schéma de montage</h2>
                <div className="border border-dashed border-gray-400 p-8 text-center text-gray-500">
                  [Schéma à insérer]
                </div>
              </div>
            )}

            {/* Formules */}
            {ficheData.documentEleve.formules.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-lg font-bold mb-4">Formules</h2>
                {ficheData.documentEleve.formules.map((formule, idx) => (
                  <div key={idx} className="font-mono bg-gray-50 p-3 mb-2 border border-gray-200">
                    {formule}
                  </div>
                ))}
              </div>
            )}

            {/* Tâches */}
            {ficheData.documentEleve.taches.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-bold mb-4">Tâches</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  {ficheData.documentEleve.taches.map((tache, idx) => (
                    <li key={idx} className="text-base">{tache}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );

      case 'synthese':
        if (!ficheData.ficheSynthese?.content) return null;
        return (
          <div className="bg-white p-12 shadow-lg min-h-[1000px] border border-edu-light/20 mb-8">
            <h1 className="text-2xl font-serif font-bold mb-8 text-center underline">{ficheData.ficheSynthese.title || 'FICHE DE SYNTHÈSE'}</h1>
            <div className="prose max-w-none" 
                 dangerouslySetInnerHTML={{ __html: ficheData.ficheSynthese.content }} />
          </div>
        );

      case 'evaluation':
        if (!ficheData.evaluation?.content) return null;
        return (
          <div className="bg-white p-12 shadow-lg min-h-[1000px] border border-edu-light/20 mb-8">
            <h1 className="text-2xl font-serif font-bold mb-8 text-center underline">{ficheData.evaluation.title || "FICHE D'ÉVALUATION FORMATIVE"}</h1>
            <div dangerouslySetInnerHTML={{ __html: ficheData.evaluation.content }} />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-edu-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-edu-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-edu-dark">Chargement de l'aperçu...</p>
        </div>
      </div>
    );
  }

  if (!ficheData) {
    return (
      <div className="min-h-screen bg-edu-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-edu-dark mb-4">Aucune donnée à afficher</p>
          <button 
            onClick={() => navigate(`/dashboard/editor/${id}`)}
            className="px-4 py-2 bg-edu-red text-white rounded-[2px] hover:bg-[#5a0808]"
          >
            Retour à l'éditeur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edu-bg print:bg-white">
      {/* Barre d'outils (cachée à l'impression) */}
      <header className="bg-white border-b border-edu-light/50 py-4 px-6 print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(`/dashboard/editor/${id}`)} 
            className="flex items-center gap-2 text-edu-dark hover:text-edu-black transition-colors"
          >
            <ChevronLeft size={20} /> Retour à l'éditeur
          </button>

          <h1 className="font-serif text-xl text-edu-black">
            Aperçu : {ficheData.titre}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToWord}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-edu-dark hover:text-edu-black hover:bg-edu-light/30 border border-edu-light/50 rounded-[2px] transition-colors disabled:opacity-50"
            >
              <FileText size={16} /> Word
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-edu-red text-white hover:bg-[#5a0808] rounded-[2px] transition-colors disabled:opacity-50"
            >
              <Download size={16} /> {isExporting ? 'Génération...' : 'Exporter PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation par onglets (cachée à l'impression) */}
      <div className="bg-white border-b border-edu-light/50 print:hidden sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActivePage('pedagogique')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePage === 'pedagogique'
                ? 'border-edu-red text-edu-red'
                : 'border-transparent text-edu-dark hover:text-edu-black'
            }`}
          >
            <BookOpen size={16} /> Fiche pédagogique
          </button>
          <button
            onClick={() => setActivePage('document-eleve')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePage === 'document-eleve'
                ? 'border-edu-red text-edu-red'
                : 'border-transparent text-edu-dark hover:text-edu-black'
            }`}
          >
            <Users size={16} /> Document élève
          </button>
          <button
            onClick={() => setActivePage('synthese')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePage === 'synthese'
                ? 'border-edu-red text-edu-red'
                : 'border-transparent text-edu-dark hover:text-edu-black'
            }`}
          >
            <CheckSquare size={16} /> Fiche synthèse
          </button>
          <button
            onClick={() => setActivePage('evaluation')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePage === 'evaluation'
                ? 'border-edu-red text-edu-red'
                : 'border-transparent text-edu-dark hover:text-edu-black'
            }`}
          >
            <FileText size={16} /> Évaluation
          </button>
        </div>
      </div>

      {/* Contenu de l'aperçu */}
      <div className="max-w-7xl mx-auto py-8 px-6 print:p-0">
        <div id="preview-content" className="print:block">
          {renderActivePage(activePage)}
        </div>
      </div>

      {/* Indication de pagination pour l'impression (cachée à l'écran) */}
      <div className="hidden print:block">
        <div className="page-break"></div>
        <div className="page-break"></div>
        <div className="page-break"></div>
      </div>
    </div>
  );
}
