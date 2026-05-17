import { Button, DatePicker, Space, Tooltip } from "antd";
import { CalendarOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

function formatMes(mes: Dayjs): string {
  const label = mes
    .toDate()
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

type Props = {
  onChange: (dataDe: string, dataAte: string) => void;
};

export default function PeriodSelector({ onChange }: Props) {
  const [mes, setMes] = useState(dayjs());
  const [modoCustom, setModoCustom] = useState(false);
  const [periodoCustom, setPeriodoCustom] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const handlePrevMes = () => {
    const novo = mes.subtract(1, "month");
    setMes(novo);
    onChange(novo.startOf("month").toISOString(), novo.endOf("month").toISOString());
  };

  const handleNextMes = () => {
    const novo = mes.add(1, "month");
    setMes(novo);
    onChange(novo.startOf("month").toISOString(), novo.endOf("month").toISOString());
  };

  const handleResetMes = () => {
    const hoje = dayjs();
    setMes(hoje);
    onChange(hoje.startOf("month").toISOString(), hoje.endOf("month").toISOString());
  };

  const handleCustomChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      const novo: [Dayjs, Dayjs] = [dates[0], dates[1]];
      setPeriodoCustom(novo);
      onChange(novo[0].startOf("day").toISOString(), novo[1].endOf("day").toISOString());
    }
  };

  const handleGoMensal = () => {
    setModoCustom(false);
    onChange(mes.startOf("month").toISOString(), mes.endOf("month").toISOString());
  };

  if (modoCustom) {
    return (
      <Space.Compact>
        <RangePicker
          value={periodoCustom}
          onChange={handleCustomChange}
          allowClear={false}
          format="DD/MM/YYYY"
        />
        <Button onClick={handleGoMensal}>Mensal</Button>
      </Space.Compact>
    );
  }

  return (
    <>
      <Space.Compact>
        <Button icon={<LeftOutlined />} onClick={handlePrevMes} />
        <Tooltip
          title={!mes.isSame(dayjs(), "month") ? "Voltar ao mês atual" : undefined}
        >
          <Button style={{ minWidth: 140 }} onClick={handleResetMes}>
            {formatMes(mes)}
          </Button>
        </Tooltip>
        <Button icon={<RightOutlined />} onClick={handleNextMes} />
      </Space.Compact>
      <Button
        type="text"
        icon={<CalendarOutlined />}
        onClick={() => setModoCustom(true)}
      >
        Personalizar
      </Button>
    </>
  );
}
