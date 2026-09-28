"use client";

import { App, Button, Card, Col, Form, Input, Row, Select, Space, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authApi } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { mergeUserProfile } from "@/features/auth/store/auth-slice";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/profile/api/profile-api";
import { ENGINEER_LEVELS, PROFILE_ROUTES } from "@/features/profile/constants/routes";
import { profileSchema } from "@/features/profile/validations/profile-schema";
import { useAppDispatch } from "@/lib/store/hooks";

const defaultValues = {
  headline: "",
  bio: "",
  level: "",
  location: "",
  phone: "",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
};

function mapZodErrors(error) {
  return error.issues.map((issue) => ({
    name: issue.path[0],
    errors: [issue.message],
  }));
}

function optionalUrlRule(label) {
  return {
    validator: (_, value) => {
      if (!value) {
        return Promise.resolve();
      }

      try {
        new URL(value);
        return Promise.resolve();
      } catch {
        return Promise.reject(new Error(`Enter a valid ${label} URL`));
      }
    },
  };
}

export function OnboardingForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    form.setFieldsValue({
      headline: profile.headline || "",
      bio: profile.bio || "",
      level: profile.level || "",
      location: profile.location || "",
      phone: profile.phone || "",
      linkedin_url: profile.linkedin_url || "",
      github_url: profile.github_url || "",
      portfolio_url: profile.portfolio_url || "",
    });
  }, [profile, form]);

  async function refreshAuthUser() {
    const result = await dispatch(
      authApi.endpoints.getMe.initiate(undefined, {
        subscribe: false,
        forceRefetch: true,
      })
    );

    if (result.data?.success) {
      return;
    }

    throw result.error;
  }

  async function completeOnboarding(profilePatch) {
    const updatedProfile = await updateProfile(profilePatch).unwrap();
    dispatch(mergeUserProfile(updatedProfile));
    await refreshAuthUser();
    router.push(AUTH_ROUTES.dashboard);
  }

  async function handleContinue(values) {
    const parsed = profileSchema.safeParse(values);

    if (!parsed.success) {
      form.setFields(mapZodErrors(parsed.error));
      return;
    }

    try {
      await completeOnboarding({
        ...parsed.data,
        onboarding_completed: true,
      });
      message.success("Profile saved");
    } catch (error) {
      const apiError = error?.data;

      if (apiError?.errors) {
        form.setFields(
          Object.entries(apiError.errors).map(([field, messages]) => ({
            name: field,
            errors: [Array.isArray(messages) ? messages[0] : messages],
          }))
        );
      }

      message.error(apiError?.message || "Failed to save profile");
    }
  }

  async function handleSkip() {
    setIsSkipping(true);

    try {
      await completeOnboarding({ onboarding_completed: true });
    } catch (error) {
      message.error(error?.data?.message || "Failed to skip onboarding");
    } finally {
      setIsSkipping(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="Basic information">
      <Form
        form={form}
        layout="vertical"
        initialValues={defaultValues}
        onFinish={handleContinue}
        requiredMark={false}
      >
        <Form.Item label="Headline" name="headline">
          <Input placeholder="Senior Backend Engineer" />
        </Form.Item>
        <Form.Item label="Bio" name="bio">
          <Input.TextArea
            placeholder="Tell employers about your background and interests."
            rows={4}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Engineer level" name="level">
              <Select
                placeholder="Select level"
                options={ENGINEER_LEVELS.filter((option) => option.value !== "").map(
                  (option) => ({
                    value: option.value,
                    label: option.label,
                  })
                )}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Location" name="location">
              <Input placeholder="London, UK" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="+44 7700 900000" />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="LinkedIn" name="linkedin_url" rules={[optionalUrlRule("LinkedIn")]}>
              <Input placeholder="https://linkedin.com/in/you" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="GitHub" name="github_url" rules={[optionalUrlRule("GitHub")]}>
              <Input placeholder="https://github.com/you" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Portfolio" name="portfolio_url" rules={[optionalUrlRule("Portfolio")]}>
              <Input placeholder="https://your-site.com" />
            </Form.Item>
          </Col>
        </Row>
        <Space wrap>
          <Button type="primary" htmlType="submit" loading={isSaving} disabled={isSkipping}>
            Continue
          </Button>
          <Button onClick={handleSkip} loading={isSkipping} disabled={isSaving}>
            Skip for now
          </Button>
        </Space>
      </Form>
      <p className="mt-4 text-sm text-muted-foreground">
        You can add experience, skills, and uploads later on your{" "}
        <Link href={PROFILE_ROUTES.profile}>full profile</Link>.
      </p>
    </Card>
  );
}
