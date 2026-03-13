# 🚀 Guide Démarrage Rapide - Claude AI pour Contenus Pédagogiques

## 📋 Avant de Commencer

### 1. Installer npm (si pas still fait)
```bash
cd "d:\VSCODE EDUPLAN\Eduplan_pedagogie"
npm install
```

### 2. Créer le fichier .env
À la racine du projet, créez un fichier `.env` (copier depuis `.env.example`) :
```
CLAUDE_API_KEY=sk-ant-<copiez-votre-clé-ici>
```

**Où obtenir votre clé Claude ?**
- Allez sur https://console.anthropic.com
- Créez un compte ou connectez-vous
- Générez une nouvelle clé API
- Copiez-la et collez-la dans le `.env`

### 3. Démarrer l'application
```bash
npm run dev
```

Ouvrez `http://localhost:3000` dans votre navigateur.

---

## 🎯 Comment Générer une Fiche Complète

### Étape 1: Aller sur "Créer une fiche"
Depuis le tableau de bord → **"Créer"** → **"Laisser l'IA s'occuper"**

### Étape 2: Décrire votre cours
Décrivez votre cours **en langage naturel**. Par exemple :

```
Créer une fiche pédagogique sur la Photosynthèse pour une classe de 3ème
de niveau collège. La séance dure 2 heures. Les apprenants doivent
comprendre le processus de photosynthèse, les réactifs et les produits,
et pouvoir expliquer le rôle des différentes pigments. Je veux des
expériences simples et une évaluation formative.
```

### Étape 3: Ajtoutez contexte (optionnel)
- **Matière** : Sélectionnez (ex: SVT)
- **Classe** : Sélectionnez (ex: Collège)
- **Durée** : Entrez (ex: 2H)

### Étape 4: Cliquez "Générer la fiche"
Claude génère **COMPLÈTEMENT** :
- ✅ Fiche pédagogique (avec séquences)
- ✅ Document élève (mise en situation, tâche, support, consignes)
- ✅ Fiche synthèse (notions clés)
- ✅ Évaluation formative (questions + réponses)

---

## 📖 Comprendre les Contenus Générés

### 1️⃣ FICHE PÉDAGOGIQUE
L'outil du professeur. Contient :
- Objectifs pédagogiques
- Durée estimée
- Matériel nécessaire
- Séquences d'enseignement
- Savoirs associés

### 2️⃣ DOCUMENT ÉLÈVE
À donner aux apprenants. Contient :

**a) Mise en situation**
- Contexte introductif
- Texte qui suscite l'intérêt
- Informations utiles pour répondre à la tâche

**b) Tâche (une phrase)**
- Ce que l'apprenant doit accomplir
- Clair et précis

**c) Support pédagogique**
- Documents, textes, données
- Tout ce dont l'apprenant a besoin
- Directement accessible

**d) Consignes**
- Étapes à suivre
- Ce qu'il faut analyser
- Ce qu'il faut produire

### 3️⃣ FICHE SYNTHÈSE
Le résumé du cours. Contient :
- Notions principales (concepts clés)
- Points à retenir (essentiels)
- Idées importantes (synthèse)
- Résumé complet

### 4️⃣ ÉVALUATION FORMATIVE
Pour vérifier la compréhension. Contient :
- Objectif de l'évaluation
- Questions variées
- Critères d'évaluation
- Réponses attendues / Corrigé

---

## ✏️ Éditer les Documents Générés

### Pour modifier un contenu :
1. Cliquez sur la section dans le sommaire à gauche
2. Le contenu s'affiche dans l'éditeur central
3. **Cliquez et modifiez** directement
4. Cliquez **"SAUVEGARDER"** en haut à droit

### Pour ajouter une nouvelle section :
1. Allez à la fin de la fiche
2. Cliquez **"AJOUTER SECTION"**
3. Donnez un titre
4. Remplissez le contenu
5. **Sauvegardez**

---

## 📊 Exemples de Prompts Efficaces

### Exemple 1 - Sciences
```
Créer une fiche sur la Respiration Cellulaire pour Terminale S.
La leçon dure 3 heures. Les étudiants doivent comprendre :
- Les étapes de la glycolyse
- Le cycle de Krebs
- La chaîne de transport d'électrons
Je veux des schémas et une étude de cas avec des données réelles.
```

### Exemple 2 - Français
```
Fiche pédagogique sur "Le Petit Prince" (chapitres 1-5) pour une classe de 5ème.
2 heures. Objectifs : analyse des personnages, compréhension du message allégorique,
rédaction d'un résumé. Incluez des activités de groupe et une évaluation écrite.
```

### Exemple 3 - Mathématiques
```
Créer une séquence sur les Équations du Second Degré pour Bac Pro.
1 heure 30 minutes. Les apprenants doivent :
- Résoudre des équations par factorisation
- Utiliser la formule quadratique
- Interpréter graphiquement
Je veux des exercices pratiques et une évaluation incluant problèmes concrets.
```

---

## 💡 Conseils pour de Meilleurs Résultats

✅ **À faire :**
- Soyez précis sur le niveau d'études
- Mentionnez le nombre d'heures
- Décrivez les objectifs pédagogiques
- Proposez des types d'activités
- Spécifiez si vous voulez des évaluations

❌ **À éviter :**
- Descriptions trop vagues
- Pas de contexte de niveau
- Pas d'objectifs clairs
- Demandes trop vastes

---

## 🎓 Cas d'Usages Courants

### Pour un cours magistral
```
Créer une fiche pour un cours théorique sur... [sujet]
Durée: [temps]
Public: [niveau]
Objectif général: Comprendre et expliquer les concepts clés
Incluez: définitions, explications, schémas, exemples
```

### Pour une activité pratique
```
Créer une fiche pour un TP sur... [sujet]
Durée: [temps]
Public: [niveau]
Objectif: [ce que les apprenants feront]
Matériel: [ce dont vous disposez]
Include: procédure, observations attendues, analyse
```

### Pour une évaluation
```
Créer une fiche d'évaluation pour tester la compréhension de... [sujet]
Niveau: [classe/cycle]
Points clés à évaluer:
- [point 1]
- [point 2]
- [point 3]
Incluez: questions variées, critères clairs, barème
```

---

## 🔄 Flux Complet : De l'Idée à la Fiche Utilisable

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Vous avez une idée de cours                                   │
│    (exemple: "Enseigner la Révolution Française")                │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. Vous écrivez un prompt détaillé dans l'interface              │
│    (environ 3-5 phrases avec contexte)                           │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Claude génère COMPLÈTEMENT en quelques secondes :             │
│    - Fiche pédagogique professionnelle                           │
│    - Document élève prêt à imprimer                              │
│    - Synthèse complète du cours                                  │
│    - Questions d'évaluation avec réponses                        │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Vous éditez/personnalisez dans l'interface                    │
│    (ajouter exemples locaux, adapter au contexte)                │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Vous sauvegardez et exportez                                  │
│    (PDF, Word, ou utilisez directement en classe)                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🆘 Dépannage

### Erreur "Clé API invalide"
- Vérifiez que vous avez créé un fichier `.env`
- Vérifiez que la clé commence par `sk-ant-`
- Redémarrez l'application (`npm run dev`)

### Les documents ne s'affichent pas
- Vérifiez votre connexion internet
- Vérifiez la clé API
- Essayez un prompt plus court et clair

### L'IA prend trop de temps
- C'est normal, cela peut prendre 10-30 secondes
- Attendez l'apparition du toast "Fiche générée"

### La mise en page ne correspond pas
- Cliquez sur les sections du sommaire pour naviguer
- Utilisez l'éditeur riche pour ajouter du formatage

---

## 🚀 Optimisations Avancées

### Générer plusieurs fiches
Vous pouvez maintenant générer plusieurs fiches sur des sujets différents
et les organiser dans des dossiers virtuit.

### Réutiliser et modifier
Chaque fiche générée peut être modifiée et réutilisée pour les années suivantes.

### Assistant IA intégré
L'icône "Assistant IA" (🧠) en haut droit vous permet :
- D'améliorer la rédaction
- De simplifier le contenu
- De générer des questions supplémentaires

---

## 📞 Aide et Support

- **Bloc**: Consultez la documentation du projet
- **Questions sur Claude**: https://docs.anthropic.com
- **Feedback**: Utilisez le bouton feedback dans l'application

---

**Bon courage pour vos créations pédagogiques ! 🎓**

Vous avez maintenant un outil puissant pour générer des contenus complets, cohérents
et pédagogiquement solides en quelques secondes.

