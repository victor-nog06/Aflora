alter table public.acai_batches
  add column if not exists product_type text not null default 'acai',
  add column if not exists flavor text not null default 'Tradicional';

alter table public.acai_batches
  drop constraint if exists acai_batches_product_type_check;

alter table public.acai_batches
  add constraint acai_batches_product_type_check
  check (product_type in ('acai', 'sorvete'));

create index if not exists acai_batches_open_flavor_idx
  on public.acai_batches (status, product_type, flavor);
