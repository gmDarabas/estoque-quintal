import { StatusInventario } from "../api/types";

export const STATUS_COLOR: Record<StatusInventario, string> = {
  aberto: "blue",
  fechado: "green",
  cancelado: "default",
};

export const STATUS_LABEL: Record<StatusInventario, string> = {
  aberto: "Aberto",
  fechado: "Fechado",
  cancelado: "Cancelado",
};
