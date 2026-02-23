import { Alert, LinearProgress, Paper, Skeleton, Stack } from "@mui/material";
import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ProfileHero from "./components/ProfileHero";
import ProfileIdentityCard from "./components/ProfileIdentityCard";
import ProfilePersonalInfoCard from "./components/ProfilePersonalInfoCard";
import ProfileSecurityCard from "./components/ProfileSecurityCard";
import { useProfilePageState } from "./useProfilePageState";

function ProfileLoadingState() {
  return (
    <Paper sx={{ p: { xs: 1.8, sm: 2.2 } }}>
      <LinearProgress sx={{ mb: 1.2 }} />
      <Stack spacing={0.8}>
        <Skeleton variant="rounded" height={30} width={220} />
        <Skeleton variant="rounded" height={18} width={300} />
        <Skeleton variant="rounded" height={18} width={280} />
      </Stack>
    </Paper>
  );
}

export default function ProfilePage() {
  const state = useProfilePageState();

  return (
    <ConsoleContentContainer
      spacing={2}
      maxWidth={{ xs: "100%", sm: 920, lg: 1040 }}
    >
      {state.authLoading ? <ProfileLoadingState /> : null}
      {!state.authLoading && (!state.isAuthenticated || !state.user) ? (
        <Alert severity="warning" variant="outlined">
          Session not available. Please login again.
        </Alert>
      ) : null}

      {!state.authLoading && state.isAuthenticated && state.user ? (
        <>
          <ProfileHero
            securityTone={state.securityTone}
            securityLabel={state.securityLabel}
            activeAccountName={state.activeAccountName}
          />
          {state.authError ? (
            <Alert severity="error">{state.authError}</Alert>
          ) : null}
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1.5}
            alignItems="stretch"
          >
            <ProfilePersonalInfoCard
              state={{
                name: state.name,
                email: state.email,
                phone: state.phone,
                avatarDraft: state.avatarDraft,
                errors: state.errors,
                saveDisabled: state.saveDisabled,
                onNameChange: state.onNameChange,
                onEmailChange: state.onEmailChange,
                onPhoneChange: state.onPhoneChange,
                onSaveChanges: state.onSaveChanges,
                onAvatarUpload: state.onAvatarUpload,
                setRemoveAvatarOpen: state.setRemoveAvatarOpen,
              }}
            />
            <Stack sx={{ flex: 1 }} spacing={1.5}>
              <ProfileSecurityCard
                twoFAEnabled={Boolean(state.user.twoFAEnabled)}
                onToggle2FA={state.onToggle2FA}
                onLogoutSessions={state.onLogoutSessions}
              />
              <ProfileIdentityCard identityRows={state.identityRows} />
            </Stack>
          </Stack>
          <ResourceActionConfirmDialog
            open={state.removeAvatarOpen}
            onClose={() => state.setRemoveAvatarOpen(false)}
            onConfirm={state.onAvatarRemoveConfirm}
            title="Remove profile image?"
            message="Your avatar will be cleared and replaced with the default profile placeholder."
            confirmLabel="Remove"
            confirmColor="error"
          />
        </>
      ) : null}
    </ConsoleContentContainer>
  );
}
