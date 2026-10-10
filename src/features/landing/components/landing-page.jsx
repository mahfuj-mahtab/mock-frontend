"use client";

import { ConfigProvider } from "antd";

import { CtaSection } from "@/features/landing/components/cta-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { MarketingFooter } from "@/features/landing/components/marketing-footer";
import { MarketingHeader } from "@/features/landing/components/marketing-header";
import { landingAntdTheme } from "@/lib/theme/landing-antd-theme";

export function LandingPage() {
  return (
    <ConfigProvider theme={landingAntdTheme}>
      <div className="landing-page">
        <div className="landing-bg" aria-hidden />
        <MarketingHeader />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CtaSection />
        </main>
        <MarketingFooter />
      </div>
    </ConfigProvider>
  );
}
