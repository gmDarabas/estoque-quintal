import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import FormAbrirInventario from "./components/form-abrir-inventario";

export default function PageCadastroInventario() {
  const navigate = useNavigate();

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate("/inventarios")}
        title="Novo Inventário"
      />
      <DefaultPageContainer>
        <FormAbrirInventario />
      </DefaultPageContainer>
    </>
  );
}
