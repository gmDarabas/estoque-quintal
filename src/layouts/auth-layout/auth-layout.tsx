import { Col, Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import logo from "/public/wrench.png";

function AuthLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const alignCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const colStyle = {
    backgroundColor: colorBgContainer,
    padding: "36px",
    borderRadius: "2%",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={alignCenter}>
        {/* @ts-ignore - ignore porque o align funciona mas fica acusando erro */}
        <Col span={8} lg={8} xs={22} md={12} sm={18} xl={6} style={colStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 24,
              gap: 4,
            }}
          >
            <img src={logo} alt="Quintal da Olivia" style={{ width: 180 }} />
            <span
              style={{
                fontSize: 12,
                color: "#7fb069",
                letterSpacing: "0.06em",
              }}
            ></span>
          </div>
          <Outlet />
        </Col>
      </Content>
    </Layout>
  );
}

export default AuthLayout;
