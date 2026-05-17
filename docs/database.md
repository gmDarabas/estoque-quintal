## Tabelas

```sql
CREATE TABLE public.categorias (
id uuid NOT NULL DEFAULT gen_random_uuid(),
nome text NOT NULL,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
deleted_at timestamp with time zone,
CONSTRAINT categorias_pkey PRIMARY KEY (id)
);
CREATE TABLE public.movimentacoes (
id uuid NOT NULL DEFAULT gen_random_uuid(),
produto_id uuid NOT NULL,
tipo USER-DEFINED NOT NULL,
quantidade numeric NOT NULL CHECK (quantidade > 0::numeric),
observacao text,
created_at timestamp with time zone DEFAULT now(),
deleted_at timestamp with time zone,
preco_custo_unitario numeric,
preco_venda_unitario numeric,
CONSTRAINT movimentacoes_pkey PRIMARY KEY (id),
CONSTRAINT movimentacoes_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id)
);
CREATE TABLE public.produtos (
id uuid NOT NULL DEFAULT gen_random_uuid(),
nome text NOT NULL,
descricao text,
categoria_id uuid,
quantidade_atual numeric NOT NULL DEFAULT 0,
estoque_minimo numeric NOT NULL DEFAULT 0,
unidade text NOT NULL DEFAULT 'un'::text,
foto_url text,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
deleted_at timestamp with time zone,
preco_custo_atual numeric,
margem numeric,
CONSTRAINT produtos_pkey PRIMARY KEY (id),
CONSTRAINT produtos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id)
);
```

## Views

```sql
create view public.v_estoque_atual as
with
entradas as (
select
movimentacoes.produto_id,
sum(movimentacoes.quantidade) as qtd_total,
sum(
movimentacoes.quantidade _ movimentacoes.preco_custo_unitario
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
COALESCE(s.quantidade_atual, 0::numeric) _ cm.preco_custo_medio as valor_total_estoque,
COALESCE(s.quantidade_atual, 0::numeric) <= p.estoque_minimo as abaixo_do_minimo
from
produtos p
left join saldo s on s.produto_id = p.id
left join custo_medio cm on cm.produto_id = p.id
where
p.deleted_at is null;
```

## Funções

```sql
  create or replace function registrar_movimentacao(
    p_produto_id           uuid,
    p_tipo                 tipo_movimentacao,
    p_quantidade           numeric,
    p_preco_custo_unitario numeric default null,
    p_preco_venda_unitario numeric default null,
    p_observacao           text default null,
    p_data_movimentacao    timestamptz default null
  )
  returns uuid as $$
  declare
    v_id uuid;
  begin
    -- Validações
    if p_tipo = 'entrada' and p_preco_venda_unitario is not null then
      raise exception 'preco_venda_unitario não é válido para entradas';
    end if;

    if p_tipo in ('saida', 'perda') and p_preco_custo_unitario is not null then
      raise exception 'preco_custo_unitario não é válido para saídas e perdas';
    end if;

    insert into movimentacoes (produto_id, tipo, quantidade, preco_custo_unitario, preco_venda_unitario, observacao, data_movimentacao)
    values (p_produto_id, p_tipo, p_quantidade, p_preco_custo_unitario, p_preco_venda_unitario, p_observacao, coalesce(p_data_movimentacao, now()))
    returning id into v_id;

    if p_tipo = 'entrada' and p_preco_custo_unitario is not null then
      update produtos
        set preco_custo_atual = p_preco_custo_unitario
        where id = p_produto_id;
    end if;

    return v_id;
  end;
  $$ language plpgsql security definer;
```
