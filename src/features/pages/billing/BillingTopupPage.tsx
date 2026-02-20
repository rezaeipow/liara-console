import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import type {
  BillingTopupActionData,
  BillingTopupLoaderData,
} from "./billingData";
import { formatDateTime, formatIrr } from "./billingFormat";

const topupSuggestions = [100000, 300000, 500000, 1000000];

export default function BillingTopupPage() {
  const { credit, recentPayments } = useLoaderData() as BillingTopupLoaderData;
  const actionData = useActionData() as BillingTopupActionData | undefined;
  const navigation = useNavigation();
  const [dismissedNoticeKey, setDismissedNoticeKey] = useState<string | null>(null);
  const isSubmitting = navigation.state === "submitting";

  const noticeMessage = actionData?.formError ?? actionData?.successMessage;
  const noticeKey = actionData?.successAt
    ? `success-${actionData.successAt}`
    : actionData?.formError
      ? `error-${actionData.formError}`
      : null;
  const snackbarOpen = Boolean(noticeKey) && noticeKey !== dismissedNoticeKey;

  const displayedCredit = useMemo(() => {
    if (actionData?.nextCredit != null) return actionData.nextCredit;
    return credit;
  }, [actionData?.nextCredit, credit]);

  return (
    <>
      <Stack
        spacing={2.2}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 980, lg: 1080 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(31,111,235,0.24)",
            background:
              "linear-gradient(130deg, rgba(31,111,235,0.16), rgba(14,165,164,0.10))",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={800}>
                Credit Top-up
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add balance instantly and continue using services without interruption.
              </Typography>
            </Stack>
            <Chip
              icon={<CheckCircleOutlineIcon fontSize="small" />}
              label={`Available: ${formatIrr(displayedCredit)}`}
              color="success"
              variant="outlined"
            />
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.5fr) minmax(0, 1fr)" },
            gap: 1.5,
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: 1.5, sm: 2 },
              border: `1px solid ${alpha("#1f6feb", 0.18)}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.56))",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AddCardOutlinedIcon fontSize="small" />
                <Typography fontWeight={800}>Top-up Form</Typography>
              </Stack>

              <Form method="post" replace>
                <Stack spacing={1.4}>
                  <FormControl size="small" error={Boolean(actionData?.fieldErrors?.amount)}>
                    <InputLabel htmlFor="billing-topup-amount">Amount</InputLabel>
                    <OutlinedInput
                      id="billing-topup-amount"
                      name="amount"
                      type="number"
                      defaultValue={topupSuggestions[1]}
                      inputProps={{ min: 10000, step: 1000, "aria-label": "Top-up amount" }}
                      startAdornment={<InputAdornment position="start">IRR</InputAdornment>}
                      label="Amount"
                    />
                    <FormHelperText>
                      {actionData?.fieldErrors?.amount ?? "Minimum amount: 10,000 IRR"}
                    </FormHelperText>
                  </FormControl>

                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {topupSuggestions.map((value) => (
                      <Button
                        key={value}
                        type="submit"
                        name="amount"
                        value={value}
                        size="small"
                        variant="outlined"
                        disabled={isSubmitting}
                      >
                        {formatIrr(value)}
                      </Button>
                    ))}
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: 180 }}>
                      {isSubmitting ? "Processing..." : "Proceed to top-up"}
                    </Button>
                    <Button component={Link} to="/console/billing/payments" variant="outlined" endIcon={<ArrowOutwardIcon fontSize="small" />}>
                      Payment history
                    </Button>
                  </Stack>
                </Stack>
              </Form>

              {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}
            </Stack>
          </Paper>

          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: 1.5, sm: 2 },
              border: `1px solid ${alpha("#1f6feb", 0.18)}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.54))",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={1.2}>
              <Typography fontWeight={800}>Recent Payments</Typography>
              {recentPayments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  You do not have recent payments yet.
                </Typography>
              ) : (
                recentPayments.map((payment) => (
                  <Stack
                    key={payment.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      p: 1,
                      borderRadius: 1.2,
                      border: `1px solid ${alpha("#0f172a", 0.1)}`,
                      backgroundColor: alpha("#ffffff", 0.56),
                    }}
                  >
                    <Stack spacing={0.15}>
                      <Typography variant="body2" fontWeight={700}>
                        {formatIrr(payment.amount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(payment.createdAt)}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      color={payment.status === "success" ? "success" : "error"}
                      variant="outlined"
                      label={payment.status === "success" ? "Success" : "Failed"}
                    />
                  </Stack>
                ))
              )}
            </Stack>
          </Paper>
        </Box>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDismissedNoticeKey(noticeKey)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={actionData?.formError ? "error" : "success"}
          variant="filled"
          onClose={() => setDismissedNoticeKey(noticeKey)}
        >
          {noticeMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
