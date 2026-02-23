import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import type { ProfileAvatarSectionProps } from "../types";

export default function ProfileAvatarSection(props: ProfileAvatarSectionProps) {
  const { name, avatarDraft, avatarError, onAvatarUpload, onOpenRemove } = props;
  const trimmedName = name.trim();
  const trimmedAvatar = avatarDraft.trim();

  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary">
        Profile photo
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
        <Avatar src={trimmedAvatar || undefined} sx={{ width: 52, height: 52 }}>
          {(trimmedName[0] ?? "U").toUpperCase()}
        </Avatar>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.7}>
          <Button component="label" variant="outlined" size="small" startIcon={<CloudUploadOutlinedIcon fontSize="small" />}>
            {trimmedAvatar ? "Upload new image" : "Upload image"}
            <input type="file" accept="image/*" hidden onChange={(event) => onAvatarUpload(event.target.files?.[0] ?? null)} />
          </Button>
          <Button variant="text" size="small" color="inherit" onClick={onOpenRemove} disabled={!trimmedAvatar}>
            Remove
          </Button>
        </Stack>
      </Stack>
      {avatarError ? <Typography variant="caption" color="error">{avatarError}</Typography> : null}
    </Stack>
  );
}
