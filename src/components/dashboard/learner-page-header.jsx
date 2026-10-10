"use client";

import { Space } from "antd";

export function LearnerPageHeader({ title, subtitle, extra }) {
  return (
    <div className="learner-page-header">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h1 className="learner-page-header-title">{title}</h1>
          {subtitle ? (
            <p className="learner-page-header-subtitle">{subtitle}</p>
          ) : null}
        </div>
        {extra ? <Space wrap>{extra}</Space> : null}
      </div>
    </div>
  );
}
