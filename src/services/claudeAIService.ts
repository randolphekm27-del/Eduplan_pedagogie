import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: (import.meta as any).env.CLAUDE_API_KEY || "",
    dangerouslyAllowBrowser: true,
});

/**
 * Interface pour l'ensemble complet des contenus générés (aligné sur FicheData)
 */
export interface CompleteEducationalContent {
    titre: string;
    numeroFiche: string;
    enTete: {
        matiere: string;
        classe: string;
        theme: string;
        temps: string;
        objectifGeneral: string;
        date: string;
    };
    miseEnSituation: {
        rappel: string;
        prerequis: string;
        motivation: string;
    };
    sequences: {
        id: string;
        numero: string;
        objectif: string;
        taches: string;
        organisations: string;
        savoirs: string;
        materiel: string;
        duree: string;
    }[];
    syntheseLecon: string;
    evaluationFormative: string;
    documentEleve: {
        activite: string;
        objectifGeneral: string;
        consigne: string;
        texte: string;
        support: string;
        taches: string;
        strategie: {
            travailGroupe: string;
            pleniere: string;
        };
    };
    ficheSynthese: {
        point1: string;
        point2: string;
        point3: string;
    };
}

export const claudeAIService = {
    /**
     * Génère de manière complète tous les contenus pédagogiques en une seule requête
     * Assure la cohérence pédagogique entre tous les documents selon le modèle 3-pages
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
    
    ⚠️ IMPORTANT: Tu dois produire un document organisé en 3 PAGES DISTINCTES :
    Page 1: Fiche Pédagogique (En-tête, Mise en situation, Séquences, Synthèse & Évaluation)
    Page 2: Document Élève (Activités, Textes, Supports, Tâches)
    Page 3: Fiche de Synthèse (Points clés sous forme de 3 zones distinctes)

    Génère et retourne un JSON valide STRICTEMENT respectant ce schéma :
    {
      "titre": "Titre de la leçon",
      "numeroFiche": "CP-001",
      "enTete": {
        "matiere": "Discipline",
        "classe": "Niveau (ex: Bac Pro MELEC, 4ème)",
        "theme": "Thème du cours",
        "temps": "Durée (ex: 1H)",
        "objectifGeneral": "Ce que l'élève sera capable de faire",
        "date": "${new Date().toLocaleDateString('fr-FR')}"
      },
      "miseEnSituation": {
        "rappel": "Rappel du cours précédent",
        "prerequis": "Liste des pré-requis nécessaires",
        "motivation": "Pourquoi cette leçon est importante"
      },
      "sequences": [
        {
          "id": "seq-1",
          "numero": "1",
          "objectif": "Objectif opérationnel",
          "taches": "Activités et tâches des élèves",
          "organisations": "TI, TG, ou Plénière",
          "savoirs": "Savoirs associés",
          "materiel": "Outils ou documents nécessaires",
          "duree": "15 min"
        }
      ],
      "syntheseLecon": "Résumé structuré pour le professeur",
      "evaluationFormative": "Questions et critères d'évaluation",
      "documentEleve": {
        "activite": "Titre de l'activité élève",
        "objectifGeneral": "Objectif pour l'élève",
        "consigne": "Consigne globale de travail",
        "texte": "Texte de mise en situation ou corpus",
        "support": "Données techniques ou ressources",
        "taches": "Liste des tâches à accomplir (une par ligne)",
        "strategie": {
          "travailGroupe": "Format du travail en groupe",
          "pleniere": "Format de la restitution"
        }
      },
      "ficheSynthese": {
        "point1": "Premier grand point de synthèse (essentiel)",
        "point2": "Deuxième grand point de synthèse (méthode)",
        "point3": "Troisième grand point de synthèse (conclusion)"
      }
    }
    
    Respecte strictement ce schéma JSON. Assure-toi que :
    1. Les contenus sont pédagogiquement cohérents entre les 3 pages.
    2. Le langage est professionnel et adapté au niveau ${grade || 'indiqué'}.
    3. Toutes les propriétés sont remplies avec du contenu de haute qualité.
    4. Les tâches dans 'documentEleve.taches' sont séparées par des retours à la ligne.
    5. 'sequences' doit contenir au moins 3 à 5 étapes logiques.
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

            const responseText = response.content[0].type === "text" ? response.content[0].text : "";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Aucun JSON trouvé");

            const generatedContent = JSON.parse(jsonMatch[0]);
            
            // Post-processing: inject unique IDs for sequences if needed
            if (generatedContent.sequences) {
                generatedContent.sequences = generatedContent.sequences.map((s: any, i: number) => ({
                    ...s,
                    id: s.id || `seq-${Date.now()}-${i}`
                }));
            }

            return generatedContent;
        } catch (error) {
            console.error("Erreur génération AI:", error);
            throw new Error("Erreur lors de la génération du contenu pédagogique par Claude");
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
                          "organisations": "Classe entière",
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
