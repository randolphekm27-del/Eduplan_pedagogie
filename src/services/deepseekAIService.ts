import OpenAI from 'openai';

const deepseekAPI = new OpenAI({
    apiKey: (import.meta as any).env.VITE_DEEPSEEK_API_KEY || (import.meta as any).env.DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        'User-Agent': 'Eduplan-App/1.0',
    },
});

/**
 * Interface pour la fiche pédagogique générée
 */
export interface TeachingSheet {
    titre: string;
    description: string;
    classe: string;
    matiere: string;
    objectifGeneral: string;
    preRequis: string[];
    materiel: string[];
    dureeTotale: string;
    sequences: {
        numero: string;
        objectif: string;
        taches: string;
        organisations: string[];
        savoirs: string;
        duree: string;
    }[];
}

/**
 * Interface pour le document élève
 */
export interface StudentDocument {
    title: string;
    miseEnSituation: {
        texte: string;
        contexte: string;
    };
    tache: {
        enonce: string;
        objectif: string;
    };
    supportPedagogique: {
        titre: string;
        contenu: string;
    };
    consignes: {
        consigne: string[];
    };
}

/**
 * Interface pour la fiche synthèse
 */
export interface SynthesisSheet {
    title: string;
    notionsPrincipales: string[];
    pointsCles: string[];
    ideesImportantes: string;
    resume: string;
}

/**
 * Interface pour l'évaluation formative
 */
export interface FormativeEvaluation {
    title: string;
    objectifEvaluation: string;
    questions: {
        numero: number;
        question: string;
        typeQuestion: string;
    }[];
    critereEvaluation: string[];
    corrige: {
        reponsesAttendues: string[];
    };
}

/**
 * Interface pour l'ensemble complet des contenus générés
 */
export interface CompleteEducationalContent {
    fichesPedagogique: TeachingSheet;
    documentEleve: StudentDocument;
    ficheSynthese: SynthesisSheet;
    evaluationFormative: FormativeEvaluation;
}

export const deepseekAIService = {
    /**
     * Génère de manière complète tous les contenus pédagogiques
     * Utilise Deepseek au lieu de Claude
     */
    generateCompletePedagogicalContent: async (
        prompt: string,
        subject?: string,
        grade?: string,
        duration?: string
    ): Promise<CompleteEducationalContent> => {
        const fullPrompt = `
Tu es un expert en ingénierie pédagogique pour l'enseignement technique et général.

Génère de manière COMPLÈTE ET COHÉRENTE tous les contenus pédagogiques suivants basés sur cette demande :
"${prompt}"
${subject ? `Matière: ${subject}` : ''}
${grade ? `Classe: ${grade}` : ''}
${duration ? `Durée: ${duration}` : ''}

⚠️ IMPORTANT: Tous les documents doivent être cohérents entre eux. La mise en situation doit aider à répondre à la tâche, les consignes doivent être liées au support, et la synthèse doit reprendre les éléments importants.

Génère et retourne un JSON valide STRICTEMENT respectant ce schéma :
{
  "fichesPedagogique": {
    "titre": "Titre de la leçon",
    "description": "Description courte et pertinente",
    "classe": "Niveau",
    "matiere": "Discipline",
    "objectifGeneral": "Objectif global",
    "preRequis": ["liste"],
    "materiel": ["liste"],
    "dureeTotale": "Durée totale",
    "sequences": [
      {
        "numero": "1",
        "objectif": "Objectif",
        "taches": "Tâches détaillées",
        "organisations": ["Classe entière"],
        "savoirs": "Savoirs associés",
        "duree": "Durée"
      }
    ]
  },
  "documentEleve": {
    "title": "Document élève",
    "miseEnSituation": {
      "texte": "Texte introductif (3-5 lignes)",
      "contexte": "Contexte général"
    },
    "tache": {
      "enonce": "Une SEULE phrase claire",
      "objectif": "Objectif concret"
    },
    "supportPedagogique": {
      "titre": "Titre du support",
      "contenu": "Support détaillé"
    },
    "consignes": {
      "consigne": ["Consigne 1", "Consigne 2", "Consigne 3"]
    }
  },
  "ficheSynthese": {
    "title": "Fiche synthèse",
    "notionsPrincipales": ["Notion 1"],
    "pointsCles": ["Point clé 1"],
    "ideesImportantes": "Paragraphe résumant",
    "resume": "Résumé complet"
  },
  "evaluationFormative": {
    "title": "Évaluation formative",
    "objectifEvaluation": "Objectif",
    "questions": [
      {
        "numero": 1,
        "question": "Question 1",
        "typeQuestion": "Type"
      }
    ],
    "critereEvaluation": ["Critère 1"],
    "corrige": {
      "reponsesAttendues": ["Réponse 1"]
    }
  }
}

Respecte strictement ce schéma JSON.`;

        try {
            const response = await deepseekAPI.chat.completions.create({
                model: 'deepseek-chat',
                max_tokens: 4000,
                messages: [
                    {
                        role: 'user',
                        content: fullPrompt,
                    },
                ],
            });

            // Extraire le texte de la réponse
            const responseText = response.choices[0]?.message?.content || '';

            // Parser le JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Aucun JSON trouvé dans la réponse');
            }

            const generatedContent: CompleteEducationalContent = JSON.parse(
                jsonMatch[0]
            );

            // Validation basique
            if (
                !generatedContent.fichesPedagogique ||
                !generatedContent.documentEleve ||
                !generatedContent.ficheSynthese ||
                !generatedContent.evaluationFormative
            ) {
                throw new Error('Structure JSON invalide');
            }

            return generatedContent;
        } catch (error) {
            console.error('Erreur génération Deepseek:', error);
            throw new Error('Erreur lors de la génération du contenu pédagogique');
        }
    },

    /**
     * Améliore ou reformule un texte pédagogique
     */
    refineEducationalText: async (
        text: string,
        instruction: string
    ): Promise<string> => {
        try {
            const response = await deepseekAPI.chat.completions.create({
                model: 'deepseek-chat',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `Texte original : "${text}"
Instruction : "${instruction}"

Améliore ce texte en restant professionnel et pédagogique.
Retourne UNIQUEMENT le texte amélioré.`,
                    },
                ],
            });

            return response.choices[0]?.message?.content || text;
        } catch (error) {
            console.error('Erreur amélioration texte Deepseek:', error);
            return text;
        }
    },

    /**
     * Génère des questions de synthèse
     */
    generateSynthesisQuestions: async (content: string): Promise<string[]> => {
        try {
            const response = await deepseekAPI.chat.completions.create({
                model: 'deepseek-chat',
                max_tokens: 1500,
                messages: [
                    {
                        role: 'user',
                        content: `Basé sur ce contenu pédagogique:
"${content}"

Génère 5 questions de synthèse pertinentes qui couvrent les points clés.
Retourne un JSON valide avec ce format:
{
  "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
}`,
                    },
                ],
            });

            const responseText = response.choices[0]?.message?.content || '{}';
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.questions || [];
            }

            return [];
        } catch (error) {
            console.error('Erreur génération questions Deepseek:', error);
            return [];
        }
    },

    /**
     * Analyse un document (texte) pour en extraire des informations pédagogiques
     * Note: Deepseek-chat ne supporte pas nativement les images. On traite le contenu comme du texte.
     */
    analyzeDocument: async (fileBase64: string, mimeType: string): Promise<any> => {
        try {
            const base64Data = fileBase64.split(',')[1] || fileBase64;
            let decodedText = "";

            try {
                decodedText = atob(base64Data);
            } catch (e) {
                decodedText = "[Contenu binaire ou format non supporté directement en texte]";
            }

            const response = await deepseekAPI.chat.completions.create({
                model: 'deepseek-chat',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `Analyse ce document pédagogique et extrais-en les informations clés pour créer une fiche structurée.
                        
                        Contenu du document :
                        ${decodedText}

                        Retourne UNIQUEMENT un JSON valide avec ce format :
                        {
                          "titre": "Titre détecté",
                          "subject": "Matière",
                          "class": "Niveau",
                          "theme": "Thème principal",
                          "objectifGeneral": "Objectif détecté",
                          "preRequis": ["liste des pré-requis"],
                          "sequences": [
                            {
                              "numero": "1",
                              "objectif": "Objectif",
                              "taches": "Description des tâches",
                              "organisations": ["Classe entière"],
                              "savoirs": "Savoirs associés",
                              "duree": "15 min"
                            }
                          ],
                          "materiel": ["liste du matériel"]
                        }`
                    }
                ],
            });

            const responseText = response.choices[0]?.message?.content || '{}';
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Impossible d'extraire le JSON de la réponse Deepseek");
        } catch (error) {
            console.error("Erreur analyse document Deepseek:", error);
            throw error;
        }
    }
};
