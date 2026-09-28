import { z } from "zod";

export const profileSchema = z.object({
  headline: z.string().max(255).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  level: z
    .enum(["", "intern", "junior", "mid", "senior", "lead", "principal"])
    .optional(),
  location: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  linkedin_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Company is required").max(255),
    title: z.string().min(1, "Title is required").max(255),
    location: z.string().max(255).optional().or(z.literal("")),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().or(z.literal("")),
    is_current: z.boolean().default(false),
    description: z.string().max(5000).optional().or(z.literal("")),
  })
  .refine(
    (data) => data.is_current || data.end_date,
    {
      message: "End date is required unless this is your current role",
      path: ["end_date"],
    }
  );

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(255),
  degree: z.string().min(1, "Degree is required").max(255),
  field_of_study: z.string().max(255).optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
});

export const skillSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required").max(100),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});
