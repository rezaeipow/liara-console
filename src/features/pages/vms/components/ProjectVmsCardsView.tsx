import { ResourceCardsGrid } from "@/shared/components/common/ResourceListLayouts";
import type { ProjectVmsCardsViewProps } from "../pageTypes";
import ProjectVmCard from "./ProjectVmCard";

export default function ProjectVmsCardsView(props: ProjectVmsCardsViewProps) {
  const { theme, items, actionLoadingId, onAskAction, onOpenMenu } = props;

  return (
    <ResourceCardsGrid>
      {items.map((vm) => (
        <ProjectVmCard
          key={vm.id}
          theme={theme}
          vm={vm}
          actionLoadingId={actionLoadingId}
          onAskAction={onAskAction}
          onOpenMenu={onOpenMenu}
        />
      ))}
    </ResourceCardsGrid>
  );
}
