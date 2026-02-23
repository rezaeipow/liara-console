import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Chip, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import { formatIrr } from "../billingFormat";
import BillingNavActions from "./BillingNavActions";
import type { BillingTopupHeroProps } from "../types";

export default function BillingTopupHero(props: BillingTopupHeroProps) {
  const { displayedCredit, projectedCredit, parsedAmount } = props;

  return (
    <ConsoleHeroCard
      title="Credit Top-up"
      description="Add balance instantly and continue using services without interruption."
      icon={<PaymentsOutlinedIcon fontSize="small" />}
      gradient={`linear-gradient(130deg, ${alpha("#1f6feb", 0.2)}, ${alpha("#0ea5a4", 0.14)})`}
      actions={
        <Stack spacing={0.8}>
          <BillingNavActions active="topup" />
          <Chip
            icon={<CheckCircleOutlineIcon fontSize="small" />}
            label={`Available: ${formatIrr(displayedCredit)}`}
            color="success"
            variant="outlined"
            aria-live="polite"
          />
          <Chip
            icon={<PaymentsOutlinedIcon fontSize="small" />}
            label={`After top-up: ${formatIrr(projectedCredit)}`}
            color={parsedAmount > 0 ? "primary" : "default"}
            variant="outlined"
            aria-live="polite"
          />
        </Stack>
      }
    />
  );
}
