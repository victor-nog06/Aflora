create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(), username text not null unique check (username = lower(username)),
  password_hash text, role text not null check (role in ('admin', 'employee')),
  active boolean not null default true, created_at timestamptz not null default now()
);

alter table public.app_users alter column password_hash drop not null;
alter table public.app_users enable row level security;
