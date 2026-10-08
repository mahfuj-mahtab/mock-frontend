"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { antdTheme } from "@/lib/theme/antd-theme";
import { store } from "@/lib/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AntdRegistry>
        <ConfigProvider theme={antdTheme}>
          <AuthInitializer>{children}</AuthInitializer>
        </ConfigProvider>
      </AntdRegistry>
      <Toaster richColors theme="dark" position="top-right" />
    </Provider>
  );
}
