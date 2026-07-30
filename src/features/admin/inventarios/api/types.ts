import { Produto } from "../../produtos/api/types";

export type StatusInventario = "aberto" | "fechado" | "cancelado";

export type Inventario = {
  id: string;
  status: StatusInventario;
  descricao?: string | null;
  iniciado_em: string;
  fechado_em?: string | null;
  created_at: string;
  deleted_at?: string | null;
};

export type InventarioItem = {
  id: string;
  inventario_id: string;
  produto_id: string;
  qtd_esperada: number;
  qtd_contada?: number | null;
  observacao?: string | null;
  contado_em?: string | null;
  created_at: string;
};

export type InventarioItemComProduto = InventarioItem & {
  produtos?: Pick<
    Produto,
    "id" | "nome" | "codigo" | "unidade" | "foto_url"
  > | null;
};

export type AbrirInventarioDto = {
  descricao?: string | null;
  categoria_ids?: string[] | null;
  fornecedor_ids?: string[] | null;
};
