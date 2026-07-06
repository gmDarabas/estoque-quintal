import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { styles } from "@/components/pdf/timbrado-styles";
import timbradoBg from "@/components/pdf/assets/timbrado-bg.png";
import { displayCpfCnpj, displayMoney } from "@/lib/utils";
import { VendaComItens, VendaItem } from "../api/types";

const money = (v: number | null | undefined) => displayMoney(v) || "R$ 0,00";

const subtotal = (it: VendaItem) =>
  (it.quantidade || 0) * (it.preco_venda_unitario || 0);

export type ComprovanteCliente = {
  nome?: string;
  cpfCnpj?: string;
  endereco?: string;
};

type Props = {
  venda: VendaComItens;
  cliente?: ComprovanteCliente;
};

export default function ComprovanteDocument({ venda, cliente }: Props) {
  const nome = cliente?.nome?.trim();
  const cpfCnpj = cliente?.cpfCnpj ? displayCpfCnpj(cliente.cpfCnpj) : "";
  const endereco = cliente?.endereco?.trim();

  return (
    <Document title="Comprovante de Venda - Quintal da Olívia">
      <Page size="A4" style={styles.page}>
        {/* Fundo timbrado — repete em todas as páginas */}
        <Image src={timbradoBg} fixed style={styles.bg} />

        <Text style={styles.titulo}>Comprovante de Venda</Text>

        <Text style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Data: </Text>
          {dayjs(venda.data_operacao).format("DD/MM/YYYY HH:mm")}
        </Text>

        {nome ? (
          <Text style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Comprador: </Text>
            {nome}
            {cpfCnpj ? ` - ${cpfCnpj}` : ""}
          </Text>
        ) : cpfCnpj ? (
          <Text style={styles.infoLinha}>
            <Text style={styles.infoLabel}>CPF / CNPJ: </Text>
            {cpfCnpj}
          </Text>
        ) : null}

        {endereco ? (
          <Text style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Endereço: </Text>
            {endereco}
          </Text>
        ) : null}

        <View style={styles.table}>
          {/* Cabeçalho — fixed para repetir ao quebrar página */}
          <View style={[styles.row, styles.headerRow]} fixed>
            <View style={[styles.cell, styles.colItem]}>
              <Text style={styles.headerText}>Produto</Text>
            </View>
            <View style={[styles.cell, styles.colQtd]}>
              <Text style={styles.headerText}>Qtd.</Text>
            </View>
            <View style={[styles.cell, styles.colValor]}>
              <Text style={styles.headerText}>Preço un.</Text>
            </View>
            <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
              <Text style={styles.headerText}>Subtotal</Text>
            </View>
          </View>

          {/* Itens — wrap=false evita cortar uma linha entre páginas */}
          {venda.itens.map((it) => (
            <View key={it.id} style={styles.row} wrap={false}>
              <View style={[styles.cell, styles.colItem]}>
                <Text>{it.produtos?.nome ?? "—"}</Text>
              </View>
              <View style={[styles.cell, styles.colQtd]}>
                <Text>
                  {it.quantidade}
                  {it.produtos?.unidade ? ` ${it.produtos.unidade}` : ""}
                </Text>
              </View>
              <View style={[styles.cell, styles.colValor]}>
                <Text>{money(it.preco_venda_unitario)}</Text>
              </View>
              <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
                <Text>{money(subtotal(it))}</Text>
              </View>
            </View>
          ))}

          {/* Total */}
          <View style={styles.row} wrap={false}>
            <View style={[styles.cell, styles.colItem]}>
              <Text style={[styles.bold, { textAlign: "right" }]}>Total</Text>
            </View>
            <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
              <Text style={styles.bold}>{money(venda.total)}</Text>
            </View>
          </View>
        </View>

        {venda.observacao ? (
          <Text style={styles.observacao}>
            <Text style={styles.infoLabel}>Observação: </Text>
            {venda.observacao}
          </Text>
        ) : null}

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Página ${pageNumber} de ${totalPages}` : ""
          }
        />
      </Page>
    </Document>
  );
}
