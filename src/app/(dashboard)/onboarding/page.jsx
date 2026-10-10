"use client";

import { App, Col, Row } from "antd";

import { OnboardingForm } from "@/features/profile/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <App>
      <div className="app-surface-page p-6">
        <Row justify="center">
          <Col xs={24} lg={16} xl={12}>
            <div className="learner-onboarding-hero">
              <h1 className="learner-onboarding-hero-title">
                Welcome! Let&apos;s set up your profile
              </h1>
              <p className="learner-onboarding-hero-subtitle">
                Add your basic professional details now, or skip and finish later. A
                complete profile powers better mock interviews and your public CV.
              </p>
            </div>
            <OnboardingForm />
          </Col>
        </Row>
      </div>
    </App>
  );
}
