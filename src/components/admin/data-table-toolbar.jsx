"use client";

import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { useEffect, useState } from "react";

export function DataTableToolbar({
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  onReset,
  onAdd,
  addLabel = "Add",
  extra,
}) {
  const [localSearch, setLocalSearch] = useState(searchValue ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (searchValue ?? "")) {
        onSearchChange?.(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  return (
    <div className="admin-table-toolbar">
      <Space wrap>
        <Input.Search
          allowClear
          placeholder={searchPlaceholder}
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          onSearch={(value) => onSearchChange?.(value)}
          style={{ width: 280 }}
        />
        <Button icon={<ReloadOutlined />} onClick={onReset}>Reset filters</Button>
        {extra}
      </Space>
      {onAdd ? (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}
