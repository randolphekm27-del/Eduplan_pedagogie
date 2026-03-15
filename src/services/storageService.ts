import { supabase } from './supabaseClient';
import { FicheData } from '../utils/documentTemplate';

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
  content?: FicheData; // Full content for compatibility
}

export interface Folder {
  id: string;
  name: string;
}

export const storageService = {
  getFiches: async (): Promise<Fiche[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('pedagogical_sheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fiches:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      subject: row.matiere,
      class: row.classe,
      date: new Date(row.updated_at).toLocaleDateString('fr-FR'),
      tags: row.tags || [],
      theme: row.theme,
      folderId: row.folder_id,
      isFavorite: row.is_favorite
    }));
  },

  getFicheById: async (id: string): Promise<FicheData | null> => {
    // This needs to fetch from all tables and reconstruct the FicheData object
    const { data: sheet, error: sheetError } = await supabase
      .from('pedagogical_sheets')
      .select('*')
      .eq('id', id)
      .single();

    if (sheetError || !sheet) return null;

    const [
      { data: sequences },
      { data: studentDoc },
      { data: syntheses },
      { data: evaluations },
      { data: extraPages }
    ] = await Promise.all([
      supabase.from('sheet_sequences').select('*').eq('sheet_id', id).order('order_index'),
      supabase.from('student_documents').select('*').eq('sheet_id', id).single(),
      supabase.from('sheet_syntheses').select('*').eq('sheet_id', id).single(),
      supabase.from('sheet_evaluations').select('*').eq('sheet_id', id).single(),
      supabase.from('extra_pages').select('*').eq('sheet_id', id).order('order_index')
    ]);

    const ficheData: FicheData = {
      id: sheet.id,
      titre: sheet.title,
      numeroFiche: sheet.sheet_number || '',
      enTete: {
        matiere: sheet.matiere || '',
        theme: sheet.theme || '',
        objectifGeneral: sheet.objectif_general || '',
        classe: sheet.classe || '',
        temps: sheet.temps || '',
        date: sheet.date || '',
      },
      miseEnSituation: {
        rappel: sheet.rappel || '',
        prerequis: sheet.prerequis || '',
        motivation: sheet.motivation || '',
      },
      sequences: (sequences || []).map(s => ({
        id: s.id,
        numero: s.sq || '',
        objectif: s.objectif_operationnel || '',
        taches: s.tache_eleve || '',
        organisations: s.organisation || '',
        savoirs: s.savoir_associe || '',
        materiel: s.materiel_didactique || '',
        duree: s.duree || '',
        observations: s.observation || '',
      })),
      syntheseLecon: sheet.synthese_collective || '',
      evaluationFormative: evaluations?.content || '',
      documentEleve: {
        activite: studentDoc?.activite || '',
        objectifGeneral: studentDoc?.objectif || '',
        consigne: studentDoc?.consigne || '',
        texte: studentDoc?.texte || '',
        support: studentDoc?.support || '',
        taches: studentDoc?.taches || '',
        strategie: {
          travailGroupe: studentDoc?.travail_groupe || '',
          pleniere: studentDoc?.pleniere || '',
        },
      },
      ficheSynthese: {
        point1: syntheses?.point1 || '',
        point2: syntheses?.point2 || '',
        point3: syntheses?.point3 || '',
      },
      extraPages: (extraPages || []).map(p => ({
        id: p.id,
        title: p.title || '',
        content: p.content || '',
      }))
    };

    return ficheData;
  },

  saveFiche: async (data: FicheData, folderId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    // 1. Save main sheet
    const sheetPayload = {
      title: data.titre,
      user_id: user.id,
      folder_id: folderId,
      sheet_number: data.numeroFiche,
      matiere: data.enTete.matiere,
      theme: data.enTete.theme,
      objectif_general: data.enTete.objectifGeneral,
      classe: data.enTete.classe,
      temps: data.enTete.temps,
      date: data.enTete.date,
      rappel: data.miseEnSituation.rappel,
      prerequis: data.miseEnSituation.prerequis,
      motivation: data.miseEnSituation.motivation,
      synthese_collective: data.syntheseLecon,
      updated_at: new Date().toISOString()
    };

    let sheetId = data.id;

    // Robust check for UUID. Valid UUID is 36 chars with hyphens.
    // Temporary IDs are often empty or start with 'temp-' or 'seq-' etc.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isNew = !sheetId || !uuidRegex.test(sheetId);

    if (isNew) {
      const { data: newSheet, error: createError } = await supabase
        .from('pedagogical_sheets')
        .insert(sheetPayload)
        .select()
        .single();
      if (createError) throw createError;
      sheetId = newSheet.id;
    } else {
      const { error: updateError } = await supabase
        .from('pedagogical_sheets')
        .update(sheetPayload)
        .eq('id', sheetId);
      if (updateError) throw updateError;
    }

    // 2. Save Séquences (Upsert or Delete/Re-insert)
    // We'll do Delete then re-insert for simplicity and data integrity in this context
    await supabase.from('sheet_sequences').delete().eq('sheet_id', sheetId);
    if (data.sequences.length > 0) {
      const sequencePayloads = data.sequences.map((s, index) => ({
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
      }));
      await supabase.from('sheet_sequences').insert(sequencePayloads);
    }

    // 3. Save Student Document
    await supabase.from('student_documents').upsert({
      sheet_id: sheetId,
      activite: data.documentEleve.activite,
      objectif: data.documentEleve.objectifGeneral,
      consigne: data.documentEleve.consigne,
      texte: data.documentEleve.texte,
      support: data.documentEleve.support,
      taches: data.documentEleve.taches,
      travail_groupe: data.documentEleve.strategie.travailGroupe,
      pleniere: data.documentEleve.strategie.pleniere
    }, { onConflict: 'sheet_id' });

    // 4. Save Synthesis
    await supabase.from('sheet_syntheses').upsert({
      sheet_id: sheetId,
      point1: data.ficheSynthese.point1,
      point2: data.ficheSynthese.point2,
      point3: data.ficheSynthese.point3
    }, { onConflict: 'sheet_id' });

    // 5. Save Evaluation
    await supabase.from('sheet_evaluations').upsert({
      sheet_id: sheetId,
      content: data.evaluationFormative
    }, { onConflict: 'sheet_id' });

    // 6. Save Extra Pages
    await supabase.from('extra_pages').delete().eq('sheet_id', sheetId);
    if (data.extraPages && data.extraPages.length > 0) {
      const extraPayloads = data.extraPages.map((p, index) => ({
        sheet_id: sheetId,
        title: p.title,
        content: p.content,
        order_index: index
      }));
      await supabase.from('extra_pages').insert(extraPayloads);
    }

    return sheetId;
  },

  deleteFiche: async (id: string) => {
    const { error } = await supabase.from('pedagogical_sheets').delete().eq('id', id);
    if (error) console.error('Error deleting fiche:', error);
  },

  getFolders: async (): Promise<Folder[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.from('folders').select('*').order('name');
    if (error) {
       console.error('Error fetching folders:', error);
       return [];
    }

    return data.map(f => ({ id: f.id, name: f.name }));
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
    await supabase.from('pedagogical_sheets').update({ folder_id: folderId }).eq('id', ficheId);
  },

  toggleFavorite: async (ficheId: string, isFavorite: boolean) => {
    await supabase.from('pedagogical_sheets').update({ is_favorite: isFavorite }).eq('id', ficheId);
  }
};
