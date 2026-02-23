import type { Account } from "@/api/types";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

export type AccountsActionData = {
  successMessage?: string;
  successAt?: number;
  formError?: string;
  fieldErrors?: {
    name?: string;
    accountId?: string;
  };
};

export type AccountsPageState = {
  accounts: Account[];
  activeAccountId: string | null;
  filteredAccounts: Account[];
  isMobile: boolean;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  newAccountName: string;
  setNewAccountName: Dispatch<SetStateAction<string>>;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingAccountId: string | null;
  editingName: string;
  setEditingName: Dispatch<SetStateAction<string>>;
  accountIdToDelete: string | null;
  setAccountIdToDelete: Dispatch<SetStateAction<string | null>>;
  mobileMenuAnchorEl: HTMLElement | null;
  mobileMenuAccountId: string | null;
  isCreating: boolean;
  isMutatingRow: boolean;
  isSwitching: boolean;
  rowAccountId: string;
  rowIntent: string;
  mobileMenuOpen: boolean;
  showSuccessInline: boolean;
  latestSuccessMessage: string;
  createFormError?: string;
  rowFormError?: string;
  createFieldNameError?: string;
  accountToDelete: Account | null;
  startEditing: (accountId: string, name: string) => void;
  cancelEditing: () => void;
  submitEdit: () => void;
  submitSwitch: (accountId: string) => void;
  openDeleteDialog: (accountId: string) => void;
  closeDeleteDialog: () => void;
  confirmDelete: () => void;
  openMobileMenu: (event: MouseEvent<HTMLButtonElement>, accountId: string) => void;
  closeMobileMenu: () => void;
  handleCreateSubmit: () => void;
  dismissSuccess: () => void;
};

export type AccountsHeaderProps = {
  onOpenCreate: () => void;
};

export type AccountsSearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export type AccountRowProps = {
  state: AccountsPageState;
  account: Account;
};

export type AccountRowActionsProps = {
  state: AccountsPageState;
  account: Account;
  isActive: boolean;
};

export type AccountsListPanelProps = {
  state: AccountsPageState;
};

export type AccountsDialogsProps = {
  state: AccountsPageState;
};

export type AccountsMobileMenuProps = {
  state: AccountsPageState;
};
