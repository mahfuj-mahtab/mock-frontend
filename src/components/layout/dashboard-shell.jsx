"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { App, Avatar, Breadcrumb, Dropdown, Layout, Menu, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  DASHBOARD_NAV,
  getPageMeta,
  getSelectedMenuKey,
} from "@/components/layout/dashboard-nav";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const { title, breadcrumbs } = useMemo(() => getPageMeta(pathname), [pathname]);
  const selectedKey = useMemo(() => getSelectedMenuKey(pathname), [pathname]);

  const menuItems = useMemo(
    () =>
      DASHBOARD_NAV.map((item) => ({
        key: item.key,
        icon: <item.icon />,
        label: item.label,
      })),
    []
  );

  function handleLogout() {
    logout();
    router.push(AUTH_ROUTES.login);
  }

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => router.push(PROFILE_ROUTES.profile),
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
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Account";

  const breadcrumbItems = breadcrumbs.map((item) =>
    item.href
      ? { title: <Link href={item.href}>{item.title}</Link> }
      : { title: item.title }
  );

  return (
    <App>
      <Layout className="dashboard-layout" style={{ minHeight: "100vh" }}>
        <Sider
          className="dashboard-sider"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          theme="dark"
          width={248}
          collapsedWidth={72}
        >
          <Link href={AUTH_ROUTES.dashboard} className="dashboard-brand">
            <span className="dashboard-brand-mark">MP</span>
            {!collapsed ? <span className="dashboard-brand-text">Mock Prep</span> : null}
          </Link>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
            style={{ borderInlineEnd: 0, padding: "8px 0" }}
          />
        </Sider>
        <Layout>
          <Header className="dashboard-header">
            <div className="dashboard-header-main">
              <Typography.Title level={4} className="dashboard-header-title">
                {title}
              </Typography.Title>
              <Breadcrumb items={breadcrumbItems} className="dashboard-breadcrumb" />
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
              <button type="button" className="dashboard-user-trigger">
                <Avatar
                  size="small"
                  src={user?.profile?.avatar || undefined}
                  icon={<UserOutlined />}
                />
                <span className="dashboard-user-meta">
                  <Text strong className="dashboard-user-name">{displayName}</Text>
                  {user?.email ? (
                    <Text type="secondary" className="dashboard-user-email">
                      {user.email}
                    </Text>
                  ) : null}
                </span>
              </button>
            </Dropdown>
          </Header>
          <Content className="dashboard-content">{children}</Content>
        </Layout>
      </Layout>
    </App>
  );
}
