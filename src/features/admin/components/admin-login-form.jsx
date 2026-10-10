"use client";

import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { App, Button, Card, ConfigProvider, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { useLoginMutation } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { logout } from "@/features/auth/store/auth-slice";
import { adminAntdTheme } from "@/lib/theme/admin-antd-theme";

const { Title, Text } = Typography;

export function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const [login, { isLoading }] = useLoginMutation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  async function onFinish(values) {
    setSubmitting(true);
    try {
      const result = await login(values).unwrap();
      const user = result?.data?.user;
      if (!user?.is_staff && !user?.is_superuser) {
        dispatch(logout());
        message.error("Staff access required. Use a staff or superuser account.");
        return;
      }
      message.success("Welcome to the admin panel");
      router.push(ADMIN_ROUTES.dashboard);
    } catch (error) {
      message.error(error?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfigProvider theme={adminAntdTheme}>
      <App>
        <div className="admin-login-page">
          <div className="admin-login-backdrop" aria-hidden />
          <Card className="admin-login-card" bordered={false}>
            <div className="admin-login-header">
              <span className="admin-login-mark">
                <SafetyCertificateOutlined />
              </span>
              <div>
                <Title level={3} className="admin-login-title">Admin sign in</Title>
                <Text type="secondary">Staff and superuser accounts only</Text>
              </div>
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="admin@company.com"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading || submitting}
                  className="admin-login-submit"
                >
                  Sign in to admin
                </Button>
              </Form.Item>
            </Form>
            <Text type="secondary" className="admin-login-footer">
              Candidate app?{" "}
              <Link href={AUTH_ROUTES.login}>Go to user login</Link>
            </Text>
          </Card>
        </div>
      </App>
    </ConfigProvider>
  );
}
