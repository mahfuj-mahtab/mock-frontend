"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useLoginMutation } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { loginSchema } from "@/features/auth/validations/login-schema";
import { GitHubLoginButton } from "@/features/auth/components/github-login-button";

export function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("error") === "github_auth_failed") {
      toast.error("GitHub sign-in failed. Please try again.");
      router.replace(AUTH_ROUTES.login);
    }
  }, [router, searchParams]);

  async function onSubmit(values) {
    try {
      await login(values).unwrap();
      toast.success("Login successful");
      router.push(AUTH_ROUTES.dashboard);
    } catch (error) {
      const apiError = error?.data;

      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          form.setError(field, { message });
        });
      }

      toast.error(apiError?.message || "Login failed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GitHubLoginButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={AUTH_ROUTES.register} className="text-primary underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
