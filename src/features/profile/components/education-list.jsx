"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetEducationQuery,
  useUpdateEducationMutation,
} from "@/features/profile/api/profile-api";
import { educationSchema } from "@/features/profile/validations/profile-schema";

const emptyValues = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  description: "",
};

export function EducationList() {
  const { data: educations = [], isLoading } = useGetEducationQuery();
  const [createEducation, { isLoading: isCreating }] = useCreateEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: emptyValues,
  });

  function startEdit(education) {
    setEditingId(education.id);
    form.reset({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study || "",
      start_date: education.start_date,
      end_date: education.end_date || "",
      description: education.description || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    form.reset(emptyValues);
  }

  async function onSubmit(values) {
    const payload = {
      ...values,
      end_date: values.end_date || null,
    };

    try {
      if (editingId) {
        await updateEducation({ id: editingId, ...payload }).unwrap();
        toast.success("Education updated");
      } else {
        await createEducation(payload).unwrap();
        toast.success("Education added");
      }

      cancelEdit();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save education");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEducation(id).unwrap();
      toast.success("Education removed");
      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete education");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your degrees, schools, and areas of study.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading education...</p>
        ) : (
          <div className="space-y-3">
            {educations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No education added yet.</p>
            ) : (
              educations.map((education) => (
                <div
                  key={education.id}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{education.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {education.institution}
                        {education.field_of_study ? ` · ${education.field_of_study}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {education.start_date}
                        {education.end_date ? ` - ${education.end_date}` : ""}
                      </p>
                      {education.description ? (
                        <p className="mt-2 text-sm">{education.description}</p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(education)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(education.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
            <p className="text-sm font-medium">
              {editingId ? "Edit education" : "Add education"}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="BSc Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="field_of_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of study</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineering" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Honors, coursework, activities..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {editingId ? "Update education" : "Add education"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
