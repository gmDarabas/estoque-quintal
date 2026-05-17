import { createContext, ReactNode, useContext, useState } from "react";
import { Button, Modal, theme, Typography } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { useToken } = theme;
const { Title, Text } = Typography;

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  /** Executado ao confirmar. O botão fica em loading até a Promise resolver/rejeitar. */
  onOk?: () => Promise<unknown> | unknown;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface ConfirmState {
  open: boolean;
  loading: boolean;
  options: ConfirmOptions;
  resolve: ((v: boolean) => void) | null;
}

const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

const EMPTY_OPTIONS: ConfirmOptions = { title: "" };

function GenericModal({ open, loading, options, onOk, onCancel }: ModalProps) {
  return (
    <Modal
      open={open}
      title={options.title}
      onOk={onOk}
      onCancel={onCancel}
      okText={options.okText ?? "Confirmar"}
      cancelText={options.cancelText ?? "Cancelar"}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      centered
    >
      {options.description && (
        <p style={{ margin: "12px 0 4px" }}>{options.description}</p>
      )}
    </Modal>
  );
}

function DangerModal({ open, loading, options, onOk, onCancel }: ModalProps) {
  const { token } = useToken();

  return (
    <Modal
      open={open}
      title={null}
      closable={false}
      centered
      width={400}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 4,
          }}
        >
          <Button onClick={onCancel} disabled={loading}>
            {options.cancelText ?? "Cancelar"}
          </Button>
          <Button type="primary" danger onClick={onOk} loading={loading}>
            {options.okText ?? "Excluir"}
          </Button>
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "28px 8px 12px",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: token.colorErrorBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ExclamationCircleFilled
            style={{ fontSize: 30, color: token.colorError }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Title level={5} style={{ margin: 0 }}>
            {options.title}
          </Title>
          {options.description && (
            <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>
              {options.description}
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    loading: false,
    options: EMPTY_OPTIONS,
    resolve: null,
  });

  const confirm: ConfirmFn = (options) =>
    new Promise((resolve) => {
      setState({ open: true, loading: false, options, resolve });
    });

  const handleOk = async () => {
    const { onOk } = state.options;

    if (onOk) {
      setState((s) => ({ ...s, loading: true }));
      try {
        await onOk();
        state.resolve?.(true);
      } catch {
        state.resolve?.(false);
      } finally {
        setState((s) => ({ ...s, open: false, loading: false, resolve: null }));
      }
    } else {
      state.resolve?.(true);
      setState((s) => ({ ...s, open: false, resolve: null }));
    }
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false, resolve: null }));
  };

  const modalProps: ModalProps = {
    open: state.open,
    loading: state.loading,
    options: state.options,
    onOk: handleOk,
    onCancel: handleCancel,
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.options.danger ? (
        <DangerModal {...modalProps} />
      ) : (
        <GenericModal {...modalProps} />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error("useConfirm deve ser usado dentro de ConfirmProvider");
  return ctx;
}

interface ModalProps {
  open: boolean;
  loading: boolean;
  options: ConfirmOptions;
  onOk: () => void;
  onCancel: () => void;
}
