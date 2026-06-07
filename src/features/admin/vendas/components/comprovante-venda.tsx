import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useGetVenda } from "../api/get-one";
import ComprovanteDocument from "../pdf/comprovante-document";

type Props = {
  vendaId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function ComprovanteVenda({ vendaId, open, onClose }: Props) {
  const { data: venda, isLoading } = useGetVenda(vendaId ?? undefined);

  const doc = venda ? <ComprovanteDocument venda={venda} /> : null;
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
