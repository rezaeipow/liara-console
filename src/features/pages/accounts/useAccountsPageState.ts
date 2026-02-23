import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { useAppSelector } from "@/app/store/hooks";
import { selectAccounts, selectActiveAccountId } from "@/app/store/slices/accountSlice";
import type { AccountsLoaderData } from "./accountsData";
import type { AccountsActionData, AccountsPageState } from "./types";

export function useAccountsPageState(): AccountsPageState {
  useLoaderData() as AccountsLoaderData;
  const createFetcher = useFetcher<AccountsActionData>();
  const rowFetcher = useFetcher<AccountsActionData>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const accounts = useAppSelector(selectAccounts);
  const activeAccountId = useAppSelector(selectActiveAccountId);

  const [query, setQuery] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [accountIdToDelete, setAccountIdToDelete] = useState<string | null>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuAccountId, setMobileMenuAccountId] = useState<string | null>(null);
  const [dismissedSuccessAt, setDismissedSuccessAt] = useState<number | null>(null);

  const isCreating = createFetcher.state !== "idle";
  const isMutatingRow = rowFetcher.state !== "idle";
  const rowIntent = String(rowFetcher.formData?.get("intent") ?? "");
  const rowAccountId = String(rowFetcher.formData?.get("accountId") ?? "");
  const isSwitching = isMutatingRow && rowIntent === "switch";
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const accountToDelete = accountIdToDelete == null ? null : (accounts.find((item) => item.id === accountIdToDelete) ?? null);
  const filteredAccounts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return accounts.filter((account) => account.name.toLowerCase().includes(normalizedQuery));
  }, [accounts, query]);

  const latestSuccess = useMemo(() => {
    const createAt = createFetcher.data?.successAt ?? 0;
    const rowAt = rowFetcher.data?.successAt ?? 0;
    if (createAt === 0 && rowAt === 0) return null;
    if (rowAt >= createAt) return { at: rowAt, message: rowFetcher.data?.successMessage ?? "" };
    return { at: createAt, message: createFetcher.data?.successMessage ?? "" };
  }, [createFetcher.data?.successAt, createFetcher.data?.successMessage, rowFetcher.data?.successAt, rowFetcher.data?.successMessage]);

  const showSuccessInline = Boolean(latestSuccess?.message) && latestSuccess?.at !== dismissedSuccessAt;
  useEffect(() => {
    if (!showSuccessInline || !latestSuccess?.at) return;
    const timerId = window.setTimeout(() => setDismissedSuccessAt(latestSuccess.at), 3000);
    return () => window.clearTimeout(timerId);
  }, [latestSuccess?.at, showSuccessInline]);

  const startEditing = (accountId: string, name: string) => {
    setEditingAccountId(accountId);
    setEditingName(name);
  };
  const cancelEditing = () => {
    setEditingAccountId(null);
    setEditingName("");
  };
  const submitEdit = () => {
    if (!editingAccountId) return;
    rowFetcher.submit({ intent: "edit", accountId: editingAccountId, name: editingName }, { method: "post" });
    cancelEditing();
  };
  const submitSwitch = (accountId: string) => {
    rowFetcher.submit({ intent: "switch", accountId }, { method: "post" });
  };
  const openDeleteDialog = (accountId: string) => setAccountIdToDelete(accountId);
  const closeDeleteDialog = () => {
    if (isMutatingRow) return;
    setAccountIdToDelete(null);
  };
  const confirmDelete = () => {
    if (!accountIdToDelete) return;
    rowFetcher.submit({ intent: "delete", accountId: accountIdToDelete }, { method: "post" });
    if (editingAccountId === accountIdToDelete) cancelEditing();
    setAccountIdToDelete(null);
  };
  const openMobileMenu = (event: MouseEvent<HTMLButtonElement>, accountId: string) => {
    setMobileMenuAnchorEl(event.currentTarget);
    setMobileMenuAccountId(accountId);
  };
  const closeMobileMenu = () => {
    setMobileMenuAnchorEl(null);
    setMobileMenuAccountId(null);
  };
  const handleCreateSubmit = () => {
    const trimmed = newAccountName.trim();
    if (trimmed.length < 2 || isCreating) return;
    createFetcher.submit({ intent: "create", name: trimmed }, { method: "post" });
    setIsCreateDialogOpen(false);
    setNewAccountName("");
  };
  const dismissSuccess = () => {
    if (latestSuccess?.at) setDismissedSuccessAt(latestSuccess.at);
  };

  return {
    accounts,
    activeAccountId,
    filteredAccounts,
    isMobile,
    query,
    setQuery,
    newAccountName,
    setNewAccountName,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    editingAccountId,
    editingName,
    setEditingName,
    accountIdToDelete,
    setAccountIdToDelete,
    mobileMenuAnchorEl,
    mobileMenuAccountId,
    isCreating,
    isMutatingRow,
    isSwitching,
    rowAccountId,
    rowIntent,
    mobileMenuOpen,
    showSuccessInline,
    latestSuccessMessage: latestSuccess?.message ?? "",
    createFormError: createFetcher.data?.formError,
    rowFormError: rowFetcher.data?.formError,
    createFieldNameError: createFetcher.data?.fieldErrors?.name,
    accountToDelete,
    startEditing,
    cancelEditing,
    submitEdit,
    submitSwitch,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    openMobileMenu,
    closeMobileMenu,
    handleCreateSubmit,
    dismissSuccess,
  };
}
