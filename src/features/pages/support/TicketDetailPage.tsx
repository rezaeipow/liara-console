import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Alert,
  Button,
  Chip,
  LinearProgress,
  OutlinedInput,
  Paper,
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
import { useAppSelector } from "../../../app/store/hooks";
import { selectTableDensity } from "../../../app/store/slices/uiSlice";
import { formatDateTime } from "../billing/billingFormat";
import type { TicketActionData, TicketDetailLoaderData } from "./supportData";

function statusTone(status: "open" | "pending" | "closed"): "warning" | "info" | "success" {
  if (status === "open") return "warning";
  if (status === "pending") return "info";
  return "success";
}

function formatDayLabel(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

type TimelineMessage = {
  id: string;
  label: string;
  body: string;
  timestamp: string;
  tone: "user" | "support";
};

export default function TicketDetailPage() {
  const { ticket } = useLoaderData() as TicketDetailLoaderData;
  const actionData = useActionData() as TicketActionData | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const tableDensity = useAppSelector(selectTableDensity);
  const isCompact = tableDensity === "compact";
  const actionButtonSize = isCompact ? "small" : "medium";
  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith(`/console/support/tickets/${ticket.id}`);
  const [replyBody, setReplyBody] = useState("");
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  useEffect(() => {
    if (actionData?.successMessage) {
      setReplyBody("");
    }
  }, [actionData?.successMessage]);

  const messages = useMemo<TimelineMessage[]>(() => {
    const base: TimelineMessage[] = [
      {
        id: `${ticket.id}-body`,
        label: "You",
        body: ticket.body,
        timestamp: ticket.createdAt,
        tone: "user",
      },
      ...ticket.replies.map((reply) => ({
        id: reply.id,
        label: reply.author === "support" ? "Support" : "You",
        body: reply.body,
        timestamp: reply.createdAt,
        tone: reply.author,
      })),
    ];

    return base.sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime());
  }, [ticket.body, ticket.createdAt, ticket.id, ticket.replies]);

  const createdNotice = searchParams.get("created") === "1";
  const pendingReply = isSubmitting && replyBody.trim().length > 0 ? replyBody.trim() : "";

  const noticeMessage =
    actionData?.formError ??
    actionData?.successMessage ??
    (createdNotice ? "Ticket created successfully." : undefined);
  const noticeKey = actionData?.successAt
    ? `success-${actionData.successAt}`
    : actionData?.formError
      ? `error-${actionData.formError}`
      : createdNotice
        ? "created-ticket"
        : null;
  const snackbarOpen = Boolean(noticeKey) && noticeKey !== dismissedKey;

  return (
    <>
      <Stack
        spacing={isCompact ? 1.2 : 2.2}
        aria-busy={isRouteLoading}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 900, lg: 1040 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2, sm: 2.5 },
            borderRadius: isCompact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
            border: "1px solid rgba(31,111,235,0.32)",
            background:
              "linear-gradient(120deg, rgba(31,111,235,0.20), rgba(14,165,164,0.14))",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack spacing={isCompact ? 0.55 : 1.1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={0.9} alignItems="center">
                <ForumOutlinedIcon fontSize="small" />
                <Typography variant={isCompact ? "h6" : "h5"} fontWeight={800}>
                  {ticket.subject}
                </Typography>
              </Stack>
              <Chip
                size="small"
                color={statusTone(ticket.status)}
                variant="outlined"
                label={ticket.status}
                sx={isCompact ? { borderRadius: 0.7, height: 20, fontSize: "0.66rem" } : undefined}
              />
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={isCompact ? { fontSize: "0.76rem", lineHeight: 1.25 } : undefined}
            >
              Ticket ID: {ticket.id} | Category: {ticket.category.toUpperCase()} | Created: {formatDateTime(ticket.createdAt)}
            </Typography>
            <Button
              component={Link}
              to="/console/support/tickets"
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ alignSelf: "flex-start" }}
              aria-label="Back to support tickets"
              variant={isCompact ? "outlined" : "text"}
            >
              Back to tickets
            </Button>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: isCompact ? { xs: 0.85, sm: 1 } : { xs: 2, sm: 2.5 },
            borderRadius: isCompact ? { xs: 0.55, sm: 0.7 } : { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.24)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
            backdropFilter: "blur(10px)",
          }}
        >
          {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
          <Stack spacing={isCompact ? 0.45 : 1.2}>
            <Typography
              fontWeight={800}
              sx={isCompact ? { fontSize: "0.82rem", lineHeight: 1.1 } : undefined}
            >
              Conversation
            </Typography>

            {messages.length === 0 ? (
              <Alert
                severity="info"
                sx={isCompact ? { py: 0.15, "& .MuiAlert-message": { py: 0.2, fontSize: "0.74rem" } } : undefined}
              >
                No messages yet.
              </Alert>
            ) : (
              <Stack spacing={isCompact ? 0.25 : 1} role="list" aria-label="Ticket replies">
                {messages.map((message, index) => {
                  const currentDay = formatDayLabel(message.timestamp);
                  const previousDay = index > 0 ? formatDayLabel(messages[index - 1].timestamp) : "";
                  const showDay = index === 0 || currentDay !== previousDay;

                  return (
                    <Stack key={message.id} spacing={isCompact ? 0.2 : 0.8}>
                      {showDay ? (
                        <Chip
                          size="small"
                          label={currentDay}
                          variant="outlined"
                          sx={{
                            alignSelf: "center",
                            backgroundColor: alpha("#ffffff", 0.8),
                            ...(isCompact
                              ? { borderRadius: 0.45, height: 16, fontSize: "0.58rem", px: 0.25 }
                              : undefined),
                          }}
                        />
                      ) : null}
                      <MessageBubble
                        label={message.label}
                        body={message.body}
                        timestamp={message.timestamp}
                        tone={message.tone}
                        density={tableDensity}
                      />
                    </Stack>
                  );
                })}

                {pendingReply ? (
                  <MessageBubble
                    label="You"
                    body={pendingReply}
                    timestamp={new Date().toISOString()}
                    tone="user"
                    pending
                    density={tableDensity}
                  />
                ) : null}
              </Stack>
            )}
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2, sm: 2.5 },
            borderRadius: isCompact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.24)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.74))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack spacing={isCompact ? 0.7 : 1.2}>
            <Typography fontWeight={800}>Add Reply</Typography>
            <Form method="post" replace aria-label="Reply to support ticket">
              <Stack spacing={isCompact ? 0.6 : 1}>
                <OutlinedInput
                  name="replyBody"
                  multiline
                  minRows={isCompact ? 3 : 4}
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  placeholder="Write your update or response..."
                  aria-label="Reply body"
                  error={Boolean(actionData?.fieldErrors?.replyBody)}
                  sx={
                    isCompact
                      ? { "& .MuiInputBase-inputMultiline": { py: 0.7, fontSize: "0.8rem" } }
                      : undefined
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {replyBody.length}/2000
                </Typography>
                {actionData?.fieldErrors?.replyBody ? (
                  <Typography variant="caption" color="error">
                    {actionData.fieldErrors.replyBody}
                  </Typography>
                ) : null}
                {actionData?.formError ? (
                  <Alert severity="error">
                    <Stack spacing={0.2}>
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
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendOutlinedIcon />}
                  disabled={isSubmitting}
                  sx={{ alignSelf: "flex-start" }}
                  aria-label="Submit reply"
                  size={actionButtonSize}
                >
                  {isSubmitting ? "Sending..." : "Send reply"}
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3200}
        onClose={() => setDismissedKey(noticeKey)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={actionData?.formError ? "error" : "success"}
          variant="filled"
          onClose={() => setDismissedKey(noticeKey)}
          aria-live="assertive"
        >
          {noticeMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

type MessageBubbleProps = {
  label: string;
  body: string;
  timestamp: string;
  tone: "user" | "support";
  density: "compact" | "standard" | "comfortable";
  pending?: boolean;
};

function MessageBubble({ label, body, timestamp, tone, density, pending = false }: MessageBubbleProps) {
  const leftAligned = tone === "support";
  const isCompact = density === "compact";
  return (
    <Stack
      role="listitem"
      sx={{
        alignItems: leftAligned ? "flex-start" : "flex-end",
        opacity: pending ? 0.72 : 1,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          maxWidth: { xs: "100%", sm: "82%" },
          px: isCompact ? 0.45 : 1.2,
          py: isCompact ? 0.35 : 0.9,
          borderRadius: isCompact ? 0.45 : 1.4,
          borderColor: leftAligned ? alpha("#0ea5e9", 0.24) : alpha("#1f6feb", 0.24),
          backgroundColor: leftAligned ? alpha("#f0f9ff", 0.86) : alpha("#eff6ff", 0.86),
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={isCompact ? { fontSize: "0.58rem", lineHeight: 1.1 } : undefined}
        >
          {label} | {formatDateTime(timestamp)}{pending ? " | Sending" : ""}
        </Typography>
        <Typography
          variant="body2"
          sx={isCompact ? { mt: 0.2, lineHeight: 1.15, fontSize: "0.68rem" } : { mt: 0.4, lineHeight: 1.5 }}
        >
          {body}
        </Typography>
      </Paper>
    </Stack>
  );
}
