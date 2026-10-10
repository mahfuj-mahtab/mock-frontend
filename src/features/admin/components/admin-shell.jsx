"use client";

import { ExportOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { App, Avatar, ConfigProvider, Dropdown, Layout, Menu, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  ADMIN_NAV,
  getAdminSelectedMenuKey,
} from "@/features/admin/constants/nav";
import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { adminAntdTheme } from "@/lib/theme/admin-antd-theme";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = useMemo(() => getAdminSelectedMenuKey(pathname), [pathname]);

  const menuItems = useMemo(
    () =>
      ADMIN_NAV.map((item) => ({
        key: item.key,
        icon: <item.icon />,
        label: item.label,
      })),
    []
  );

  function handleLogout() {
    logout();
    router.push(ADMIN_ROUTES.login);
  }

  const userMenuItems = [
    {
      key: "app",
      icon: <ExportOutlined />,
      label: "Open candidate app",
      onClick: () => router.push(AUTH_ROUTES.dashboard),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      onClick: handleLogout,
    },
  ];

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Admin";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ConfigProvider theme={adminAntdTheme}>
      <App>
        <Layout className="admin-layout" style={{ minHeight: "100vh" }}>
          <Sider
            className="admin-sider"
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            theme="dark"
            width={272}
            collapsedWidth={76}
          >
            <div className="admin-sider-inner">
              <Link href={ADMIN_ROUTES.dashboard} className="admin-brand">
                <span className="admin-brand-mark">MP</span>
                {!collapsed ? (
                  <span className="admin-brand-text">
                    <span className="admin-brand-title">Mock Prep</span>
                    <span className="admin-brand-subtitle">Admin console</span>
                  </span>
                ) : null}
              </Link>

              {!collapsed ? <p className="admin-nav-label">Navigation</p> : null}
              <Menu
                className="admin-menu"
                mode="inline"
                theme="dark"
                selectedKeys={[selectedKey]}
                items={menuItems}
                onClick={({ key }) => router.push(key)}
              />

              <div className="admin-sider-footer">
                {!collapsed ? (
                  <Link href={AUTH_ROUTES.dashboard} className="admin-sider-link">
                    <ExportOutlined />
                    <span>Candidate app</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </Sider>

          <Layout className="admin-main">
            <Header className="admin-header">
              <div className="admin-header-glow" aria-hidden />
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                <button type="button" className="admin-user-trigger">
                  <Avatar size={36} className="admin-user-avatar">{initials}</Avatar>
                  <span className="admin-user-meta">
                    <Text strong className="admin-user-name">{displayName}</Text>
                    {user?.email ? (
                      <Text type="secondary" className="admin-user-email">{user.email}</Text>
                    ) : null}
                  </span>
                </button>
              </Dropdown>
            </Header>
            <Content className="admin-content">{children}</Content>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
}
