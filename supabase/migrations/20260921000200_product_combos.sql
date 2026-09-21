create table if not exists public.combos (
  id text primary key,
  name text not null,
  price numeric(10,2) not null check (price > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.combo_items (
  combo_id text not null references public.combos(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  quantity numeric(10,3) not null check (quantity > 0),
  primary key (combo_id, product_id)
);

alter table public.combos enable row level security;
alter table public.combo_items enable row level security;
