import { ConfirmOptions, useConfirm } from "./use-confirm";

export interface ConfirmDeleteOptions extends Partial<ConfirmOptions> {
  /** Tipo do registro. Ex: "usuário", "cargo". Usado no título e na mensagem. */
  entidade?: string;
  /** Label do registro específico. Ex: "João Silva". Aparece em destaque na mensagem. */
  identificador?: string;
}

export function useConfirmDelete() {
  const confirm = useConfirm();

  return ({
    entidade,
    identificador,
    ...overrides
  }: ConfirmDeleteOptions = {}): Promise<boolean> => {
    return confirm({
      danger: true,
      okText: "Excluir",
      cancelText: "Cancelar",
      ...overrides,
      title: overrides.title ?? buildTitle(entidade),
      description:
        overrides.description ?? buildDescription(entidade, identificador),
    });
  };
}

function buildTitle(entidade?: string): string {
  return entidade ? `Excluir ${entidade}` : "Excluir registro";
}

function buildDescription(entidade?: string, identificador?: string) {
  const aviso = "Esta ação não pode ser desfeita.";

  if (entidade && identificador) {
    return (
      <>
        Tem certeza que deseja excluir o {entidade}{" "}
        <strong>{identificador}</strong>?
        <br />
        {aviso}
      </>
    );
  }

  if (identificador) {
    return (
      <>
        Tem certeza que deseja excluir <strong>{identificador}</strong>?
        <br />
        {aviso}
      </>
    );
  }

  if (entidade) {
    return `Tem certeza que deseja excluir este ${entidade}? ${aviso}`;
  }

  return `Tem certeza que deseja realizar esta ação? ${aviso}`;
}
