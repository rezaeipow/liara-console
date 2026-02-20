import { Alert, Box, Typography } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorPage() {
  const error = useRouteError();
  let details = "";

  if (isRouteErrorResponse(error)) {
    details = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    details = error.message;
  }

  if (import.meta.env.DEV && details) {
    // eslint-disable-next-line no-console
    console.error("Route error:", details);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">
        مشکلي در بارگذاري اين مسير رخ داده است.
        {details ? (
          <Typography variant="caption" display="block">
            {details}
          </Typography>
        ) : null}
      </Alert>
    </Box>
  );
}
