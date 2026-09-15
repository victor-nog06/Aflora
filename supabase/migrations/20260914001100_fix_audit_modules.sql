-- Corrige registros criados quando o prefixo /api foi identificado como módulo.
update public.audit_logs
set
  entity_type = entity_id,
  entity_id = nullif(details ->> 'id', '')
where entity_type = 'api'
  and entity_id in (
    'sales',
    'products',
    'costs',
    'users',
    'batches',
    'materials',
    'material-categories'
  );
