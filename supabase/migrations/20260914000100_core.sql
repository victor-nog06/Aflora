create extension if not exists "pgcrypto";

create table if not exists public.products (
  id text primary key, name text not null, category text not null, sku text not null unique,
  unit text not null check (unit in ('un', 'kg', 'L')), price numeric(10,2) not null default 0,
  cost numeric(10,2) not null default 0, stock numeric(10,3) not null default 0,
  min_stock numeric(10,3) not null default 0, active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id text primary key, created_at timestamptz not null default now(),
  items jsonb not null default '[]'::jsonb, total numeric(10,2) not null,
  payment text not null check (payment in ('Pix', 'Dinheiro', 'Cartão'))
);

create table if not exists public.acai_batches (
  id text primary key, liters numeric(10,2) not null, opened_at timestamptz not null,
  ended_at timestamptz, cost numeric(10,2) not null default 0,
  status text not null check (status in ('open', 'closed'))
);

alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.acai_batches enable row level security;
