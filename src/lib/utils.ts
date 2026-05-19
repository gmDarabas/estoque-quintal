export const displayCpfCnpj = (value: string | null | undefined): string => {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (digits.length === 14)
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return value;
};

export const displayDate = (date: string | Date | undefined) => {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString();
};

export const displayMoney = (value: string | number | undefined | null) => {
  if (!value) return "";
  if (typeof value === "string") value = +value;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};
