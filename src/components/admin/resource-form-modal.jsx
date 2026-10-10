"use client";

import { Form, Modal } from "antd";
import { useEffect } from "react";

export function ResourceFormModal({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
  loading,
  children,
  width = 640,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues ?? {});
    } else {
      form.resetFields();
    }
  }, [form, initialValues, open]);

  async function handleOk() {
    const values = await form.validateFields();
    await onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={width}
      destroyOnHidden
      okText="Save"
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        {children}
      </Form>
    </Modal>
  );
}
