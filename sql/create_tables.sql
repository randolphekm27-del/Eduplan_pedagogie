-- ============================================================================
-- TABLES SUPABASE POUR EDUPLAN - AUTHENTIFICATION ET PROFILS
-- ============================================================================

-- Créer une extension pour les UUIDs
create extension if not exists "uuid-ossp";

-- ============================================================================
-- TABLE: user_profiles
-- Description: Profils utilisateur complètes
-- ============================================================================
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  firstName text not null,
  lastName text not null,
  role text check (role in ('teacher', 'student', 'admin')) default 'teacher' not null,
  avatar_url text,
  bio text,
  institution text,
  specialties text[], -- Pour les enseignants
  is_verified boolean default false,
  last_login timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes pour user_profiles
create index if not exists user_profiles_email_idx on public.user_profiles(email);
create index if not exists user_profiles_role_idx on public.user_profiles(role);
create index if not exists user_profiles_created_at_idx on public.user_profiles(created_at);

-- ============================================================================
-- TABLE: pedagogical_sheets
-- Description: Fiches pédagogiques créées
-- ============================================================================
create table if not exists public.pedagogical_sheets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  subject text not null,
  class_level text,
  duration text,
  content jsonb,
  tags text[],
  is_published boolean default false,
  is_archived boolean default false,
  view_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes pour pedagogical_sheets
create index if not exists pedagogical_sheets_user_idx on public.pedagogical_sheets(user_id);
create index if not exists pedagogical_sheets_subject_idx on public.pedagogical_sheets(subject);
create index if not exists pedagogical_sheets_created_at_idx on public.pedagogical_sheets(created_at);
create index if not exists pedagogical_sheets_is_published_idx on public.pedagogical_sheets(is_published);

-- ============================================================================
-- TABLE: student_documents
-- Description: Documents élèves créés ou téléchargés
-- ============================================================================
create table if not exists public.student_documents (
  id uuid primary key default uuid_generate_v4(),
  sheet_id uuid references public.pedagogical_sheets(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  content jsonb, -- { miseEnSituation, tache, support, consignes }
  document_type text check (document_type in ('student', 'teacher', 'evaluation', 'synthesis')),
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes pour student_documents
create index if not exists student_documents_sheet_idx on public.student_documents(sheet_id);
create index if not exists student_documents_user_idx on public.student_documents(user_id);
create index if not exists student_documents_type_idx on public.student_documents(document_type);

-- ============================================================================
-- TABLE: shared_sheets
-- Description: Partage de fiches entre utilisateurs
-- ============================================================================
create table if not exists public.shared_sheets (
  id uuid primary key default uuid_generate_v4(),
  sheet_id uuid not null references public.pedagogical_sheets(id) on delete cascade,
  owner_id uuid not null references public.user_profiles(id) on delete cascade,
  shared_with_id uuid not null references public.user_profiles(id) on delete cascade,
  access_level text check (access_level in ('view', 'comment', 'edit')) default 'view' not null,
  created_at timestamp with time zone default now(),
  
  -- Contrainte: empêcher le partage avec soi-même
  constraint no_self_share check (owner_id != shared_with_id)
);

-- Indexes pour shared_sheets
create index if not exists shared_sheets_sheet_idx on public.shared_sheets(sheet_id);
create index if not exists shared_sheets_owner_idx on public.shared_sheets(owner_id);
create index if not exists shared_sheets_shared_with_idx on public.shared_sheets(shared_with_id);

-- ============================================================================
-- TABLE: activity_logs
-- Description: Journal des activités utilisateur
-- ============================================================================
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  action text not null, -- 'created', 'updated', 'shared', 'deleted', 'viewed'
  resource_type text not null, -- 'sheet', 'document', 'profile'
  resource_id uuid,
  details jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes pour activity_logs
create index if not exists activity_logs_user_idx on public.activity_logs(user_id);
create index if not exists activity_logs_action_idx on public.activity_logs(action);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at);

-- ============================================================================
-- TABLE: export_history
-- Description: Historique des exports de documents
-- ============================================================================
create table if not exists public.export_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  sheet_id uuid references public.pedagogical_sheets(id) on delete set null,
  format text check (format in ('pdf', 'docx', 'xlsx', 'html')),
  file_name text,
  file_size integer, -- en bytes
  download_url text,
  created_at timestamp with time zone default now()
);

-- Indexes pour export_history
create index if not exists export_history_user_idx on public.export_history(user_id);
create index if not exists export_history_sheet_idx on public.export_history(sheet_id);
create index if not exists export_history_created_at_idx on public.export_history(created_at);

-- ============================================================================
-- SECURITY: Enable Row Level Security (RLS)
-- ============================================================================

-- RLS pour user_profiles
alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Anyone can view public profiles"
  on public.user_profiles for select
  using (true);

-- RLS pour pedagogical_sheets
alter table public.pedagogical_sheets enable row level security;

create policy "Users can view their own sheets"
  on public.pedagogical_sheets for select
  using (auth.uid() = user_id or is_published = true);

create policy "Users can create sheets"
  on public.pedagogical_sheets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sheets"
  on public.pedagogical_sheets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sheets"
  on public.pedagogical_sheets for delete
  using (auth.uid() = user_id);

-- RLS pour student_documents
alter table public.student_documents enable row level security;

create policy "Users can view their own documents"
  on public.student_documents for select
  using (auth.uid() = user_id);

create policy "Users can create documents"
  on public.student_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own documents"
  on public.student_documents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own documents"
  on public.student_documents for delete
  using (auth.uid() = user_id);

-- RLS pour shared_sheets
alter table public.shared_sheets enable row level security;

create policy "Users can see sheets shared with them"
  on public.shared_sheets for select
  using (auth.uid() = owner_id or auth.uid() = shared_with_id);

create policy "Only owner can share their sheets"
  on public.shared_sheets for insert
  with check (auth.uid() = owner_id);

create policy "Only owner can manage shares"
  on public.shared_sheets for update
  using (auth.uid() = owner_id);

create policy "Only owner can delete shares"
  on public.shared_sheets for delete
  using (auth.uid() = owner_id);

-- RLS pour activity_logs
alter table public.activity_logs enable row level security;

create policy "Users can view their own activity"
  on public.activity_logs for select
  using (auth.uid() = user_id);

create policy "System can create activity logs"
  on public.activity_logs for insert
  with check (true);

-- RLS pour export_history
alter table public.export_history enable row level security;

create policy "Users can view their own exports"
  on public.export_history for select
  using (auth.uid() = user_id);

create policy "Users can delete their own exports"
  on public.export_history for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS: Triggers pour updated_at
-- ============================================================================

create or replace function public.update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger pour user_profiles
create trigger user_profiles_update_timestamp
  before update on public.user_profiles
  for each row
  execute function public.update_timestamp();

-- Trigger pour pedagogical_sheets
create trigger pedagogical_sheets_update_timestamp
  before update on public.pedagogical_sheets
  for each row
  execute function public.update_timestamp();

-- Trigger pour student_documents
create trigger student_documents_update_timestamp
  before update on public.student_documents
  for each row
  execute function public.update_timestamp();

-- ============================================================================
-- INSERTS: Données de test (optionnel)
-- ============================================================================
-- Décommenter pour ajouter des données de test

/*
INSERT INTO public.user_profiles (id, email, firstName, lastName, role)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'prof.test@eduplan.fr',
  'Jean',
  'Dupont',
  'teacher'
);
*/

-- ============================================================================
-- NOTES IMPORTANTES:
-- ============================================================================
-- 1. Les IDs d'utilisateurs doivent correspondre aux UIDs de Supabase Auth
-- 2. Row Level Security (RLS) est activée pour tous les tables
-- 3. Les politiques de sécurité garantissent que chaque utilisateur ne peut voir
--    que ses propres données
-- 4. Les timestamps updated_at sont automatiquement mis à jour via triggers
-- 5. Les indexes optimisent les requêtes courants
