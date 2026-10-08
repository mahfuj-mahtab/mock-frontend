"use client";

import {
  BulbOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";

import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

const { Paragraph, Text, Title } = Typography;

function formatLevel(level) {
  if (!level) {
    return "";
  }
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function SessionSummaryView({ session }) {
  const summary = session.summary || {};
  const breakdown = summary.question_breakdown || [];

  const collapseItems = breakdown.map((item) => ({
    key: item.question_id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          paddingRight: 8,
        }}
      >
        <Text style={{ flex: 1 }}>{item.question_prompt}</Text>
        <Tag color={item.score >= 7 ? "success" : item.score >= 5 ? "warning" : "error"}>
          {item.score}/10
        </Tag>
      </div>
    ),
    children: (
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        {item.feedback}
      </Paragraph>
    ),
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card bordered={false}>
        <Row justify="space-between" align="top" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ marginTop: 0 }}>Session summary</Title>
            <Text type="secondary">
              {session.track?.name} · {formatLevel(session.level)} ·{" "}
              {session.ended_at
                ? new Date(session.ended_at).toLocaleString()
                : "In progress"}
            </Text>
          </Col>
        </Row>

        <Row gutter={[32, 24]} align="middle" style={{ marginTop: 24 }}>
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            {summary.overall_score != null ? (
              <Progress
                type="circle"
                percent={Math.round((summary.overall_score / 10) * 100)}
                format={() => (
                  <span>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>
                      {summary.overall_score}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.65 }}>out of 10</div>
                  </span>
                )}
                size={140}
                strokeColor="#e5e5e5"
              />
            ) : (
              <Text type="secondary">Summary is being generated...</Text>
            )}
          </Col>
          <Col xs={24} md={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {summary.strengths?.length ? (
                <div>
                  <Text strong>
                    <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                    Strengths
                  </Text>
                  <List
                    size="small"
                    dataSource={summary.strengths}
                    renderItem={(item) => <List.Item style={{ paddingInline: 0 }}>{item}</List.Item>}
                  />
                </div>
              ) : null}

              {summary.weaknesses?.length ? (
                <div>
                  <Text strong>
                    <WarningOutlined style={{ color: "#faad14", marginRight: 8 }} />
                    Areas to improve
                  </Text>
                  <List
                    size="small"
                    dataSource={summary.weaknesses}
                    renderItem={(item) => <List.Item style={{ paddingInline: 0 }}>{item}</List.Item>}
                  />
                </div>
              ) : null}

              {summary.recommendations?.length ? (
                <div>
                  <Text strong>
                    <BulbOutlined style={{ marginRight: 8 }} />
                    Recommendations
                  </Text>
                  <List
                    size="small"
                    dataSource={summary.recommendations}
                    renderItem={(item) => <List.Item style={{ paddingInline: 0 }}>{item}</List.Item>}
                  />
                </div>
              ) : null}
            </Space>
          </Col>
        </Row>
      </Card>

      {breakdown.length > 0 ? (
        <Card bordered={false} title="Question breakdown">
          <Collapse items={collapseItems} bordered={false} />
        </Card>
      ) : null}

      <Space wrap>
        <Link href={MOCK_PREP_ROUTES.setup}>
          <Button type="primary" size="large">Start another session</Button>
        </Link>
        <Link href={MOCK_PREP_ROUTES.history}>
          <Button size="large">View history</Button>
        </Link>
      </Space>
    </Space>
  );
}
