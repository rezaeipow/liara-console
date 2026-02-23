import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { BillingNavActionsProps } from "./types";

export default function BillingNavActions({ active }: BillingNavActionsProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
      <Button component={Link} to="/console/billing" variant={active === "overview" ? "contained" : "outlined"}>
        Overview
      </Button>
      <Button
        component={Link}
        to="/console/billing/topup"
        variant={active === "topup" ? "contained" : "outlined"}
        startIcon={active === "topup" ? <AddCardOutlinedIcon /> : undefined}
      >
        Top up
      </Button>
      <Button
        component={Link}
        to="/console/billing/payments"
        variant={active === "payments" ? "contained" : "outlined"}
        endIcon={active === "payments" ? undefined : <ArrowOutwardIcon />}
      >
        Payments
      </Button>
      <Button
        component={Link}
        to="/console/billing/invoices"
        variant={active === "invoices" ? "contained" : "outlined"}
        endIcon={active === "invoices" ? undefined : <ArrowOutwardIcon />}
      >
        Invoices
      </Button>
    </Stack>
  );
}
