"use client";

import { useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useAdminList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [filters, setFilters] = useState({});
  const [toolbarKey, setToolbarKey] = useState(0);

  const queryParams = useMemo(() => {
    const params = { page, page_size: pageSize };
    if (search.trim()) {
      params.search = search.trim();
    }
    if (ordering) {
      params.ordering = ordering;
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      if (key === "is_active") {
        params.is_active = value === true || value === "true";
        return;
      }
      params[key] = value;
    });
    return params;
  }, [filters, ordering, page, pageSize, search]);

  function reset() {
    setFilters({});
    setSearch("");
    setOrdering("");
    setPage(1);
    setToolbarKey((value) => value + 1);
  }

  function setFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  }

  function onSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function onTableChange(pagination, _filters, sorter) {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sorter?.field && sorter.order) {
      const prefix = sorter.order === "descend" ? "-" : "";
      setOrdering(`${prefix}${sorter.field}`);
    } else {
      setOrdering("");
    }
  }

  return {
    queryParams,
    page,
    pageSize,
    search,
    filters,
    toolbarKey,
    reset,
    setFilter,
    onSearchChange,
    onTableChange,
  };
}
