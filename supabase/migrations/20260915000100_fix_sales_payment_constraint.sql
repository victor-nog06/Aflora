-- Garante que a forma de pagamento usada pela aplicação seja aceita pelo banco.
alter table public.sales
  drop constraint if exists sales_payment_check;

update public.sales
set payment = 'Cartão'
where payment = 'CartÃ£o';

alter table public.sales
  add constraint sales_payment_check
  check (payment in ('Pix', 'Dinheiro', 'Cartão'));
