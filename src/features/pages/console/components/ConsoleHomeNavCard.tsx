import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ConsoleStatCard from "@/shared/components/console/ConsoleStatCard";
import type { ConsoleHomeNavCardProps } from "../types";

export default function ConsoleHomeNavCard(props: ConsoleHomeNavCardProps) {
  const { item } = props;

  return (
    <ConsoleStatCard
      label={item.label}
      value={item.value}
      hint={item.hint}
      icon={item.icon}
      action={
        <Button component={Link} to={item.to} size="small" variant="text" endIcon={<ArrowOutwardIcon fontSize="small" />} sx={{ alignSelf: "flex-start" }}>
          Open
        </Button>
      }
    />
  );
}
