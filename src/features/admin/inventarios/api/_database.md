### Inventário (contagem física)

O inventário **não** altera `quantidade_atual` diretamente — esse saldo é derivado
das movimentações (view `v_estoque_atual`). Ao fechar, cada divergência gera uma
movimentação que reconcilia o saldo com a contagem:

- **falta** (contado < esperado) → `perda`
- **sobra** (contado > esperado) → `entrada` (sem `preco_custo_unitario`, para não
  distorcer o custo médio)

A origem fica rastreável pela `observacao` de cada movimentação gerada.

#### Enum de status

```sql
create type status_inventario as enum ('aberto', 'fechado', 'cancelado');
```

#### Tabelas

```sql
create table public.inventarios (
  id          uuid not null default gen_random_uuid(),
  status      status_inventario not null default 'aberto',
  descricao   text null,
  iniciado_em timestamptz not null default now(),
  fechado_em  timestamptz null,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz null,
  constraint inventarios_pkey primary key (id)
) tablespace pg_default;

create index if not exists inventarios_deleted_at_idx
  on public.inventarios using btree (deleted_at);

create table public.inventario_itens (
  id            uuid not null default gen_random_uuid(),
  inventario_id uuid not null,
  produto_id    uuid not null,
  qtd_esperada  numeric(10, 2) not null default 0,
  qtd_contada   numeric(10, 2) null,
  observacao    text null,
  contado_em    timestamptz null,
  created_at    timestamptz not null default now(),
  constraint inventario_itens_pkey primary key (id),
  constraint inventario_itens_inventario_id_fkey
    foreign key (inventario_id) references inventarios (id) on delete cascade,
  constraint inventario_itens_produto_id_fkey
    foreign key (produto_id) references produtos (id),
  constraint inventario_itens_unq unique (inventario_id, produto_id)
) tablespace pg_default;

create index if not exists inventario_itens_inventario_id_idx
  on public.inventario_itens using btree (inventario_id);
```

#### RPC `abrir_inventario`

Cria o cabeçalho e tira um snapshot do saldo esperado de cada produto. Os arrays de
categoria/fornecedor apenas filtram quais produtos entram (não ficam salvos). Vazio = todos.

```sql
create or replace function abrir_inventario(
  p_descricao      text default null,
  p_categoria_ids  uuid[] default null,
  p_fornecedor_ids uuid[] default null
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into inventarios (descricao)
  values (p_descricao)
  returning id into v_id;

  insert into inventario_itens (inventario_id, produto_id, qtd_esperada)
  select v_id, e.id, e.quantidade_atual
  from v_estoque_atual e
  where (p_categoria_ids is null or e.categoria_id = any (p_categoria_ids))
    and (p_fornecedor_ids is null or e.fornecedor_id = any (p_fornecedor_ids));

  return v_id;
end;
$$ language plpgsql security definer;
```

#### RPC `fechar_inventario`

Percorre os itens contados, gera as movimentações de ajuste e marca o inventário como
fechado. Itens com `qtd_contada` nula (não contados) são ignorados.

```sql
create or replace function fechar_inventario(p_inventario_id uuid)
returns void as $$
declare
  r      record;
  v_diff numeric;
  v_obs  text;
begin
  if not exists (
    select 1 from inventarios
    where id = p_inventario_id and status = 'aberto' and deleted_at is null
  ) then
    raise exception 'Inventário não está aberto';
  end if;

  for r in
    select ii.produto_id, ii.qtd_esperada, ii.qtd_contada
    from inventario_itens ii
    where ii.inventario_id = p_inventario_id
      and ii.qtd_contada is not null
  loop
    v_diff := r.qtd_contada - r.qtd_esperada;

    if v_diff <> 0 then
      v_obs := format(
        'Inventário %s: esperado %s, contado %s',
        p_inventario_id, r.qtd_esperada, r.qtd_contada
      );

      if v_diff > 0 then
        -- sobra: entrada sem custo (não distorce o custo médio)
        perform registrar_movimentacao(
          r.produto_id, 'entrada'::tipo_movimentacao, v_diff,
          null, null, v_obs, null
        );
      else
        -- falta: perda
        perform registrar_movimentacao(
          r.produto_id, 'perda'::tipo_movimentacao, -v_diff,
          null, null, v_obs, null
        );
      end if;
    end if;
  end loop;

  update inventarios
    set status = 'fechado', fechado_em = now()
    where id = p_inventario_id;
end;
$$ language plpgsql security definer;
```
