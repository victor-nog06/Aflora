alter table public.costs
  add column if not exists paid_by text;

alter table public.costs
  drop constraint if exists costs_paid_by_length_check;

alter table public.costs
  add constraint costs_paid_by_length_check
  check (paid_by is null or char_length(trim(paid_by)) between 2 and 100);
