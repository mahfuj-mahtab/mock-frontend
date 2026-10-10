"use client";

import { App, Button, Form, Input, Select, Space, Switch } from "antd";
import { useState } from "react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { FilterPanel } from "@/components/admin/filter-panel";
import { ResourceFormModal } from "@/components/admin/resource-form-modal";
import { StatusTag } from "@/components/admin/status-tag";
import {
  useCreateAdminTechnologyMutation,
  useDeleteAdminTechnologyMutation,
  useGetAdminTechnologiesQuery,
  useGetAdminTracksQuery,
  useUpdateAdminTechnologyMutation,
} from "@/features/admin/api/admin-api";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { getAdminPageMeta } from "@/features/admin/constants/nav";
import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { useAdminList } from "@/features/admin/hooks/use-admin-list";
import { slugifyName } from "@/features/admin/utils/slugify";

const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export function TechnologiesAdminView() {
  const { message } = App.useApp();
  const meta = getAdminPageMeta(ADMIN_ROUTES.technologies);
  const list = useAdminList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isFetching } = useGetAdminTechnologiesQuery(list.queryParams);
  const { data: tracksData } = useGetAdminTracksQuery({ page_size: 100 });
  const trackOptions = (tracksData?.items ?? []).map((track) => ({
    label: track.name,
    value: track.id,
  }));

  const [createTechnology, { isLoading: creating }] = useCreateAdminTechnologyMutation();
  const [updateTechnology, { isLoading: updating }] = useUpdateAdminTechnologyMutation();
  const [deleteTechnology] = useDeleteAdminTechnologyMutation();

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", sorter: true },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Tracks",
      dataIndex: "tracks",
      key: "tracks",
      render: (tracks) => (tracks?.length ? tracks.map((t) => t.name).join(", ") : "—"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (value) => <StatusTag active={value} />,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => { setEditing(record); setModalOpen(true); }}>
            Edit
          </Button>
          <ConfirmDeleteButton
            onConfirm={async () => {
              try {
                await deleteTechnology(record.id).unwrap();
                message.success("Technology deleted");
              } catch (error) {
                message.error(error?.data?.message || "Delete failed");
              }
            }}
          />
        </Space>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      const payload = { ...values, track_ids: values.track_ids ?? [] };
      if (editing) {
        await updateTechnology({ id: editing.id, ...payload }).unwrap();
        message.success("Technology updated");
      } else {
        await createTechnology(payload).unwrap();
        message.success("Technology created");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      message.error(error?.data?.message || "Save failed");
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title={meta.title}
        description="Technologies linked to interview tracks and questions."
        breadcrumbs={meta.breadcrumbs}
      />
      <div className="admin-panel-card">
        <DataTableToolbar
          key={list.toolbarKey}
          searchValue={list.search}
          onSearchChange={list.onSearchChange}
          onReset={list.reset}
          onAdd={() => { setEditing(null); setModalOpen(true); }}
          addLabel="Add technology"
        />
        <FilterPanel
          fields={[
            { name: "track", label: "Track", options: trackOptions, showSearch: true },
            { name: "is_active", label: "Status", options: ACTIVE_OPTIONS },
          ]}
          values={list.filters}
          onChange={list.setFilter}
        />
        <AdminDataTable
          columns={columns}
          dataSource={data?.items ?? []}
          loading={isLoading || isFetching}
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: data?.pagination?.count ?? 0,
          }}
          onTableChange={list.onTableChange}
        />
      </div>
      <ResourceFormModal
        open={modalOpen}
        title={editing ? "Edit technology" : "New technology"}
        loading={creating || updating}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialValues={
          editing
            ? {
                name: editing.name,
                slug: editing.slug,
                is_active: editing.is_active,
                track_ids: editing.tracks?.map((track) => track.id) ?? [],
              }
            : { is_active: true, track_ids: [] }
        }
      >
        <TechnologyFormFields trackOptions={trackOptions} />
      </ResourceFormModal>
    </div>
  );
}

function TechnologyFormFields({ trackOptions }) {
  const form = Form.useFormInstance();

  return (
    <>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
        <Input
          placeholder="Python"
          onBlur={(event) => {
            if (!form.getFieldValue("slug")) {
              form.setFieldValue("slug", slugifyName(event.target.value));
            }
          }}
        />
      </Form.Item>
      <Form.Item name="slug" label="Slug">
        <Input placeholder="python" />
      </Form.Item>
      <Form.Item name="track_ids" label="Tracks">
        <Select mode="multiple" options={trackOptions} placeholder="Select tracks" />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
}
