export class ApiError extends Error {
  constructor(message, errors = null, status = 400) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
    this.status = status;
  }
}

export async function parseApiResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.message || "Request failed",
      payload.errors || null,
      response.status
    );
  }

  return payload;
}
