# Configuration et Déploiement des Edge Functions Chariow

## 📋 Vue d'ensemble

Ce dossier contient les Supabase Edge Functions pour intégrer Chariow (système de paiement) dans EduPlan.

### Fichiers:
- `chariow-checkout/index.ts` - Fonction pour initialiser un checkout Chariow
- `_shared/cors.ts` - Configuration CORS partagée

---

## 🚀 Installation et Déploiement

### **Step 1: Installer Supabase CLI**

```bash
npm install -g supabase
# ou
scoop install supabase

# Vérifier l'installation
supabase --version
```

### **Step 2: Configurer les Variables d'Environnement**

Créer le fichier `.env.local` à la racine du projet (si pas existant):

```bash
# Supabase
SUPABASE_URL=https://uxxxwxsmeakqoscmwcyv.supabase.co
SUPABASE_ANON_KEY=sb_publishable_TioZx28FNrpTDJppv5zHCA_wGkPesiB

# Chariow (depuis .env existant)
CHARIOW_SECRET_KEY=sk_gv34ygdi_8712e29b228248a28f2128db28bad570
CHARIOW_PRODUCT_ID_PRO=prd_eumj8o
CHARIOW_PRODUCT_ID_INSTITUTION=prd_by8qtf
```

### **Step 3: Tester les Edge Functions Localement**

```bash
# Depuis la racine du projet
supabase functions serve

# Cela lancera un serveur local à http://localhost:54321
```

### **Step 4: Invoquer la Fonction Localement**

```bash
curl -X POST http://localhost:54321/functions/v1/chariow-checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "tier": "Pro",
    "userId": "user-123",
    "email": "test@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": {
      "number": "0123456789",
      "country_code": "BJ"
    }
  }'
```

### **Step 5: Déployer vers Supabase**

#### **Option A: Déployer une fonction spécifique**

```bash
supabase functions deploy chariow-checkout \
  --project-id uxxxwxsmeakqoscmwcyv
```

#### **Option B: Déployer toutes les fonctions**

```bash
supabase functions deploy \
  --project-id uxxxwxsmeakqoscmwcyv
```

#### **Option C: Déployer avec GitHub Actions** (CI/CD)

Créer `.github/workflows/deploy-functions.yml`:

```yaml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/functions-deploy@v1
        with:
          project-id: ${{ secrets.SUPABASE_PROJECT_ID }}
          project-ref: ${{ secrets.SUPABASE_PROJECT_REF }}
```

---

## ⚙️ Configuration Supabase

### **Vérifier le Déploiement**

```bash
# Lister les fonctions déployées
supabase functions list --project-id uxxxwxsmeakqoscmwcyv

# Voir les logs
supabase functions logs chariow-checkout \
  --project-id uxxxwxsmeakqoscmwcyv
```

### **Ajouter les Secrets**

Si la clé Chariow n'est pas disponible dans la fonction:

```bash
# Via CLI
supabase secrets set CHARIOW_SECRET_KEY=sk_gv34ygdi_... \
  --project-id uxxxwxsmeakqoscmwcyv

# Vérifier
supabase secrets list --project-id uxxxwxsmeakqoscmwcyv
```

---

## 🧪 Test Complet (Frontend → Edge Function → Chariow)

### **Frontend Call**

```typescript
import { chariowService } from './services/chariowService';

// Appel depuis Pricing.tsx
const checkout = await chariowService.initializeCheckout(
  'Pro',
  'user-123',
  'test@example.com',
  'Jean',
  'Dupont',
  { number: '0123456789', country_code: 'BJ' }
);

console.log('Checkout URL:', checkout.checkoutUrl);
window.location.href = checkout.checkoutUrl;
```

### **Edge Function Flow**

```
Frontend (chariowService)
    ↓
    POST /api/chariow-checkout
    ↓
Edge Function (supabase/functions/chariow-checkout/index.ts)
    ↓
    Valide data
    ↓
    POST https://api.chariow.com/v1/checkouts
    ↓
Chariow API
    ↓
    Retourne checkoutUrl
    ↓
Edge Function
    ↓
    Retourne au Frontend
    ↓
User redirect vers Chariow Checkout
```

---

## 📝 Variables d'Environnement

| Variable | Obligatoire | Défaut | Source |
|----------|------------|--------|--------|
| `CHARIOW_SECRET_KEY` | ✅ | - | .env |
| `CHARIOW_PRODUCT_ID_PRO` | ✅ | - | .env |
| `CHARIOW_PRODUCT_ID_INSTITUTION` | ✅ | - | .env |
| `SUPABASE_URL` | ✅ | - | .env |

---

## 🔍 Debugging

### **Erreur: "Function not found"**

```bash
# Vérifier que la fonction est déployée
supabase functions list

# Si absente, déployer
supabase functions deploy chariow-checkout
```

### **Erreur: "Authorization failed"**

```bash
# Vérifier que le token est valide
# et que la fonction accepte les requêtes publiques
```

### **Erreur: "Invalid Supabase configuration"**

```bash
# Vérifier .env.local
cat .env.local

# Ou vérifier dans Supabase Dashboard → Settings → API
```

### **Erreur de Chariow API**

```typescript
// Ajouter du logging dans index.ts:
console.error("Chariow API Error:", checkoutResponse.status, errorData);

// Voir les logs avec:
supabase functions logs chariow-checkout --project-id [id]
```

---

## 📊 Monitoring

### **Via Supabase Dashboard**

1. Aller à **Functions** (menu gauche)
2. Cliquer sur **chariow-checkout**
3. Voir les **Invocations** et **Logs**

### **Via CLI**

```bash
supabase functions logs chariow-checkout \
  --project-id uxxxwxsmeakqoscmwcyv \
  --follow
```

---

## ♻️ Workflow de Développement

```bash
# 1. Démarrer les Edge Functions en local
supabase functions serve

# 2. Dans un autre terminal, lancer l'app frontend
npm run dev

# 3. Tester le flux de paiement depuis /pricing

# 4. Une fois satisfait, déployer
supabase functions deploy chariow-checkout

# 5. Vérifier le déploiement
supabase functions list
```

---

## 🔐 Sécurité

✅ **Bonnes pratiques appliquées:**
- La clé secrète Chariow est stockée en tant que secret Supabase (jamais exposée au frontend)
- CORS correctement configuré
- Validation des données d'entrée
- Gestion des erreurs sans révéler les secrets

❌ **À ÉVITER:**
- Ne jamais mettre la clé secrète en dur dans le code
- Ne jamais exposer la clé au frontend
- Ne jamais logger les données sensibles

---

## 📞 Support

- **Chariow Docs**: https://chariow.dev/llms.txt
- **Supabase Functions**: https://supabase.com/docs/guides/functions
- **Dépot EduPlan**: https://github.com/[repo]

---

## 📋 Checklist Déploiement

- [ ] Variables d'environnement configurées (.env.local)
- [ ] Supabase CLI installé et authentifié
- [ ] Edge Functions testées localement avec `supabase functions serve`
- [ ] Frontend prêt (chariowService + CheckoutSuccess page)
- [ ] Déployé: `supabase functions deploy chariow-checkout`
- [ ] Service Chariow API (clé secrète, IDs produits)
- [ ] Routes de callback configurées dans Pricing.tsx
- [ ] Webhooks Chariow configurés (optionnel mais recommandé)
