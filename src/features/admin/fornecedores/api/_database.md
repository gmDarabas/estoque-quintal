### Tabela de fornecedores

```sql
create table public.fornecedores (
  id uuid not null default gen_random_uuid(),
  nome text not null,
  cnpj text null,
  telefone text null,
  email text null,
  contato text null,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  deleted_at timestamptz null,
  constraint fornecedores_pkey primary key (id)
);

create index if not exists fornecedores_deleted_at_idx
  on public.fornecedores using btree (deleted_at);

create trigger trigger_fornecedores_updated_at
  before update on fornecedores
  for each row execute function atualizar_timestamp();
```

### Coluna fornecedor_id em produtos

```sql
alter table public.produtos
  add column fornecedor_id uuid null
  references fornecedores(id) on delete set null;

create index if not exists produtos_fornecedor_id_idx
  on public.produtos using btree (fornecedor_id);
```
