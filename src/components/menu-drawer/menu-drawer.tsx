import { useState } from "react";
import { Button, Drawer } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { LayoutProps } from "@/layouts/base-layout/base-layout";

function SeedlingIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
    >
      <path
        fill={color}
        d="M576 96C576 204.1 499.4 294.3 397.6 315.4C389.7 257.3 363.6 205 325.1 164.5C365.2 104 433.9 64 512 64L544 64C561.7 64 576 78.3 576 96zM64 160C64 142.3 78.3 128 96 128L128 128C251.7 128 352 228.3 352 352L352 544C352 561.7 337.7 576 320 576C302.3 576 288 561.7 288 544L288 384C164.3 384 64 283.7 64 160z"
      />
    </svg>
  );
}
function MenuDrawer({ menuItens }: LayoutProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const onSelectMenu = (key: string) => {
    navigate(key);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setOpen(true)}
        style={{ fontSize: "16px", marginRight: "16px", padding: 0 }}
      />
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SeedlingIcon color="#2d5016" size={22} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#cf6438" }}>
              Quintal da Olivia
            </span>
          </div>
        }
        placement="left"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="menu"
        styles={{ body: { padding: 0 } }}
        size={300}
      >
        <Menu
          className="w-100"
          mode="inline"
          onSelect={({ key }) => onSelectMenu(key)}
          items={menuItens}
        />
      </Drawer>{" "}
    </>
  );
}

export default MenuDrawer;
