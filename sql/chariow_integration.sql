-- ============================================================================
-- CHARIOW INTEGRATION - Database Schema Extensions
-- Fichier: sql/chariow_integration.sql
-- Exécuter ce script dans Supabase SQL Editor pour ajouter le support Chariow
-- ============================================================================

-- ============================================================================
-- TABLE: subscriptions (for Chariow integration)
-- Description: Historique des abonnements et statuts de paiement
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Chariow checkout/order info
  checkout_id TEXT UNIQUE,  -- ID unique du checkout Chariow
  order_id TEXT,            -- ID de la commande
  
  -- Subscription details
  tier TEXT CHECK (tier IN ('free', 'pro', 'institution')) DEFAULT 'free' NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'pending', 'failed')) DEFAULT 'pending' NOT NULL,
  
  -- Payment info
  amount_value INTEGER,     -- Montant en cents
  amount_currency TEXT DEFAULT 'XOF',
  payment_method TEXT,
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_tier_status CHECK (
    (tier = 'free' AND status IN ('active', 'expired', 'cancelled')) OR
    (tier IN ('pro', 'institution') AND status IN ('active', 'expired', 'cancelled', 'pending', 'failed'))
  )
);

-- Indexes pour subscriptions
CREATE INDEX IF NOT EXISTS subscriptions_user_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_tier_idx ON public.subscriptions(tier);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_checkout_id_idx ON public.subscriptions(checkout_id);
CREATE INDEX IF NOT EXISTS subscriptions_created_at_idx ON public.subscriptions(created_at DESC);

-- ============================================================================
-- TABLE: payment_events (for audit trail)
-- Description: Journal des événements de paiement Chariow
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Event info
  event_type TEXT NOT NULL, -- 'checkout.created', 'payment.completed', 'payment.failed', 'refund.issued'
  event_source TEXT DEFAULT 'chariow', -- Source de l'événement
  external_event_id TEXT,   -- ID de l'événement chez le provider
  
  -- Status change
  old_status TEXT,
  new_status TEXT,
  
  -- Details
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour payment_events
CREATE INDEX IF NOT EXISTS payment_events_user_idx ON public.payment_events(user_id);
CREATE INDEX IF NOT EXISTS payment_events_subscription_idx ON public.payment_events(subscription_id);
CREATE INDEX IF NOT EXISTS payment_events_event_type_idx ON public.payment_events(event_type);
CREATE INDEX IF NOT EXISTS payment_events_created_at_idx ON public.payment_events(created_at DESC);

-- ============================================================================
-- ALTER user_profiles: Ajouter le champ tier si nécessaire
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'tier') THEN
    ALTER TABLE public.user_profiles ADD COLUMN tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'institution'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE public.user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'expired', 'cancelled'));
  END IF;
END $$;

-- ============================================================================
-- FUNCTION: get_active_subscription
-- Description: Récupère l'abonnement actif le plus récent d'un utilisateur
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_active_subscription(user_id_param UUID)
RETURNS TABLE (
  subscription_id UUID,
  user_id UUID,
  tier TEXT,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  checkout_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.tier,
    s.status,
    s.expires_at,
    s.checkout_id
  FROM public.subscriptions s
  WHERE s.user_id = user_id_param
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- TRIGGER: Update user_profiles tier when subscription changes
-- Description: Synchronise le tier de user_profiles avec l'abonnement actif
-- ============================================================================
CREATE OR REPLACE FUNCTION public.sync_user_tier_from_subscription()
RETURNS TRIGGER AS $$
DECLARE
  active_sub RECORD;
BEGIN
  -- Si la subscription est maintenant active, mettre à jour user_profiles
  IF NEW.status = 'active' THEN
    UPDATE public.user_profiles
    SET 
      tier = NEW.tier,
      subscription_status = 'active',
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  -- Si la subscription est annulée/expirée, revenir à 'free' (optionnel)
  -- Décommenter si vous voulez le comportement automatique:
  -- IF NEW.status IN ('cancelled', 'expired') THEN
  --   UPDATE public.user_profiles
  --   SET 
  --     tier = 'free',
  --     subscription_status = NEW.status,
  --     updated_at = NOW()
  --   WHERE id = NEW.user_id;
  -- END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_tier_on_subscription ON public.subscriptions;
CREATE TRIGGER sync_tier_on_subscription
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_tier_from_subscription();

-- ============================================================================
-- TRIGGER: Log payment events
-- Description: Crée un événement de paiement quand une subscription change
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_payment_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.payment_events (
    subscription_id,
    user_id,
    event_type,
    old_status,
    new_status,
    description,
    metadata
  )
  VALUES (
    NEW.id,
    NEW.user_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'subscription.created'
      WHEN NEW.status != OLD.status THEN 'subscription.status_changed'
      ELSE 'subscription.updated'
    END,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
    NEW.status,
    COALESCE(NEW.tier, '') || ' subscription ' || NEW.status,
    jsonb_build_object(
      'checkout_id', NEW.checkout_id,
      'order_id', NEW.order_id,
      'amount', NEW.amount_value,
      'currency', NEW.amount_currency
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_payment_events ON public.subscriptions;
CREATE TRIGGER log_payment_events
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.log_payment_event();

-- ============================================================================
-- RLS POLICIES: subscriptions table
-- ============================================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view only their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (Edge Functions) can manage subscriptions
CREATE POLICY "Service role can manage subscriptions (webhook)"
  ON public.subscriptions
  USING (auth.role() = 'service_role');

-- ============================================================================
-- RLS POLICIES: payment_events table
-- ============================================================================
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment events
CREATE POLICY "Users can view their own payment events"
  ON public.payment_events FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- Sample Data (test only - remove for production)
-- ============================================================================
-- INSERT INTO public.subscriptions (
--   user_id,
--   tier,
--   status,
--   started_at,
--   expires_at
-- )
-- SELECT 
--   id,
--   'pro',
--   'active',
--   NOW(),
--   NOW() + interval '1 year'
-- FROM public.user_profiles
-- LIMIT 1
-- ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF CHARIOW INTEGRATION SCHEMA
-- ============================================================================
-- 
-- Vérifier le déploiement:
-- SELECT COUNT(*) FROM information_schema.tables 
-- WHERE table_name = 'subscriptions';
--
-- Tester la fonction:
-- SELECT * FROM public.get_active_subscription('[user_id]');
--
-- ============================================================================
