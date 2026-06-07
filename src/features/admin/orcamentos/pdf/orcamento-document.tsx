import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { styles } from "@/components/pdf/timbrado-styles";
import timbradoBg from "@/components/pdf/assets/timbrado-bg.png";
import { displayCpfCnpj, displayMoney } from "@/lib/utils";
import { OrcamentoItem } from "../types";

const money = (v: number) => displayMoney(v) || "R$ 0,00";

type Props = {
  dataEmissao: string;
  clienteNome: string;
  clienteCnpj: string;
  itens: OrcamentoItem[];
  validadeDias?: number;
};

export default function OrcamentoDocument({
  dataEmissao,
  clienteNome,
  clienteCnpj,
  itens,
  validadeDias = 30,
}: Props) {
  const total = itens.reduce(
    (s, it) => s + (it.quantidade || 0) * (it.valor_unitario || 0),
    0,
  );
  const cnpj = clienteCnpj ? displayCpfCnpj(clienteCnpj) : "";

  return (
    <Document title="Orçamento - Quintal da Olívia">
      <Page size="A4" style={styles.page}>
        {/* Fundo timbrado — repete em todas as páginas */}
        <Image src={timbradoBg} fixed style={styles.bg} />

        <Text style={styles.titulo}>Orçamento</Text>

        <Text style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Data de Emissão: </Text>
          {dayjs(dataEmissao).format("DD/MM/YYYY")} (Validade {validadeDias} dias)
        </Text>
        <Text style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Cliente: </Text>
          {clienteNome || "—"}
          {cnpj ? ` - ${cnpj}` : ""}
        </Text>

        <View style={styles.table}>
          {/* Cabeçalho — fixed para repetir ao quebrar página */}
          <View style={[styles.row, styles.headerRow]} fixed>
            <View style={[styles.cell, styles.colItem]}>
              <Text style={styles.headerText}>Item</Text>
            </View>
            <View style={[styles.cell, styles.colQtd]}>
              <Text style={styles.headerText}>Qtd.</Text>
            </View>
            <View style={[styles.cell, styles.colValor]}>
              <Text style={styles.headerText}>Valor unitário</Text>
            </View>
            <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
              <Text style={styles.headerText}>Total</Text>
            </View>
          </View>

          {/* Itens — wrap=false evita cortar uma linha entre páginas */}
          {itens.map((it) => (
            <View key={it.key} style={styles.row} wrap={false}>
              <View style={[styles.cell, styles.colItem]}>
                <Text>{it.descricao || "—"}</Text>
              </View>
              <View style={[styles.cell, styles.colQtd]}>
                <Text>{it.quantidade ?? 0}</Text>
              </View>
              <View style={[styles.cell, styles.colValor]}>
                <Text>{money(it.valor_unitario)}</Text>
              </View>
              <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
                <Text>{money((it.quantidade || 0) * (it.valor_unitario || 0))}</Text>
              </View>
            </View>
          ))}

          {/* Total */}
          <View style={styles.row} wrap={false}>
            <View style={[styles.cell, styles.colItem]}>
              <Text style={[styles.bold, { textAlign: "right" }]}>Total</Text>
            </View>
            <View style={[styles.cell, styles.colTotal, styles.cellLast]}>
              <Text style={styles.bold}>{money(total)}</Text>
            </View>
          </View>
        </View>

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
