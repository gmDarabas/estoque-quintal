import {
  Button,
  Descriptions,
  Drawer,
  Grid,
  Image,
  Modal,
  Tag,
  Tooltip,
  Typography,
} from "antd";

const { useBreakpoint } = Grid;
import {
  PictureOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { ProdutoEstoque } from "../../api/types";
import { displayMoney } from "@/lib/utils";
import "./modal-produto.css";

const { Text } = Typography;

const TipLabel = ({ label, tip }: { label: string; tip: string }) => (
  <span>
    {label}&nbsp;
    <Tooltip title={tip}>
      <QuestionCircleOutlined style={{ color: "#aaa", cursor: "help" }} />
    </Tooltip>
  </span>
);

function calcularPrecoSugerido(produto: ProdutoEstoque): number | null {
  if (produto.preco_custo_medio == null || produto.margem == null) {
    return null;
  }

  return produto.preco_custo_medio * (1 + produto.margem / 100);
}

type Props = {
  produto: ProdutoEstoque | null;
  onClose: () => void;
  onEdit: (id: string) => void;
};

export default function ModalProduto({ produto, onClose, onEdit }: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  if (!produto) return null;

  const precoVendaSugerido = calcularPrecoSugerido(produto);

  const handleEdit = () => {
    onEdit(produto.id);
    onClose();
  };

  const footer = [
    <Button key="fechar" onClick={onClose}>
      Fechar
    </Button>,
    <Button key="editar" type="primary" onClick={handleEdit}>
      Editar
    </Button>,
  ];

  const conteudo = (
    <div className="produto-modal">
      <ProdutoImagem produto={produto} />
      <ProdutoInfo produto={produto} />
      <ProdutoDescricao descricao={produto.descricao} />
      <EstoqueSection produto={produto} />
      <PrecosSection produto={produto} precoVendaSugerido={precoVendaSugerido} />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        open
        placement="bottom"
        height="100dvh"
        title="Informações do Produto"
        onClose={onClose}
        styles={{ body: { overflowY: "auto", padding: 0 } }}
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {footer}
          </div>
        }
      >
        {conteudo}
      </Drawer>
    );
  }

  return (
    <Modal open title="Informações do Produto" onCancel={onClose} footer={footer}>
      {conteudo}
    </Modal>
  );
}

function ProdutoImagem({ produto }: { produto: ProdutoEstoque }) {
  return (
    <div className="produto-imagem-wrapper">
      {produto.foto_url ? (
        <Image
          src={produto.foto_url}
          width={120}
          height={120}
          className="produto-imagem"
          preview={{ zIndex: 2000 }}
        />
      ) : (
        <div className="produto-imagem-placeholder">
          <PictureOutlined className="produto-imagem-icon" />
        </div>
      )}
    </div>
  );
}

function ProdutoInfo({ produto }: { produto: ProdutoEstoque }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {produto.nome}
        </Typography.Title>
        {produto.categoria?.nome && <Tag>{produto.categoria.nome}</Tag>}
      </div>
      {produto.codigo && (
        <Text type="secondary" style={{ fontSize: 13 }}>
          Código: {produto.codigo}
        </Text>
      )}
      {produto.abaixo_do_minimo && (
        <div>
          <Tag color="red" icon={<WarningOutlined />}>
            Abaixo do mínimo
          </Tag>
        </div>
      )}
    </div>
  );
}

function ProdutoDescricao({ descricao }: { descricao?: string | null }) {
  if (!descricao) return null;

  return <Text type="secondary">{descricao}</Text>;
}

function EstoqueSection({ produto }: { produto: ProdutoEstoque }) {
  return (
    <Descriptions title="Estoque" bordered column={1} size="small">
      <Descriptions.Item label="Quantidade atual">
        <Tag color={produto.abaixo_do_minimo ? "red" : "green"}>
          {produto.quantidade_atual} {produto.unidade}
        </Tag>
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <TipLabel
            label="Estoque mínimo"
            tip="Quantidade mínima antes de ser necessário repor o estoque."
          />
        }
      >
        {produto.estoque_minimo} {produto.unidade}
      </Descriptions.Item>
    </Descriptions>
  );
}

function PrecosSection({
  produto,
  precoVendaSugerido,
}: {
  produto: ProdutoEstoque;
  precoVendaSugerido: number | null;
}) {
  return (
    <Descriptions title="Preços" bordered column={1} size="small">
      <Descriptions.Item
        label={
          <TipLabel
            label="Custo médio"
            tip="Média ponderada do preço de custo de todas as entradas registradas."
          />
        }
      >
        {displayMoney(produto.preco_custo_medio)}
      </Descriptions.Item>

      <Descriptions.Item label="Margem">
        {produto.margem != null ? `${produto.margem}%` : "—"}
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <TipLabel
            label="Preço sugerido"
            tip="Calculado como: custo médio × (1 + margem)."
          />
        }
      >
        <PrecoSugerido
          produto={produto}
          precoVendaSugerido={precoVendaSugerido}
        />
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <TipLabel
            label="Valor em estoque"
            tip="Estimativa do valor total do estoque: custo médio × quantidade atual."
          />
        }
      >
        {displayMoney(produto.valor_total_estoque)}
      </Descriptions.Item>
    </Descriptions>
  );
}

function PrecoSugerido({
  produto,
  precoVendaSugerido,
}: {
  produto: ProdutoEstoque;
  precoVendaSugerido: number | null;
}) {
  if (precoVendaSugerido != null) {
    return (
      <Text strong className="preco-sugerido">
        {displayMoney(precoVendaSugerido)}
      </Text>
    );
  }

  return (
    <Text type="secondary">
      —{" "}
      {produto.preco_custo_medio == null
        ? "sem custo médio"
        : "defina a margem para calcular"}
    </Text>
  );
}
