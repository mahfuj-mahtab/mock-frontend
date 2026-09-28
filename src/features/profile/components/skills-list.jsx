"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillsQuery,
  useUpdateSkillMutation,
} from "@/features/profile/api/profile-api";
import { PROFICIENCY_LEVELS } from "@/features/profile/constants/routes";
import { skillSchema } from "@/features/profile/validations/profile-schema";

export function SkillsList() {
  const { data: skills = [], isLoading } = useGetSkillsQuery();
  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: "",
      proficiency: "intermediate",
    },
  });

  async function onSubmit(values) {
    try {
      await createSkill(values).unwrap();
      toast.success("Skill added");
      form.reset({ skill_name: "", proficiency: "intermediate" });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add skill");
    }
  }

  async function handleProficiencyChange(id, proficiency) {
    try {
      await updateSkill({ id, proficiency }).unwrap();
      toast.success("Skill updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update skill");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSkill(id).unwrap();
      toast.success("Skill removed");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete skill");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & technologies</CardTitle>
        <CardDescription>Highlight the tools and technologies you work with.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2"
              >
                <Badge variant="secondary">{item.skill.name}</Badge>
                <Select
                  value={item.proficiency}
                  onChange={(event) =>
                    handleProficiencyChange(item.id, event.target.value)
                  }
                  className="h-8 w-auto min-w-[140px]"
                >
                  {PROFICIENCY_LEVELS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
            <p className="text-sm font-medium">Add skill</p>
            <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
              <FormField
                control={form.control}
                name="skill_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology</FormLabel>
                    <FormControl>
                      <Input placeholder="Python, React, AWS..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        {PROFICIENCY_LEVELS.map((option) => (
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
              <div className="flex items-end">
                <Button type="submit" disabled={isCreating}>
                  Add
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
