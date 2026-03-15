import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Download, ChevronLeft, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { storageService } from '../services/storageService';
import { FicheData, generateDocumentHTML, DOCUMENT_STYLES } from '../utils/documentTemplate';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ficheData, setFicheData] = useState<FicheData | null>(location.state?.draft || null);
  const [isLoading, setIsLoading] = useState(!location.state?.draft);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (location.state?.draft) {
      setFicheData(location.state.draft);
      setIsLoading(false);
    } else if (id) {
       const loadData = async () => {
        setIsLoading(true);
        try {
          const content = await storageService.getFicheById(id);
          if (content) {
            setFicheData(content);
          } else {
            toast.error('Données non trouvées');
            navigate(`/dashboard/editor/${id}`);
          }
        } catch (error) {
          toast.error('Erreur de chargement');
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [id, navigate, location.state?.draft]);

  const exportToPDF = async () => {
    if (!ficheData) return;
    setIsExporting(true);
    const loadingToast = toast.loading('Export PDF en cours...');
    
    try {
      const fullHTML = generateDocumentHTML(ficheData);
      const opt = {
        margin: 0,
        filename: `fiche-${ficheData.titre.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'] as const }
      };

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fullHTML;
      document.body.appendChild(tempDiv);
      
      const worker = html2pdf().set(opt).from(tempDiv);
      await worker.save();

      
      document.body.removeChild(tempDiv);
      toast.dismiss(loadingToast);
      toast.success('PDF exporté avec succès');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = () => {
    if (!ficheData) return;
    const fullHTML = generateDocumentHTML(ficheData);
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          ${DOCUMENT_STYLES}
          .page { border: 1px solid #ccc; margin-bottom: 20px; }
        </style>
      </head>
      <body>${fullHTML}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, `fiche-${ficheData.titre.substring(0, 30)}.doc`);
    toast.success('Document Word généré');
  };

  if (isLoading || !ficheData) return null;

  // Générer et parser les pages
  const fullHTML = ficheData ? generateDocumentHTML(ficheData) : '';
  const pageElements = React.useMemo(() => {
    if (!fullHTML) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHTML, "text/html");
    return Array.from(doc.querySelectorAll('.page'));
  }, [fullHTML]);

  const totalPages = pageElements.length;

  const renderCurrentPage = () => {
    if (totalPages === 0) return <div className="p-20 text-center text-gray-400 font-serif italic">Aucune donnée à afficher.</div>;
    const pageHtml = pageElements[currentPage]?.outerHTML || '';
    return (
      <div 
        className="preview-container scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-top bg-white border border-gray-100 shadow-sm"
        dangerouslySetInnerHTML={{ __html: `<style>${DOCUMENT_STYLES}</style>${pageHtml}` }} 
      />
    );
  };

  const getPageTitle = (index: number) => {
    if (index === 0) return "1. Fiche Pédagogique (Paysage)";
    if (index === 1) return "2. Document Élève";
    if (index === 2) return "3. Fiche de Synthèse";
    if (index === 3) return "4. Évaluation Formative";
    return `Page Supplémentaire ${index - 3}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <header className="bg-white border-b border-edu-light/50 h-16 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-edu-light/20 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-edu-light/50"></div>
          <div>
            <h1 className="font-serif font-bold text-edu-black">{ficheData.titre}</h1>
            <p className="text-[10px] text-edu-red font-bold uppercase tracking-widest">Aperçu interactif</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-edu-light/20 p-1 rounded-[4px] gap-2">
            <button 
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 hover:bg-white rounded disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-2 min-w-[100px] text-center">
              PAGE {currentPage + 1} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 hover:bg-white rounded disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={exportToWord} className="px-4 py-2 text-xs font-bold bg-white border border-edu-light/50 rounded hover:bg-edu-light/10 transition-all">
              WORD
            </button>
            <button onClick={exportToPDF} className="px-6 py-2 text-xs font-bold bg-edu-black text-white rounded hover:bg-edu-red transition-all shadow-lg">
              {isExporting ? 'EXPORT...' : 'EXPORTER PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-12 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-bold text-edu-dark uppercase tracking-[0.2em]">
            {getPageTitle(currentPage)}
          </h2>
        </div>
        
        <div className="shadow-2xl ring-1 ring-black/5 bg-white">
          {renderCurrentPage()}
        </div>
      </main>

      <footer className="h-12 bg-white border-t border-edu-light/50 flex items-center justify-center px-8 fixed bottom-0 w-full">
        <div className="flex gap-2 overflow-x-auto p-1 items-center max-w-full no-scrollbar">
          {pageElements.map((_, i) => (
             <button 
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full transition-all ${currentPage === i ? 'bg-edu-red scale-125' : 'bg-edu-light/50 hover:bg-edu-dark'}`}
              title={getPageTitle(i)}
             />
          ))}
        </div>
      </footer>
    </div>
  );
}
