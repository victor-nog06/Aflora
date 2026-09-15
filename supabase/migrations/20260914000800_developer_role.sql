alter table public.app_users
  drop constraint if exists app_users_role_check;

alter table public.app_users
  add constraint app_users_role_check
  check (role in ('developer', 'admin', 'employee'));

update public.app_users
set role = 'developer'
where username = 'victor.nogueira';
