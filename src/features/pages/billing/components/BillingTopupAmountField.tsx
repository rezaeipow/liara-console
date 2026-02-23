import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import type { BillingTopupAmountFieldProps } from "../types";

export default function BillingTopupAmountField(props: BillingTopupAmountFieldProps) {
  const { actionData, amountInput, amountInvalid, onAmountInputChange } = props;

  return (
    <FormControl size="small" error={Boolean(actionData?.fieldErrors?.amount) || amountInvalid}>
      <InputLabel htmlFor="billing-topup-amount">Amount</InputLabel>
      <OutlinedInput
        id="billing-topup-amount"
        name="amount"
        type="number"
        value={amountInput}
        onChange={(event) => onAmountInputChange(event.target.value)}
        inputProps={{ min: 10000, step: 1000, "aria-label": "Top-up amount" }}
        startAdornment={<InputAdornment position="start">IRR</InputAdornment>}
        label="Amount"
      />
      <FormHelperText>
        {actionData?.fieldErrors?.amount ??
          (amountInvalid ? "Minimum amount: 10,000 IRR" : "Choose an amount and continue to top-up")}
      </FormHelperText>
    </FormControl>
  );
}
