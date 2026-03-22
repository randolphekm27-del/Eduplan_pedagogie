# 🔧 Guide de Diagnostic - Système de Connexion

## 📊 Résumé des Corrections Appliquées

### 1️⃣ **Bug: Incohérence des Noms de Colonnes**
- ❌ **Avant**: `firstName`/`lastName` (camelCase) en SQL
- ✅ **Après**: `firstname`/`lastname` (minuscules) partout
- 📝 **Fichier**: `sql/create_tables.sql`

### 2️⃣ **Bug: Profil Non Créé Automatiquement**
- ❌ **Avant**: Création manuelle du profil uniquement en code
- ✅ **Après**: Trigger SQL (`handle_new_user`) crée automatiquement le profil
- 📝 **Fichier**: `sql/create_tables.sql`

### 3️⃣ **Bug: Timeout Prématuré**
- ❌ **Avant**: `Promise.race()` timeout 10s pour toute l'opération
- ✅ **Après**: Timeouts séparés pour auth (immédiat) et profile loading (retry)
- 📝 **Fichier**: `src/context/AuthContext.tsx`

### 4️⃣ **Bug: Logging Insuffisant**
- ❌ **Avant**: Messages génériques sans contexte
- ✅ **Après**: Logging détaillé avec émojis pour tracer chaque étape
- 📝 **Fichier**: `src/context/AuthContext.tsx`

---

## 🚀 PROCÉDURE DE TEST

### **Phase 0: Préparation**

#### ✅ Vérifier les Variables d'Environnement
```bash
# Ouvrir le fichier .env
cat .env

# Doit contenir:
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### ✅ Exécuter les Migrations SQL
```sql
-- 1. Accéder à: https://app.supabase.com → [Project] → SQL Editor
-- 2. Créer une nouvelle query
-- 3. Copier-coller le contenu de: sql/create_tables.sql
-- 4. Cliquer "Run" (Alt+Enter)
-- 5. Vérifier ✅ "Query succeeded" (pas d'erreur)
```

#### ✅ Redémarrer l'Application
```bash
npm run dev
# Fermer et rouvrir le navigateur
# Effacer le localStorage: DevTools → Application → localStorage → clear()
```

---

### **Phase 1: Test d'Inscription (Signup)**

#### 🟢 Étapes
1. **Naviguer vers** `/signup`
2. **Remplir le formulaire**:
   - Email: `test-$(date +%s)@example.com` (unique)
   - Password: `SecurePassword123!`
   - First Name: `Jean`
   - Last Name: `Dupont`
   - Role: `teacher`
   - Subject: `Mathématiques`

3. **Cliquer "Créer compte"**

#### 🔍 Logs Attendus (DevTools Console)
```
🟠 AuthProvider.signup: Starting signup for test-123456@example.com
🟡 AuthProvider.signup: Creating auth user...
✅ AuthProvider.signup: Auth user created [UUID]
🟡 AuthProvider.signup: Updating user_profiles record...
✅ AuthProvider.signup: Profile record ready
🟡 AuthProvider.signup: Loading profile for verification...
🟡 [Try 1/5] Loading profile for user: [UUID]
✅ Profile loaded successfully: {
  email: "test-123456@example.com",
  firstname: "Jean",
  lastname: "Dupont",
  role: "teacher"
}
✅ AuthProvider.signup: Signup complete
```

#### ✅ Vérifier en Base de Données
```sql
-- Exécuter dans Supabase SQL Editor
SELECT id, email, firstname, lastname, role 
FROM user_profiles 
ORDER BY created_at DESC LIMIT 1;
```

**✅ Résultat attendu:**
| id | email | firstname | lastname | role |
|----|-------|-----------|----------|------|
| [UUID] | test-123456@example.com | Jean | Dupont | teacher |

---

### **Phase 2: Test de Connexion (Login)**

#### 🟢 Étapes
1. **Naviguer vers** `/login`
2. **Entrer les identifiants**:
   - Email: `test-123456@example.com`
   - Password: `SecurePassword123!`
3. **Cliquer "Se connecter"**

#### 🔍 Logs Attendus (DevTools Console)
```
🟠 AuthProvider.login: Starting login for test-123456@example.com
🟡 AuthProvider.login: Signing in...
✅ AuthProvider.login: User authenticated test-123456@example.com
🟡 AuthProvider.login: Loading user profile...
🟡 [Try 1/5] Loading profile for user: [UUID]
✅ Profile loaded successfully: {
  email: "test-123456@example.com",
  firstname: "Jean",
  lastname: "Dupont",
  role: "teacher"
}
✅ AuthProvider.login: Profile loaded successfully
```

#### ✅ Redirection
L'utilisateur doit être **redirigé vers `/dashboard`** automatiquement

---

### **Phase 3: Diagnostic des Erreurs**

#### ❌ Erreur: `PGRST116` (profil non trouvé)
```
⏳ Profile not found yet (attempt 1/5). Retrying in 1.5s...
⏳ Profile not found yet (attempt 2/5). Retrying in 1.5s...
...
❌ Profile query exhausted retries
```

**Cause**: Le trigger SQL n'a pas créé le profil
**Solution**:
```sql
-- 1. Vérifier le trigger existe
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Test du trigger manuellement
-- a) Créer un utilisateur via Supabase UI
-- b) Chercher l'ID utilisateur en auth.users
-- c) Vérifier si une row existe dans user_profiles
SELECT * FROM user_profiles WHERE id = '[user_id]';

-- 3. Si vide, exécuter le trigger manuellement:
SELECT public.handle_new_user();
```

#### ❌ Erreur: `Email ou mot de passe incorrect`
```
❌ AuthProvider.login: Authentication failed
  "message": "Invalid login credentials"
```

**Causes possibles**:
1. Email ou password incorrect
2. Utilisateur pas encore confirmé par email
3. Compte supprimé

**Solutions**:
```bash
# Vérifier dans Supabase Auth
# 1. Dashboard → Authentication → Users
# 2. Chercher l'email
# 3. Vérifier "Email Confirmed" = ✅
# 4. Si ❌, cliquer sur l'utilisateur → "Confirm email manually"
```

#### ❌ Erreur: `TypeError: Cannot read property 'firstname'`
```javascript
// Erreur en console
Error: Cannot read property 'firstname' of null
  at ProfileDisplay.tsx:10
```

**Cause**: Le profil n'a pas été chargé ou les données sont corrompues

**Solution**:
```sql
-- Vérifier les colonnes de user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Doit retourner EXACTEMENT ces colonnes:
-- firstname | text | no
-- lastname  | text | no
-- (avec minuscules, pas camelCase)
```

---

## 📋 Checklist de Vérification

- [ ] **Variables d'environnement** chargées (vérifier dans Network tab du DevTools)
- [ ] **Tables créées** en base (verified via Supabase Dashboard)
- [ ] **Trigger ajouté** (SELECT count(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created')
- [ ] **Colonnes correctes** (firstname/lastname en minuscules)
- [ ] **Signup OK** (nouvel utilisateur dans user_profiles)
- [ ] **Login OK** (utilisateur redirigé vers dashboard)
- [ ] **Logs visibles** (DevTools Console → Filter par "AuthProvider")

---

## 🐛 Cas de Test Avancés

### **Test 1: Utilisateur existant (résister au PK conflict)**
```bash
# 1. Signup avec email: alice@test.com
# 2. Signup AGAIN avec même email
# 3. Vérifier que c'est rejeté avec "User already registered"
```

### **Test 2: Profil partiellement créé**
```bash
# 1. Signup normalement
# 2. Dans DevTools Console, vérifier que firstname/lastname ne sont pas vides
# 3. Modifier manuellement en BD pour tester firstname = NULL
# 4. Tenter login → Vérifier warning ⚠️ dans logs
```

### **Test 3: Resiliency en cas de réseau lent**
```bash
# DevTools → Network → Slow 3G
# Tester signup/login
# Vérifier que retries fonctionnent (⏳ messages)
```

---

## 📞 Résolution des Problèmes Persistants

Si après tous ces tests le problème persiste:

1. **Vérifier les Identifiants Supabase**
   ```bash
   # Dans .env:
   VITE_SUPABASE_URL  # Ne doit jamais être vide
   VITE_SUPABASE_ANON_KEY  # Doit commencer par "eyJ..."
   ```

2. **Vérifier RLS Policies**
   ```sql
   -- Supabase Dashboard → SQL Editor
   SELECT polname, polcmd, polroles
   FROM pg_policies
   WHERE tablename = 'user_profiles';
   ```

3. **Vérifier Permissions**
   ```sql
   -- Donner les permissions complètes
   GRANT ALL ON public.user_profiles TO anon;
   GRANT ALL ON public.user_profiles TO authenticated;
   ```

4. **Tester Directement via Postman/cURL**
   ```bash
   # POST https://[project].supabase.co/auth/v1/signup
   # Content-Type: application/json
   # {
   #   "email": "test@example.com",
   #   "password": "Test123!",
   #   "data": { "firstName": "Test", "lastName": "User" }
   # }
   ```

---

## 📚 Fichiers Modifiés

| Fichier | Changement |
|---------|-----------|
| `sql/create_tables.sql` | ✅ Colonnes en minuscules, trigger ajouté |
| `src/context/AuthContext.tsx` | ✅ Logging amélioré, timeouts séparés |
| `src/services/supabaseClient.ts` | ✅ Type UserProfile mis à jour |

---

## ✨ Résultat Attendu

Après appliquer ces corrections et exécuter les tests:

✅ Signup crée un profil complet et cohérent  
✅ Login récupère le profil sans timeout  
✅ Logs détaillés pour diagnostiquer tout problème futur  
✅ Gestion gracieuse des erreurs de profil  

**Vous êtes prêt! 🚀**
