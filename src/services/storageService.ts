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
    numeroFiche: sheet.sheet_number || '',
    enTete: {
      matiere: sheet.matiere || '',
      theme: sheet.theme || '',
      objectifGeneral: sheet.objectif_general || '',
      classe: sheet.classe || '',
      temps: sheet.temps || '',
      date: sheet.date || ''
    },
    miseEnSituation: {
      rappel: sheet.rappel || '',
      prerequis: sheet.prerequis || '',
      motivation: sheet.motivation || ''
    },
    sequences: [],
    syntheseLecon: sheet.synthese_collective || '',
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
      subject: row.matiere || '',
      class: row.classe || '',
      date: new Date(row.updated_at).toLocaleDateString('fr-FR'),
      tags: row.tags || [],
      theme: row.theme || '',
      folderId: row.folder_id || undefined,
      isFavorite: row.is_favorite || false
    }));
  },

  getFicheById: async (id: string): Promise<FicheData | null> => {
    // 1. Fetch main sheet data
    const { data: sheet, error: sheetError } = await supabase
      .from('pedagogical_sheets')
      .select('*')
      .eq('id', id)
      .single();

    if (sheetError || !sheet) {
      console.error('Error fetching fiche by id:', sheetError);
      return null;
    }

    // 2. Fetch all related data in parallel
    const [
      { data: sequences },
      { data: studentDoc },
      { data: synthesis },
      { data: evaluation },
      { data: extraPages }
    ] = await Promise.all([
      supabase.from('sheet_sequences').select('*').eq('sheet_id', id).order('order_index'),
      supabase.from('student_documents').select('*').eq('sheet_id', id).single(),
      supabase.from('sheet_syntheses').select('*').eq('sheet_id', id).single(),
      supabase.from('sheet_evaluations').select('*').eq('sheet_id', id).single(),
      supabase.from('extra_pages').select('*').eq('sheet_id', id).order('order_index')
    ]);

    // 3. Reconstruct FicheData
    const fallback = buildDefaultFicheData(sheet);
    
    return {
      ...fallback,
      id: sheet.id,
      titre: sheet.title,
      numeroFiche: sheet.sheet_number || '',
      enTete: {
        matiere: sheet.matiere || '',
        theme: sheet.theme || '',
        objectifGeneral: sheet.objectif_general || '',
        classe: sheet.classe || '',
        temps: sheet.temps || '',
        date: sheet.date || ''
      },
      miseEnSituation: {
        rappel: sheet.rappel || '',
        prerequis: sheet.prerequis || '',
        motivation: sheet.motivation || ''
      },
      syntheseLecon: sheet.synthese_collective || '',
      sequences: (sequences || []).map(s => ({
        id: s.id,
        numero: s.sq || '',
        objectif: s.objectif_operationnel || '',
        taches: s.tache_eleve || '',
        organisations: s.organisation || '',
        savoirs: s.savoir_associe || '',
        materiel: s.materiel_didactique || '',
        duree: s.duree || '',
        observations: s.observation || ''
      })),
      documentEleve: studentDoc ? {
        activite: studentDoc.activite || '',
        objectifGeneral: studentDoc.objectif || '',
        consigne: studentDoc.consigne || '',
        texte: studentDoc.texte || '',
        support: studentDoc.support || '',
        taches: studentDoc.taches || '',
        strategie: {
          travailGroupe: studentDoc.travail_groupe || '',
          pleniere: studentDoc.pleniere || ''
        }
      } : fallback.documentEleve,
      ficheSynthese: synthesis ? {
        point1: synthesis.point1 || '',
        point2: synthesis.point2 || '',
        point3: synthesis.point3 || ''
      } : fallback.ficheSynthese,
      evaluationFormative: evaluation?.content || '',
      extraPages: (extraPages || []).map(p => ({
        id: p.id,
        title: p.title || '',
        content: p.content || ''
      }))
    };
  },

  saveFiche: async (data: FicheData, folderId?: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) throw new Error('User not logged in');

    const sheetPayload = {
      user_id: user.id,
      folder_id: (data as any).folder_id || folderId || null,
      title: data.titre,
      sheet_number: data.numeroFiche || null,
      matiere: data.enTete.matiere || null,
      classe: data.enTete.classe || null,
      theme: data.enTete.theme || null,
      temps: data.enTete.temps || null,
      date: data.enTete.date || null,
      objectif_general: data.enTete.objectifGeneral || null,
      rappel: data.miseEnSituation.rappel || null,
      prerequis: data.miseEnSituation.prerequis || null,
      motivation: data.miseEnSituation.motivation || null,
      synthese_collective: data.syntheseLecon || null,
      tags: [],
      updated_at: new Date().toISOString()
    };

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isNew = !data.id || !uuidRegex.test(data.id);

    let sheetId = data.id;

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
      sheetId = newSheet.id;
    } else {
      const { error: updateError } = await supabase
        .from('pedagogical_sheets')
        .update(sheetPayload)
        .eq('id', data.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating fiche:', updateError);
        throw updateError;
      }

      // Cleanup child tables for a clean update
      await Promise.all([
        supabase.from('sheet_sequences').delete().eq('sheet_id', sheetId),
        supabase.from('student_documents').delete().eq('sheet_id', sheetId),
        supabase.from('sheet_syntheses').delete().eq('sheet_id', sheetId),
        supabase.from('sheet_evaluations').delete().eq('sheet_id', sheetId),
        supabase.from('extra_pages').delete().eq('sheet_id', sheetId)
      ]);
    }

    // Save sub-components
    const subPromises = [];

    if (data.sequences && data.sequences.length > 0) {
      subPromises.push(supabase.from('sheet_sequences').insert(
        data.sequences.map((s, index) => ({
          sheet_id: sheetId,
          sq: s.numero,
          objectif_operationnel: s.objectif,
          tache_eleve: s.taches,
          organisation: s.organisations,
          savoir_associe: s.savoirs,
          materiel_didactique: s.materiel,
          duree: s.duree,
          observation: s.observations,
          order_index: index
        }))
      ));
    }

    if (data.documentEleve) {
      subPromises.push(supabase.from('student_documents').insert({
        sheet_id: sheetId,
        activite: data.documentEleve.activite,
        objectif: data.documentEleve.objectifGeneral,
        consigne: data.documentEleve.consigne,
        texte: data.documentEleve.texte,
        support: data.documentEleve.support,
        taches: data.documentEleve.taches,
        travail_groupe: data.documentEleve.strategie.travailGroupe,
        pleniere: data.documentEleve.strategie.pleniere
      }));
    }

    if (data.ficheSynthese) {
      subPromises.push(supabase.from('sheet_syntheses').insert({
        sheet_id: sheetId,
        point1: data.ficheSynthese.point1,
        point2: data.ficheSynthese.point2,
        point3: data.ficheSynthese.point3
      }));
    }

    if (data.evaluationFormative) {
      subPromises.push(supabase.from('sheet_evaluations').insert({
        sheet_id: sheetId,
        content: data.evaluationFormative
      }));
    }

    if (data.extraPages && data.extraPages.length > 0) {
      subPromises.push(supabase.from('extra_pages').insert(
        data.extraPages.map((p, index) => ({
          sheet_id: sheetId,
          title: p.title,
          content: p.content,
          order_index: index
        }))
      ));
    }

    await Promise.all(subPromises);
    return sheetId;
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

  moveFicheToFolder: async (ficheId: string, folderId: string | null) => {
    const { error } = await supabase
      .from('pedagogical_sheets')
      .update({ folder_id: folderId })
      .eq('id', ficheId);
    
    if (error) {
      console.error('Error moving fiche to folder:', error);
      throw error;
    }
  },

  toggleFavorite: async (ficheId: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('pedagogical_sheets')
      .update({ is_favorite: isFavorite })
      .eq('id', ficheId);
    
    if (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
};
