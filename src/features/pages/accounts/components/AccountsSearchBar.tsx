import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import type { AccountsSearchBarProps } from "../types";

export default function AccountsSearchBar(props: AccountsSearchBarProps) {
  const { query, onQueryChange } = props;

  return (
    <TextField
      size="small"
      placeholder="Search by Account name"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      sx={{
        minWidth: { sm: 260 },
        "& .MuiOutlinedInput-root": {
          minHeight: 40,
          alignItems: "center",
        },
        "& .MuiOutlinedInput-input": {
          paddingTop: "10px",
          paddingBottom: "10px",
          lineHeight: "20px",
        },
        "& .MuiOutlinedInput-input::placeholder": {
          lineHeight: "20px",
          opacity: 0.78,
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: "center", display: "flex", alignItems: "center", m: 0, mr: 1 }}>
              <SearchIcon fontSize="small" sx={{ display: "block", transform: "translateY(1px)" }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
