import { useEffect, useMemo, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Spin, Typography } from "antd";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import dayjs from "dayjs";
import InputCpfCnpj from "@/components/input-cpf-cnpj/input-cpf-cnpj";
import { useDebouncedValue } from "@/lib/use-debounce";
import { useGetVenda } from "../api/get-one";
import ComprovanteDocument from "../pdf/comprovante-document";

const { Text } = Typography;

type Props = {
  vendaId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function ComprovanteVenda({ vendaId, open, onClose }: Props) {
  const { data: venda, isLoading } = useGetVenda(vendaId ?? undefined);

  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  // Limpa os campos ao trocar de venda / reabrir a modal.
  useEffect(() => {
    if (!open) {
      setNome("");
      setCpfCnpj("");
      setEndereco("");
    }
  }, [open, vendaId]);

  // O PDF é caro de renderizar; espera parar de digitar antes de reconstruir.
  const nomeDebounced = useDebouncedValue(nome, 800);
  const cpfCnpjDebounced = useDebouncedValue(cpfCnpj, 800);
  const enderecoDebounced = useDebouncedValue(endereco, 800);

  const doc = useMemo(
    () =>
      venda ? (
        <ComprovanteDocument
          venda={venda}
          cliente={{
            nome: nomeDebounced,
            cpfCnpj: cpfCnpjDebounced,
            endereco: enderecoDebounced,
          }}
        />
      ) : null,
    [venda, nomeDebounced, cpfCnpjDebounced, enderecoDebounced],
  );
  const fileName = venda
    ? `comprovante-venda-${dayjs(venda.data_operacao).format("YYYY-MM-DD")}.pdf`
    : "comprovante.pdf";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Comprovante de venda"
      footer={[
        <Button key="fechar" onClick={onClose}>
          Fechar
        </Button>,
        doc ? (
          <PDFDownloadLink
            key="baixar"
            document={doc}
            fileName={fileName}
            style={{ textDecoration: "none" }}
          >
            {({ loading }) => (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={loading}
              >
                Baixar PDF
              </Button>
            )}
          </PDFDownloadLink>
        ) : null,
      ]}
      width={680}
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div>
            <Text type="secondary">Comprador (opcional)</Text>
            <Input
              placeholder="Nome do comprador"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text type="secondary">CPF / CNPJ (opcional)</Text>
            <div style={{ marginTop: 4 }}>
              <InputCpfCnpj value={cpfCnpj} onChange={setCpfCnpj} />
            </div>
          </div>
          <div>
            <Text type="secondary">Endereço (opcional)</Text>
            <Input
              placeholder="Endereço do cliente"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </div>
        </div>

        <div style={{ height: 600 }}>
          {doc && (
            <PDFViewer
              width="100%"
              height="100%"
              showToolbar={false}
              style={{ border: "none" }}
            >
              {doc}
            </PDFViewer>
          )}
        </div>
      </Spin>
    </Modal>
  );
}
