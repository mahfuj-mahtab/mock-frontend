/**
 * Future server-side fetch scaffold for RSC pages.
 *
 * Note: localStorage tokens are not available in Server Components.
 * Migrate to HTTP-only cookies before using this for authenticated reads.
 */
import { API_BASE_URL } from "@/constants/api";

export async function serverFetch(path, options = {}) {
  const { headers = {}, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Server request failed");
  }

  return payload;
}
