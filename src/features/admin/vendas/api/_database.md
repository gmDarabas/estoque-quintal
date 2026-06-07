### Venda agrupada (carrinho) — Fase 1

Cabeçalho genérico `operacoes` (com `tipo`) + `movimentacoes.operacao_id` opcional.
O cálculo de estoque/custo médio continua sendo feito pela view `v_estoque_atual`
existente, que soma por `produto_id`/`tipo` e ignora o cabeçalho — **nada nela muda**.

```sql
-- 'tipo' é text simples (entrada já previsto p/ fase 2); CHECK garante os valores
create table public.operacoes (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null check (tipo in ('entrada', 'saida')),
  data_operacao timestamptz not null default now(),
  observacao    text null,
  total         numeric(10, 2) not null default 0,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz null
);
create index operacoes_tipo_idx       on public.operacoes (tipo);
create index operacoes_deleted_at_idx on public.operacoes (deleted_at);

-- liga a movimentação ao cabeçalho (null = avulsa / legada / perda)
alter table public.movimentacoes add column operacao_id uuid null
  references public.operacoes (id);
create index movimentacoes_operacao_id_idx on public.movimentacoes (operacao_id);
```

### RPC `registrar_venda` (cabeçalho + N itens, atômico)

```sql
create or replace function registrar_venda(
  p_observacao text default null,
  p_data       timestamptz default null,
  p_itens      jsonb default '[]'  -- [{produto_id, quantidade, preco_venda_unitario}]
) returns uuid as $$
declare
  v_id    uuid;
  v_total numeric;
begin
  if jsonb_array_length(p_itens) = 0 then
    raise exception 'venda sem itens';
  end if;

  select coalesce(
           sum((i->>'quantidade')::numeric * (i->>'preco_venda_unitario')::numeric),
           0)
    into v_total
    from jsonb_array_elements(p_itens) i;

  insert into operacoes (tipo, data_operacao, observacao, total)
  values ('saida', coalesce(p_data, now()), p_observacao, v_total)
  returning id into v_id;

  insert into movimentacoes
    (produto_id, tipo, quantidade, preco_venda_unitario, data_movimentacao, operacao_id)
  select (i->>'produto_id')::uuid,
         'saida',
         (i->>'quantidade')::numeric,
         (i->>'preco_venda_unitario')::numeric,
         coalesce(p_data, now()),
         v_id
    from jsonb_array_elements(p_itens) i;

  return v_id;
end;
$$ language plpgsql security definer;
```

### RPC `excluir_venda` (soft-delete em cascata — restaura estoque)

Excluir a venda precisa marcar `deleted_at` nas movimentações filhas também, senão a
`v_estoque_atual` (que filtra por `deleted_at`) não devolve o estoque.

```sql
create or replace function excluir_venda(p_id uuid) returns void as $$
begin
  update movimentacoes set deleted_at = now()
    where operacao_id = p_id and deleted_at is null;
  update operacoes set deleted_at = now() where id = p_id;
end;
$$ language plpgsql security definer;
```
