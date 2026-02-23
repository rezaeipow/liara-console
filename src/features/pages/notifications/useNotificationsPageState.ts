import { useState } from "react";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { NOTIFICATION_FILTER_OPTIONS } from "@/shared/constants/notificationsOptions";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { isRouteLoadingByPrefix } from "@/shared/hooks/useRouteLoading";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import type { NotificationsActionData, NotificationsLoaderData } from "./notificationsData";

export function useNotificationsPageState() {
  const { items } = useLoaderData() as NotificationsLoaderData;
  const actionData = useActionData() as NotificationsActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();
  const dispatch = useAppDispatch();
  const { getEnumParam, getParam, setQueryParam } = useQueryParams();
  const [dismissedNoticeKey, setDismissedNoticeKey] = useState<string | null>(null);
  const { tableDensity } = useTableDensity();

  const filter = getEnumParam("filter", [...NOTIFICATION_FILTER_OPTIONS], "all");
  const search = getParam("q");
  const isRouteLoading = isRouteLoadingByPrefix(navigation, "/console/notifications");
  const isSubmitting = navigation.state === "submitting";

  return {
    items,
    actionData,
    submit,
    dispatch,
    filter,
    search,
    setQueryParam,
    dismissedNoticeKey,
    setDismissedNoticeKey,
    tableDensity,
    isRouteLoading,
    isSubmitting,
  };
}
