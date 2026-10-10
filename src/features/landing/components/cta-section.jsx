"use client";

import { RocketOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LANDING_COPY } from "@/features/landing/constants/copy";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export function CtaSection() {
  const { isAuthenticated, isInitialized } = useAuth();
  const { cta } = LANDING_COPY;

  const href = isAuthenticated ? MOCK_PREP_ROUTES.setup : AUTH_ROUTES.register;
  const label = isAuthenticated ? "Start mock interview" : "Create free account";

  return (
    <section className="landing-cta">
      <div className="landing-container landing-cta-inner">
        <div>
          <h2 className="landing-cta-title">{cta.title}</h2>
          <p className="landing-cta-subtitle">{cta.subtitle}</p>
        </div>
        {isInitialized ? (
          <Link href={href}>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              className="landing-btn-primary landing-btn-lg"
            >
              {label}
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
