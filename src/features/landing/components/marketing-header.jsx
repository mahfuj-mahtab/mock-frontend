"use client";

import { Button } from "antd";
import Link from "next/link";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LANDING_COPY } from "@/features/landing/constants/copy";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export function MarketingHeader() {
  const { isAuthenticated, isInitialized } = useAuth();

  return (
    <header className="landing-header">
      <div className="landing-container landing-header-inner">
        <Link href="/" className="landing-logo">
          <span className="landing-logo-mark">MP</span>
          <span>{LANDING_COPY.productName}</span>
        </Link>

        <nav className="landing-nav" aria-label="Main">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="landing-header-actions">
          {!isInitialized ? (
            <div className="landing-header-spinner" aria-hidden />
          ) : isAuthenticated ? (
            <>
              <Link href={AUTH_ROUTES.dashboard}>
                <Button type="text" className="landing-btn-ghost">Dashboard</Button>
              </Link>
              <Link href={MOCK_PREP_ROUTES.setup}>
                <Button type="primary" className="landing-btn-primary">Start mock</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={AUTH_ROUTES.login}>
                <Button type="text" className="landing-btn-ghost">Log in</Button>
              </Link>
              <Link href={AUTH_ROUTES.register}>
                <Button type="primary" className="landing-btn-primary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
