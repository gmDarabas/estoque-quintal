import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import FormVenda from "./components/form-venda";

export default function PageCadastroVenda() {
  const navigate = useNavigate();

  return (
    <>
      <DefaultPageHeader onBack={() => navigate(-1)} title="Registrar Venda" />
      <DefaultPageContainer>
        <FormVenda />
      </DefaultPageContainer>
    </>
  );
}
