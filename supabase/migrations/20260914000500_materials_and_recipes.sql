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
