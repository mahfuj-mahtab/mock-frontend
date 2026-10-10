"use client";

import {
  CodeOutlined,
  HistoryOutlined,
  PartitionOutlined,
} from "@ant-design/icons";

import { LANDING_COPY } from "@/features/landing/constants/copy";

const FEATURE_ICONS = [PartitionOutlined, CodeOutlined, HistoryOutlined];

export function FeaturesSection() {
  const { features } = LANDING_COPY;

  return (
    <section id="features" className="landing-section">
      <div className="landing-container">
        <div className="landing-section-head">
          <h2 className="landing-section-title">{features.title}</h2>
          <p className="landing-section-subtitle">{features.subtitle}</p>
        </div>
        <div className="landing-features-grid">
          {features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index];
            return (
              <article key={item.title} className="landing-feature-card">
                <span className="landing-feature-icon" aria-hidden>
                  <Icon />
                </span>
                <h3 className="landing-feature-title">{item.title}</h3>
                <p className="landing-feature-desc">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
