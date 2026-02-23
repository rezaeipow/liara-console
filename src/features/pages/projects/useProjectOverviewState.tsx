import { useMemo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { useActionFeedbackSnackbar } from "@/shared/hooks/useActionFeedbackSnackbar";
import {
  createDateFormatter,
  createMonthDayTimeFormatter,
} from "@/shared/utils/dateTime";
import type {
  ProjectOverviewActionData,
  ProjectOverviewLoaderData,
} from "./projectsData";
import { buildProjectOverviewCards } from "./projectOverviewCards";
import type { ProjectOverviewState } from "./types";

export function useProjectOverviewState(): ProjectOverviewState {
  const data = useLoaderData() as ProjectOverviewLoaderData;
  const actionFetcher = useFetcher<ProjectOverviewActionData>();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [nextProjectName, setNextProjectName] = useState(data.project.name);

  const createdAt = useMemo(
    () => createDateFormatter().format(new Date(data.project.createdAt)),
    [data.project.createdAt],
  );
  const activityDateTimeFormatter = useMemo(
    () => createMonthDayTimeFormatter(),
    [],
  );

  const isHealthy =
    data.project.servicesSummary.apps + data.project.servicesSummary.vms > 0;
  const isSubmitting = actionFetcher.state !== "idle";
  const actionIntent = String(actionFetcher.formData?.get("intent") ?? "");
  const renameError = actionFetcher.data?.fieldErrors?.name;
  const deleteDisabled =
    deleteConfirmText.trim() !== data.project.name || isSubmitting;

  const feedback = useActionFeedbackSnackbar(actionFetcher.data, {
    fallbackMessage: "Operation completed.",
  });

  const overviewCards = buildProjectOverviewCards(data);

  return {
    data,
    actionData: actionFetcher.data,
    isSubmitting,
    actionIntent,
    renameDialogOpen,
    deleteDialogOpen,
    deleteConfirmText,
    nextProjectName,
    createdAt,
    isHealthy,
    renameError,
    deleteDisabled,
    overviewCards,
    formatActivityDate: (value: string) =>
      activityDateTimeFormatter.format(new Date(value)),
    feedbackOpen: feedback.open,
    feedbackSeverity: feedback.severity,
    feedbackMessage: feedback.message,
    onOpenRenameDialog: () => {
      setNextProjectName(data.project.name);
      setRenameDialogOpen(true);
    },
    onCloseRenameDialog: () => setRenameDialogOpen(false),
    onNextProjectNameChange: setNextProjectName,
    onSubmitRename: () => {
      setRenameDialogOpen(false);
      actionFetcher.submit(
        { intent: "rename", name: nextProjectName },
        { method: "post" },
      );
    },
    onOpenDeleteDialog: () => setDeleteDialogOpen(true),
    onCloseDeleteDialog: () => {
      setDeleteDialogOpen(false);
      setDeleteConfirmText("");
    },
    onDeleteConfirmTextChange: setDeleteConfirmText,
    onSubmitDelete: () => {
      setDeleteDialogOpen(false);
      actionFetcher.submit({ intent: "delete" }, { method: "post" });
    },
    onFeedbackClose: feedback.close,
  };
}
