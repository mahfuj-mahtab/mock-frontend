import { antdTheme } from "@/lib/theme/antd-theme";

const adminViolet = "#8b5cf6";
const adminVioletHover = "#a78bfa";

export const adminAntdTheme = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorPrimary: adminViolet,
    colorPrimaryHover: adminVioletHover,
    colorPrimaryActive: "#7c3aed",
    colorLink: adminVioletHover,
    colorLinkHover: "#c4b5fd",
  },
  components: {
    ...antdTheme.components,
    Button: {
      ...antdTheme.components?.Button,
      primaryColor: "#ffffff",
      colorPrimary: adminViolet,
      colorPrimaryHover: adminVioletHover,
    },
    Layout: {
      siderBg: "#14121c",
      headerBg: "transparent",
      bodyBg: "#0c0c10",
      triggerBg: "rgba(255, 255, 255, 0.06)",
      triggerColor: "rgba(255, 255, 255, 0.65)",
    },
    Menu: {
      itemBorderRadius: 10,
      itemMarginInline: 10,
      itemMarginBlock: 4,
      itemHeight: 42,
      iconSize: 18,
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkItemColor: "rgba(255, 255, 255, 0.72)",
      darkItemHoverColor: "#ffffff",
      darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
      darkItemSelectedBg: "rgba(139, 92, 246, 0.22)",
      darkItemSelectedColor: "#f5f3ff",
      itemSelectedColor: "#f5f3ff",
    },
    Table: {
      headerBg: "rgba(255, 255, 255, 0.03)",
      rowHoverBg: "rgba(139, 92, 246, 0.06)",
    },
  },
};
