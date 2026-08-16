"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { store } from "@/lib/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}
