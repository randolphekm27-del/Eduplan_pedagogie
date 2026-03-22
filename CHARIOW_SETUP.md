# 💳 Configuration Chariow - Guide Complet

## 📊 Vue d'ensemble

Chariow est une plateforme e-commerce dédiée aux produits numériques (cours, logiciels, fichiers). EduPlan l'utilise pour gérer les abonnements et les paiements.

### Flux de Paiement EduPlan:

```
1. Utilisateur va à /pricing
   ↓
2. Crée le formulaire de téléphone (PhoneModal)
   ↓
3. Appelle chariowService.initializeCheckout()
   ↓
4. Edge Function Supabase (chariow-checkout)
   ↓
5. Appelle Chariow API pour créer un checkout
   ↓
6. Redirects vers page de paiement Chariow
   ↓
7. Utilisateur paye (carte/mobile)
   ↓
8. Redirects vers /checkout-success
   ↓
9. Vérifie le statut du paiement
   ↓
10. Active l'abonnement
```

---

## ⚙️ Configuration Requise

### **1. Variables d'Environnement**

Vérifier que le `.env` contient:

```bash
# Supabase
VITE_SUPABASE_URL=https://uxxxwxsmeakqoscmwcyv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Chariow
CHARIOW_SECRET_KEY=sk_gv34ygdi_8712e29b228248a28f2128db28bad570
VITE_CHARIOW_PRODUCT_ID_PRO=prd_eumj8o
VITE_CHARIOW_PRODUCT_ID_INSTITUTION=prd_by8qtf

# App
VITE_APP_URL=http://localhost:5173
```

### **2. Edge Functions Supabase**

Les fichiers nécessaires:

```
supabase/
├── functions/
│   ├── chariow-checkout/
│   │   └── index.ts              ✅ Function principale
│   └── _shared/
│       └── cors.ts                ✅ Configuration CORS
```

### **3. Services Frontend**

```
src/services/
├── chariowService.ts              ✅ Client API Chariow
└── supabaseClient.ts              ✅ Configuration Supabase

src/pages/
├── Pricing.tsx                    ✅ Page de pricing
├── CheckoutSuccess.tsx             ✅ Confirmation paiement
```

---

## 🚀 Déploiement

### **Phase 1: Configuration Locale**

```bash
# 1. Vérifier le .env
cat .env | grep -i chariow

# 2. Installer Supabase CLI
npm install -g supabase

# 3. Tester les Edge Functions
supabase functions serve
```

### **Phase 2: Déployer les Edge Functions**

```bash
# Authentifier avec Supabase
supabase login

# Déployer la fonction
supabase functions deploy chariow-checkout \
  --project-id uxxxwxsmeakqoscmwcyv

# Vérifier
supabase functions list --project-id uxxxwxsmeakqoscmwcyv
```

### **Phase 3: Configurer les Secrets Supabase**

La clé `CHARIOW_SECRET_KEY` doit aussi être accessible à l'Edge Function:

```bash
# Déposer le secret
supabase secrets set CHARIOW_SECRET_KEY=sk_gv34ygdi_... \
  --project-id uxxxwxsmeakqoscmwcyv

# Vérifier
supabase secrets list --project-id uxxxwxsmeakqoscmwcyv
```

### **Phase 4: Tester le Flux**

```bash
# Dans le navigateur:
# 1. Aller à http://localhost:5173/pricing
# 2. Cliquer sur "S'abonner" pour le plan Pro
# 3. Remplir le numéro de téléphone
# 4. Cliquer "Payer maintenant"
# 5. Vérifier les logs: DevTools → Console
```

---

## 🔍 Debugging

### **Erreur: "Function not found"**

```bash
# La Edge Function chariow-checkout n'existe pas
# Solutions:
1. Vérifier le déploiement: supabase functions list
2. Redéployer: supabase functions deploy chariow-checkout
3. Vérifier le fichier existe: ls supabase/functions/chariow-checkout/
```

### **Erreur: "CHARIOW_SECRET_KEY not configured"**

```bash
# La clé secrète n'est pas accessible à la Edge Function
# Solutions:
1. Vérifier le .env: cat .env | grep CHARIOW_SECRET_KEY
2. Ajouter le secret: supabase secrets set CHARIOW_SECRET_KEY=sk_...
3. Relancer les Edge Functions: supabase functions serve
```

### **Erreur: "Invalid Chariow response"**

```bash
# La Chariow API rejette la requête
# Solutions:
1. Vérifier la clé secrète Chariow (expiée?)
2. Vérifier les IDs de produits (existent?)
3. Vérifier les données (email valide?)
4. Voir logs: supabase functions logs chariow-checkout --follow
```

### **Erreur: "Checkout timeout"**

```bash
# La requête à Chariow prend trop de temps
# Solutions:
1. Vérifier la connexion internet
2. Vérifier le status de Chariow API (uptime?)
3. Augmenter le timeout dans chariowService.ts
```

---

## 📋 Structure des Fichiers

### **supabase/functions/chariow-checkout/index.ts**

```typescript
// Deno Edge Function
serve(async (req: Request) => {
  // 1. Valider la méthode (POST)
  // 2. Parser le body JSON
  // 3. Valider les données (tier, email, etc.)
  // 4. Récupérer l'ID du produit
  // 5. Appeler Chariow API
  // 6. Retourner checkoutUrl
});
```

### **src/services/chariowService.ts**

```typescript
export const chariowService = {
  // 1. initializeCheckout() - Crée un checkout
  // 2. getCheckoutStatus() - Récupère le status d'un checkout
  // 3. listProducts() - Liste les produits
  // 4. getOrder() - Récupère les détails d'une commande
};
```

### **src/pages/CheckoutSuccess.tsx**

```typescript
// Page de confirmation après paiement
export default function CheckoutSuccess() {
  // 1. Récupère checkout_id de l'URL
  // 2. Appelle chariowService.getCheckoutStatus()
  // 3. Affiche le statut (loading/success/error)
  // 4. Redirige vers dashboard ou affiche erreur
}
```

### **src/pages/Pricing.tsx**

```typescript
// Page de tarification
const handleCheckoutInit = async (phone) => {
  // 1. Appelle chariowService.initializeCheckout()
  // 2. Obtient checkoutUrl
  // 3. Redirige vers Chariow (window.location.href)
};
```

---

## 🧪 Tests

### **Test Local (Mock)**

```typescript
// Dans chariowService.ts, créer un mode mock
export const chariowService = {
  initializeCheckout: async (...) => {
    if (process.env.NODE_ENV === 'test') {
      return {
        checkoutUrl: 'https://chariow.dev/success',
        checkoutId: 'test-12345'
      };
    }
    // ... appel réel
  }
};
```

### **Test avec Postman**

```bash
# POST http://localhost:54321/functions/v1/chariow-checkout
# Headers: Content-Type: application/json
# Body:
{
  "tier": "Pro",
  "userId": "test-user-123",
  "email": "test@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": {
    "number": "0123456789",
    "country_code": "BJ"
  }
}

# Réponse attendue:
{
  "checkoutUrl": "https://checkout.chariow.com/...",
  "checkoutId": "chk_abc123"
}
```

---

## 🔐 Sécurité

✅ **Best Practices:**
- Clé secrète stockée en tant que secret Supabase (jamais en .env.local)
- Edge Function valide toutes les données d'entrée
- CORS correctement configuré
- Erreurs gérées sans révéler les secrets

❌ **À ÉVITER:**
- Mettre la clé secrète en dur dans le code
- Exposer la clé au frontend
- Logger les données sensibles

---

## 📞 Support

- **Chariow Documentation**: https://chariow.dev/llms.txt
- **Chariow Dashboard**: https://dashboard.chariow.com
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **GitHub Issues**: [repositoire]

---

## ✅ Checklist Déploiement

- [ ] Variables d'environnement (.env) complètes
- [ ] Supabase CLI installé (`supabase --version`)
- [ ] Edge Functions testées localement
- [ ] `supabase functions deploy chariow-checkout`
- [ ] Secrets Supabase configurés: `supabase secrets set ...`
- [ ] Compte Chariow créé et IDs produits récupérés
- [ ] Services frontend (chariowService, CheckoutSuccess) créés
- [ ] Routes dans App.tsx (*.pricing*, `/checkout-success`)
- [ ] Tests de paiement réussis
- [ ] Logs visibles dans Supabase Dashboard → Functions

---

## 🎯 Étapes Suivantes

1. **Webhooks Chariow** - Confirmer les paiements en temps réel
2. **Mise à jour des UserProfiles** - Activer l'abonnement Pro après paiement
3. **Email de confirmation** - Envoyer reçu et instructions
4. **Cycle de facturation** - Gérer les renouvellements d'abonnement
5. **Gestion des remboursements** - Interface pour annuler/rembourser

