import { Alert, Button, Stack, TextField } from "@mui/material";
import { PagePlaceholder } from "../PagePlaceholder";

export default function LoginPage() {
  return (
    <PagePlaceholder title="Login" description="Ê—Êœ »Â ò‰”Ê· (Mock)">
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Alert severity="info">«Ì‰ ’›ÕÂ placeholder «”  Ê »Â flow «Õ—«“ ÂÊÌ  Ê’· „Ìù‘Êœ.</Alert>
        <TextField label="Email" size="small" fullWidth />
        <TextField label="Password" type="password" size="small" fullWidth />
        <Button variant="contained">Login</Button>
      </Stack>
    </PagePlaceholder>
  );
}
