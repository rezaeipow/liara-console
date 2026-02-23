import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function LoginLinks() {
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        <Link component={RouterLink} to="/forgot-password" underline="hover">Forgot password?</Link>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Do not have an account? <Link component={RouterLink} to="/signup" underline="hover">Create one</Link>
      </Typography>
    </>
  );
}
