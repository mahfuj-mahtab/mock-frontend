"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/profile/api/profile-api";
import { ENGINEER_LEVELS } from "@/features/profile/constants/routes";
import { profileSchema } from "@/features/profile/validations/profile-schema";

export function ProfileForm() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      headline: "",
      bio: "",
      level: "",
      location: "",
      phone: "",
      linkedin_url: "",
      github_url: "",
      portfolio_url: "",
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    form.reset({
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

  async function onSubmit(values) {
    try {
      await updateProfile(values).unwrap();
      toast.success("Profile updated");
    } catch (error) {
      const apiError = error?.data;

      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          form.setError(field, { message });
        });
      }

      toast.error(apiError?.message || "Failed to update profile");
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          Share your professional headline, bio, and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Backend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell employers about your background and interests."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engineer level</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        {ENGINEER_LEVELS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="London, UK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+44 7700 900000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/you" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/you" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-site.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
