import { Button, Stack, TextField } from "@mui/material";
import { PagePlaceholder } from "../PagePlaceholder";

export default function SignupPage() {
  return (
    <PagePlaceholder title="Signup" description="ÇíÌÇÏ ÍÓÇÈ ˜ÇÑÈÑí (Mock)">
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField label="Name" size="small" fullWidth />
        <TextField label="Email" size="small" fullWidth />
        <TextField label="Password" type="password" size="small" fullWidth />
        <Button variant="contained">Create account</Button>
      </Stack>
    </PagePlaceholder>
  );
}
