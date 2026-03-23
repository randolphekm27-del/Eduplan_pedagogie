import React, { useState, useEffect } from 'react';
import { Search, Filter, Folder, MoreHorizontal, Edit2, Share2, Grid, List, Clock, Tag, Plus, Trash2, FolderPlus, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { storageService, Fiche, Folder as FolderType } from '../services/storageService';

export default function Library() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Fiche[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedFiche, setSelectedFiche] = useState<Fiche | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [activeFolderId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allFiches = await storageService.getFiches();
      const allFolders = await storageService.getFolders();
      setDocuments(allFiches);
      setFolders(allFolders);
    } catch (error) {
       console.error(error);
       toast.error('Erreur de chargement');
    } finally {
       setIsLoading(false);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/dashboard/editor/${id}`);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const newFolder: FolderType = {
      id: '', 
      name: newFolderName
    };
    try {
      await storageService.saveFolder(newFolder);
      setNewFolderName('');
      setIsNewFolderModalOpen(false);
      await loadData();
      toast.success('Dossier créé');
    } catch (e) {
      toast.error('Erreur lors de la création du dossier');
    }
  };

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer ce dossier ? Les fichiers qu\'il contient ne seront pas supprimés.')) {
      try {
        await storageService.deleteFolder(id);
        if (activeFolderId === id) setActiveFolderId(null);
        await loadData();
        toast.success('Dossier supprimé');
      } catch (e) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteFiche = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer cette fiche ?')) {
      try {
        await storageService.deleteFiche(id);
        await loadData();
        toast.success('Fiche supprimée');
      } catch (e) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleMoveFiche = async (folderId: string | undefined) => {
    if (selectedFiche) {
      try {
        await storageService.moveFicheToFolder(selectedFiche.id, folderId || null);
        setIsMoveModalOpen(false);
        setSelectedFiche(null);
        await loadData();
        toast.success('Fichier déplacé');
      } catch (e) {
        toast.error('Erreur lors du déplacement');
      }
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = documents.find(d => d.id === id);
    if (doc) {
      try {
        await storageService.toggleFavorite(id, !doc.isFavorite);
        await loadData();
        toast.success(!doc.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
      } catch (err) {
        toast.error('Erreur lors de la mise à jour des favoris');
      }
    }
  };

  const filters = ['Toutes', 'Favorites', 'Récents', 'Partagées'];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = activeFolderId ? doc.folderId === activeFolderId : true;
    
    if (!matchesSearch || !matchesFolder) return false;

    if (activeFilter === 'Favorites') return doc.isFavorite;
    if (activeFilter === 'Récents') return true; // Could be filtered by date
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-edu-black mb-2">Ma bibliothèque technique</h2>
          <p className="text-edu-dark font-sans">Gérez et organisez vos fiches pédagogiques et ressources.</p>
        </div>
      </div>

      {/* Folders Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-edu-dark uppercase tracking-widest font-mono">Mes dossiers</h3>
          {activeFolderId && (
            <button 
              onClick={() => setActiveFolderId(null)}
              className="text-xs text-edu-red hover:underline"
            >
              Voir tous les fichiers
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {folders.map(folder => (
            <div 
              key={folder.id} 
              onClick={() => setActiveFolderId(folder.id)}
              className={`shrink-0 flex items-center gap-3 border px-4 py-3 rounded-[2px] cursor-pointer transition-all group min-w-[200px] ${
                activeFolderId === folder.id 
                  ? 'bg-edu-red/5 border-edu-red shadow-sm' 
                  : 'bg-white border-edu-light/50 hover:border-edu-red/50 hover:shadow-sm'
              }`}
            >
              <Folder size={20} className={`${activeFolderId === folder.id ? 'text-edu-red' : 'text-edu-dark group-hover:text-edu-red'} transition-colors`} />
              <span className={`font-medium text-sm flex-1 ${activeFolderId === folder.id ? 'text-edu-red' : 'text-edu-black'}`}>{folder.name}</span>
              <button 
                onClick={(e) => handleDeleteFolder(folder.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-edu-dark hover:text-edu-red transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setIsNewFolderModalOpen(true)} 
            className="shrink-0 flex items-center gap-2 bg-transparent border border-dashed border-edu-dark/30 px-4 py-3 rounded-[2px] cursor-pointer hover:border-edu-black hover:text-edu-black text-edu-dark transition-all text-sm font-medium"
          >
            <FolderPlus size={18} /> Nouveau dossier
          </button>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="bg-white border border-edu-light/50 p-4 rounded-[2px] mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-[2px] transition-colors ${
                activeFilter === filter 
                  ? 'bg-edu-red text-white shadow-sm' 
                  : 'bg-edu-bg text-edu-dark hover:bg-edu-light/30 hover:text-edu-black'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-edu-dark" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-edu-bg border border-edu-light/50 rounded-[2px] text-sm text-edu-black outline-none focus:border-edu-red"
            />
          </div>
          <div className="flex border border-edu-light/50 rounded-[2px] overflow-hidden">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-edu-light/40 text-edu-black' : 'bg-white text-edu-dark hover:bg-edu-light/20'}`}
              title="Mode liste"
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-edu-light/40 text-edu-black' : 'bg-white text-edu-dark hover:bg-edu-light/20'}`}
              title="Mode grille"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-2 border-edu-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-edu-dark">Chargement des documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-edu-light rounded-[2px]">
          <p className="text-edu-dark">Aucun document trouvé.</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, i) => (
              <motion.div 
                key={doc.id}
                onClick={() => handleCardClick(doc.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#FDFCFB] border border-edu-light/60 p-6 rounded-[2px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-sm ${
                    doc.subject === 'MEL' ? 'bg-red-100 text-red-800' : 
                    doc.subject === 'Génie Électrique' ? 'bg-blue-100 text-blue-800' : 
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {doc.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleToggleFavorite(doc.id, e)}
                      className={`p-1 rounded-full transition-colors ${doc.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-edu-light hover:text-amber-500 hover:bg-amber-50'}`}
                    >
                      <Clock size={14} className={doc.isFavorite ? 'fill-current' : ''} />
                    </button>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-edu-dark">
                      <Clock size={12} /> {doc.date}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-serif text-xl font-bold text-edu-black mb-2 group-hover:text-edu-red transition-colors line-clamp-2">
                  {doc.title}
                </h4>
                
                <div className="flex items-center gap-3 text-xs text-edu-dark mb-6 font-sans">
                  <span className="font-medium">{doc.class}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-edu-light/30 flex justify-between items-center">
                  <div className="flex gap-2">
                    {doc.tags?.filter(t => t !== 'Favorite').map((tag, j) => (
                      <span key={j} className="flex items-center gap-1 text-[10px] bg-edu-bg text-edu-dark px-2 py-1 rounded-sm">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiche(doc);
                        setIsMoveModalOpen(true);
                      }} 
                      className="p-1.5 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-sm transition-colors" 
                      title="Ranger dans un dossier"
                    >
                      <Move size={16} />
                    </button>
                    <button onClick={(e) => handleDeleteFiche(doc.id, e)} className="p-1.5 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-sm transition-colors" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-edu-light/50 rounded-[2px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-edu-bg/50 border-b border-edu-light/50">
                    <th className="p-4 font-serif text-sm font-bold text-edu-black">Thème</th>
                    <th className="p-4 font-serif text-sm font-bold text-edu-black">Matière</th>
                    <th className="p-4 font-serif text-sm font-bold text-edu-black">Classe</th>
                    <th className="p-4 font-serif text-sm font-bold text-edu-black">Modifié le</th>
                    <th className="p-4 font-serif text-sm font-bold text-edu-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} onClick={() => handleCardClick(doc.id)} className="border-b border-edu-light/30 hover:bg-edu-bg/30 transition-colors group cursor-pointer">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => handleToggleFavorite(doc.id, e)}
                            className={`p-1 rounded-full transition-colors ${doc.isFavorite ? 'text-amber-500' : 'text-edu-light hover:text-amber-500'}`}
                          >
                            <Clock size={14} className={doc.isFavorite ? 'fill-current' : ''} />
                          </button>
                          <div>
                            <div className="font-medium text-edu-black group-hover:text-edu-red transition-colors">{doc.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-sm ${
                          doc.subject === 'MEL' ? 'bg-red-50 text-red-700' : 
                          doc.subject === 'Génie Électrique' ? 'bg-blue-50 text-blue-700' : 
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {doc.subject}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-edu-dark">{doc.class}</td>
                      <td className="p-4 text-sm text-edu-dark">{doc.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiche(doc);
                              setIsMoveModalOpen(true);
                            }} 
                            className="p-1.5 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-sm transition-colors" 
                            title="Ranger"
                          >
                            <Move size={16} />
                          </button>
                          <button onClick={(e) => handleDeleteFiche(doc.id, e)} className="p-1.5 text-edu-dark hover:text-edu-red hover:bg-edu-red/10 rounded-sm transition-colors" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* New Folder Modal */}
      <AnimatePresence>
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2px] p-6 w-full max-w-md shadow-xl"
            >
              <h3 className="font-serif text-xl text-edu-black mb-4">Nouveau dossier</h3>
              <input 
                type="text" 
                placeholder="Nom du dossier" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-2 border border-edu-light rounded-[2px] outline-none focus:border-edu-red mb-6"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-edu-dark hover:text-edu-black"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreateFolder}
                  className="px-6 py-2 bg-edu-red text-white text-sm font-medium rounded-[2px] hover:bg-[#5a0808]"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move to Folder Modal */}
      <AnimatePresence>
        {isMoveModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2px] p-6 w-full max-w-md shadow-xl"
            >
              <h3 className="font-serif text-xl text-edu-black mb-4">Ranger dans un dossier</h3>
              <p className="text-sm text-edu-dark mb-4">Sélectionnez un dossier pour "{selectedFiche?.title}"</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                <button 
                  onClick={() => handleMoveFiche(undefined)}
                  className="w-full text-left px-4 py-3 rounded-[2px] border border-edu-light hover:border-edu-red hover:bg-edu-red/5 transition-all flex items-center gap-3"
                >
                  <Folder size={18} className="text-edu-dark" />
                  <span className="text-sm font-medium">Aucun dossier (Racine)</span>
                </button>
                {folders.map(folder => (
                  <button 
                    key={folder.id}
                    onClick={() => handleMoveFiche(folder.id)}
                    className="w-full text-left px-4 py-3 rounded-[2px] border border-edu-light hover:border-edu-red hover:bg-edu-red/5 transition-all flex items-center gap-3"
                  >
                    <Folder size={18} className="text-edu-dark" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsMoveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-edu-dark hover:text-edu-black"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
