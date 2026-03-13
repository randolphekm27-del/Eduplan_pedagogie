
export interface Fiche {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  tags: string[];
  progress?: number;
  theme?: string;
  folderId?: string;
  content?: any;
}

export interface Folder {
  id: string;
  name: string;
}

const FICHES_KEY = 'edu_fiches';
const FOLDERS_KEY = 'edu_folders';

const defaultFiches: Fiche[] = [
  { id: "1", subject: "MEL", class: "2nd F3/A", title: "Détermination des paramètres (E, r) d'une pile", date: "Aujourd'hui", tags: ["Pratique", "Mesures"], progress: 80 },
  { id: "2", subject: "Génie Électrique", class: "Bac Pro MELEC", title: "Câblage Armoire TGBT", date: "Hier", tags: ["Atelier", "Sécurité"], progress: 45 },
  { id: "3", subject: "HISTOIRE", class: "4ème", title: "La Révolution Industrielle", date: "Il y a 2 jours", tags: ["Chronologie", "Synthèse"], progress: 15 },
  { id: "4", subject: "FRANÇAIS", class: "1ère", title: "Les Fleurs du Mal - Baudelaire", date: "10 Mars 2026", tags: ["Poésie", "Analyse"] },
  { id: "5", subject: "PHYSIQUE", class: "Terminale S", title: "Mécanique Quantique", date: "05 Mars 2026", tags: ["Théorie", "Calculs"] },
  { id: "6", subject: "HISTOIRE", class: "3ème", title: "La Seconde Guerre Mondiale", date: "28 Fév 2026", tags: ["Chronologie", "Synthèse"] },
];

const defaultFolders: Folder[] = [
  { id: '1', name: 'Séquences 2nde' },
  { id: '2', name: 'TP Atelier' },
  { id: '3', name: 'Évaluations' },
  { id: '4', name: 'Ressources partagées' }
];

export const storageService = {
  getFiches: (): Fiche[] => {
    const stored = localStorage.getItem(FICHES_KEY);
    if (!stored) {
      localStorage.setItem(FICHES_KEY, JSON.stringify(defaultFiches));
      return defaultFiches;
    }
    return JSON.parse(stored);
  },

  saveFiche: (fiche: Fiche) => {
    const fiches = storageService.getFiches();
    const index = fiches.findIndex(f => f.id === fiche.id);
    if (index >= 0) {
      fiches[index] = fiche;
    } else {
      fiches.unshift(fiche);
    }
    localStorage.setItem(FICHES_KEY, JSON.stringify(fiches));
  },

  deleteFiche: (id: string) => {
    const fiches = storageService.getFiches().filter(f => f.id !== id);
    localStorage.setItem(FICHES_KEY, JSON.stringify(fiches));
  },

  getFolders: (): Folder[] => {
    const stored = localStorage.getItem(FOLDERS_KEY);
    if (!stored) {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(defaultFolders));
      return defaultFolders;
    }
    return JSON.parse(stored);
  },

  saveFolder: (folder: Folder) => {
    const folders = storageService.getFolders();
    const index = folders.findIndex(f => f.id === folder.id);
    if (index >= 0) {
      folders[index] = folder;
    } else {
      folders.push(folder);
    }
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  },

  deleteFolder: (id: string) => {
    const folders = storageService.getFolders().filter(f => f.id !== id);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    // Reset folderId for fiches in this folder
    const fiches = storageService.getFiches().map(f => {
      if (f.folderId === id) {
        return { ...f, folderId: undefined };
      }
      return f;
    });
    localStorage.setItem(FICHES_KEY, JSON.stringify(fiches));
  },

  moveFicheToFolder: (ficheId: string, folderId: string | undefined) => {
    const fiches = storageService.getFiches().map(f => {
      if (f.id === ficheId) {
        return { ...f, folderId };
      }
      return f;
    });
    localStorage.setItem(FICHES_KEY, JSON.stringify(fiches));
  }
};
