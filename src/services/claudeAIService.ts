import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY || "",
    dangerouslyAllowBrowser: true,
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

export const claudeAIService = {
    /**
     * Génère de manière complète tous les contenus pédagogiques en une seule requête
     * Assure la cohérence pédagogique entre tous les documents
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
    ${subject ? `Matière: ${subject}` : ""}
    ${grade ? `Classe: ${grade}` : ""}
    ${duration ? `Durée: ${duration}` : ""}
    
    ⚠️ IMPORTANT: Tous les documents doivent être cohérents entre eux. La mise en situation doit aider à répondre à la tâche, les consignes doivent être liées au support, et la synthèse doit reprendre les éléments importants.
    
    Génère et retourne un JSON valide STRICTEMENT respectant ce schéma :
    {
      "fichesPedagogique": {
        "titre": "Titre de la leçon",
        "description": "Description courte et pertinente de la leçon",
        "classe": "Niveau (ex: Bac Pro MELEC, 4ème)",
        "matiere": "Discipline",
        "objectifGeneral": "Objectif global de la séance",
        "preRequis": ["liste des pré-requis"],
        "materiel": ["liste du matériel nécessaire"],
        "dureeTotale": "Durée totale estimée (ex: 2H)",
        "sequences": [
          {
            "numero": "1",
            "objectif": "Objectif de la séquence",
            "taches": "Description détaillée des activités et tâches",
            "organisations": ["Classe entière", "Binômes", etc.],
            "savoirs": "Savoirs associés (S1, S2, etc.) ou compétences visées",
            "duree": "Durée de la séquence (ex: 45 min)"
          }
        ]
      },
      "documentEleve": {
        "title": "Document élève",
        "miseEnSituation": {
          "texte": "Texte introductif permettant d'introduire le thème de la leçon (3-5 lignes). Doit contextualiser le sujet, susciter l'intérêt et contenir des informations utiles pour répondre à la tâche.",
          "contexte": "Contexte général de la mise en situation"
        },
        "tache": {
          "enonce": "Une tâche claire et UNIQUE formulée en une seule phrase indiquant clairement ce que les apprenants doivent accomplir",
          "objectif": "L'objectif concret de l'activité"
        },
        "supportPedagogique": {
          "titre": "Titre du support",
          "contenu": "Support pédagogique complet (texte, données, situation, contenu) permettant aux apprenants de travailler sur la tâche. Doit être suffisamment détaillé et pertinent."
        },
        "consignes": {
          "consigne": [
            "Consigne 1: Ce que les apprenants doivent analyser",
            "Consigne 2: Ce qu'ils doivent produire",
            "Consigne 3: Comment répondre à la tâche (étapes, format, etc.)"
          ]
        }
      },
      "ficheSynthese": {
        "title": "Fiche synthèse",
        "notionsPrincipales": ["Notion 1", "Notion 2", "Notion 3"],
        "pointsCles": ["Point clé 1", "Point clé 2", "Point clé 3"],
        "ideesImportantes": "Paragraphe résumant les idées importantes du cours (3-5 lignes)",
        "resume": "Résumé complet et structuré des éléments essentiels du thème étudié"
      },
      "evaluationFormative": {
        "title": "Évaluation formative",
        "objectifEvaluation": "Objectif global de l'évaluation formative",
        "questions": [
          {
            "numero": 1,
            "question": "Question 1 claire et pertinente relative au contenu pédagogique",
            "typeQuestion": "Type (QCM, Vrai/Faux, Réponse courte, Développement, etc.)"
          },
          {
            "numero": 2,
            "question": "Question 2",
            "typeQuestion": "Type de question"
          },
          {
            "numero": 3,
            "question": "Question 3",
            "typeQuestion": "Type de question"
          }
        ],
        "critereEvaluation": [
          "Critère 1 d'évaluation",
          "Critère 2 d'évaluation",
          "Critère 3 d'évaluation"
        ],
        "corrige": {
          "reponsesAttendues": [
            "Réponse attendue à la question 1",
            "Réponse attendue à la question 2",
            "Réponse attendue à la question 3"
          ]
        }
      }
    }
    
    Respecte strictement ce schéma JSON. Assure-toi que :
    1. Les contenus sont pédagogiquement cohérents
    2. Le document élève est prêt à être utilisé directement
    3. La synthèse reprend les éléments clés des autres documents
    4. L'évaluation teste les compétences visées
    5. Tous les textes sont en français impeccable
    6. Les durées et niveaux sont réalistes
    `;

        try {
            const response = await client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4000,
                messages: [
                    {
                        role: "user",
                        content: fullPrompt,
                    },
                ],
            });

            // Extraire le texte de la réponse
            const responseText =
                response.content[0].type === "text" ? response.content[0].text : "";

            // Parser le JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Aucun JSON trouvé dans la réponse");
            }

            const generatedContent: CompleteEducationalContent = JSON.parse(
                jsonMatch[0]
            );

            // Validation basique de la structure
            if (
                !generatedContent.fichesPedagogique ||
                !generatedContent.documentEleve ||
                !generatedContent.ficheSynthese ||
                !generatedContent.evaluationFormative
            ) {
                throw new Error("Structure JSON invalide");
            }

            return generatedContent;
        } catch (error) {
            console.error("Erreur génération contenu pédagogique:", error);
            throw new Error(
                "Erreur lors de la génération du contenu pédagogique par Claude"
            );
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
            const response = await client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 2000,
                messages: [
                    {
                        role: "user",
                        content: `Texte original : "${text}"
            Instruction : "${instruction}"
            
            Améliore ce texte en restant professionnel et pédagogique. 
            Retourne UNIQUEMENT le texte amélioré, sans explications supplémentaires.`,
                    },
                ],
            });

            return response.content[0].type === "text" ? response.content[0].text : text;
        } catch (error) {
            console.error("Erreur amélioration texte:", error);
            return text;
        }
    },

    /**
     * Génère des questions de synthèse basées sur le contenu
     */
    generateSynthesisQuestions: async (content: string): Promise<string[]> => {
        try {
            const response = await client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1500,
                messages: [
                    {
                        role: "user",
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

            const responseText =
                response.content[0].type === "text" ? response.content[0].text : "{}";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.questions || [];
            }

            return [];
        } catch (error) {
            console.error("Erreur génération questions:", error);
            return [];
        }
    },

    /**
     * Analyse un document (image ou texte) pour en extraire des informations pédagogiques
     */
    analyzeDocument: async (fileBase64: string, mimeType: string): Promise<any> => {
        try {
            const isImage = mimeType.startsWith('image/');
            const base64Data = fileBase64.split(',')[1] || fileBase64;

            const content: any[] = [
                {
                    type: "text",
                    text: `Analyse ce document pédagogique et extrais-en les informations clés pour créer une fiche structurée.
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
            ];

            if (isImage) {
                content.push({
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: mimeType as any,
                        data: base64Data
                    }
                });
            } else {
                // Pour le texte, on décode le base64 si possible ou on traite comme texte
                try {
                    const decodedText = atob(base64Data);
                    content[0].text += `\n\nContenu du document :\n${decodedText}`;
                } catch (e) {
                    content[0].text += `\n\n[Document binaire ou format non supporté directement en texte]`;
                }
            }

            const response = await client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 2000,
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ],
            });

            const responseText = response.content[0].type === "text" ? response.content[0].text : "{}";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Impossible d'extraire le JSON de la réponse Claude");
        } catch (error) {
            console.error("Erreur analyse document Claude:", error);
            throw error;
        }
    }
};
