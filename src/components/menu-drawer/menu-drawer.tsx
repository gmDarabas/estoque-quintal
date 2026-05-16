import { useState } from "react";
import { Button, Drawer } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { LayoutProps } from "@/layouts/base-layout/base-layout";

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
        title="Menu"
        placement="left"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="menu"
        styles={{ body: { padding: 0 } }}
        width={300}
      >
        <Menu className="w-100" mode="inline" onSelect={({ key }) => onSelectMenu(key)} items={menuItens} />
      </Drawer>{" "}
    </>
  );
}

export default MenuDrawer;
