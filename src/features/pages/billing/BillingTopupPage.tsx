import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Paper,
  Snackbar,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, type ChangeEvent } from "react";
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
const minimumTopup = 10000;

export default function BillingTopupPage() {
  const { credit, recentPayments } = useLoaderData() as BillingTopupLoaderData;
  const actionData = useActionData() as BillingTopupActionData | undefined;
  const navigation = useNavigation();
  const [amountInput, setAmountInput] = useState(String(topupSuggestions[1]));
  const [dismissedNoticeKey, setDismissedNoticeKey] = useState<string | null>(null);
  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/billing/topup");

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

  const parsedAmount = useMemo(() => {
    const next = Number(amountInput);
    if (!Number.isFinite(next) || next <= 0) return 0;
    return Math.floor(next);
  }, [amountInput]);
  const projectedCredit = displayedCredit + parsedAmount;
  const amountInvalid = parsedAmount > 0 && parsedAmount < minimumTopup;

  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountInput(event.target.value);
  };

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
            <Stack spacing={0.8}>
              <Chip
                icon={<CheckCircleOutlineIcon fontSize="small" />}
                label={`Available: ${formatIrr(displayedCredit)}`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<PaymentsOutlinedIcon fontSize="small" />}
                label={`After top-up: ${formatIrr(projectedCredit)}`}
                color={parsedAmount > 0 ? "primary" : "default"}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "1.2fr 0.8fr",
              lg: "minmax(0, 1.5fr) minmax(0, 1fr)",
            },
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
            {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AddCardOutlinedIcon fontSize="small" />
                <Typography fontWeight={800}>Top-up Form</Typography>
              </Stack>

              <Form method="post" replace>
                <Stack spacing={1.4}>
                  <FormControl
                    size="small"
                    error={Boolean(actionData?.fieldErrors?.amount) || amountInvalid}
                  >
                    <InputLabel htmlFor="billing-topup-amount">Amount</InputLabel>
                    <OutlinedInput
                      id="billing-topup-amount"
                      name="amount"
                      type="number"
                      value={amountInput}
                      onChange={onChangeAmount}
                      inputProps={{ min: 10000, step: 1000, "aria-label": "Top-up amount" }}
                      startAdornment={<InputAdornment position="start">IRR</InputAdornment>}
                      label="Amount"
                    />
                    <FormHelperText>
                      {actionData?.fieldErrors?.amount ??
                        (amountInvalid
                          ? "Minimum amount: 10,000 IRR"
                          : "Choose an amount and continue to top-up")}
                    </FormHelperText>
                  </FormControl>

                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {topupSuggestions.map((value) => (
                      <Button
                        key={value}
                        type="button"
                        size="small"
                        variant={parsedAmount === value ? "contained" : "outlined"}
                        disabled={isSubmitting}
                        onClick={() => setAmountInput(String(value))}
                      >
                        {formatIrr(value)}
                      </Button>
                    ))}
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || parsedAmount < minimumTopup}
                      sx={{ minWidth: 180 }}
                    >
                      {isSubmitting ? "Processing..." : "Proceed to top-up"}
                    </Button>
                    <Button
                      component={Link}
                      to="/console/billing/payments"
                      variant="outlined"
                      endIcon={<ArrowOutwardIcon fontSize="small" />}
                    >
                      Payment history
                    </Button>
                  </Stack>
                </Stack>
              </Form>

              {actionData?.formError ? (
                <Alert
                  severity="error"
                  action={
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => {
                        setDismissedNoticeKey(null);
                      }}
                    >
                      Retry
                    </Button>
                  }
                >
                  <Stack spacing={0.25}>
                    <Typography variant="body2">{actionData.formError}</Typography>
                    {actionData.errorStatus ? (
                      <Typography variant="caption">Error code: {actionData.errorStatus}</Typography>
                    ) : null}
                    {actionData.errorHint ? (
                      <Typography variant="caption">{actionData.errorHint}</Typography>
                    ) : null}
                  </Stack>
                </Alert>
              ) : null}
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
              {isRouteLoading ? (
                <Stack spacing={1}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={`topup-loading-${index}`} variant="rounded" height={52} />
                  ))}
                </Stack>
              ) : recentPayments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  You do not have recent payments yet.
                </Typography>
              ) : (
                recentPayments.map((payment) => (
                  <Stack
                    key={payment.id}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
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
