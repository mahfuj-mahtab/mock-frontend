import { antdTheme } from "@/lib/theme/antd-theme";

const emerald = "#34d399";
const emeraldHover = "#6ee7b7";

export const landingAntdTheme = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorPrimary: emerald,
    colorPrimaryHover: emeraldHover,
    colorPrimaryActive: "#10b981",
  },
  components: {
    ...antdTheme.components,
    Button: {
      ...antdTheme.components?.Button,
      primaryColor: "#0a0f0d",
      colorPrimary: emerald,
      colorPrimaryHover: emeraldHover,
    },
    Tag: {
      defaultBg: "rgba(52, 211, 153, 0.12)",
      defaultColor: "#a7f3d0",
    },
  },
};
