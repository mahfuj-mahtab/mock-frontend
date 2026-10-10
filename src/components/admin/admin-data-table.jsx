"use client";

import { Empty, Table } from "antd";

export function AdminDataTable({
  columns,
  dataSource,
  loading,
  rowKey = "id",
  pagination,
  onTableChange,
}) {
  return (
    <Table
      className="admin-data-table"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      locale={{ emptyText: <Empty description="No records found" /> }}
      pagination={
        pagination
          ? {
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `${total} items`,
            }
          : false
      }
      onChange={onTableChange}
      scroll={{ x: true }}
    />
  );
}
