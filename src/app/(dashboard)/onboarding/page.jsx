"use client";

import { App, Col, Row, Typography } from "antd";

import { OnboardingForm } from "@/features/profile/components/onboarding-form";

const { Title, Paragraph } = Typography;

export default function OnboardingPage() {
  return (
    <App>
      <div className="min-h-screen bg-muted/30 p-6">
        <Row justify="center">
          <Col xs={24} lg={16} xl={12}>
            <div className="mb-6 space-y-2">
              <Title level={2} style={{ marginBottom: 0 }}>
                Welcome! Let&apos;s set up your profile
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Add your basic professional details now, or skip and finish later.
              </Paragraph>
            </div>
            <OnboardingForm />
          </Col>
        </Row>
      </div>
    </App>
  );
}
