# Migrations do banco

Este diretório é a fonte oficial da estrutura do banco. Cada mudança deve gerar um novo arquivo SQL com timestamp crescente: `YYYYMMDDHHMMSS_descricao.sql`.

Regras:

- não editar migrations já aplicadas;
- não usar o schema consolidado para publicar mudanças;
- manter cada migration pequena e focada;
- não incluir chaves, senhas ou tokens em SQL;
- testar antes de aplicar no ambiente remoto.

Com a CLI do Supabase vinculada ao projeto, aplique somente as migrations pendentes:

```bash
npm run db:migrate
```

Consulte o histórico local e remoto:

```bash
npm run db:migrations
```

O arquivo `database/supabase-schema.sql` é legado e permanece apenas como referência consolidada.
