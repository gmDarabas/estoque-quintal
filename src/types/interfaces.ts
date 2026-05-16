export interface GetPageOptions {
  page?: number;
  rpp?: number;
}

export interface Page<T> {
  list: Array<T>;
  totalCount: number;
  page: number;
  rpp: number;
}


export enum Buckets {
  anexosManutencao = 'anexos_manutencao',
  anexosEquipamento = 'anexos_equipamento',
  fotosProduto = 'fotos_produto',
}
