import AppsIcon from "@mui/icons-material/Apps";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
import type { ProjectOverviewMetricCard } from "./types";
import type { ProjectOverviewLoaderData } from "./projectsData";

export function buildProjectOverviewCards(data: ProjectOverviewLoaderData): ProjectOverviewMetricCard[] {
  return [
    {
      id: "apps",
      icon: <AppsIcon fontSize="small" />,
      label: "Apps",
      value: data.project.servicesSummary.apps,
      href: `/console/projects/${data.project.id}/apps`,
      hrefLabel: "Open apps",
      hrefIcon: <ArrowOutwardIcon fontSize="small" />,
    },
    {
      id: "vms",
      icon: <StorageIcon fontSize="small" />,
      label: "VMs",
      value: data.project.servicesSummary.vms,
      href: `/console/projects/${data.project.id}/vms`,
      hrefLabel: "Open VMs",
      hrefIcon: <ArrowOutwardIcon fontSize="small" />,
    },
    {
      id: "billing",
      icon: <ReceiptLongIcon fontSize="small" />,
      label: "Credit Snapshot",
      value: `${data.project.billingSnapshot.credit.toLocaleString()} IRR`,
      href: "/console/billing",
      hrefLabel: "Open billing",
      hrefIcon: <CreditCardIcon fontSize="small" />,
    },
    {
      id: "activity",
      icon: <TimelineIcon fontSize="small" />,
      label: "Activity",
      value: data.project.activity.length,
      description: "Recent events in this project",
    },
  ];
}
