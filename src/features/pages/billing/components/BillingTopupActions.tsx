import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { BillingTopupActionsProps } from "../types";

export default function BillingTopupActions(props: BillingTopupActionsProps) {
  const { isSubmitting, parsedAmount, minimumTopup } = props;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || parsedAmount < minimumTopup}
        sx={{ minWidth: 180 }}
        aria-label="Submit top-up payment"
      >
        {isSubmitting ? "Processing..." : "Proceed to top-up"}
      </Button>
      <Button
        component={Link}
        to="/console/billing/payments"
        variant="outlined"
        endIcon={<ArrowOutwardIcon fontSize="small" />}
        aria-label="Open billing payments history"
      >
        Payment history
      </Button>
    </Stack>
  );
}
