import { Box, Typography } from "@mui/material";
import type { AuthPasswordRulesHintProps } from "../types";

export default function AuthPasswordRulesHint({
  checks,
  fieldError,
  showRules,
  showCurrentPasswordConflict = false,
}: AuthPasswordRulesHintProps) {
  const allPassed = Object.values(checks).every(Boolean);
  if (showCurrentPasswordConflict && fieldError) {
    return (
      <Typography
        component="span"
        variant="caption"
        sx={{ color: "text.primary" }}
      >
        <Box
          component="span"
          sx={{ color: "error.main", display: "block", mt: 0.35 }}
        >
          {fieldError}
        </Box>
      </Typography>
    );
  }
  if (showRules && !allPassed) {
    return (
      <Typography
        component="span"
        variant="caption"
        sx={{ color: "text.primary" }}
      >
        Use at least{" "}
        <Box
          component="span"
          sx={{
            color: checks.length ? "text.primary" : "error.main",
            fontWeight: 600,
          }}
        >
          8 chars
        </Box>{" "}
        with{" "}
        <Box
          component="span"
          sx={{
            color: checks.upper ? "text.primary" : "error.main",
            fontWeight: 600,
          }}
        >
          uppercase
        </Box>
        /
        <Box
          component="span"
          sx={{
            color: checks.lower ? "text.primary" : "error.main",
            fontWeight: 600,
          }}
        >
          lowercase
        </Box>
        ,{" "}
        <Box
          component="span"
          sx={{
            color: checks.number ? "text.primary" : "error.main",
            fontWeight: 600,
          }}
        >
          number
        </Box>
        ,{" "}
        <Box
          component="span"
          sx={{
            color: checks.special ? "text.primary" : "error.main",
            fontWeight: 600,
          }}
        >
          special
        </Box>
        .
      </Typography>
    );
  }
  return allPassed
    ? ""
    : "Use at least 8 chars with upper/lowercase, number, special.";
}
