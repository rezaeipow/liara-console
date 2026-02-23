import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { Chip, FormControl, IconButton, MenuItem, Paper, Select, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { UIPreferences } from "@/app/store/slices/uiSlice";
import type { PreferencesSettingsCardProps } from "@/shared/types/settingsComponents";
import PreferenceField from "./PreferenceField";

export default function PreferencesSettingsCard(props: PreferencesSettingsCardProps) {
  const { isXs, isSmMd, isLgUp, draftPreferences, changedKeys, densityPreviewGapPx, densityPreviewRowMinHeight, onSidebarModeChange, onTableDensityChange } = props;
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 }, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`, background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`, backdropFilter: glassBackdrop.card, transition: "transform .2s ease", "&:hover": { transform: "translateY(-1px)" } }}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={0.9} alignItems="center" justifyContent="space-between"><Stack direction="row" spacing={0.9} alignItems="center"><TuneOutlinedIcon fontSize="small" /><Typography fontWeight={800}>Preferences</Typography></Stack><Tooltip title="Sidebar behavior and data density settings."><IconButton size="small" aria-label="Preferences help"><InfoOutlinedIcon fontSize="small" /></IconButton></Tooltip></Stack>
        {!isLgUp ? (
          <PreferenceField icon={<ViewSidebarOutlinedIcon fontSize="small" />} title="Sidebar mode" description={isXs ? "Visible for reference. This setting applies to tablet layouts only." : "Control navigation density in medium layouts."}>
            <FormControl size="small" sx={{ minWidth: 168 }}>
              <Select value={draftPreferences.sidebarMode} onChange={(event) => onSidebarModeChange(event.target.value as UIPreferences["sidebarMode"])} disabled={!isSmMd} sx={!isSmMd ? { opacity: 0.72, "& .MuiSelect-select": { color: "text.secondary" } } : undefined} inputProps={{ "aria-label": "Select sidebar mode" }}>
                <MenuItem value="expanded">Expanded</MenuItem><MenuItem value="collapsed">Collapsed</MenuItem>
              </Select>
            </FormControl>
          </PreferenceField>
        ) : null}
        {changedKeys.sidebarMode && !isLgUp ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
        <PreferenceField icon={<TuneOutlinedIcon fontSize="small" />} title="Table density" description="Adjust row spacing for data-heavy pages.">
          <Stack spacing={1} sx={{ minWidth: { xs: "100%", sm: 220 } }}>
            <FormControl size="small" sx={{ minWidth: 168 }}>
              <Select value={draftPreferences.tableDensity} onChange={(event) => onTableDensityChange(event.target.value as UIPreferences["tableDensity"])} inputProps={{ "aria-label": "Select table density" }}>
                <MenuItem value="comfortable">Comfortable</MenuItem><MenuItem value="standard">Standard</MenuItem><MenuItem value="compact">Compact</MenuItem>
              </Select>
            </FormControl>
            <Paper variant="outlined" sx={{ p: 1, borderRadius: 1.2, borderColor: (theme) => alpha(theme.palette.text.primary, 0.12), backgroundColor: (theme) => alpha(theme.palette.common.white, 0.55) }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                <Typography variant="caption" color="text.secondary">Density preview</Typography>
                <Chip size="small" variant="outlined" color="primary" label={draftPreferences.tableDensity} />
              </Stack>
              <Stack sx={{ gap: `${densityPreviewGapPx}px` }}>
                {["Row 1", "Row 2", "Row 3"].map((row) => <Paper key={row} variant="outlined" sx={{ minHeight: `${densityPreviewRowMinHeight}px`, px: 1.2, borderRadius: 1, borderColor: (theme) => alpha(theme.palette.text.primary, 0.1), backgroundColor: (theme) => alpha(theme.palette.common.white, 0.72), display: "flex", alignItems: "center" }}><Typography variant="caption" color="text.secondary">{row}</Typography></Paper>)}
              </Stack>
            </Paper>
          </Stack>
        </PreferenceField>
        {changedKeys.tableDensity ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
      </Stack>
    </Paper>
  );
}
