"use client";

import { LANDING_COPY } from "@/features/landing/constants/copy";

export function HowItWorksSection() {
  const { howItWorks } = LANDING_COPY;

  return (
    <section id="how-it-works" className="landing-section landing-section--muted">
      <div className="landing-container">
        <div className="landing-section-head">
          <h2 className="landing-section-title">{howItWorks.title}</h2>
          <p className="landing-section-subtitle">{howItWorks.subtitle}</p>
        </div>
        <ol className="landing-steps">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="landing-step">
              <span className="landing-step-num">{index + 1}</span>
              <div>
                <h3 className="landing-step-title">{step.title}</h3>
                <p className="landing-step-desc">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
