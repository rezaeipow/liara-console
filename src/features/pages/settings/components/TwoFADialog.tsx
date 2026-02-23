import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import type { TwoFADialogProps } from "@/shared/types/settingsComponents";

export default function TwoFADialog(props: TwoFADialogProps) {
  const { open, step, verificationCode, verificationError, mockCode, onClose, onStepChange, onCodeChange, onVerify } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="two-fa-dialog-title">
      <DialogTitle id="two-fa-dialog-title">Enable 2FA</DialogTitle>
      <DialogContent>
        <Stack spacing={1.4} sx={{ mt: 0.5 }}>
          {step === "instructions" ? <Alert severity="info" variant="outlined">Step 1: Setup completed (mock). Continue to verification.</Alert> : null}
          {step === "verify" ? (
            <>
              <Typography variant="body2" color="text.secondary">Step 2: enter <strong>{mockCode}</strong> to verify and enable.</Typography>
              <TextField value={verificationCode} onChange={(event) => onCodeChange(event.target.value)} label="Verification code" placeholder="123456" inputProps={{ "aria-label": "Enter 2FA verification code", maxLength: 6 }} error={Boolean(verificationError)} helperText={verificationError ?? " "} autoFocus />
            </>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {step === "instructions" ? <Button variant="contained" onClick={() => onStepChange("verify")}>Continue</Button> : <Button variant="contained" onClick={onVerify}>Verify & Enable</Button>}
      </DialogActions>
    </Dialog>
  );
}
