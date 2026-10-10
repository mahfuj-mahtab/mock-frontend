"use client";

import { App, Button, Form, Input, Space, Switch } from "antd";
import { useState } from "react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { FilterPanel } from "@/components/admin/filter-panel";
import { ResourceFormModal } from "@/components/admin/resource-form-modal";
import { StatusTag } from "@/components/admin/status-tag";
import {
  useCreateAdminTrackMutation,
  useDeleteAdminTrackMutation,
  useGetAdminTracksQuery,
  useUpdateAdminTrackMutation,
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

export function TracksAdminView() {
  const { message } = App.useApp();
  const meta = getAdminPageMeta(ADMIN_ROUTES.tracks);
  const list = useAdminList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isFetching } = useGetAdminTracksQuery(list.queryParams);
  const [createTrack, { isLoading: creating }] = useCreateAdminTrackMutation();
  const [updateTrack, { isLoading: updating }] = useUpdateAdminTrackMutation();
  const [deleteTrack] = useDeleteAdminTrackMutation();

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", sorter: true },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (value) => <StatusTag active={value} />,
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => new Date(value).toLocaleString(),
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
                await deleteTrack(record.id).unwrap();
                message.success("Track deleted");
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
      if (editing) {
        await updateTrack({ id: editing.id, ...values }).unwrap();
        message.success("Track updated");
      } else {
        await createTrack(values).unwrap();
        message.success("Track created");
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
        description="Manage interview tracks shown in mock prep setup."
        breadcrumbs={meta.breadcrumbs}
      />
      <div className="admin-panel-card">
        <DataTableToolbar
          key={list.toolbarKey}
          searchValue={list.search}
          onSearchChange={list.onSearchChange}
          onReset={list.reset}
          onAdd={() => { setEditing(null); setModalOpen(true); }}
          addLabel="Add track"
        />
        <FilterPanel
          fields={[{ name: "is_active", label: "Status", options: ACTIVE_OPTIONS }]}
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
        title={editing ? "Edit track" : "New track"}
        loading={creating || updating}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialValues={
          editing
            ? {
                name: editing.name,
                slug: editing.slug,
                description: editing.description,
                is_active: editing.is_active,
              }
            : { is_active: true, description: "" }
        }
      >
        <TrackFormFields />
      </ResourceFormModal>
    </div>
  );
}

function TrackFormFields() {
  const form = Form.useFormInstance();

  return (
    <>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
        <Input
          placeholder="Backend Engineer"
          onBlur={(event) => {
            if (!form.getFieldValue("slug")) {
              form.setFieldValue("slug", slugifyName(event.target.value));
            }
          }}
        />
      </Form.Item>
      <Form.Item name="slug" label="Slug">
        <Input placeholder="backend-engineer" />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} placeholder="Optional description" />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
}
