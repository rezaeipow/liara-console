import { FormControlLabel, Switch } from "@mui/material";
import type { AppEnvVisibilityToggleProps } from "@/shared/types/appsComponents";

export default function AppEnvVisibilityToggle({ hasSecretRows, revealSecrets, onToggle }: AppEnvVisibilityToggleProps) {
  return (
    <FormControlLabel
      control={<Switch checked={revealSecrets} disabled={!hasSecretRows} onChange={(event) => onToggle(event.target.checked)} />}
      label={hasSecretRows ? "Reveal secret values" : "No secret values to reveal"}
    />
  );
}
