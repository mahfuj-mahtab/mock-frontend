"use client";

import { Tag } from "antd";

export function StatusTag({ active }) {
  return active ? <Tag color="success">Active</Tag> : <Tag color="default">Inactive</Tag>;
}
