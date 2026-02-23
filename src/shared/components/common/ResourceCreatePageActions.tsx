import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { ResourceCreatePageActionsProps } from "./types";

export default function ResourceCreatePageActions({
  backTo,
  backLabel,
  submitLabel = "Create",
  submittingLabel = "Creating...",
  isSubmitting,
}: ResourceCreatePageActionsProps) {
  return (
    <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1}>
      <Button
        component={Link}
        to={backTo}
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {backLabel}
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        startIcon={<AddCircleOutlineIcon />}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </Stack>
  );
}
