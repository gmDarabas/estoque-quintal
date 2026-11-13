import { supabase } from "@/supabaseClient";

/**
 * `registrar_movimentacao` rejeita `preco_custo_unitario` em saídas e perdas,
 * então essas movimentações não guardam o próprio custo — ele é resolvido na
 * leitura a partir do custo do produto.
 */

/**
 * Custo unitário por produto, na mesma base que `v_estoque_atual` usa para
 * valorizar o estoque (`preco_custo_medio`, a média ponderada das entradas).
 * Cai para o último custo de compra quando o produto nunca teve entrada com
 * preço informado.
 *
 * Produtos excluídos não aparecem na view e ficam fora do mapa, para que a
 * movimentação apareça sem valor em vez de ser valorizada a zero.
 */
export const resolveCustosPorProduto = async (
  produtoIds: string[],
): Promise<Map<string, number>> => {
  const ids = [...new Set(produtoIds)];
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from("v_estoque_atual")
    .select("id, preco_custo_medio, preco_custo_atual")
    .in("id", ids);

  if (error) throw error;

  const custos = new Map<string, number>();
  for (const p of data ?? []) {
    const custo = p.preco_custo_medio ?? p.preco_custo_atual;
    if (custo != null) custos.set(p.id, custo);
  }
  return custos;
};

/** Prefere o custo gravado na própria movimentação, se algum dia houver. */
export const custoUnitario = (
  row: { produto_id: string; preco_custo_unitario?: number | null },
  custos: Map<string, number>,
): number | null =>
  row.preco_custo_unitario ?? custos.get(row.produto_id) ?? null;
