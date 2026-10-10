"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export function ConfirmDeleteButton({ onConfirm, loading, size = "small" }) {
  return (
    <Popconfirm
      title="Delete this record?"
      description="This action cannot be undone."
      okText="Delete"
      okType="danger"
      onConfirm={onConfirm}
    >
      <Button danger size={size} icon={<DeleteOutlined />} loading={loading}>
        Delete
      </Button>
    </Popconfirm>
  );
}
