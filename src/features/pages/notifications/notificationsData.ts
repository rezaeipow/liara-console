import type { ActionFunctionArgs } from "react-router-dom";
import { NotificationsAPI } from "../../../api/notificationsApi";
import { ApiError } from "../../../api/httpClient";
import type { NotificationItem } from "../../../api/types";

export type NotificationsLoaderData = {
  items: NotificationItem[];
};

export type NotificationsActionData = {
  successMessage?: string;
  successAt?: number;
  formError?: string;
  errorStatus?: number;
  errorHint?: string;
};

function mapStatusText(status: number): string {
  if (status === 408) return "Request Timeout";
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 404) return "Not Found";
  if (status >= 500) return "Server Error";
  return "Request Failed";
}

function mapStatusHint(status: number): string {
  if (status === 408) return "The request timed out. Please retry.";
  if (status === 401) return "Your session may be expired. Please login again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "Notification resource not found.";
  if (status >= 500) return "Server problem detected. Retry in a few moments.";
  return "Please check your request and try again.";
}

function toRouteErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return new Response(error.message, {
      status: error.status,
      statusText: mapStatusText(error.status),
    });
  }

  return new Response("Unexpected error", {
    status: 500,
    statusText: "Server Error",
  });
}

export async function notificationsLoader(): Promise<NotificationsLoaderData> {
  try {
    const { items } = await NotificationsAPI.list();
    const sorted = [...items].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
    return { items: sorted };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function notificationsAction({
  request,
}: ActionFunctionArgs): Promise<NotificationsActionData> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "").trim();

  try {
    if (intent === "mark-all-read") {
      await NotificationsAPI.markAllRead();
      return {
        successMessage: "All notifications marked as read.",
        successAt: Date.now(),
      };
    }

    if (intent === "mark-read") {
      const notificationId = String(formData.get("notificationId") ?? "").trim();
      if (!notificationId) {
        return {
          formError: "Notification id is required.",
          errorStatus: 400,
          errorHint: mapStatusHint(400),
        };
      }

      await NotificationsAPI.markRead(notificationId);
      return {
        successMessage: "Notification marked as read.",
        successAt: Date.now(),
      };
    }

    return {
      formError: "Unsupported action.",
      errorStatus: 400,
      errorHint: mapStatusHint(400),
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        formError: error.message,
        errorStatus: error.status,
        errorHint: mapStatusHint(error.status),
      };
    }

    return {
      formError: error instanceof Error ? error.message : "Request failed.",
      errorStatus: 500,
      errorHint: mapStatusHint(500),
    };
  }
}

