import Link from "next/link";

import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { LANDING_COPY } from "@/features/landing/constants/copy";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-inner">
        <p className="landing-footer-brand">
          <span className="landing-logo-mark landing-logo-mark--sm">MP</span>
          {LANDING_COPY.productName}
          <span className="landing-footer-copy">© {year}</span>
        </p>
        <nav className="landing-footer-nav" aria-label="Footer">
          <Link href={AUTH_ROUTES.login}>Log in</Link>
          <Link href={AUTH_ROUTES.register}>Register</Link>
          <Link href={ADMIN_ROUTES.login} className="landing-footer-admin">
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
