import { Button, Stack } from "@mui/material";
import { formatIrr } from "../billingFormat";
import type { BillingTopupSuggestionsProps } from "../types";

export default function BillingTopupSuggestions(props: BillingTopupSuggestionsProps) {
  const { suggestions, parsedAmount, isSubmitting, onSelectAmount } = props;

  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
      {suggestions.map((value) => (
        <Button
          key={value}
          type="button"
          size="small"
          variant={parsedAmount === value ? "contained" : "outlined"}
          disabled={isSubmitting}
          onClick={() => onSelectAmount(value)}
          aria-label={`Set top-up amount to ${formatIrr(value)}`}
        >
          {formatIrr(value)}
        </Button>
      ))}
    </Stack>
  );
}
