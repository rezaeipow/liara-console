import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { TopbarCreditSummaryProps } from "../types";

export default function TopbarCreditSummary(props: TopbarCreditSummaryProps) {
  const { creditAmount } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.common.white, 0.52),
      }}
    >
      <CreditCardIcon fontSize="small" />
      <Typography variant="body2" fontWeight={600}>
        {creditAmount == null ? "..." : `${new Intl.NumberFormat().format(creditAmount)} IRR`}
      </Typography>
    </Box>
  );
}
