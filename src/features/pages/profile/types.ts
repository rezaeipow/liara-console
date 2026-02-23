import type { User } from "@/api/types";
import type { Dispatch, SetStateAction } from "react";

export type IdentityRow = {
  label: string;
  value: string;
};

export type ProfileFieldErrors = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export type ProfilePageState = {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  activeAccountName: string;
  name: string;
  email: string;
  phone: string;
  avatarDraft: string;
  removeAvatarOpen: boolean;
  setRemoveAvatarOpen: Dispatch<SetStateAction<boolean>>;
  identityRows: IdentityRow[];
  errors: ProfileFieldErrors;
  saveDisabled: boolean;
  securityLabel: string;
  securityTone: "success" | "warning";
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAvatarUpload: (file: File | null) => void;
  onAvatarRemoveConfirm: () => void;
  onSaveChanges: () => void;
  onToggle2FA: (checked: boolean) => void;
  onLogoutSessions: () => void;
};

export type ProfileHeroProps = {
  securityTone: "success" | "warning";
  securityLabel: string;
  activeAccountName: string;
};

export type ProfilePersonalInfoCardProps = {
  state: Pick<
    ProfilePageState,
    | "name"
    | "email"
    | "phone"
    | "avatarDraft"
    | "errors"
    | "saveDisabled"
    | "onNameChange"
    | "onEmailChange"
    | "onPhoneChange"
    | "onSaveChanges"
    | "onAvatarUpload"
    | "setRemoveAvatarOpen"
  >;
};

export type ProfileAvatarSectionProps = {
  name: string;
  avatarDraft: string;
  avatarError: string;
  onAvatarUpload: (file: File | null) => void;
  onOpenRemove: () => void;
};

export type ProfileContactFieldsProps = {
  name: string;
  email: string;
  phone: string;
  errors: ProfileFieldErrors;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};

export type ProfileSecurityCardProps = {
  twoFAEnabled: boolean;
  onToggle2FA: (checked: boolean) => void;
  onLogoutSessions: () => void;
};

export type ProfileIdentityCardProps = {
  identityRows: IdentityRow[];
};
