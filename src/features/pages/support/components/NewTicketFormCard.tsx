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
import NewTicketFormActions from "./NewTicketFormActions";
import NewTicketFormFields from "./NewTicketFormFields";
import type { NewTicketFormCardProps } from "../types";

export default function NewTicketFormCard(props: NewTicketFormCardProps) {
  const {
    categories,
    actionData,
    hasError,
    subject,
    category,
    body,
    isSubmitting,
    isRouteLoading,
    isCompact,
    actionButtonSize,
    onSubjectChange,
    onCategoryChange,
    onBodyChange,
  } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2, sm: 2.5 },
        borderRadius: isCompact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
      <Stack spacing={isCompact ? 0.9 : 1.6}>
        <Form method="post" aria-label="Create support ticket form">
          <Stack spacing={isCompact ? 0.7 : 1.4}>
            <NewTicketFormFields
              categories={categories}
              actionData={actionData}
              subject={subject}
              category={category}
              body={body}
              isCompact={isCompact}
              onSubjectChange={onSubjectChange}
              onCategoryChange={onCategoryChange}
              onBodyChange={onBodyChange}
            />

            {hasError ? (
              <Alert severity="error">
                <Stack spacing={0.25}>
                  <Typography variant="body2">{actionData?.formError}</Typography>
                  {actionData?.errorStatus ? <Typography variant="caption">Error code: {actionData.errorStatus}</Typography> : null}
                  {actionData?.errorHint ? <Typography variant="caption">{actionData.errorHint}</Typography> : null}
                </Stack>
              </Alert>
            ) : null}

            <NewTicketFormActions isSubmitting={isSubmitting} actionButtonSize={actionButtonSize} />
          </Stack>
        </Form>
      </Stack>
    </Paper>
  );
}
