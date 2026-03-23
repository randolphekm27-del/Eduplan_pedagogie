import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { buildDocumentPages, DOCUMENT_STYLES, FicheData, PageOrientation } from '../utils/documentTemplate';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ficheData, setFicheData] = useState<FicheData | null>(location.state?.draft || null);
  const [isLoading, setIsLoading] = useState(!location.state?.draft);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { profile } = useAuth();

  const isFree = profile?.tier === 'free';

  useEffect(() => {
    if (location.state?.draft) {
      setFicheData(location.state.draft);
      setIsLoading(false);
      return;
    }

    if (!id) return;

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
  }, [id, navigate, location.state?.draft]);

  const pages = useMemo(() => {
    if (!ficheData) return [];
    return buildDocumentPages(ficheData, isFree);
  }, [ficheData, isFree]);

  useEffect(() => {
    if (currentPage > 0 && currentPage >= pages.length) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  const currentPageDefinition = pages[currentPage] || null;

  const updateOrientation = (pageId: string, orientation: PageOrientation) => {
    setFicheData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pageOrientations: {
          ...(prev.pageOrientations || {}),
          [pageId]: orientation
        }
      };
    });
  };

  const exportToPDF = async () => {
    if (!ficheData) return;
    setIsExporting(true);

    try {
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>${ficheData.titre}</title>
          <style>${DOCUMENT_STYLES}</style>
        </head>
        <body>${buildDocumentPages(ficheData, isFree).map((page) => page.html).join('')}</body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow) {
        throw new Error("La fenêtre d'impression a été bloquée par le navigateur.");
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      printWindow.onload = () => {
        printWindow.print();
      };

      toast.success('La fenêtre d’export PDF est ouverte. Vous pouvez enregistrer en PDF depuis l’impression.');
    } catch (error) {
      toast.error("Erreur lors de l'ouverture de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = () => {
    if (!ficheData) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          ${DOCUMENT_STYLES}
          .page { border: 1px solid #ccc; margin-bottom: 20px; }
        </style>
      </head>
      <body>${buildDocumentPages(ficheData, isFree).map((page) => page.html).join('')}</body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, `fiche-${ficheData.titre.substring(0, 30)}.doc`);
    toast.success('Document Word généré');
  };

  if (isLoading || !ficheData) return null;
  if (!currentPageDefinition) return null;

  const orientationLabel = currentPageDefinition.orientation === 'landscape' ? 'Paysage' : 'Portrait';

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
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 hover:bg-white rounded disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-2 min-w-[100px] text-center">
              PAGE {currentPage + 1} / {pages.length}
            </span>
            <button
              disabled={currentPage === pages.length - 1}
              onClick={() => setCurrentPage((p) => p + 1)}
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
              {isExporting ? 'OUVERTURE...' : 'EXPORTER PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-12 flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-sm font-bold text-edu-dark uppercase tracking-[0.2em]">
            {currentPageDefinition.title}
          </h2>
          <p className="text-xs text-edu-dark/60 mt-2">Orientation actuelle: {orientationLabel}</p>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white border border-edu-light/30 px-5 py-3 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-edu-red">Orientation</span>
          <select
            value={currentPageDefinition.orientation}
            onChange={(e) => updateOrientation(currentPageDefinition.id, e.target.value as PageOrientation)}
            className="px-4 py-2 border border-edu-light/40 rounded-[4px] text-sm outline-none focus:border-edu-red bg-white"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Paysage</option>
          </select>
          <span className="text-xs text-edu-dark/60">Le choix manuel est prioritaire sur la règle par défaut.</span>
        </div>

        <div className="shadow-2xl ring-1 ring-black/5 bg-white">
          <div
            className="preview-container scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-top bg-white border border-gray-100 shadow-sm"
            dangerouslySetInnerHTML={{ __html: `<style>${DOCUMENT_STYLES}</style>${currentPageDefinition.html}` }}
          />
        </div>
      </main>

      <footer className="h-12 bg-white border-t border-edu-light/50 flex items-center justify-center px-8 fixed bottom-0 w-full">
        <div className="flex gap-2 overflow-x-auto p-1 items-center max-w-full no-scrollbar">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentPage === index ? 'bg-edu-red scale-125' : 'bg-edu-light/50 hover:bg-edu-dark'}`}
              title={`${page.title} - ${page.orientation}`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
