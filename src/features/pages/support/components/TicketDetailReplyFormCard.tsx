import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Alert, Button, OutlinedInput, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Form } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { TicketDetailReplyFormCardProps } from "../types";

export default function TicketDetailReplyFormCard(props: TicketDetailReplyFormCardProps) {
  const { actionData, replyBody, isSubmitting, isCompact, actionButtonSize, onReplyBodyChange } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2, sm: 2.5 },
        borderRadius: isCompact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
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
              onChange={(event) => onReplyBodyChange(event.target.value)}
              placeholder="Write your update or response..."
              aria-label="Reply body"
              error={Boolean(actionData?.fieldErrors?.replyBody)}
              sx={isCompact ? { "& .MuiInputBase-inputMultiline": { py: 0.7, fontSize: "0.8rem" } } : undefined}
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
                  {actionData.errorStatus ? <Typography variant="caption">Error code: {actionData.errorStatus}</Typography> : null}
                  {actionData.errorHint ? <Typography variant="caption">{actionData.errorHint}</Typography> : null}
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
  );
}
