import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Link as RouterLink, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function LoginPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";

  const next = searchParams.get("next");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your console.
            </Typography>
          </Box>

          {next ? <input type="hidden" name="next" value={next} /> : null}

          {actionData?.formError ? (
            <Alert severity="error">{actionData.formError}</Alert>
          ) : null}

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
            autoComplete="email"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.email)}
            helperText={actionData?.fieldErrors?.email}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            required
            fullWidth
            autoComplete="current-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.password)}
            helperText={actionData?.fieldErrors?.password}
          />

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Do not have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Create one
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
