import { GuestRoute } from "@/components/layout/guest-route";

export default function AuthLayout({ children }) {
  return <GuestRoute>{children}</GuestRoute>;
}
