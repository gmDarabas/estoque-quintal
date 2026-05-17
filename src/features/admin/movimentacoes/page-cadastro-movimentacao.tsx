import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import FormMovimentacao from "./components/form-movimentacao";

export default function PageCadastroMovimentacao() {
  const navigate = useNavigate();

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate(-1)}
        title="Registrar Movimentação"
      />
      <DefaultPageContainer>
        <FormMovimentacao />
      </DefaultPageContainer>
    </>
  );
}
