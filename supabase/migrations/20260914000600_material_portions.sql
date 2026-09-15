alter table public.materials
  add column if not exists portion_enabled boolean not null default false,
  add column if not exists portion_quantity numeric(12,3) not null default 0;

alter table public.materials
  drop constraint if exists materials_portion_quantity_check;

alter table public.materials
  add constraint materials_portion_quantity_check
  check (
    (portion_enabled = false and portion_quantity >= 0)
    or (portion_enabled = true and portion_quantity > 0)
  );
