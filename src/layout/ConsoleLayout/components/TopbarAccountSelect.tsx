import { FormControl, MenuItem, Select } from "@mui/material";
import type { TopbarAccountSelectProps } from "../types";

export default function TopbarAccountSelect(props: TopbarAccountSelectProps) {
  const {
    accountItems,
    selectedAccountId,
    accountSwitching,
    accountMenuMaxHeight,
    accountMenuItemHeight,
    onAccountChange,
  } = props;

  return (
    <FormControl size="small" sx={{ minWidth: { xs: 112, sm: 210 }, maxWidth: { xs: 124, sm: 260 } }}>
      <Select
        aria-label="Switch active account"
        value={selectedAccountId}
        onChange={onAccountChange}
        disabled={accountSwitching}
        MenuProps={{
          MenuListProps: { sx: { py: 0 } },
          PaperProps: { sx: { maxHeight: accountMenuMaxHeight, overflowY: "auto" } },
        }}
        sx={{
          "& .MuiSelect-select": {
            pr: { xs: 3.5, sm: 4 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            py: { xs: 0.75, sm: 1 },
          },
        }}
      >
        {accountItems.map((account) => (
          <MenuItem
            key={account.id}
            value={account.id}
            sx={{ minHeight: `${accountMenuItemHeight}px`, height: `${accountMenuItemHeight}px` }}
          >
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
