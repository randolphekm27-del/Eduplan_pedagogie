import { GoogleGenAI, Type } from "@google/genai";

// Initialisation de l'IA avec la clé d'API fournie par l'environnement
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.GEMINI_API_KEY || "" });

export interface GeneratedSheet {
  titre: string;
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

export const aiService = {
  /**
   * Génère une fiche pédagogique complète à partir d'un prompt utilisateur
   */
  generateSheet: async (prompt: string): Promise<GeneratedSheet> => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Tu es un expert en ingénierie pédagogique pour l'enseignement technique (Maintenance des Systèmes, Électrotechnique). 
      Génère une fiche pédagogique structurée et détaillée basée sur la demande suivante : "${prompt}".
      
      La réponse doit être un JSON valide respectant strictement ce schéma :
      {
        "titre": "Titre de la leçon",
        "classe": "Niveau (ex: Bac Pro MELEC, BTS MS)",
        "matiere": "Discipline",
        "objectifGeneral": "Objectif global de la séance",
        "preRequis": ["liste de pré-requis"],
        "materiel": ["liste du matériel nécessaire"],
        "dureeTotale": "Durée totale estimée",
        "sequences": [
          {
            "numero": "1",
            "objectif": "Objectif de la séquence",
            "taches": "Description des activités",
            "organisations": ["Classe entière", "Binômes", etc.],
            "savoirs": "Savoirs associés (S1, S2, etc.)",
            "duree": "Durée"
          }
        ]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titre: { type: Type.STRING },
            classe: { type: Type.STRING },
            matiere: { type: Type.STRING },
            objectifGeneral: { type: Type.STRING },
            preRequis: { type: Type.ARRAY, items: { type: Type.STRING } },
            materiel: { type: Type.ARRAY, items: { type: Type.STRING } },
            dureeTotale: { type: Type.STRING },
            sequences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  numero: { type: Type.STRING },
                  objectif: { type: Type.STRING },
                  taches: { type: Type.STRING },
                  organisations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  savoirs: { type: Type.STRING },
                  duree: { type: Type.STRING }
                },
                required: ["numero", "objectif", "taches", "organisations", "savoirs", "duree"]
              }
            }
          },
          required: ["titre", "classe", "matiere", "objectifGeneral", "preRequis", "materiel", "dureeTotale", "sequences"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Erreur de parsing JSON IA:", e);
      throw new Error("L'IA a généré un format invalide.");
    }
  },

  /**
   * Analyse un document (image ou texte) pour en extraire le contenu pédagogique
   */
  analyzeDocument: async (fileData: string, mimeType: string): Promise<Partial<GeneratedSheet>> => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            data: fileData.split(",")[1], // Enlever le préfixe data:image/...;base64,
            mimeType: mimeType
          }
        },
        {
          text: `Analyse ce document pédagogique technique et extrais-en les informations structurées pour créer une fiche.
          Retourne un JSON avec le titre, l'objectif général, les pré-requis, le matériel et si possible les séquences.`
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Erreur analyse document:", e);
      return {};
    }
  },

  /**
   * Améliore ou reformule un texte technique
   */
  refineText: async (text: string, instruction: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Texte original : "${text}"
      Instruction : "${instruction}"
      Améliore ce texte en restant professionnel et technique. Retourne uniquement le texte amélioré.`
    });

    return response.text || text;
  }
};
