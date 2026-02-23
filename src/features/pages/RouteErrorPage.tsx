import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { isRouteErrorResponse, useRevalidator, useRouteError } from "react-router-dom";

export default function RouteErrorPage() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  let details = "";
  let statusHint = "";

  if (isRouteErrorResponse(error)) {
    details = `${error.status} ${error.statusText}`;
    if (error.status === 408) statusHint = "The request timed out. Please retry.";
    if (error.status === 401) statusHint = "Please login again and retry.";
    if (error.status === 403) statusHint = "You do not have permission for this resource.";
    if (error.status === 404) statusHint = "The requested data was not found.";
    if (error.status >= 500) statusHint = "Server error occurred. Try again.";
  } else if (error instanceof Error) {
    details = error.message;
  }

  if (import.meta.env.DEV && details) {
     
    console.error("Route error:", details);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">
        <Stack spacing={1}>
          <Typography variant="body2">Something went wrong while loading this route.</Typography>
          {details ? (
            <Typography variant="caption" display="block">
              {details}
            </Typography>
          ) : null}
          {statusHint ? (
            <Typography variant="caption" display="block">
              {statusHint}
            </Typography>
          ) : null}
          <Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={() => {
                void revalidator.revalidate();
              }}
              disabled={revalidator.state !== "idle"}
            >
              {revalidator.state === "idle" ? "Retry" : "Retrying..."}
            </Button>
          </Box>
        </Stack>
      </Alert>
    </Box>
  );
}
