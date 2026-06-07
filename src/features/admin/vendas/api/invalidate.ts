import { QueryClient } from "react-query";

/**
 * Query keys afetadas ao registrar ou excluir uma venda. Como uma venda mexe no
 * estoque e nas métricas, várias caches precisam ser invalidadas. No react-query
 * v3 o match por string é por igualdade do primeiro segmento, então keys como
 * "vendas-resumo" não são pegas ao invalidar "vendas" — todas vão listadas aqui.
 */
const VENDA_QUERY_KEYS = [
  "vendas", // listagem de vendas
  "vendas-resumo", // métricas da página de vendas
  "movimentacoes", // movimentações geradas pela venda
  "produtos", // listagem/estoque de produtos
  "produtos-select", // saldo usado na validação de quantidade
  "dashboard-kpis", // KPIs da home
  "period-kpis", // KPIs por período
  "estoque-por-categoria", // gráfico de estoque por categoria
];

export const invalidateVendaQueries = (queryClient: QueryClient) =>
  Promise.all(
    VENDA_QUERY_KEYS.map((key) => queryClient.invalidateQueries(key)),
  );
