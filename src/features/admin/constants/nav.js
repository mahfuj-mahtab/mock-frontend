import {
  AppstoreOutlined,
  CodeOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { ADMIN_ROUTES } from "@/features/admin/constants/routes";

export const ADMIN_NAV = [
  {
    key: ADMIN_ROUTES.dashboard,
    label: "Dashboard",
    icon: DashboardOutlined,
    title: "Dashboard",
    breadcrumbs: [{ title: "Admin" }, { title: "Dashboard" }],
  },
  {
    key: ADMIN_ROUTES.tracks,
    label: "Interview tracks",
    icon: AppstoreOutlined,
    title: "Interview tracks",
    breadcrumbs: [{ title: "Admin", href: ADMIN_ROUTES.dashboard }, { title: "Tracks" }],
  },
  {
    key: ADMIN_ROUTES.technologies,
    label: "Technologies",
    icon: CodeOutlined,
    title: "Technologies",
    breadcrumbs: [{ title: "Admin", href: ADMIN_ROUTES.dashboard }, { title: "Technologies" }],
  },
  {
    key: ADMIN_ROUTES.questions,
    label: "Questions",
    icon: QuestionCircleOutlined,
    title: "Questions",
    breadcrumbs: [{ title: "Admin", href: ADMIN_ROUTES.dashboard }, { title: "Questions" }],
  },
];

export function getAdminPageMeta(pathname) {
  const match = ADMIN_NAV.find((item) => item.key === pathname);
  if (match) {
    return { title: match.title, breadcrumbs: match.breadcrumbs };
  }
  return { title: "Admin", breadcrumbs: [{ title: "Admin" }] };
}

export function getAdminSelectedMenuKey(pathname) {
  const match = ADMIN_NAV.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`));
  return match?.key ?? ADMIN_ROUTES.dashboard;
}
