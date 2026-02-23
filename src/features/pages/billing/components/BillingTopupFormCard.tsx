import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import {
  Alert,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Form } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import BillingTopupActions from "./BillingTopupActions";
import BillingTopupAmountField from "./BillingTopupAmountField";
import BillingTopupSuggestions from "./BillingTopupSuggestions";
import type { BillingTopupFormCardProps } from "../types";

export default function BillingTopupFormCard(props: BillingTopupFormCardProps) {
  const {
    actionData,
    amountInput,
    parsedAmount,
    isSubmitting,
    isRouteLoading,
    amountInvalid,
    suggestions,
    minimumTopup,
    onAmountInputChange,
    onSelectAmount,
  } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
      <Stack spacing={1.6}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AddCardOutlinedIcon fontSize="small" />
          <Typography fontWeight={800}>Top-up Form</Typography>
        </Stack>

        <Form method="post" replace aria-label="Billing top-up form">
          <Stack spacing={1.4}>
            <BillingTopupAmountField
              actionData={actionData}
              amountInput={amountInput}
              amountInvalid={amountInvalid}
              onAmountInputChange={onAmountInputChange}
            />

            <BillingTopupSuggestions
              suggestions={suggestions}
              parsedAmount={parsedAmount}
              isSubmitting={isSubmitting}
              onSelectAmount={onSelectAmount}
            />

            <BillingTopupActions
              isSubmitting={isSubmitting}
              parsedAmount={parsedAmount}
              minimumTopup={minimumTopup}
            />
          </Stack>
        </Form>

        {actionData?.formError ? (
          <Alert severity="error">
            <Stack spacing={0.25}>
              <Typography variant="body2">{actionData.formError}</Typography>
              {actionData.errorStatus ? <Typography variant="caption">Error code: {actionData.errorStatus}</Typography> : null}
              {actionData.errorHint ? <Typography variant="caption">{actionData.errorHint}</Typography> : null}
            </Stack>
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
