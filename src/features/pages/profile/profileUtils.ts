import { createDateTimeFormatter, formatWith } from "@/shared/utils/dateTime";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/shared/utils/storage";

const PHONE_STORAGE_KEY_PREFIX = "console-profile-phone";
const LAST_LOGIN_STORAGE_KEY = "console-profile-last-login";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const profileDateTimeFormatter = createDateTimeFormatter();

export function readStorage(key: string): string {
  return getStorageItem(key) ?? "";
}

export function writeStorage(key: string, value: string) {
  if (!value) {
    removeStorageItem(key);
    return;
  }
  setStorageItem(key, value);
}

export function getPhoneStorageKey(userId: string): string {
  return `${PHONE_STORAGE_KEY_PREFIX}:${userId}`;
}

export function getOrCreateLastLogin() {
  const storedLogin = readStorage(LAST_LOGIN_STORAGE_KEY);
  if (storedLogin) return storedLogin;
  const now = new Date().toISOString();
  writeStorage(LAST_LOGIN_STORAGE_KEY, now);
  return now;
}

export function formatProfileDateTime(value: string) {
  return formatWith(profileDateTimeFormatter, value);
}

export function getEmailError(email: string) {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmedEmail)) return "Enter a valid email address.";
  return "";
}

export function getNameError(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) return "Name is required.";
  if (trimmedName.length < 2) return "Name must be at least 2 characters.";
  return "";
}

export function getPhoneError(phone: string) {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) return "";
  return /^[0-9+\-()\s]{8,20}$/.test(trimmedPhone)
    ? ""
    : "Phone must contain valid digits and symbols.";
}

export function validateAvatarFile(file: File | null) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) return "Only image files are allowed.";
  if (file.size > MAX_AVATAR_BYTES) return "Image size must be less than 2MB.";
  return "";
}
