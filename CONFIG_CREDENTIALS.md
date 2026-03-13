# 🔐 Configuration - Identifiants et Clés d'accès

> ⚠️ **IMPORTANT**: Ce fichier contient des identifiants de configuration.  
> Ne pas committer `.env` dans le repository Git - il est protégé par `.gitignore`

## Supabase Configuration

```
Instance URL: https://uxxxwxsmeakqoscmwcyv.supabase.co
Publishable Key: sb_publishable_TioZx28FNrpTDJppv5zHCA_wGkPesiB
```

**Variables d'environnement attendues dans `.env`:**
```env
VITE_SUPABASE_URL=https://uxxxwxsmeakqoscmwcyv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TioZx28FNrpTDJppv5zHCA_wGkPesiB
```

---

## Deepseek AI Configuration

```
API Key: sk-1c5676a3438c4ee7b7ddb4485d3bfce3
Base URL: https://api.deepseek.com
Model: deepseek-chat
```

**Variables d'environnement attendues dans `.env`:**
```env
VITE_DEEPSEEK_API_KEY=sk-1c5676a3438c4ee7b7ddb4485d3bfce3
```

---

## Accès aux tableaux de bord

### Supabase Dashboard
- **URL**: https://supabase.com/dashboard
- **Projet**: Eduplan_pedagogie
- Pour créer les tables SQL:
  1. Allez à SQL Editor
  2. Créez une nouvelle query
  3. Copiez `sql/create_tables.sql`
  4. Exécutez

### Deepseek API Dashboard
- **URL**: https://platform.deepseek.com/api/keys
- Consultez votre utilisation de l'API
- Générez des nouvelles clés si nécessaire

---

## Vérification de l'intégration

### 1. Vérifier le fichier `.env`
```bash
# Doit contenir:
cat .env
```

**Contenu attendu:**
```
VITE_SUPABASE_URL=https://uxxxwxsmeakqoscmwcyv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TioZx28FNrpTDJppv5zHCA_wGkPesiB
VITE_DEEPSEEK_API_KEY=sk-1c5676a3438c4ee7b7ddb4485d3bfce3
```

### 2. Vérifier les tables Supabase
```sql
-- Exécuter dans Supabase SQL Editor:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Tables attendues:**
- ✅ user_profiles
- ✅ pedagogical_sheets
- ✅ student_documents
- ✅ shared_sheets
- ✅ activity_logs
- ✅ export_history

### 3. Tester l'authentification
```bash
# Démarrer le serveur
npm run dev

# Aller sur http://localhost:5173/signup
# Créer un compte avec:
# - Email: test@example.com
# - Password: Test123!@#
# - FirstName: Jean
# - LastName: Dupont
# - Role: teacher
```

### 4. Tester Deepseek
1. Connectez-vous
2. Allez à `/dashboard/create/ai`
3. Entrez un sujet pédagogique
4. Le contenu doit être généré par Deepseek

---

## Dépannage

### ❌ "Invalid API key" (Supabase)
```bash
1. Vérifiez la clé dans .env
2. Vérifiez sur https://supabase.com/dashboard
3. Redémarrez: npm run dev
```

### ❌ "API Error" (Deepseek)
```bash
1. Vérifiez la clé API Deepseek
2. Vérifiez votre plan (crédit disponible)
3. Vérifiez l'URL: https://api.deepseek.com
```

### ❌ "Row Level Security violation"
```sql
-- Exécuter le script complet:
-- sql/create_tables.sql
```

### ❌ "Module not found"
```bash
npm install
npm run lint
```

---

## Renouvellement des clés

### Renouveler la clé Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. **Settings** → **API**
4. **Regenerate keys** → Copier la nouvelle clé
5. Mettez à jour `.env` et redémarrez

### Renouveler la clé Deepseek
1. Allez sur https://platform.deepseek.com/api/keys
2. Créez une nouvelle clé
3. Supprimez l'ancienne clé
4. Mettez à jour `.env` et redémarrez

---

## Production Checklist

- [ ] Créer les tables SQL dans Supabase
- [ ] Vérifier que toutes les clés sont correctes
- [ ] Tester l'authentification login/signup
- [ ] Tester la génération Deepseek
- [ ] Exécuter `npm run build` sans erreurs
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Activez le RLS (Row Level Security) sur Supabase
- [ ] Testez sur un appareil de production
- [ ] Configurez les URLs de redirection Supabase pour le domaine de production

---

## Fichiers de configuration

| Fichier | Contenu | Status |
|---------|---------|--------|
| `.env` | Clés API (PRIVÉ) | ✅ Créé, dans .gitignore |
| `.env.example` | Template de configuration | ✅ Créé, versionnisé |
| `vite.config.ts` | Exposition des variables | ✅ Configuré |
| `package.json` | Dépendances npm | ✅ Mis à jour |

---

## Notes de sécurité

🔒 **Bonnes pratiques:**
- ✅ `.env` est dans `.gitignore` (jamais committé)
- ✅ `.env.example` montre la structure sans valeurs réelles
- ✅ Les clés sont exposées via `VITE_` pour le client
- ✅ RLS (Row Level Security) protège la base de données
- ✅ ProtectedRoute vérifie l'authentification côté client

⚠️ **À éviter:**
- ❌ Ne pas exposer les clés dans le code source
- ❌ Ne pas committer `.env` dans Git
- ❌ Ne pas partager les clés par email ou chat
- ❌ Ne pas utiliser les clés de développement en production

---

## Support & Ressources

**Documentation:**
- [Supabase Documentation](https://supabase.com/docs)
- [Deepseek API Docs](https://platform.deepseek.com/docs)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)

**Fichiers du projet:**
- [GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md) - Guide complet
- [INTEGRATION_SUPABASE_DEEPSEEK_COMPLETE.md](INTEGRATION_SUPABASE_DEEPSEEK_COMPLETE.md) - Récapitulatif intégration
- [sql/create_tables.sql](sql/create_tables.sql) - Tables SQL
