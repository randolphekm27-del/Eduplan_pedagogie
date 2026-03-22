# ⚡ ACTIONS RAPIDES - CORRECTION LOGIN

## 🚨 URGENCE: 3 Actions pour Corriger le Bug

### **Action 1️⃣: Exécuter le Script SQL (5 min)**

1. **Ouvrir Supabase**
   - Aller à: https://app.supabase.com
   - Sélectionner votre projet EduPlan

2. **SQL Editor**
   - Cliquer sur "SQL Editor" (menu gauche)
   - Cliquer sur "New Query"

3. **Copier-Coller le script**
   - Ouvrir le fichier: `FIX_LOGIN_QUICK.sql` (à la racine du projet)
   - Copier TOUT le contenu
   - Coller dans l'éditeur SQL de Supabase

4. **Exécuter**
   - Appuyer sur `Alt+Enter` ou cliquer "Run"
   - Vérifier ✅ **"Query succeeded"** (en bas)
   - Si erreurs ❌, voir section "Dépannage" en bas

---

### **Action 2️⃣: Redémarrer l'App (2 min)**

```bash
# Terminal dans le projet:
npm run dev

# Dans le navigateur:
# 1. Appuyer Ctrl+Shift+Delete (effacer le cache)
# 2. Rafraîchir la page (Ctrl+R)
```

---

### **Action 3️⃣: Tester Signup → Login (3 min)**

#### **Test Signup**
1. Aller à `http://localhost:5173/signup`
2. Remplir:
   - Email: `test-$(date +%s)@test.com` (unique)
   - Password: `TestPassword123!`
   - First Name: `Jean`
   - Last Name: `Martin`
   - Role: `teacher`

3. Cliquer "Créer compte"

4. **DevTools** (F12) → Console
   - Chercher ✅ `Profile loaded successfully`
   - Si ❌ `Profile not found`, voir dépannage

#### **Test Login**
1. Aller à `http://localhost:5173/login`
2. Entrer email + password
3. Cliquer "Se connecter"
4. **DevTools** → Console
   - Chercher ✅ `Profile loaded successfully`
5. Si redirected vers `/dashboard` = **✅ SUCCÈS!**

---

## 📊 What's Fixed?

| Bug | Symptôme | Status |
|-----|----------|--------|
| Colonnes nom incompatibles | Profile vide | ✅ FIXED |
| Pas de trigger auto-création | Profile manquant | ✅ FIXED |
| Timeout prématuré | "Login timeout" | ✅ FIXED |
| Logging insuffisant | Impossible à debugger | ✅ FIXED |

---

## 🔍 Si Ça Marche Pas encore...

### ❌ Erreur: "Query syntax error"
```
→ Problème: Le script SQL a une erreur
→ Solution: Vérifier que le fichier FIX_LOGIN_QUICK.sql est complet
→ Ou exécuter: sql/create_tables.sql (archivo complet)
```

### ❌ Erreur: "Profile not found (attempt 5/5)"
```
→ Problème: Le trigger ne crée pas le profil
→ Solution: 
   1. Aller à Supabase → SQL Editor
   2. Exécuter:
      SELECT count(*) FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created';
   3. S'il retourne 0, le trigger n'existe pas
   4. Réexécuter FIX_LOGIN_QUICK.sql
```

### ❌ Erreur: "Cannot read property 'firstname'"
```
→ Problème: Les colonnes sont en camelCase
→ Solution:
   1. DevTools → Network (recharger page)
   2. Vérifier que response de /user_profiles contient 'firstname' (minuscules)
   3. Sinon, il faut renommer les colonnes (voir dépannage avancé)
```

### ❌ Erreur: "email already registered"
```
→ Problème: L'utilisateur existe déjà
→ Solution: Utiliser un email différent ou supprimer le user:
   -- Dans Supabase SQL Editor:
   DELETE FROM user_profiles WHERE email = 'test@example.com';
   -- Puis supprimer manuellement dans Auth si needed
```

---

## 📞 Dépannage Avancé

### **Vérifier que les colonnes sont au format correct**

```sql
-- Exécuter dans Supabase SQL Editor:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('firstname', 'lastname', 'firstName', 'lastName');
```

**Résultat ATTENDU:**
```
firstname | text
lastname  | text
```

**Résultat PROBLÉMATIQUE:**
```
firstName | text
lastName  | text
```

Si vous voyez le résultat problématique, les colonnes doivent être renommées.

---

### **Si le trigger ne s'exécute pas**

1. **Vérifier qu'il existe:**
```sql
SELECT tgname FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
-- Doit retourner 1 ligne
```

2. **Si aucune ligne, le recréer:**
```sql
-- Copier-coller le contenu de FIX_LOGIN_QUICK.sql
-- Section "ÉTAPE 2"
```

3. **Tester manuellement:**
```sql
-- Appeler la fonction
SELECT public.handle_new_user();

-- Créer un user de test dans Supabase Auth directement
-- Puis vérifier si le profil est créé:
SELECT * FROM user_profiles 
WHERE id = '[user_id_from_step_above]';
```

---

## ✅ Checklist Finale

- [ ] Script SQL exécuté sans erreurs ✅
- [ ] App redémarrée
- [ ] DevTools → Console vidée (F12 → Console → Clear)
- [ ] Signup testé → Profile créé ✅
- [ ] Login testé → Redirection vers dashboard ✅
- [ ] Pas d'erreur "Login timeout" ✅

---

## 🎓 Qu'est-ce qui a été corrigé?

**Avant (❌):**
- Colonnes incohérentes → profil vide
- Pas de trigger → profil jamais créé
- Timeout global → race conditions
- Logs génériques → impossible à debugger

**Après (✅):**
- Colonnes uniformes (minuscules partout)
- Trigger auto-crée le profil toujours
- Timeouts intelligents par phase
- Logs détaillés avec émojis pour tracer

---

## 📚 Documentation Complète

Si vous voulez plus de détails:
- `CORRECTIONS_LOGIN_SUMMARY.md` - Résumé des corrections
- `DIAGNOSTIC_LOGIN_DEBUG.md` - Guide complet de diag et test
- `sql/create_tables.sql` - Définition complète du schéma

---

**Besoin d'aide? Les fichiers au-dessus ont les réponses! 🚀**
