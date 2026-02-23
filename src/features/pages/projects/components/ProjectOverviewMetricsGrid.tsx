import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ConsoleMetricCard from "@/shared/components/console/ConsoleMetricCard";
import type { ProjectOverviewMetricsGridProps } from "../types";

export default function ProjectOverviewMetricsGrid(props: ProjectOverviewMetricsGridProps) {
  const { cards } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      {cards.map((card) => (
        <ConsoleMetricCard key={card.id}>
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} alignItems="center">
              {card.icon}
              <Typography fontWeight={700}>{card.label}</Typography>
            </Stack>
            <Typography variant="h6" fontWeight={800}>
              {card.value}
            </Typography>
            {card.href && card.hrefLabel ? (
              <Button
                component={Link}
                to={card.href}
                size="small"
                variant="outlined"
                {...(card.id === "billing" ? { startIcon: card.hrefIcon } : { endIcon: card.hrefIcon })}
                sx={{ alignSelf: "flex-start" }}
              >
                {card.hrefLabel}
              </Button>
            ) : card.description ? (
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            ) : null}
          </Stack>
        </ConsoleMetricCard>
      ))}
    </Box>
  );
}
