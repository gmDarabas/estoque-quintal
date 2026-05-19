import { Input } from "antd";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const CPF_MASK = "999.999.999-99";
const CNPJ_MASK = "99.999.999/9999-99";

const MAX_DIGITS = 14;

function clear(value: string | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

function applyMask(digits: string, mask: string): string {
  let result = "";
  let di = 0;
  for (let mi = 0; mi < mask.length && di < digits.length; mi++) {
    if (mask[mi] === "9") {
      result += digits[di++];
    } else {
      result += mask[mi];
    }
  }
  return result;
}

function getMask(digits: string): string {
  return digits.length <= 11 ? CPF_MASK : CNPJ_MASK;
}

export default function InputCpfCnpj({ value, onChange, placeholder = "CPF ou CNPJ" }: Props) {
  const digits = clear(value);
  const displayed = digits ? applyMask(digits, getMask(digits)) : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDigits = clear(e.target.value);
    if (newDigits.length > MAX_DIGITS) return;
    onChange?.(newDigits);
  }

  return (
    <Input
      value={displayed}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={CNPJ_MASK.length}
    />
  );
}
