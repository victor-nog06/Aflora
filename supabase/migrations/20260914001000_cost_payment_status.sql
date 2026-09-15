alter table public.costs
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz;

alter table public.costs
  drop constraint if exists costs_paid_at_check;

alter table public.costs
  add constraint costs_paid_at_check
  check ((paid = false and paid_at is null) or paid = true);

create index if not exists costs_pending_payment_idx
  on public.costs (payment_date)
  where paid = false;
