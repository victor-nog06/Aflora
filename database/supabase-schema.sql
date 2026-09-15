-- LEGADO: referência consolidada. Não execute para atualizações.
-- Use exclusivamente os arquivos versionados em supabase/migrations.
create extension if not exists "pgcrypto";

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  sku text not null unique,
  unit text not null check (unit in ('un', 'kg', 'L')),
  price numeric(10,2) not null default 0,
  cost numeric(10,2) not null default 0,
  stock numeric(10,3) not null default 0,
  min_stock numeric(10,3) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id text primary key,
  created_at timestamptz not null default now(),
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null,
  payment text not null check (payment in ('Pix', 'Dinheiro', 'Cartão'))
);

create table if not exists public.acai_batches (
  id text primary key,
  liters numeric(10,2) not null,
  opened_at timestamptz not null,
  ended_at timestamptz,
  cost numeric(10,2) not null default 0,
  status text not null check (status in ('open', 'closed'))
);

alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.acai_batches enable row level security;

-- Substitua estas políticas por acesso autenticado antes de publicar.
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username = lower(username)),
  password_hash text,
  role text not null check (role in ('admin', 'employee')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;

-- Em bancos criados por versões anteriores, permita primeiro acesso sem senha.
alter table public.app_users alter column password_hash drop not null;

create table if not exists public.costs (
  id text primary key,
  description text not null,
  category text not null,
  amount numeric(12,2) not null check (amount >= 0),
  cost_date date not null,
  recurring boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.costs enable row level security;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.app_users(id) on delete set null,
  actor_username text not null,
  action text not null check (action in ('create', 'update', 'delete')),
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_actor_idx on public.audit_logs(actor_username);
alter table public.audit_logs enable row level security;

create table if not exists public.material_categories (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.materials (
  id text primary key,
  name text not null,
  category_id text references public.material_categories(id) on delete restrict,
  unit text not null check (unit in ('un','g','ml','kg','L')),
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  cost numeric(12,4) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_items (
  product_id text references public.products(id) on delete cascade,
  material_id text references public.materials(id) on delete restrict,
  quantity numeric(12,3) not null check (quantity > 0),
  primary key (product_id, material_id)
);

alter table public.material_categories enable row level security;
alter table public.materials enable row level security;
alter table public.recipe_items enable row level security;

-- Sem políticas públicas. O acesso ocorre somente pelo backend com service role.
