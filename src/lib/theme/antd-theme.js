import { theme } from "antd";

export const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#e5e5e5",
    colorPrimaryHover: "#ffffff",
    colorPrimaryActive: "#d4d4d4",
    colorLink: "#a3a3a3",
    colorLinkHover: "#e5e5e5",
    borderRadius: 8,
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    colorBgContainer: "#141414",
    colorBgElevated: "#1a1a1a",
    colorBgLayout: "#0a0a0a",
    colorBorder: "#262626",
    colorText: "rgba(255, 255, 255, 0.88)",
    colorTextSecondary: "rgba(255, 255, 255, 0.65)",
  },
  components: {
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemHeight: 44,
      darkItemBg: "#0a0a0a",
    },
    Card: {
      headerFontSize: 16,
    },
    Button: {
      controlHeight: 40,
      controlHeightLG: 44,
      primaryColor: "#0a0a0a",
    },
    Layout: {
      siderBg: "#0a0a0a",
      headerBg: "#141414",
      bodyBg: "#0a0a0a",
      triggerBg: "#141414",
    },
  },
};
