import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AccountsHeaderProps } from "../types";

export default function AccountsHeader(props: AccountsHeaderProps) {
  const { onOpenCreate } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        background: (theme) =>
          `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        borderRadius: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <ManageAccountsOutlinedIcon />
          <Box>
            <Typography variant="h5" fontWeight={800}>Accounts</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              Manage and switch between your console accounts.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={onOpenCreate}>
          Create Account
        </Button>
      </Stack>
    </Paper>
  );
}
