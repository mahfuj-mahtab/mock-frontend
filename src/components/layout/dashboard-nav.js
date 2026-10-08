import {
  DashboardOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

export const DASHBOARD_NAV = [
  {
    key: AUTH_ROUTES.dashboard,
    icon: DashboardOutlined,
    label: "Dashboard",
  },
  {
    key: MOCK_PREP_ROUTES.setup,
    icon: PlayCircleOutlined,
    label: "Mock interview",
  },
  {
    key: MOCK_PREP_ROUTES.history,
    icon: HistoryOutlined,
    label: "Session history",
  },
  {
    key: PROFILE_ROUTES.profile,
    icon: UserOutlined,
    label: "Profile",
  },
];

export function getPageMeta(pathname) {
  if (pathname === AUTH_ROUTES.dashboard) {
    return {
      title: "Dashboard",
      breadcrumbs: [{ title: "Dashboard" }],
    };
  }
  if (pathname === MOCK_PREP_ROUTES.setup) {
    return {
      title: "Mock interview",
      breadcrumbs: [
        { title: "Dashboard", href: AUTH_ROUTES.dashboard },
        { title: "Mock interview" },
      ],
    };
  }
  if (pathname === MOCK_PREP_ROUTES.history) {
    return {
      title: "Session history",
      breadcrumbs: [
        { title: "Dashboard", href: AUTH_ROUTES.dashboard },
        { title: "Session history" },
      ],
    };
  }
  if (pathname === PROFILE_ROUTES.profile) {
    return {
      title: "Profile",
      breadcrumbs: [
        { title: "Dashboard", href: AUTH_ROUTES.dashboard },
        { title: "Profile" },
      ],
    };
  }
  if (pathname.startsWith("/mock-prep/session/") && pathname.endsWith("/summary")) {
    return {
      title: "Session summary",
      breadcrumbs: [
        { title: "Dashboard", href: AUTH_ROUTES.dashboard },
        { title: "Mock interview", href: MOCK_PREP_ROUTES.setup },
        { title: "Summary" },
      ],
    };
  }
  if (pathname.startsWith("/mock-prep/session/")) {
    return {
      title: "Live session",
      breadcrumbs: [
        { title: "Dashboard", href: AUTH_ROUTES.dashboard },
        { title: "Mock interview", href: MOCK_PREP_ROUTES.setup },
        { title: "Live session" },
      ],
    };
  }
  return {
    title: "Mock Prep",
    breadcrumbs: [{ title: "Dashboard", href: AUTH_ROUTES.dashboard }],
  };
}

export function getSelectedMenuKey(pathname) {
  if (pathname === AUTH_ROUTES.dashboard) {
    return AUTH_ROUTES.dashboard;
  }
  if (pathname === MOCK_PREP_ROUTES.history) {
    return MOCK_PREP_ROUTES.history;
  }
  if (pathname === PROFILE_ROUTES.profile) {
    return PROFILE_ROUTES.profile;
  }
  if (pathname.startsWith("/mock-prep")) {
    return MOCK_PREP_ROUTES.setup;
  }
  return AUTH_ROUTES.dashboard;
}
