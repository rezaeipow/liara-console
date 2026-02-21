import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import type { NewTicketLoaderData, TicketActionData } from "./supportData";

const DRAFT_KEY = "support-ticket-draft";

type DraftPayload = {
  subject: string;
  category: string;
  body: string;
};

function readDraft(defaultCategory: string): DraftPayload {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { subject: "", category: defaultCategory, body: "" };
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;
    return {
      subject: typeof parsed.subject === "string" ? parsed.subject : "",
      category: typeof parsed.category === "string" ? parsed.category : defaultCategory,
      body: typeof parsed.body === "string" ? parsed.body : "",
    };
  } catch {
    return { subject: "", category: defaultCategory, body: "" };
  }
}

export default function NewTicketPage() {
  const { categories } = useLoaderData() as NewTicketLoaderData;
  const actionData = useActionData() as TicketActionData | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/support/tickets/new");

  const prefilledCategory = searchParams.get("category") ?? "apps";
  const initialDraft = useMemo(() => readDraft(prefilledCategory), [prefilledCategory]);
  const [subject, setSubject] = useState(initialDraft.subject);
  const [category, setCategory] = useState(initialDraft.category);
  const [body, setBody] = useState(initialDraft.body);

  useEffect(() => {
    const payload: DraftPayload = { subject, category, body };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [body, category, subject]);

  const hasError = Boolean(actionData?.formError);
  const snackbarOpen = Boolean(actionData?.formError || actionData?.successMessage);
  const noticeTone = actionData?.formError ? "error" : "success";

  const categoryOptions = useMemo(
    () => categories.map((value) => ({ value, label: value.toUpperCase() })),
    [categories],
  );

  const clearDraft = () => {
    setSubject("");
    setCategory("apps");
    setBody("");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <>
      <Stack
        spacing={2.2}
        aria-busy={isRouteLoading}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 860, lg: 980 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(31,111,235,0.32)",
            background:
              "linear-gradient(120deg, rgba(31,111,235,0.20), rgba(14,165,164,0.14))",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.4}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={800}>
                Create Support Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share issue details and the support team will follow up in this thread.
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={clearDraft}
              >
                Discard draft
              </Button>
              <Button
                component={Link}
                to="/console/support/tickets"
                variant="outlined"
                startIcon={<ArrowBackIcon fontSize="small" />}
                aria-label="Back to tickets list"
              >
                Back to list
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.24)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
            backdropFilter: "blur(10px)",
          }}
        >
          {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
          <Stack spacing={1.6}>
            <Form method="post" aria-label="Create support ticket form">
              <Stack spacing={1.4}>
                <FormControl size="small" error={Boolean(actionData?.fieldErrors?.subject)}>
                  <InputLabel htmlFor="support-ticket-subject">Subject</InputLabel>
                  <OutlinedInput
                    id="support-ticket-subject"
                    name="subject"
                    label="Subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Example: Deployment failed after pushing commit"
                    inputProps={{ "aria-label": "Ticket subject", maxLength: 120 }}
                  />
                  <FormHelperText>
                    {actionData?.fieldErrors?.subject ??
                      `A short title helps faster triage (${subject.length}/120)`}
                  </FormHelperText>
                </FormControl>

                <FormControl size="small" error={Boolean(actionData?.fieldErrors?.category)}>
                  <InputLabel id="support-ticket-category-label">Category</InputLabel>
                  <Select
                    labelId="support-ticket-category-label"
                    id="support-ticket-category"
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    label="Category"
                    inputProps={{ "aria-label": "Ticket category" }}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {actionData?.fieldErrors?.category ?? "Choose the most relevant area."}
                  </FormHelperText>
                </FormControl>

                <FormControl size="small" error={Boolean(actionData?.fieldErrors?.body)}>
                  <InputLabel htmlFor="support-ticket-body">Description</InputLabel>
                  <OutlinedInput
                    id="support-ticket-body"
                    name="body"
                    label="Description"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    multiline
                    minRows={6}
                    placeholder="What happened? What did you expect? Include key details."
                    inputProps={{ "aria-label": "Ticket description", maxLength: 2000 }}
                  />
                  <FormHelperText>
                    {actionData?.fieldErrors?.body ??
                      `Include steps and exact error text if available (${body.length}/2000)`}
                  </FormHelperText>
                </FormControl>

                {hasError ? (
                  <Alert severity="error">
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{actionData?.formError}</Typography>
                      {actionData?.errorStatus ? (
                        <Typography variant="caption">Error code: {actionData.errorStatus}</Typography>
                      ) : null}
                      {actionData?.errorHint ? (
                        <Typography variant="caption">{actionData.errorHint}</Typography>
                      ) : null}
                    </Stack>
                  </Alert>
                ) : null}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendOutlinedIcon />}
                    disabled={isSubmitting}
                    aria-label="Submit support ticket"
                  >
                    {isSubmitting ? "Submitting..." : "Submit ticket"}
                  </Button>
                  <Button component={Link} to="/console/support/tickets" variant="text">
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Form>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={noticeTone} variant="filled">
          {actionData?.formError ?? actionData?.successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
