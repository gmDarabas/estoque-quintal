import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useGetInventario } from "./api/get-one";
import { useListInventarioItens } from "./api/list-itens";
import ContagemInventario from "./components/contagem-inventario";

export default function PageInventario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: inventario, isLoading: loadingInventario } =
    useGetInventario(id);
  const { data: itens, isLoading: loadingItens } = useListInventarioItens(id);

  const carregando = loadingInventario || loadingItens;

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate("/inventarios")}
        title={inventario?.descricao || "Inventário"}
      />
      <DefaultPageContainer>
        {carregando || !inventario || !itens ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <ContagemInventario inventario={inventario} itens={itens} />
        )}
      </DefaultPageContainer>
    </>
  );
}
