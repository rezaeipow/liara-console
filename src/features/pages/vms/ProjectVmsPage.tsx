import { useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function ProjectVmsPage() {
  const { projectId } = useParams();
  return <PagePlaceholder title={`Project VMs: ${projectId ?? "-"}`} description="/console/projects/:projectId/vms" />;
}
