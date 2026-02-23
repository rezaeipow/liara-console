import { Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ProfilePersonalInfoCardProps } from "../types";
import ProfileAvatarSection from "./ProfileAvatarSection";
import ProfileContactFields from "./ProfileContactFields";

export default function ProfilePersonalInfoCard(props: ProfilePersonalInfoCardProps) {
  const { state } = props;

  return (
    <Paper
      sx={{
        flex: 1.3,
        p: { xs: 1.8, sm: 2.2 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={800}>Personal Info</Typography>

        <ProfileAvatarSection
          name={state.name}
          avatarDraft={state.avatarDraft}
          avatarError={state.errors.avatar}
          onAvatarUpload={state.onAvatarUpload}
          onOpenRemove={() => state.setRemoveAvatarOpen(true)}
        />

        <ProfileContactFields
          name={state.name}
          email={state.email}
          phone={state.phone}
          errors={state.errors}
          onNameChange={state.onNameChange}
          onEmailChange={state.onEmailChange}
          onPhoneChange={state.onPhoneChange}
        />

        <Button
          variant="contained"
          disabled={state.saveDisabled}
          onClick={state.onSaveChanges}
        >
          Save changes
        </Button>
      </Stack>
    </Paper>
  );
}
