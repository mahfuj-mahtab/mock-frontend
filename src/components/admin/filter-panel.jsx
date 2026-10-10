"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Space, Switch } from "antd";
import { useState } from "react";

function renderFilterField(field, value, onChange) {
  if (field.type === "switch") {
    return (
      <Space>
        <span>{field.label}</span>
        <Switch
          checked={value === true}
          onChange={(checked) => onChange(field.name, checked ? true : undefined)}
        />
      </Space>
    );
  }

  return (
    <Select
      allowClear
      placeholder={field.placeholder || field.label}
      style={{ width: "100%" }}
      value={value}
      options={field.options}
      onChange={(next) => onChange(field.name, next)}
      showSearch={field.showSearch}
      optionFilterProp="label"
      mode={field.mode}
    />
  );
}

export function FilterPanel({ fields, values, onChange, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="admin-filter-panel">
      <div className="admin-filter-panel-head">
        <span className="admin-filter-panel-title">Filters</span>
        <Button
          type="text"
          size="small"
          icon={collapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? "Show" : "Hide"}
        </Button>
      </div>
      {!collapsed ? (
        <Row gutter={[16, 16]}>
          {fields.map((field) => (
            <Col key={field.name} xs={24} sm={12} md={8} lg={6}>
              {field.label && field.type !== "switch" ? (
                <div className="admin-filter-label">{field.label}</div>
              ) : null}
              {renderFilterField(field, values[field.name], onChange)}
            </Col>
          ))}
        </Row>
      ) : null}
    </div>
  );
}
