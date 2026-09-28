"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { store } from "@/lib/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#171717",
              borderRadius: 8,
            },
          }}
        >
          <AuthInitializer>{children}</AuthInitializer>
        </ConfigProvider>
      </AntdRegistry>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}
