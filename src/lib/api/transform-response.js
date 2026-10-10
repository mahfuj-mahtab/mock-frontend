/**
 * Unwraps standard API envelopes `{ success, message, data }`.
 * Returns `data` when present; otherwise the raw payload.
 */
export function unwrapApiData(response) {
  if (
    response &&
    typeof response === "object" &&
    "success" in response &&
    "data" in response
  ) {
    return response.data;
  }
  return response;
}

export function getApiErrorMessage(error, fallback) {
  const payload = error?.data;
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const errors = payload.errors;
  if (errors && typeof errors === "object") {
    const detail = errors.detail;
    if (Array.isArray(detail) && detail[0]) {
      return String(detail[0]);
    }
    if (typeof detail === "string") {
      return detail;
    }
    const firstKey = Object.keys(errors)[0];
    const firstVal = errors[firstKey];
    if (Array.isArray(firstVal) && firstVal[0]) {
      return String(firstVal[0]);
    }
    if (typeof firstVal === "string") {
      return firstVal;
    }
  }

  if (payload.message && payload.message !== "Validation failed") {
    return String(payload.message);
  }

  return fallback;
}

export function isSessionAlreadyStartedError(error) {
  const message = getApiErrorMessage(error, "");
  return message.toLowerCase().includes("already been started");
}
