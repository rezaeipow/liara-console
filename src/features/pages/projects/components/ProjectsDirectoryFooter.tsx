import { Button, Stack, Typography } from "@mui/material";
import type { ProjectsDirectoryFooterProps } from "../types";

export default function ProjectsDirectoryFooter(props: ProjectsDirectoryFooterProps) {
  const { pageSummary, isLoading, hasMore, hasQuery, onLoadMore } = props;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="caption" color="text.secondary">
        {pageSummary}
      </Typography>
      {hasMore && !hasQuery ? (
        <Button size="small" variant="outlined" onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load more"}
        </Button>
      ) : null}
    </Stack>
  );
}
