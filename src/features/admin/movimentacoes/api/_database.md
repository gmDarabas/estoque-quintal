### RPC para criar movimentacoes

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
