import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { NewTicketFormActionsProps } from "../types";

export default function NewTicketFormActions(props: NewTicketFormActionsProps) {
  const { isSubmitting, actionButtonSize } = props;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={0.6}>
      <Button type="submit" variant="contained" startIcon={<SendOutlinedIcon />} disabled={isSubmitting} size={actionButtonSize}>
        {isSubmitting ? "Submitting..." : "Submit ticket"}
      </Button>
      <Button component={Link} to="/console/support/tickets" variant="text" size={actionButtonSize}>
        Cancel
      </Button>
    </Stack>
  );
}
