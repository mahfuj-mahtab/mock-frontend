"use client";

import {
  AppstoreOutlined,
  ArrowRightOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Col, Row, Skeleton } from "antd";
import Link from "next/link";

import {
  useGetAdminQuestionsQuery,
  useGetAdminTechnologiesQuery,
  useGetAdminTracksQuery,
} from "@/features/admin/api/admin-api";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { getAdminPageMeta } from "@/features/admin/constants/nav";
import { ADMIN_ROUTES } from "@/features/admin/constants/routes";

export function AdminDashboardView() {
  const meta = getAdminPageMeta(ADMIN_ROUTES.dashboard);
  const { data: tracks, isLoading: tracksLoading } = useGetAdminTracksQuery({
    page: 1,
    page_size: 1,
  });
  const { data: technologies, isLoading: techLoading } = useGetAdminTechnologiesQuery({
    page: 1,
    page_size: 1,
  });
  const { data: questions, isLoading: questionsLoading } = useGetAdminQuestionsQuery({
    page: 1,
    page_size: 1,
  });

  const cards = [
    {
      title: "Interview tracks",
      description: "Roles and interview paths",
      count: tracks?.pagination?.count ?? 0,
      href: ADMIN_ROUTES.tracks,
      icon: <AppstoreOutlined />,
      accent: "violet",
      loading: tracksLoading,
    },
    {
      title: "Technologies",
      description: "Stacks linked to tracks",
      count: technologies?.pagination?.count ?? 0,
      href: ADMIN_ROUTES.technologies,
      icon: <CodeOutlined />,
      accent: "indigo",
      loading: techLoading,
    },
    {
      title: "Questions",
      description: "Full interview question bank",
      count: questions?.pagination?.count ?? 0,
      href: ADMIN_ROUTES.questions,
      icon: <QuestionCircleOutlined />,
      accent: "fuchsia",
      loading: questionsLoading,
    },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title={meta.title}
        description="Manage mock interview content and keep the question bank up to date."
        breadcrumbs={meta.breadcrumbs}
      />
      <Row gutter={[20, 20]}>
        {cards.map((card) => (
          <Col key={card.href} xs={24} md={8}>
            <Link href={card.href} className="admin-stat-link">
              <article className={`admin-stat-card admin-stat-card--${card.accent}`}>
                <div className="admin-stat-card-top">
                  <span className="admin-stat-icon-wrap">{card.icon}</span>
                  <ArrowRightOutlined className="admin-stat-arrow" />
                </div>
                {card.loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
                ) : (
                  <>
                    <p className="admin-stat-value">{card.count}</p>
                    <h3 className="admin-stat-title">{card.title}</h3>
                    <p className="admin-stat-desc">{card.description}</p>
                  </>
                )}
              </article>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
