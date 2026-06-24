interface RequestOptions<B> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: B;
  headers?: Record<string, string>;
  timeout?: number;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "APIError";
  }
}

const REFRESH_ENDPOINT = "/api/v1/session/refresh" as const;
const AUTH_ROUTE = "/v1/auth" as const;

export const apiFetch = async <TBody = unknown, TResponse = unknown>(
  endpoint: string,
  { method, body, headers, timeout = 10_000 }: RequestOptions<TBody> = {},
): Promise<TResponse> => {
  const res = await fetch(`/api/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  });

  if (!res.ok) {
    const isAuthRoute = endpoint.startsWith(AUTH_ROUTE);
    if (res.status === 401 && !isAuthRoute) {
      const refreshRes = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        return apiFetch(endpoint, { method, body, headers, timeout });
      }
      window.location.href = "/login";
    }
    const errorData = await res.json().catch(() => null);
    throw new APIError(errorData?.error ?? "Request failed", res.status);
  }

  return res.json();
};

export const handleFetchErrors = (err: unknown) => {
  const data = null;

  if (err instanceof APIError) {
    return {
      data,
      error: err.message,
    };
  }
  if (err instanceof DOMException && err.name === "TimeoutError") {
    return {
      data,
      error: "Request timed out. Please try again.",
    };
  }

  return {
    data,
    error: "Network error. Please check your connection.",
  };
};

export const handleTanstackQueryError = (err: unknown) => {
  if (err instanceof APIError) {
    throw err;
  }

  if (err instanceof DOMException && err.name === "TimeoutError") {
    throw new APIError("Request timed out. Please try again.", 408);
  }

  throw new APIError("Network error. Please check your connection.", 0);
};
