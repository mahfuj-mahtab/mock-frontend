"use client";

import { App, Button, Form, Input, InputNumber, Select, Space, Switch, Tag } from "antd";
import { useState } from "react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { FilterPanel } from "@/components/admin/filter-panel";
import { ResourceFormModal } from "@/components/admin/resource-form-modal";
import { StatusTag } from "@/components/admin/status-tag";
import {
  useCreateAdminQuestionMutation,
  useDeleteAdminQuestionMutation,
  useGetAdminMetaQuery,
  useGetAdminQuestionsQuery,
  useGetAdminTechnologiesQuery,
  useGetAdminTracksQuery,
  useUpdateAdminQuestionMutation,
} from "@/features/admin/api/admin-api";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { getAdminPageMeta } from "@/features/admin/constants/nav";
import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { useAdminList } from "@/features/admin/hooks/use-admin-list";

const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

function formatLabel(value) {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function QuestionsAdminView() {
  const { message } = App.useApp();
  const meta = getAdminPageMeta(ADMIN_ROUTES.questions);
  const list = useAdminList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: metaChoices } = useGetAdminMetaQuery();
  const { data: tracksData } = useGetAdminTracksQuery({ page_size: 100 });
  const { data: techData } = useGetAdminTechnologiesQuery({ page_size: 200 });
  const { data, isLoading, isFetching } = useGetAdminQuestionsQuery(list.queryParams);

  const trackOptions = (tracksData?.items ?? []).map((t) => ({ label: t.name, value: t.id }));
  const technologyOptions = (techData?.items ?? []).map((t) => ({ label: t.name, value: t.id }));
  const categoryOptions = (metaChoices?.categories ?? []).map((item) => ({
    label: item.label,
    value: item.value,
  }));
  const levelOptions = (metaChoices?.engineer_levels ?? []).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  const [createQuestion, { isLoading: creating }] = useCreateAdminQuestionMutation();
  const [updateQuestion, { isLoading: updating }] = useUpdateAdminQuestionMutation();
  const [deleteQuestion] = useDeleteAdminQuestionMutation();

  const columns = [
    { title: "Prompt", dataIndex: "prompt", key: "prompt", ellipsis: true, width: 320 },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value) => <Tag>{formatLabel(value)}</Tag>,
      sorter: true,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: formatLabel,
      sorter: true,
    },
    { title: "Min", dataIndex: "estimated_minutes", key: "estimated_minutes", width: 72 },
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
                await deleteQuestion(record.id).unwrap();
                message.success("Question deleted");
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
      const payload = {
        ...values,
        track_ids: values.track_ids ?? [],
        technology_ids: values.technology_ids ?? [],
      };
      if (editing) {
        await updateQuestion({ id: editing.id, ...payload }).unwrap();
        message.success("Question updated");
      } else {
        await createQuestion(payload).unwrap();
        message.success("Question created");
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
        description="Interview question bank with category, engineer level, tracks, and technologies."
        breadcrumbs={meta.breadcrumbs}
      />
      <div className="admin-panel-card">
        <DataTableToolbar
          key={list.toolbarKey}
          searchPlaceholder="Search prompts…"
          searchValue={list.search}
          onSearchChange={list.onSearchChange}
          onReset={list.reset}
          onAdd={() => { setEditing(null); setModalOpen(true); }}
          addLabel="Add question"
        />
        <FilterPanel
          fields={[
            { name: "category", label: "Category", options: categoryOptions, showSearch: true },
            { name: "level", label: "Engineer level", options: levelOptions, showSearch: true },
            { name: "track", label: "Track", options: trackOptions, showSearch: true },
            { name: "technology", label: "Technology", options: technologyOptions, showSearch: true },
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
        title={editing ? "Edit question" : "New question"}
        loading={creating || updating}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        width={720}
        initialValues={
          editing
            ? {
                prompt: editing.prompt,
                category: editing.category,
                level: editing.level,
                estimated_minutes: editing.estimated_minutes,
                is_active: editing.is_active,
                track_ids: editing.tracks?.map((track) => track.id) ?? [],
                technology_ids: editing.technologies?.map((tech) => tech.id) ?? [],
              }
            : { is_active: true, estimated_minutes: 2, track_ids: [], technology_ids: [] }
        }
      >
        <QuestionFormFields
          categoryOptions={categoryOptions}
          levelOptions={levelOptions}
          trackOptions={trackOptions}
          technologyOptions={technologyOptions}
        />
      </ResourceFormModal>
    </div>
  );
}

function QuestionFormFields({ categoryOptions, levelOptions, trackOptions, technologyOptions }) {
  return (
    <>
      <Form.Item
        name="prompt"
        label="Prompt"
        rules={[{ required: true, message: "Prompt is required" }]}
      >
        <Input.TextArea rows={4} placeholder="Question text shown by the interviewer" />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Category is required" }]}
      >
        <Select options={categoryOptions} placeholder="Select category" />
      </Form.Item>
      <Form.Item
        name="level"
        label="Engineer level"
        rules={[{ required: true, message: "Level is required" }]}
      >
        <Select options={levelOptions} placeholder="Select level" />
      </Form.Item>
      <Form.Item
        name="track_ids"
        label="Tracks"
        rules={[{ required: true, message: "At least one track is required" }]}
      >
        <Select mode="multiple" options={trackOptions} placeholder="Select tracks" />
      </Form.Item>
      <Form.Item name="technology_ids" label="Technologies">
        <Select mode="multiple" options={technologyOptions} placeholder="Select technologies" />
      </Form.Item>
      <Form.Item name="estimated_minutes" label="Estimated minutes">
        <InputNumber min={1} max={60} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
}
