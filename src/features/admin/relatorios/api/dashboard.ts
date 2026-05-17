import { supabase } from "@/supabaseClient";
import { useQuery } from "react-query";

export type DashboardKpis = {
  valorTotalEstoque: number;
  totalProdutos: number;
  produtosAbaixoMinimo: number;
};

export type PeriodKpis = {
  valorEntradas: number;
  valorSaidas: number;
  valorPerdas: number;
};

export type EstoquePorCategoria = {
  categoria: string;
  qtdProdutos: number;
  valorTotal: number;
  percentual: number;
};

const fetchDashboardKpis = async (): Promise<DashboardKpis> => {
  const { data: produtos, error } = await supabase
    .from("v_estoque_atual")
    .select("valor_total_estoque,abaixo_do_minimo");

  if (error) throw error;

  return {
    valorTotalEstoque:
      produtos?.reduce((s, p) => s + (p.valor_total_estoque ?? 0), 0) ?? 0,
    totalProdutos: produtos?.length ?? 0,
    produtosAbaixoMinimo:
      produtos?.filter((p) => p.abaixo_do_minimo).length ?? 0,
  };
};

const fetchPeriodKpis = async (
  dataDe: string,
  dataAte: string,
): Promise<PeriodKpis> => {
  const [
    { data: entradas, error: e1 },
    { data: saidas, error: e2 },
    { data: perdas, error: e3 },
  ] = await Promise.all([
    supabase
      .from("movimentacoes")
      .select("quantidade,preco_custo_unitario")
      .eq("tipo", "entrada")
      .is("deleted_at", null)
      .gte("data_movimentacao", dataDe)
      .lte("data_movimentacao", dataAte),
    supabase
      .from("movimentacoes")
      .select("quantidade,preco_venda_unitario")
      .eq("tipo", "saida")
      .is("deleted_at", null)
      .gte("data_movimentacao", dataDe)
      .lte("data_movimentacao", dataAte),
    supabase
      .from("movimentacoes")
      .select("quantidade,produtos(preco_custo_atual)")
      .eq("tipo", "perda")
      .is("deleted_at", null)
      .gte("data_movimentacao", dataDe)
      .lte("data_movimentacao", dataAte),
  ]);

  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;

  return {
    valorEntradas:
      entradas?.reduce(
        (s, e) => s + e.quantidade * (e.preco_custo_unitario ?? 0),
        0,
      ) ?? 0,
    valorSaidas:
      saidas?.reduce(
        (s, e) => s + e.quantidade * (e.preco_venda_unitario ?? 0),
        0,
      ) ?? 0,
    valorPerdas:
      perdas?.reduce((s, p) => {
        const custo =
          (
            p.produtos as unknown as {
              preco_custo_atual?: number | null;
            } | null
          )?.preco_custo_atual ?? 0;
        return s + p.quantidade * custo;
      }, 0) ?? 0,
  };
};

const fetchEstoquePorCategoria = async (): Promise<EstoquePorCategoria[]> => {
  const { data, error } = await supabase
    .from("v_estoque_atual")
    .select("valor_total_estoque, categorias(nome)");

  if (error) throw error;

  const map = new Map<string, { qtd: number; valor: number }>();

  for (const row of data ?? []) {
    const nome =
      (row.categorias as unknown as { nome: string } | null)?.nome ??
      "Sem categoria";
    const atual = map.get(nome) ?? { qtd: 0, valor: 0 };
    map.set(nome, {
      qtd: atual.qtd + 1,
      valor: atual.valor + (row.valor_total_estoque ?? 0),
    });
  }

  const totalGeral = [...map.values()].reduce((s, v) => s + v.valor, 0);

  return [...map.entries()]
    .map(([categoria, { qtd, valor }]) => ({
      categoria,
      qtdProdutos: qtd,
      valorTotal: valor,
      percentual: totalGeral > 0 ? (valor / totalGeral) * 100 : 0,
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal);
};

export const useDashboardKpis = () =>
  useQuery(["dashboard-kpis"], fetchDashboardKpis, { staleTime: 60_000 });

export const usePeriodKpis = (dataDe: string, dataAte: string) =>
  useQuery(
    ["period-kpis", dataDe, dataAte],
    () => fetchPeriodKpis(dataDe, dataAte),
    {
      staleTime: 60_000,
    },
  );

export const useEstoquePorCategoria = () =>
  useQuery(["estoque-por-categoria"], fetchEstoquePorCategoria, {
    staleTime: 60_000,
  });
