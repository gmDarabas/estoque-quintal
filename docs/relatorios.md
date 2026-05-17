# Relatórios e Indicadores — Planejamento

## Classificação

- **Implantação** — útil desde o primeiro dia, funciona sem histórico
- **Com histórico** — ganha valor após meses de uso; implantar depois

## Fase 2: Com Histórico (3+ meses de uso)

### Relatório Financeiro Mensal

> Compara meses. Sem histórico, um único mês não diz nada.

**Indicadores por mês:**

- Faturamento bruto: `SUM(quantidade × preco_venda_unitario)` das saídas
- CMV (custo da mercadoria vendida): `SUM(quantidade × preco_custo_medio)` das saídas
- Lucro bruto e margem bruta %
- Total de perdas (valor de custo)

**Nova view: `v_resumo_mensal`**

```sql
select
  date_trunc('month', created_at) as mes,
  sum(case when tipo = 'saida' then quantidade * preco_venda_unitario end) as receita,
  sum(case when tipo = 'saida' then quantidade * preco_custo_unitario end) as cmv,
  sum(case when tipo = 'perda' then quantidade * preco_custo_unitario end) as perdas,
  sum(case when tipo = 'entrada' then quantidade end) as qtd_entrada,
  sum(case when tipo = 'saida'  then quantidade end) as qtd_saida
from movimentacoes
where deleted_at is null
group by 1
order by 1;
```

**Gráfico:** barras agrupadas (receita vs. CMV) com linha de margem sobreposta.

---

### Margem por Produto

> Precisa de volume de vendas razoável para ser representativo.

**Conteúdo:** ranking de produtos por margem e lucro absoluto:

- Receita total, CMV total, lucro bruto, margem %
- Filtrável por período e categoria

**Nova view: `v_margem_por_produto`**

```sql
select
  p.id,
  p.nome,
  p.categoria_id,
  sum(m.quantidade * m.preco_venda_unitario) as receita,
  sum(m.quantidade * m.preco_custo_unitario) as cmv,
  sum(m.quantidade * m.preco_venda_unitario)
    - sum(m.quantidade * m.preco_custo_unitario) as lucro_bruto,
  round(
    (sum(m.quantidade * m.preco_venda_unitario)
      - sum(m.quantidade * m.preco_custo_unitario))
    / nullif(sum(m.quantidade * m.preco_venda_unitario), 0) * 100,
  2) as margem_pct
from movimentacoes m
join produtos p on p.id = m.produto_id
where m.tipo = 'saida'
  and m.deleted_at is null
  and m.preco_venda_unitario is not null
  and m.preco_custo_unitario is not null
group by p.id, p.nome, p.categoria_id;
```

---

### Curva ABC

> Clássico para priorizar compras e espaço físico. Requer histórico de vendas consolidado.

**Lógica:** produtos ranqueados por faturamento acumulado, classificados em:

- **A** — 80% do faturamento (poucos produtos, alta atenção)
- **B** — 15% do faturamento
- **C** — 5% do faturamento (muitos produtos, baixo impacto)

**Nova view: `v_curva_abc`**

```sql
with vendas as (
  select
    produto_id,
    sum(quantidade * preco_venda_unitario) as receita
  from movimentacoes
  where tipo = 'saida'
    and deleted_at is null
    and preco_venda_unitario is not null
  group by produto_id
),
ranking as (
  select
    produto_id,
    receita,
    sum(receita) over () as receita_total,
    sum(receita) over (order by receita desc) as receita_acumulada
  from vendas
)
select
  p.nome,
  r.receita,
  round(r.receita / r.receita_total * 100, 1) as participacao_pct,
  round(r.receita_acumulada / r.receita_total * 100, 1) as acumulado_pct,
  case
    when r.receita_acumulada / r.receita_total <= 0.80 then 'A'
    when r.receita_acumulada / r.receita_total <= 0.95 then 'B'
    else 'C'
  end as classe
from ranking r
join produtos p on p.id = r.produto_id
order by r.receita desc;
```

---

### Giro de Estoque por Produto

> Identifica produtos parados. Precisa de pelo menos 1 mês completo para ser relevante.

**Cálculo:** `quantidade vendida no período / estoque médio no período`

- Giro alto → produto se vende rápido, menos capital preso
- Giro baixo → produto parado, risco de vencimento/obsolescência

**Nova view: `v_giro_estoque`** (parametrizável por período via RPC ou calculado no frontend com dados brutos).

---

## Resumo das Views Novas por Fase

| View                      | Fase          | Descrição                               |
| ------------------------- | ------------- | --------------------------------------- |
| `v_estoque_por_categoria` | Implantação   | Valor de estoque agrupado por categoria |
| `v_resumo_mensal`         | Com histórico | Receita, CMV, lucro e perdas por mês    |
| `v_margem_por_produto`    | Com histórico | Margem bruta por produto                |
| `v_curva_abc`             | Com histórico | Classificação ABC por faturamento       |
| `v_giro_estoque`          | Com histórico | Giro de estoque por produto             |
