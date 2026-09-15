create table if not exists public.costs (
  id text primary key, description text not null, category text not null,
  amount numeric(12,2) not null check (amount >= 0), cost_date date not null,
  recurring boolean not null default false, notes text,
  created_at timestamptz not null default now()
);

alter table public.costs enable row level security;
