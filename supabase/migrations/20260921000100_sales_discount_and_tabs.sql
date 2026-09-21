alter table public.sales
  add column if not exists subtotal numeric(10,2),
  add column if not exists discount numeric(5,2) not null default 0;

update public.sales set subtotal = total where subtotal is null;
alter table public.sales alter column subtotal set not null;
alter table public.sales drop constraint if exists sales_discount_check;
alter table public.sales add constraint sales_discount_check check (discount >= 0 and discount <= 100);

create table if not exists public.customer_tabs (
  id text primary key,
  customer_name text not null,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null check (total > 0),
  status text not null default 'open' check (status in ('open', 'paid'))
);

create index if not exists customer_tabs_status_created_at_idx
  on public.customer_tabs (status, created_at desc);

alter table public.customer_tabs enable row level security;
