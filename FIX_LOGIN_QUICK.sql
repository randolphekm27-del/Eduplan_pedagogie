-- ============================================================================
-- CORRECTIONS SQL POUR BUG DE CONNEXION
-- Exécuter ce script dans Supabase SQL Editor pour appliquer les corrections
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: Corriger la table user_profiles (colonnes minuscules)
-- ============================================================================

-- Étape 1a: Renommer les colonnes existantes si elles sont en camelCase
DO $$
BEGIN
  -- Vérifier et renommer firstName → firstname
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'firstName'
  ) THEN
    ALTER TABLE public.user_profiles RENAME COLUMN "firstName" TO firstname;
  END IF;

  -- Vérifier et renommer lastName → lastname
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'lastName'
  ) THEN
    ALTER TABLE public.user_profiles RENAME COLUMN "lastName" TO lastname;
  END IF;
END $$;

-- Étape 1b: Vérifier que les colonnes firstname et lastname existent
DO $$
BEGIN
  -- Ajouter firstname si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'firstname'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN firstname text NOT NULL DEFAULT 'Utilisateur';
  END IF;

  -- Ajouter lastname si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'lastname'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN lastname text NOT NULL DEFAULT '';
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2: Créer le trigger de création automatique du profil
-- ============================================================================

-- Étape 2a: Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Étape 2b: Supprimer la fonction s'elle existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Étape 2c: Créer la fonction de handle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  first_name text;
  last_name text;
  user_role text;
BEGIN
  -- Récupérer les métadonnées avec fallback
  first_name := COALESCE(
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'firstname',
    'Utilisateur'
  );
  
  last_name := COALESCE(
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'lastname',
    ''
  );
  
  user_role := COALESCE(
    new.raw_user_meta_data->>'role',
    'teacher'
  );

  -- Insérer le profil utilisateur
  INSERT INTO public.user_profiles (
    id,
    email,
    firstname,
    lastname,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    first_name,
    last_name,
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    firstname = EXCLUDED.firstname,
    lastname = EXCLUDED.lastname,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Étape 2d: Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ÉTAPE 3: Vérification et Rapport
-- ============================================================================

-- Vérifier la structure de la table
SELECT 'Colonnes user_profiles:' as INFO;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Vérifier que le trigger existe
SELECT 'Trigger créé:' as INFO;
SELECT 
  tgname as trigger_name,
  relname as table_name,
  tgenabled as enabled
FROM pg_trigger
JOIN pg_class ON pg_class.oid = pg_trigger.tgrelid
WHERE tgname = 'on_auth_user_created';

-- Vérifier que la fonction existe
SELECT 'Fonction créée:' as INFO;
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- ============================================================================
-- ÉTAPE 4: Testing rapide (créer un user test)
-- ============================================================================

-- Optionnel: Nettoyer les anciens utilisateurs de test
-- DELETE FROM user_profiles WHERE email LIKE 'test-fix-%';

-- Vérifier les données existantes
SELECT 'Utilisateurs existants:' as INFO;
SELECT 
  id,
  email,
  firstname,
  lastname,
  role,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- FIN - CORRECTIONS APPLIQUÉES
-- ============================================================================
-- 
-- ✅ Si aucune erreur n'est affichée, tout est bon!
-- 
-- Prochaines étapes:
-- 1. Aller dans Supabase Auth → Users
-- 2. Créer un nouvel utilisateur (ou signup via interface)
-- 3. Vérifier que le profil a firstname/lastname (minuscules)
-- 4. Tester login avec les nouvelles corrections
--
-- Si problème persiste, consulter: DIAGNOSTIC_LOGIN_DEBUG.md
-- ============================================================================
