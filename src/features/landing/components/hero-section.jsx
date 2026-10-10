"use client";

import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Space, Tag } from "antd";
import Link from "next/link";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LANDING_COPY } from "@/features/landing/constants/copy";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export function HeroSection() {
  const { isAuthenticated, isInitialized } = useAuth();
  const { hero } = LANDING_COPY;

  const primaryHref = isAuthenticated ? MOCK_PREP_ROUTES.setup : AUTH_ROUTES.register;
  const primaryLabel = isAuthenticated ? "Start mock interview" : "Get started free";
  const secondaryHref = isAuthenticated ? AUTH_ROUTES.dashboard : AUTH_ROUTES.login;
  const secondaryLabel = isAuthenticated ? "Go to dashboard" : "Log in";

  return (
    <section className="landing-hero">
      <div className="landing-container landing-hero-grid">
        <div className="landing-hero-copy">
          <Tag className="landing-hero-badge">{hero.badge}</Tag>
          <h1 className="landing-hero-title">{hero.headline}</h1>
          <p className="landing-hero-subtitle">{hero.subheadline}</p>
          {isInitialized ? (
            <Space wrap size="middle" className="landing-hero-ctas">
              <Link href={primaryHref}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  className="landing-btn-primary landing-btn-lg"
                >
                  {primaryLabel}
                </Button>
              </Link>
              <Link href={secondaryHref}>
                <Button size="large" className="landing-btn-secondary landing-btn-lg">
                  {secondaryLabel}
                </Button>
              </Link>
            </Space>
          ) : null}
        </div>

        <div className="landing-terminal" aria-label="Example mock interview snippet">
          <div className="landing-terminal-bar">
            <span className="landing-terminal-dot landing-terminal-dot--red" />
            <span className="landing-terminal-dot landing-terminal-dot--yellow" />
            <span className="landing-terminal-dot landing-terminal-dot--green" />
            <span className="landing-terminal-title">mock-session — zsh</span>
          </div>
          <pre className="landing-terminal-body">
            <code>
              <span className="landing-t-dim">$</span> mock-prep start --track backend --level mid
              {"\n\n"}
              <span className="landing-t-accent">Interviewer</span>
              {"\n"}
              Walk me through how you would design a rate limiter for an API.
              {"\n\n"}
              <span className="landing-t-you">You</span>
              {"\n"}
              I would use a sliding window counter in Redis, keyed by client id...
              {"\n\n"}
              <span className="landing-t-accent">Interviewer</span>
              {"\n"}
              What happens when Redis is unavailable?
              {"\n\n"}
              <span className="landing-t-dim">✓ session active · question 3/18</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
