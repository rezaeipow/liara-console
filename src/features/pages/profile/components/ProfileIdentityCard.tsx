import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ProfileIdentityCardProps } from "../types";

export default function ProfileIdentityCard(props: ProfileIdentityCardProps) {
  const { identityRows } = props;

  return (
    <Paper
      sx={{
        p: { xs: 1.6, sm: 2 },
        borderRadius: { xs: 1.4, sm: 1.8 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={0.9}>
        <Stack direction="row" spacing={0.7} alignItems="center">
          <ManageAccountsOutlinedIcon fontSize="small" />
          <Typography fontWeight={800}>Identity & Context</Typography>
        </Stack>
        {identityRows.map((item) => (
          <Stack key={item.label} direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
            <Typography variant="caption" fontWeight={700}>{item.value}</Typography>
          </Stack>
        ))}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ pt: 0.2 }}>
          <Button component={Link} to="/console/accounts" variant="outlined" size="small">Manage accounts</Button>
          <Button component={Link} to="/console/settings" variant="text" size="small" startIcon={<ShieldOutlinedIcon fontSize="small" />}>
            Open settings
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
