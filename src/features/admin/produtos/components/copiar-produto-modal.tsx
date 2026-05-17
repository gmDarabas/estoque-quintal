import { useState } from "react";
import { Modal, Select } from "antd";
import { getOneProduto } from "../api/get-one";
import { useListProdutosSelect } from "../api/list-select";
import { ProdutoComCategoria } from "../api/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCopy: (produto: ProdutoComCategoria) => void;
};

export default function CopiarProdutoModal({ open, onClose, onCopy }: Props) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: produtos = [] } = useListProdutosSelect();

  const handleOk = async () => {
    if (!selecionado) return;
    setLoading(true);
    try {
      const produto = await getOneProduto(selecionado);
      onCopy(produto);
      setSelecionado(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelecionado(null);
    onClose();
  };

  return (
    <Modal
      title="Copiar de outro produto"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Copiar"
      cancelText="Cancelar"
      okButtonProps={{ disabled: !selecionado, loading }}
    >
      <p style={{ marginBottom: 12, color: "#888" }}>
        Selecione o produto de origem. Todos os campos e a foto serão copiados.
      </p>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="Buscar produto..."
        optionFilterProp="label"
        value={selecionado}
        onChange={setSelecionado}
        options={produtos.map((p) => ({ value: p.id, label: p.nome }))}
      />
    </Modal>
  );
}
