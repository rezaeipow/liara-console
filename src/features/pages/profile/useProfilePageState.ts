import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectActiveAccount } from "@/app/store/slices/accountSlice";
import {
  disable2FA,
  enable2FA,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  updateProfile,
} from "@/app/store/slices/authSlice";
import { showToast } from "@/app/store/slices/uiSlice";
import type { ProfilePageState } from "./types";
import {
  formatProfileDateTime,
  getEmailError,
  getNameError,
  getOrCreateLastLogin,
  getPhoneError,
  getPhoneStorageKey,
  readStorage,
  validateAvatarFile,
  writeStorage,
} from "./profileUtils";

export function useProfilePageState(): ProfilePageState {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const activeAccount = useAppSelector(selectActiveAccount);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarDraft, setAvatarDraft] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [removeAvatarOpen, setRemoveAvatarOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [lastLoginAt] = useState(getOrCreateLastLogin);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setAvatarDraft(user.avatar ?? "");
    });
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    queueMicrotask(() => {
      setPhone(readStorage(getPhoneStorageKey(user.id)));
    });
  }, [user?.id]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedAvatarDraft = avatarDraft.trim();
  const trimmedPhone = phone.trim();
  const errors = useMemo(
    () => ({
      name: getNameError(name),
      email: getEmailError(email),
      phone: getPhoneError(phone),
      avatar: avatarError,
    }),
    [avatarError, email, name, phone],
  );

  const hasValidationError = Boolean(errors.name || errors.email || errors.phone || errors.avatar);
  const hasChanges = Boolean(
    user &&
      (trimmedName !== (user.name ?? "") ||
        trimmedEmail !== (user.email ?? "") ||
        trimmedAvatarDraft !== (user.avatar ?? "") ||
        trimmedPhone !== readStorage(getPhoneStorageKey(user.id))),
  );
  const saveDisabled = !user || !hasChanges || hasValidationError;
  const securityTone = user?.twoFAEnabled ? "success" : "warning";
  const securityLabel = user?.twoFAEnabled ? "2FA Enabled" : "2FA Disabled";
  const identityRows = useMemo(
    () => [
      { label: "User ID", value: user?.id ?? "-" },
      { label: "Last Login", value: formatProfileDateTime(lastLoginAt) },
      { label: "Active Account", value: activeAccount?.name ?? "No active account" },
    ],
    [activeAccount?.name, lastLoginAt, user?.id],
  );

  const onSaveChanges = () => {
    if (!user || saveDisabled) return;
    dispatch(
      updateProfile({
        name: trimmedName,
        email: trimmedEmail,
        avatar: trimmedAvatarDraft || undefined,
      }),
    );
    writeStorage(getPhoneStorageKey(user.id), trimmedPhone);
    dispatch(showToast({ message: "Profile updated successfully.", severity: "success" }));
  };

  const onToggle2FA = (checked: boolean) => {
    if (!user) return;
    if (checked) {
      dispatch(enable2FA());
      dispatch(showToast({ message: "2FA has been enabled.", severity: "success" }));
      return;
    }
    dispatch(disable2FA());
    dispatch(showToast({ message: "2FA has been disabled.", severity: "warning" }));
  };

  const onLogoutSessions = () => {
    dispatch(showToast({ message: "Logged out from other sessions (mock).", severity: "info" }));
  };

  const onAvatarUpload = (file: File | null) => {
    const error = validateAvatarFile(file);
    if (error) {
      setAvatarError(error);
      return;
    }
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setAvatarError("Could not read selected image.");
        return;
      }
      setAvatarDraft(result);
      setAvatarError("");
    };
    reader.onerror = () => {
      setAvatarError("Could not read selected image.");
    };
    reader.readAsDataURL(file);
  };

  const onAvatarRemoveConfirm = () => {
    setAvatarDraft("");
    setAvatarError("");
    setRemoveAvatarOpen(false);
  };

  return {
    user,
    isAuthenticated,
    authLoading,
    authError,
    activeAccountName: activeAccount?.name ?? "N/A",
    name,
    email,
    phone,
    avatarDraft,
    removeAvatarOpen,
    setRemoveAvatarOpen,
    identityRows,
    errors,
    saveDisabled,
    securityLabel,
    securityTone,
    onNameChange: setName,
    onEmailChange: setEmail,
    onPhoneChange: setPhone,
    onAvatarUpload,
    onAvatarRemoveConfirm,
    onSaveChanges,
    onToggle2FA,
    onLogoutSessions,
  };
}
