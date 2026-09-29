import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";

export function GitHubLoginButton() {
  const githubAuthUrl = `${API_BASE_URL}/auth/github/`;

  return (
    <Button variant="outline" className="w-full" asChild>
      <a href={githubAuthUrl}>
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </a>
    </Button>
  );
}
