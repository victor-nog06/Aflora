alter table public.costs
  add column if not exists payment_date date,
  add column if not exists installment_number integer not null default 1,
  add column if not exists installments_total integer not null default 1,
  add column if not exists installment_group_id text;

update public.costs
set payment_date = cost_date
where payment_date is null;

alter table public.costs
  alter column payment_date set not null;

alter table public.costs
  drop constraint if exists costs_installments_check;

alter table public.costs
  add constraint costs_installments_check
  check (
    installment_number >= 1
    and installments_total >= 1
    and installment_number <= installments_total
  );

create index if not exists costs_payment_date_idx
  on public.costs (payment_date);

create index if not exists costs_installment_group_idx
  on public.costs (installment_group_id)
  where installment_group_id is not null;
