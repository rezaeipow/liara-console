import { Box, Typography } from "@mui/material";

export default function LoginHeader() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>Login</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>Sign in to continue to your console.</Typography>
    </Box>
  );
}
