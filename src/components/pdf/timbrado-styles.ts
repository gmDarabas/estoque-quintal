import { StyleSheet } from "@react-pdf/renderer";

/**
 * Estilos compartilhados para documentos em folha timbrada (orçamento,
 * comprovante de venda, etc.), calibrados para o fundo `timbrado-bg.png`
 * (A4, 1414×2000). PADDING_TOP deixa passar o cabeçalho (logo + contato);
 * PADDING_BOTTOM deixa passar a faixa de florais inferior.
 * Ajuste estes valores se trocar a arte do timbrado.
 */
const A4 = { width: 595.28, height: 841.89 };
const PADDING_TOP = 120;
const PADDING_BOTTOM = 100;
const PADDING_X = 45;

export const styles = StyleSheet.create({
  page: {
    paddingTop: PADDING_TOP,
    paddingBottom: PADDING_BOTTOM,
    paddingHorizontal: PADDING_X,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f1f1f",
  },
  /**
   * Fundo de página inteira. O posicionamento absoluto no react-pdf é relativo
   * à área de conteúdo (dentro do padding); por isso usamos tamanho A4 exato
   * para sangrar até a borda física da folha.
   */
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: A4.width,
    height: A4.height,
    objectFit: "fill",
  },
  titulo: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
  },
  infoLinha: {
    marginBottom: 3,
    fontSize: 11,
  },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
  },
  table: {
    marginTop: 14,
    borderColor: "#333",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  row: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
  },
  cell: {
    borderColor: "#333",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  colItem: { flex: 1 },
  colQtd: { width: 55, textAlign: "center" },
  colValor: { width: 95, textAlign: "right" },
  colTotal: { width: 95, textAlign: "right" },
  headerText: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  observacao: {
    marginTop: 12,
    fontSize: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 82,
    left: PADDING_X,
    right: PADDING_X,
    textAlign: "right",
    fontSize: 9,
    color: "#888",
  },
});
