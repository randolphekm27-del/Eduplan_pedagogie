# 📋 Guide de Déploiement - Eduplan Supabase + Deepseek

## Phase 1: Configuration Supabase

### Étape 1.1: Créer les tables SQL

1. **Accédez à la Supabase Console**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet Eduplan

2. **Exécuter le script SQL**
   - Cliquez sur l'onglet **SQL Editor**
   - Cliquez sur **+ New Query**
   - Copiez le contenu du fichier `sql/create_tables.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run** (ou Ctrl+Enter)

3. **Vérifier les tables créées**
   ```
   Tables attendues:
   ✓ user_profiles
   ✓ pedagogical_sheets
   ✓ student_documents
   ✓ shared_sheets
   ✓ activity_logs
   ✓ export_history
   ```

### Étape 1.2: Configurer l'authentification Supabase

1. **Activez l'email/password auth**
   - Allez dans **Authentication** → **Providers**
   - Activez **Email**
   - Assurez-vous que **Confirm email** est désactivé (pour développement)

2. **Configurez les redirections**
   - Allez dans **Authentication** → **URL Configuration**
   - Ajouter Site URL: `http://localhost:5173`
   - Ajouter Redirect URLs:
     - `http://localhost:5173/dashboard`
     - `http://localhost:5173/login`

---

## Phase 2: Installation des dépendances

### Étape 2.1: Installer les packages npm

```bash
# Naviguer au répertoire du projet
cd "d:\VSCODE EDUPLAN\Eduplan_pedagogie"

# Installer les dépendances
npm install

# Vérifier que tout compile
npm run build
```

### Étape 2.2: Vérifier le fichier .env

```bash
# Vérifier que le fichier .env existe et contient:
cat .env
```

**Contenu attendu:**
```
VITE_SUPABASE_URL=https://uxxxwxsmeakqoscmwcyv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TioZx28FNrpTDJppv5zHCA_wGkPesiB
VITE_DEEPSEEK_API_KEY=sk-1c5676a3438c4ee7b7ddb4485d3bfce3
```

⚠️ **Important**: Assurez-vous que `.env` est dans `.gitignore` et NON committé

---

## Phase 3: Tests locaux

### Étape 3.1: Démarrer le serveur de développement

```bash
npm run dev
```

**Sortie attendue:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Étape 3.2: Tester les flux d'authentification

#### Test 1: Créer un nouveau compte
1. Allez sur `http://localhost:5173/`
2. Cliquez sur "S'inscrire" ou allez sur `/signup`
3. Remplissez le formulaire:
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Email: `jean.dupont@test.fr`
   - Mot de passe: `Test123!@#`
   - Rôle: `Enseignant`
4. Cliquez sur "S'inscrire"
5. ✅ Vérifier que vous êtes redirigé vers `/dashboard`

#### Test 2: Se connecter
1. Allez sur `/login`
2. Entrez les credentials:
   - Email: `jean.dupont@test.fr`
   - Mot de passe: `Test123!@#`
3. Cliquez sur "Se connecter"
4. ✅ Vérifier que vous êtes redirigé vers `/dashboard`

#### Test 3: Accéder au dashboard
1. Une fois connecté, vous devriez voir:
   - Votre profil en haut à droite
   - Le menu latéral avec options (Create, Library, etc.)
   - Les fiches pédagogiques vides (première utilisation)

#### Test 4: Test AI Deepseek
1. Cliquez sur **Create** → **AI**
2. Remplissez le formulaire:
   ```
   Subject: Mathématiques
   Class Level: Seconde
   Topic: Les équations du second degré
   Objectives: Résoudre des équations quadratiques
   ```
3. Cliquez sur **Générer le contenu pédagogique complet**
4. ✅ Vérifier que Deepseek génère le contenu
5. ✅ Vérifier que les 4 documents s'affichent

#### Test 5: Se déconnecter
1. Cliquez sur votre profil en haut à droite
2. Cliquez sur **Déconnexion**
3. ✅ Vérifier que vous êtes redirigé vers `/login`

---

## Phase 4: Erreurs courantes et solutions

### ❌ "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

### ❌ "Cannot find module '@openai/sdk'"

```bash
npm install @openai/sdk
```

### ❌ "Erreur Supabase: Invalid API key"

1. Vérifiez que `VITE_SUPABASE_ANON_KEY` est correct dans `.env`
2. Vérifiez sur https://supabase.com/dashboard
3. Redémarrez le serveur: `npm run dev`

### ❌ "Deepseek API Error: Timeout"

1. Vérifiez que `VITE_DEEPSEEK_API_KEY` est correct
2. Vérifiez votre connexion Internet
3. Vérifiez que l'API Deepseek est accessible: `https://api.deepseek.com`

### ❌ "Row Level Security (RLS) policy violation"

Cela arrive si les policies RLS ne sont pas créées. Réexécutez le script SQL complet.

### ❌ "Auth state change not detected"

1. Vérifiez que `AuthProvider` wrap l'app dans `App.tsx`
2. Vérifiez que `useAuth()` est appelé dans des composants enfants
3. Regardez la console Browser DevTools (F12) pour les erreurs

---

## Phase 5: Vérifications finales

### Checklist avant production:

- [ ] `npm run build` compile sans erreurs
- [ ] Tests d'authentification réussis
- [ ] Génération Deepseek fonctionne
- [ ] Dashboard se charge pour utilisateurs connectés
- [ ] Routes protégées redirigent vers `/login` si déconnecté
- [ ] `.env` est dans `.gitignore`
- [ ] Aucune clé API en clair dans le code source
- [ ] Row Level Security (RLS) activée sur Supabase
- [ ] Email de confirmation désactivé (pour maintenance)

---

## Phase 6: Structure des fichiers clés

```
src/
├── context/
│   └── AuthContext.tsx          # ✅ Contexte global d'auth
├── components/
│   ├── ProtectedRoute.tsx        # ✅ Wrapper pour routes protégées
│   └── ...
├── pages/
│   ├── LoginPage.tsx             # ✅ Page de connexion
│   ├── SignupPage.tsx            # ✅ Page d'inscription
│   └── ...
├── services/
│   ├── supabaseClient.ts         # ✅ Client Supabase
│   ├── deepseekAIService.ts      # ✅ Service Deepseek AI
│   └── ...
└── App.tsx                       # ✅ Routes + AuthProvider

sql/
└── create_tables.sql             # ✅ Script SQL complet
```

---

## Phase 7: Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Vérifier le TypeScript
npm run lint

# Installer une dépendance
npm install [package-name]

# Vérifier les versions
npm list
```

---

## 📞 Support

Pour toute erreur:

1. **Vérifier la console** (F12 en navigateur)
2. **Vérifier les logs** Supabase (Dashboard → Logs)
3. **Vérifier les variables d'environnement** (`.env`)
4. **Redémarrer le serveur** (`npm run dev`)

---

## 🎉 Succès!

Une fois tous les tests réussis, vous avez:

✅ Authentification Supabase  
✅ Génération pédagogique Deepseek  
✅ Dashboard protégé  
✅ Profils utilisateurs  
✅ Export et partage de fiches
