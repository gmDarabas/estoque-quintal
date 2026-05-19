### Tabela de produtos

```sql
    create table public.produtos (
    id uuid not null default gen_random_uuid (),
    nome text not null,
    descricao text null,
    categoria_id uuid null,
    quantidade_atual numeric(10, 2) not null default 0,
    estoque_minimo numeric(10, 2) not null default 0,
    unidade text not null default 'un'::text,
    foto_url text null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    deleted_at timestamp with time zone null,
    preco_custo_atual numeric(10, 2) null,
    constraint produtos_pkey primary key (id),
    constraint produtos_categoria_id_fkey foreign KEY (categoria_id) references categorias (id) on delete set null
    ) TABLESPACE pg_default;

    create index IF not exists produtos_categoria_id_idx on public.produtos using btree (categoria_id) TABLESPACE pg_default;

    create index IF not exists produtos_deleted_at_idx on public.produtos using btree (deleted_at) TABLESPACE pg_default;

    create trigger trigger_produtos_updated_at BEFORE
    update on produtos for EACH row
    execute FUNCTION atualizar_timestamp ();
```

### View v_estoque_atual

```sql
create or replace view public.v_estoque_atual as
with
  entradas as (
    select
      movimentacoes.produto_id,
      sum(movimentacoes.quantidade) as qtd_total,
      sum(
        movimentacoes.quantidade * movimentacoes.preco_custo_unitario
      ) as valor_total
    from
      movimentacoes
    where
      movimentacoes.tipo = 'entrada'::tipo_movimentacao
      and movimentacoes.preco_custo_unitario is not null
      and movimentacoes.deleted_at is null
    group by
      movimentacoes.produto_id
  ),
  custo_medio as (
    select
      entradas.produto_id,
      entradas.valor_total / NULLIF(entradas.qtd_total, 0::numeric) as preco_custo_medio
    from
      entradas
  ),
  saldo as (
    select
      movimentacoes.produto_id,
      COALESCE(
        sum(
          case
            when movimentacoes.tipo = 'entrada'::tipo_movimentacao then movimentacoes.quantidade
            when movimentacoes.tipo = any (
              array[
                'saida'::tipo_movimentacao,
                'perda'::tipo_movimentacao
              ]
            ) then - movimentacoes.quantidade
            else null::numeric
          end
        ),
        0::numeric
      ) as quantidade_atual
    from
      movimentacoes
    where
      movimentacoes.deleted_at is null
    group by
      movimentacoes.produto_id
  )
select
  p.id,
  p.codigo,
  p.nome,
  p.descricao,
  p.unidade,
  p.estoque_minimo,
  p.categoria_id,
  p.foto_url,
  p.preco_custo_atual,
  p.created_at,
  p.updated_at,
  COALESCE(s.quantidade_atual, 0::numeric) as quantidade_atual,
  cm.preco_custo_medio,
  COALESCE(s.quantidade_atual, 0::numeric) * cm.preco_custo_medio as valor_total_estoque,
  COALESCE(s.quantidade_atual, 0::numeric) < p.estoque_minimo as abaixo_do_minimo,
  p.margem,
  p.fornecedor_id,
  f.nome as fornecedor_nome
from
  produtos p
  left join saldo s on s.produto_id = p.id
  left join custo_medio cm on cm.produto_id = p.id
  left join fornecedores f on f.id = p.fornecedor_id
where
  p.deleted_at is null;
```
