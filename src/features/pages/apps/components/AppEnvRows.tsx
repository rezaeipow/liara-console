import { Stack } from "@mui/material";
import type { AppEnvRowsProps } from "@/shared/types/appsComponents";
import AppEnvRowItem from "./AppEnvRowItem";

export default function AppEnvRows({ rows, rowErrors, revealSecrets, onUpdate, onRemove, theme }: AppEnvRowsProps) {
  return (
    <Stack spacing={1.1}>
      {rows.map((row, index) => (
        <AppEnvRowItem
          key={row.id}
          row={row}
          index={index}
          errors={rowErrors[row.id]}
          revealSecrets={revealSecrets}
          onUpdate={onUpdate}
          onRemove={onRemove}
          theme={theme}
        />
      ))}
    </Stack>
  );
}
