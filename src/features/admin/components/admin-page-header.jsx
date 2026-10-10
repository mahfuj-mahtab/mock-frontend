"use client";

import { Breadcrumb, Typography } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export function AdminPageHeader({ title, description, breadcrumbs = [], extra }) {
  const breadcrumbItems = breadcrumbs.map((item) =>
    item.href ? { title: <Link href={item.href}>{item.title}</Link> } : { title: item.title }
  );

  return (
    <div className="admin-page-header">
      <div className="admin-page-header-main">
        <Breadcrumb items={breadcrumbItems} className="admin-page-breadcrumb" />
        <Title level={3} className="admin-page-title">{title}</Title>
        {description ? <Text type="secondary">{description}</Text> : null}
      </div>
      {extra ? <div className="admin-page-header-extra">{extra}</div> : null}
    </div>
  );
}
