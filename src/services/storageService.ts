import { supabase } from './supabaseClient';
import { FicheData } from '../utils/documentTemplate';

const QUERY_TIMEOUT_MS = 10000;

async function withTimeout<T>(promise: PromiseLike<T>, fallbackMessage: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(fallbackMessage));
    }, QUERY_TIMEOUT_MS);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function buildDefaultFicheData(sheet: any): FicheData {
  return {
    id: sheet.id,
    titre: sheet.title || '',
    numeroFiche: '',
    enTete: {
      matiere: sheet.subject || '',
      theme: '',
      objectifGeneral: '',
      classe: sheet.class_level || '',
      temps: sheet.duration || '',
      date: ''
    },
    miseEnSituation: {
      rappel: '',
      prerequis: '',
      motivation: ''
    },
    sequences: [],
    syntheseLecon: '',
    evaluationFormative: '',
    documentEleve: {
      activite: '',
      objectifGeneral: '',
      consigne: '',
      texte: '',
      support: '',
      taches: '',
      strategie: {
        travailGroupe: '',
        pleniere: ''
      }
    },
    ficheSynthese: {
      point1: '',
      point2: '',
      point3: ''
    },
    extraPages: [],
    pageOrientations: {}
  };
}

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
  isFavorite?: boolean;
  content?: FicheData;
}

export interface Folder {
  id: string;
  name: string;
}

export const storageService = {
  getFiches: async (): Promise<Fiche[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await withTimeout(
      supabase
        .from('pedagogical_sheets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      'Le chargement des fiches a expiré.'
    );

    if (error) {
      console.error('Error fetching fiches:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      subject: row.subject || row.content?.enTete?.matiere || '',
      class: row.class_level || row.content?.enTete?.classe || '',
      date: new Date(row.updated_at).toLocaleDateString('fr-FR'),
      tags: row.tags || [],
      theme: row.content?.enTete?.theme || row.description || '',
      folderId: undefined,
      isFavorite: false,
      content: row.content || undefined
    }));
  },

  getFicheById: async (id: string): Promise<FicheData | null> => {
    const { data: sheet, error } = await supabase
      .from('pedagogical_sheets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !sheet) {
      console.error('Error fetching fiche by id:', error);
      return null;
    }

    const fromContent = sheet.content as Partial<FicheData> | null;
    if (fromContent && typeof fromContent === 'object') {
      const fallback = buildDefaultFicheData(sheet);
      return {
        ...fallback,
        ...fromContent,
        id: sheet.id,
        titre: fromContent.titre || sheet.title || fallback.titre,
        numeroFiche: fromContent.numeroFiche || '',
        enTete: {
          ...fallback.enTete,
          ...(fromContent.enTete || {}),
          matiere: fromContent.enTete?.matiere || sheet.subject || fallback.enTete.matiere,
          classe: fromContent.enTete?.classe || sheet.class_level || fallback.enTete.classe,
          temps: fromContent.enTete?.temps || sheet.duration || fallback.enTete.temps
        },
        miseEnSituation: {
          ...fallback.miseEnSituation,
          ...(fromContent.miseEnSituation || {})
        },
        sequences: fromContent.sequences || [],
        documentEleve: {
          ...fallback.documentEleve,
          ...(fromContent.documentEleve || {}),
          strategie: {
            ...fallback.documentEleve.strategie,
            ...(fromContent.documentEleve?.strategie || {})
          }
        },
        ficheSynthese: {
          ...fallback.ficheSynthese,
          ...(fromContent.ficheSynthese || {})
        },
        extraPages: fromContent.extraPages || [],
        pageOrientations: fromContent.pageOrientations || {}
      };
    }

    return buildDefaultFicheData(sheet);
  },

  saveFiche: async (data: FicheData, folderId?: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) throw new Error('User not logged in');

    const sheetPayload = {
      title: data.titre,
      user_id: user.id,
      description: data.enTete.theme || null,
      subject: data.enTete.matiere || 'Sans matière',
      class_level: data.enTete.classe || null,
      duration: data.enTete.temps || null,
      content: data,
      tags: [],
      updated_at: new Date().toISOString()
    };

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isNew = !data.id || !uuidRegex.test(data.id);

    if (isNew) {
      const { data: newSheet, error: createError } = await supabase
        .from('pedagogical_sheets')
        .insert(sheetPayload)
        .select()
        .single();

      if (createError) {
        console.error('Error creating fiche:', createError);
        throw createError;
      }

      return newSheet.id;
    }

    const { error: updateError } = await supabase
      .from('pedagogical_sheets')
      .update(sheetPayload)
      .eq('id', data.id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating fiche:', updateError);
      throw updateError;
    }

    return data.id;
  },

  deleteFiche: async (id: string) => {
    const { error } = await supabase.from('pedagogical_sheets').delete().eq('id', id);
    if (error) console.error('Error deleting fiche:', error);
  },

  getFolders: async (): Promise<Folder[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await withTimeout(
      supabase.from('folders').select('*').eq('user_id', user.id).order('name'),
      'Le chargement des dossiers a expiré.'
    );

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    return (data || []).map((f: any) => ({ id: f.id, name: f.name }));
  },

  saveFolder: async (folder: Folder) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not logged in');

    const isNew = !folder.id || folder.id.length < 10;
    if (isNew) {
      await supabase.from('folders').insert({ name: folder.name, user_id: user.id });
    } else {
      await supabase.from('folders').update({ name: folder.name }).eq('id', folder.id);
    }
  },

  deleteFolder: async (id: string) => {
    await supabase.from('folders').delete().eq('id', id);
  },

  moveFicheToFolder: async () => {
    console.warn('moveFicheToFolder: folders are not wired to pedagogical_sheets in the current schema.');
  },

  toggleFavorite: async () => {
    console.warn('toggleFavorite: favorites are not wired in the current schema.');
  }
};
