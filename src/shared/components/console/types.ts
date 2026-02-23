import type { Palette, SxProps, Theme } from "@mui/material/styles";
import type { StackProps } from "@mui/material";
import type { ReactNode } from "react";
import type { StatusChipTone, StatusChipVariant } from "@/shared/ui/statusChipSx";

export type ConsoleContentContainerProps = {
  children: ReactNode;
  maxWidth?: { xs: string; sm: number; lg: number } | { xs: string; sm: number; lg: number; md?: number };
} & StackProps;

export type ConsoleHeroCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  compact?: boolean;
  gradient?: string;
  sx?: SxProps<Theme>;
};

export type ConsoleMetricCardProps = {
  children: ReactNode;
  padding?: number;
};

export type ConsolePageShellProps = {
  children: ReactNode;
  spacing?: number;
  maxWidth?: number | string | { xs?: string | number; sm?: string | number; lg?: string | number; xl?: string | number };
  busy?: boolean;
};

export type ConsoleResourceLayoutBodyProps = {
  chips: ReactNode;
  children: ReactNode;
};

export type ResourceLayoutTab = {
  label: string;
  path: string;
};

export type ConsoleResourceLayoutHeaderProps = {
  icon: ReactNode;
  title: string;
  badgeLabel: string;
  backTo?: string | null;
  backLabel?: string;
  tabs: ResourceLayoutTab[];
  isLoading: boolean;
  error?: string | null;
  smTabColumns?: number;
};

export type ConsoleResourceLayoutHeaderLoadingProps = {
  isLoading: boolean;
};

export type ConsoleResourceLayoutHeaderContentProps = Omit<
  ConsoleResourceLayoutHeaderProps,
  "isLoading" | "error"
>;

export type ConsoleSectionCardProps = {
  children: ReactNode;
  compact?: boolean;
  soft?: boolean;
  padding?: { xs: number; sm: number };
};

export type StatTone = "default" | "primary" | "warning" | "info" | "success";
export type Density = "compact" | "standard" | "comfortable";

export type ConsoleStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: StatTone;
  density?: Density;
};

export type ConsoleStatusChipProps = {
  label: string;
  tone: StatusChipTone;
  variant?: StatusChipVariant;
  size?: "small" | "medium";
  capitalize?: boolean;
  sx?: SxProps<Theme>;
};

export type Tone = "primary" | "secondary" | "error";

export type ConsoleToneSectionProps = {
  children: ReactNode;
  tone?: Tone;
  padding?: { xs: number; sm: number };
};

export type ResourceStatusMetaChipsProps = {
  statusLabel: string;
  statusTone: StatusChipTone;
  children?: ReactNode;
};

export type GetToneColor = (tone: StatTone, palette: Palette) => string;
