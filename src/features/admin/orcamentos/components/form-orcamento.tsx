import { useMemo, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Grid,
  Input,
  Row,
  theme,
  Typography,
} from "antd";
import { FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import SelectProduto from "../../produtos/components/select-produto";
import { ProdutoSelectOption } from "../../produtos/api/list-select";
import InputCpfCnpj from "@/components/input-cpf-cnpj/input-cpf-cnpj";
import { displayMoney } from "@/lib/utils";
import ItensOrcamento from "./itens-orcamento";
import OrcamentoDocument from "../pdf/orcamento-document";
import { OrcamentoItem } from "../types";

const { Text } = Typography;
const { useBreakpoint } = Grid;

/** Preço de venda sugerido a partir do custo atual e da margem do produto. */
function precoSugerido(p: ProdutoSelectOption): number {
  if (p.preco_custo_atual == null || p.margem == null) return 0;
  return Math.round(p.preco_custo_atual * (1 + p.margem / 100) * 100) / 100;
}

let seq = 0;
const novaKey = () => `item-${Date.now()}-${seq++}`;

export default function FormOrcamento() {
  const screens = useBreakpoint();
  const isDesktop = !!screens.lg;
  const { token } = theme.useToken();

  const [data, setData] = useState<Dayjs>(dayjs());
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCnpj, setClienteCnpj] = useState("");
  const [itens, setItens] = useState<OrcamentoItem[]>([]);

  const total = itens.reduce(
    (s, it) => s + it.quantidade * it.valor_unitario,
    0,
  );

  const handleAddProduto = (p: ProdutoSelectOption | null) => {
    if (!p) return;
    setItens((prev) => [
      ...prev,
      {
        key: novaKey(),
        produto_id: p.id,
        descricao: p.nome,
        quantidade: 1,
        valor_unitario: precoSugerido(p),
      },
    ]);
  };

  const handleAddLinha = () =>
    setItens((prev) => [
      ...prev,
      {
        key: novaKey(),
        produto_id: null,
        descricao: "",
        quantidade: 1,
        valor_unitario: 0,
      },
    ]);

  const handleChange = (index: number, patch: Partial<OrcamentoItem>) =>
    setItens((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  const handleRemove = (index: number) =>
    setItens((prev) => prev.filter((_, i) => i !== index));

  const podeGerar =
    clienteNome.trim().length > 0 &&
    itens.length > 0 &&
    itens.every((it) => it.descricao.trim().length > 0);

  const doc = useMemo(
    () => (
      <OrcamentoDocument
        dataEmissao={data.toISOString()}
        clienteNome={clienteNome}
        clienteCnpj={clienteCnpj}
        itens={itens}
      />
    ),
    [data, clienteNome, clienteCnpj, itens],
  );

  const fileName = `orcamento-${
    clienteNome.trim().toLowerCase().replace(/\s+/g, "-") || "cliente"
  }-${data.format("YYYY-MM-DD")}.pdf`;

  const baixarBtn = podeGerar ? (
    <PDFDownloadLink
      document={doc}
      fileName={fileName}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <Button
          type="primary"
          size="large"
          icon={<FilePdfOutlined />}
          loading={loading}
          style={{ height: 52, fontSize: 16, paddingInline: 28 }}
        >
          Baixar PDF
        </Button>
      )}
    </PDFDownloadLink>
  ) : (
    <Button
      type="primary"
      size="large"
      icon={<FilePdfOutlined />}
      disabled
      style={{ height: 52, fontSize: 16, paddingInline: 28 }}
    >
      Baixar PDF
    </Button>
  );

  const formCol = (
    <div>
      <Text type="secondary">Data de emissão</Text>
      <DatePicker
        format="DD/MM/YYYY"
        size="large"
        allowClear={false}
        value={data}
        onChange={(d) => d && setData(d)}
        style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
      />

      <Text type="secondary">Cliente</Text>
      <Input
        size="large"
        placeholder="Nome do cliente"
        value={clienteNome}
        onChange={(e) => setClienteNome(e.target.value)}
        style={{ marginTop: 4, marginBottom: 12 }}
      />

      <Text type="secondary">CPF / CNPJ</Text>
      <div style={{ marginTop: 4, marginBottom: 16 }}>
        <InputCpfCnpj value={clienteCnpj} onChange={setClienteCnpj} />
      </div>

      <Text type="secondary">Adicionar item</Text>
      <div style={{ marginTop: 4, marginBottom: 8 }}>
        <SelectProduto
          value={null}
          onSelect={handleAddProduto}
          placeholder="🔍 Buscar produto"
        />
      </div>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAddLinha}
        block
        style={{ marginBottom: 16 }}
      >
        Adicionar linha avulsa
      </Button>

      <ItensOrcamento
        items={itens}
        onChangeItem={handleChange}
        onRemove={handleRemove}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
            Total
          </Text>
          <Text strong style={{ fontSize: 22, color: token.colorPrimary }}>
            {displayMoney(total) || "R$ 0,00"}
          </Text>
        </div>
        {baixarBtn}
      </div>

      {!podeGerar && (
        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginTop: 8 }}
        >
          Informe o nome do cliente e adicione ao menos um item (com descrição)
          para gerar o PDF.
        </Text>
      )}
    </div>
  );

  if (!isDesktop) return formCol;

  return (
    <Row gutter={24}>
      <Col span={11}>{formCol}</Col>
      <Col span={13}>
        <div style={{ position: "sticky", top: 16 }}>
          <Text type="secondary">Pré-visualização</Text>
          <div
            style={{
              marginTop: 8,
              height: "calc(100vh - 220px)",
              minHeight: 480,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {podeGerar ? (
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                style={{ border: "none" }}
              >
                {doc}
              </PDFViewer>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <Text type="secondary">
                  Preencha o cliente e adicione itens para ver o orçamento.
                </Text>
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}
