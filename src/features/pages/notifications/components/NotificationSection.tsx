import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Form } from "react-router-dom";
import { createDateTimeFormatter, formatWith } from "@/shared/utils/dateTime";
import type { NotificationSectionProps } from "../types";

const notificationDateFormatter = createDateTimeFormatter();

export default function NotificationSection({
  title,
  items,
  listSpacing,
  itemPaddingX,
  itemPaddingY,
  itemInnerSpacing,
  tableDensity,
  isSubmitting,
}: NotificationSectionProps) {
  return (
    <Stack spacing={0.9}>
      <Stack direction="row" alignItems="center" spacing={0.8}>
        <Typography fontWeight={800}>{title}</Typography>
        <Chip size="small" label={items.length} />
      </Stack>
      <Stack spacing={listSpacing} role="list" aria-label={`${title} notifications`}>
        {items.map((item) => (
          <Paper key={item.id} role="listitem" variant="outlined" sx={{ px: itemPaddingX, py: itemPaddingY, borderRadius: tableDensity === "compact" ? 0.7 : 1.4, borderColor: (theme) => alpha(theme.palette.text.primary, item.read ? 0.12 : 0.2), backgroundColor: (theme) => (item.read ? alpha(theme.palette.common.white, 0.6) : alpha(theme.palette.primary.light, 0.24)) }}>
            <Stack spacing={itemInnerSpacing}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography fontWeight={800} sx={tableDensity === "compact" ? { fontSize: "0.82rem", lineHeight: 1.2 } : undefined}>{item.title}</Typography>
                <Chip size="small" color={item.read ? "success" : "warning"} variant="outlined" label={item.read ? "Read" : "Unread"} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={tableDensity === "compact" ? { fontSize: "0.73rem", lineHeight: 1.25 } : undefined}>{item.body}</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="caption" color="text.secondary" sx={tableDensity === "compact" ? { fontSize: "0.64rem", lineHeight: 1.15 } : undefined}>{formatWith(notificationDateFormatter, item.createdAt)}</Typography>
                <Form method="post" replace>
                  <input type="hidden" name="intent" value="mark-read" />
                  <input type="hidden" name="notificationId" value={item.id} />
                  <Button type="submit" size="small" variant="text" disabled={item.read || isSubmitting} aria-label={`Mark notification ${item.id} as read`}>Mark as read</Button>
                </Form>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
