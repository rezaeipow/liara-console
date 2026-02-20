const BASE_URL = "";

export interface ApiErrorPayload {
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // keep default message
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const clone = response.clone();
  try {
    return (await response.json()) as T;
  } catch (error) {
    if (import.meta.env.DEV) {
      const text = await clone.text();
      // eslint-disable-next-line no-console
      console.error("Failed to parse JSON response", {
        url: response.url,
        status: response.status,
        preview: text.slice(0, 200),
      });
    }
    throw error;
  }
}
