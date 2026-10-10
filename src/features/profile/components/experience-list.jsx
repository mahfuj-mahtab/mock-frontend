"use client";

import { Briefcase } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { LearnerEmptyState } from "@/components/dashboard/learner-empty-state";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
  useUpdateExperienceMutation,
} from "@/features/profile/api/profile-api";
import { experienceSchema } from "@/features/profile/validations/profile-schema";

const emptyValues = {
  company: "",
  title: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

export function ExperienceList() {
  const { data: experiences = [], isLoading } = useGetExperiencesQuery();
  const [createExperience, { isLoading: isCreating }] = useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: emptyValues,
  });

  const isCurrent = form.watch("is_current");

  function startEdit(experience) {
    setEditingId(experience.id);
    setFormOpen(true);
    form.reset({
      company: experience.company,
      title: experience.title,
      location: experience.location || "",
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      is_current: experience.is_current,
      description: experience.description || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    form.reset(emptyValues);
    if (experiences.length > 0) {
      setFormOpen(false);
    }
  }

  async function onSubmit(values) {
    const payload = {
      ...values,
      end_date: values.is_current ? null : values.end_date || null,
    };

    try {
      if (editingId) {
        await updateExperience({ id: editingId, ...payload }).unwrap();
        toast.success("Experience updated");
      } else {
        await createExperience(payload).unwrap();
        toast.success("Experience added");
      }

      cancelEdit();
      setFormOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save experience");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExperience(id).unwrap();
      toast.success("Experience removed");
      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete experience");
    }
  }

  const showForm = formOpen || editingId || experiences.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work experience</CardTitle>
        <CardDescription>Add your roles, companies, and responsibilities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading experience...</p>
        ) : experiences.length === 0 ? (
          <LearnerEmptyState
            icon={<Briefcase size={22} />}
            title="No experience yet"
            description="Add roles you've held so mock interviews and your CV reflect your background."
          />
        ) : (
          <div className="learner-timeline">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className={`learner-timeline-item${
                  editingId === experience.id ? " learner-timeline-item--editing" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{experience.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {experience.company}
                      {experience.location ? ` · ${experience.location}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {experience.start_date}
                      {" - "}
                      {experience.is_current ? "Present" : experience.end_date}
                    </p>
                    {experience.description ? (
                      <p className="mt-2 text-sm whitespace-pre-wrap">{experience.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(experience)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(experience.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {experiences.length > 0 && !showForm ? (
          <Button type="button" variant="outline" onClick={() => setFormOpen(true)}>
            Add experience
          </Button>
        ) : null}

        {showForm ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 rounded-lg border p-4 bg-muted/20"
            >
              <p className="text-sm font-medium">
                {editingId ? "Edit experience" : "Add experience"}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isCurrent} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="is_current"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">I currently work here</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="What did you work on?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {editingId ? "Update experience" : "Add experience"}
                </Button>
                {editingId || experiences.length > 0 ? (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </Form>
        ) : null}
      </CardContent>
    </Card>
  );
}
