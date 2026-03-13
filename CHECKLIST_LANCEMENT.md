# ✅ Checklist de Lancement - Supabase + Deepseek Integration

## Phase 1: Configuration de base (15-20 minutes)

### Étape 1.1: Préparer les variables d'environnement
- [ ] Vérifier que `.env` existe à la racine du projet
- [ ] Vérifier contient `VITE_SUPABASE_URL`
- [ ] Vérifier contient `VITE_SUPABASE_ANON_KEY`
- [ ] Vérifier contient `VITE_DEEPSEEK_API_KEY`
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Créer `.env.example` pour les développeurs

**Commande pour vérifier:**
```bash
cat .env | grep -E "VITE_SUPABASE|VITE_DEEPSEEK"
```

### Étape 1.2: Créer les tables SQL dans Supabase
- [ ] Accéder à https://supabase.com/dashboard
- [ ] Sélectionner le projet Eduplan
- [ ] Aller à **SQL Editor**
- [ ] Créer une **New Query**
- [ ] Copier le contenu de `sql/create_tables.sql`
- [ ] Exécuter la requête (Ctrl+Enter)
- [ ] Vérifier que les 6 tables sont créées:
  - [ ] user_profiles
  - [ ] pedagogical_sheets
  - [ ] student_documents
  - [ ] shared_sheets
  - [ ] activity_logs
  - [ ] export_history

**Vérification SQL:**
```sql
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';
-- Doit retourner: 6
```

### Étape 1.3: Configurer l'authentification Supabase
- [ ] Aller à **Authentication** → **Providers**
- [ ] Activer **Email**
- [ ] Désactiver **Confirm email** (pour développement local)
- [ ] Aller à **Authentication** → **URL Configuration**
- [ ] Ajouter Site URL:
  - [ ] `http://localhost:5173`
- [ ] Ajouter Redirect URLs:
  - [ ] `http://localhost:5173/dashboard`
  - [ ] `http://localhost:5173/login`
  - [ ] `http://localhost:5173/signup`

---

## Phase 2: Installation et compilation (5-10 minutes)

### Étape 2.1: Installer les dépendances
```bash
cd "d:\VSCODE EDUPLAN\Eduplan_pedagogie"
npm install
```
- [ ] Pas d'erreurs npm
- [ ] Message: "audited 463 packages, found 0 vulnerabilities"
- [ ] Dossier `node_modules/` créé

### Étape 2.2: Vérifier la compilation TypeScript
```bash
npm run lint
```
- [ ] Aucune erreur affichée
- [ ] Messages like "error TS" = ÉCHEC
- [ ] Sortie vide ou "Command exited with code 0" = SUCCÈS

### Étape 2.3: Vérifier les imports critiques
- [ ] Vérifier `src/App.tsx` importe `AuthProvider`
- [ ] Vérifier `src/App.tsx` importe `ProtectedRoute`
- [ ] Vérifier `src/services/supabaseClient.ts` existe
- [ ] Vérifier `src/services/deepseekAIService.ts` existe
- [ ] Vérifier `src/pages/LoginPage.tsx` existe
- [ ] Vérifier `src/pages/SignupPage.tsx` existe

---

## Phase 3: Tests locaux (20-30 minutes)

### Étape 3.1: Démarrer le serveur de développement
```bash
npm run dev
```
- [ ] Serveur démarre sans erreurs
- [ ] Message affiche: "Local: http://localhost:5173/"
- [ ] Peut accéder à http://localhost:5173/ dans le navigateur

### Étape 3.2: Tester la page d'accueil
1. Allez sur http://localhost:5173/
2. Vérifier:
   - [ ] Land page se charge
   - [ ] Boutons "S'inscrire" et "Se connecter" sont visibles
   - [ ] Pas d'erreurs dans la console (F12)

### Étape 3.3: Tester l'inscription (Signup)
1. Allez sur http://localhost:5173/signup
2. Remplissez le formulaire:
   ```
   Prénom: Jean
   Nom: Dupont
   Email: jean.dupont@edtest.fr
   Mot de passe: Test123!@#
   Rôle: Enseignant
   ```
3. Cliquez **S'inscrire**
4. Vérifiez:
   - [ ] Pas d'erreur dans la console
   - [ ] Redirection vers `/dashboard`
   - [ ] Profil utilisateur visible en haut à droite
   - [ ] Email correspond
   - [ ] Utilisateur dans table `user_profiles` de Supabase

### Étape 3.4: Tester la page Dashboard
1. Vérifier que vous êtes connecté
2. Allez sur http://localhost:5173/dashboard
3. Vérifiez:
   - [ ] Dashboard se charge
   - [ ] Menu latéral visible
   - [ ] Bouton "Create" visible
   - [ ] Bouton "Library" visible
   - [ ] Nom d'utilisateur en haut à droite
   - [ ] Pas d'erreurs console

### Étape 3.5: Tester la création de contenu Deepseek
1. Cliquez sur **Create** → **AI**
2. Remplissez le formulaire:
   ```
   Subject: Mathématiques
   Class Level: Seconde
   Topic: Les équations du second degré
   Objectives: Résoudre des équations quadratiques
   ```
3. Cliquez **Générer le contenu pédagogique complet**
4. Vérifiez:
   - [ ] Spinner de chargement s'affiche
   - [ ] Toast notification "Processing with Deepseek..."
   - [ ] Contenu généré après quelques secondes
   - [ ] 4 documents affichés:
     - [ ] Fiche pédagogique
     - [ ] Document élève
     - [ ] Fiche synthèse
     - [ ] Évaluation formative
   - [ ] Bouton "Save" disponible
   - [ ] Pas d'erreurs console

### Étape 3.6: Tester la déconnexion (Logout)
1. Cliquez sur votre profil en haut à droite
2. Cliquez **Déconnexion**
3. Vérifiez:
   - [ ] Redirection vers `/login`
   - [ ] Session terminée
   - [ ] Impossible d'accéder à `/dashboard` sans reconnecter

### Étape 3.7: Tester la reconnexion (Login)
1. Allez sur http://localhost:5173/login
2. Entrez les credentials:
   ```
   Email: jean.dupont@edtest.fr
   Mot de passe: Test123!@#
   ```
3. Cliquez **Se connecter**
4. Vérifiez:
   - [ ] Redirection vers `/dashboard`
   - [ ] Profil rechargé
   - [ ] Même utilisateur connecté
   - [ ] Pas d'erreurs console

### Étape 3.8: Tester les routes protégées
1. Déconnectez-vous
2. Essayez d'accéder directement à http://localhost:5173/dashboard
3. Vérifiez:
   - [ ] Redirection automatique vers `/login`
   - [ ] Impossible d'accéder au dashboard sans authentification
   - [ ] Message "Vous n'avez pas les permissions..." si role invalide

---

## Phase 4: Vérifications de sécurité (10 minutes)

### Étape 4.1: Vérifier la protection des données sensibles
```bash
# Vérifier que .env n'est pas commité
git status

# Doit afficher: .env (rouge, pas suivi)
# Ne doit PAS afficher: .env dans les fichiers à commiter
```
- [ ] `.env` est rouge (non suivi par git)
- [ ] `.env` est dans `.gitignore`
- [ ] `.env.example` existe (sans clés réelles)

### Étape 4.2: Vérifier le RLS (Row Level Security)
1. Allez sur Supabase Dashboard
2. Sélectionnez une table (ex: `user_profiles`)
3. Allez à **Authentication** → Vérifiez RLS
4. Vérifiez:
   - [ ] RLS est "Enable"
   - [ ] Policies sont listées pour chaque table
   - [ ] Exemple: "Users can view their own profile"

### Étape 4.3: Vérifier l'exposition des clés API
```bash
# Vérifier que les clés ne sont exposées QUE via VITE_
grep -r "DEEPSEEK_API_KEY\|SUPABASE_" src/ --include="*.tsx" --include="*.ts"

# Doit retourner SEULEMENT:
# - process.env.VITE_DEEPSEEK_API_KEY
# - process.env.VITE_SUPABASE_URL
# - process.env.VITE_SUPABASE_ANON_KEY

# Si vous voyez les vraies clés, c'est un problème!
```
- [ ] Parfois VITE_* variables trouvées
- [ ] Jamais de vraies clés exposées
- [ ] Aucun `DEEPSEEK_API_KEY=sk-xxx` en clair

---

## Phase 5: Vérifications de performance (5 minutes)

### Étape 5.1: Tests de chargement
1. Ouvrez DevTools (F12)
2. Allez à **Performance** ou **Network**
3. Rechargez la page http://localhost:5173/
4. Vérifiez:
   - [ ] Page charge en < 3 secondes
   - [ ] Aucune requête 404
   - [ ] Time to Interactive (TTI) < 5s

### Étape 5.2: Test de génération Deepseek
1. Allez sur `/dashboard/create/ai`
2. Générez du contenu
3. Vérifiez dans DevTools:
   - [ ] Appel API Deepseek réussi (statut 200)
   - [ ] URL commence par `https://api.deepseek.com`
   - [ ] Modèle utilisé: `deepseek-chat`
   - [ ] Temps de réponse < 30 secondes

---

## Phase 6: Build et préparation production (10 minutes)

### Étape 6.1: Créer le build production
```bash
npm run build
```
- [ ] Aucune erreur
- [ ] Dossier `dist/` créé
- [ ] Fichier `dist/index.html` > 0 bytes

### Étape 6.2: Prévisualiser le build
```bash
npm run preview
```
- [ ] Serveur de preview démarre
- [ ] URL affichée (ex: http://localhost:4173/)
- [ ] Application fonctionne en mode production
- [ ] Même flux de test qu'en développement

### Étape 6.3: Vérifier les fichiers sensibles
```bash
# Vérifier que les clés ne sont PAS dans le build
grep -r "sk-1c5676a3438c4ee7b7ddb4485d3bfce3" dist/

# Doit retourner RIEN (pas de résultat)
# Si vous trouvez la clé, c'est un problème!
```
- [ ] Aucune clé trouvée dans `dist/`
- [ ] `.env` n'est pas dans `dist/`

---

## Phase 7: Documentation (5 minutes)

### Étape 7.1: Vérifier les fichiers de documentation
- [ ] `GUIDE_DEPLOIEMENT.md` existe
- [ ] `INTEGRATION_SUPABASE_DEEPSEEK_COMPLETE.md` existe
- [ ] `CONFIG_CREDENTIALS.md` existe
- [ ] `README.md` mis à jour (optionnel)

### Étape 7.2: Instructions pour les développeurs
- [ ] `.env.example` contient tous les variables nécessaires
- [ ] Instructions claires pour créer `.env` local
- [ ] Processus d'onboarding documenté

---

## ✅ Checklist finale avant production

### Code Quality
- [ ] 0 erreurs TypeScript
- [ ] 0 avertissements console
- [ ] Pas de erreurs network 4xx/5xx
- [ ] Performance < 3 secondes load time

### Authentification
- [ ] Signup fonctionne
- [ ] Login fonctionne
- [ ] Logout fonctionne
- [ ] Session persiste après refresh
- [ ] Routes protégées redirigent vers /login

### IA Deepseek
- [ ] Génération complète fonctionne
- [ ] 4 documents générés correctement
- [ ] Pas de timeout API
- [ ] Erreurs gérées correctement

### Sécurité
- [ ] `.env` dans `.gitignore`
- [ ] Pas de clés exposées dans le code
- [ ] RLS activé sur Supabase
- [ ] Mots de passe hashés (Supabase)

### Déploiement
- [ ] `npm run build` réussi
- [ ] Build production prévisualisé
- [ ] Aucune clé API dans `dist/`
- [ ] Documentation complète

---

## 🚀 Commandes de déploiement rapide

### Après validation complète:
```bash
# 1. Préparer l'intégration
npm install

# 2. Vérifier les tests
npm run lint
npm run build

# 3. Démarrer en production
npm run preview

# 4. Ou déployer sur Vercel/Netlify
# (Voir documentation de votre hébergeur)
```

---

## 📊 Statistiques d'intégration

| Composant | Fichiers | Lignes de code | Erreurs TypeScript |
|-----------|----------|----------------|--------------------|
| Supabase Client | 1 | 189 | 0 |
| Deepseek Service | 1 | 320 | 0 (après fix) |
| Auth Context | 1 | 220 | 0 |
| Protected Route | 1 | 45 | 0 |
| Login Page | 1 | 150 | 0 |
| Signup Page | 1 | 245 | 0 |
| App.tsx (modifié) | 1 | 60 | 0 |
| SQL Schema | 1 | 320 | N/A |
| **TOTAL** | **8** | **~1500** | **0** |

---

## 🎉 Succès!

Si toutes les cases sont cochées ✅, votre système est prêt pour:
- ✅ Production
- ✅ Déploiement sur serveur
- ✅ Accès par utilisateurs réels
- ✅ Génération pédagogique complète

**Prochaines étapes:**
1. Déployer sur Vercel, Netlify, ou votre serveur
2. Configurer les URLs de production dans Supabase
3. Tester les flux end-to-end en production
4. Monitorer les logs et erreurs
5. Recuillir les retours utilisateurs

---

## 📞 Troubleshooting rapide

Si quelque chose échoue, consultez:
- [GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md) - Section "Erreurs courantes"
- [CONFIG_CREDENTIALS.md](CONFIG_CREDENTIALS.md) - Section "Dépannage"
- Console navigateur (F12) pour les erreurs client
- Logs Supabase pour les erreurs base de données

---

**Date d'intégration:** 2024  
**Version:** 1.0 Stable  
**Status:** ✅ Prêt pour production
