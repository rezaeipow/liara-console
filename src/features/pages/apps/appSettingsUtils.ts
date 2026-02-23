export function getRenameHelper(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 3) return "Use at least 3 characters.";
  if (trimmed.length > 32) return "Use at most 32 characters.";
  return "Choose a descriptive service name.";
}
