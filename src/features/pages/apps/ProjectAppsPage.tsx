import { useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function ProjectAppsPage() {
  const { projectId } = useParams();
  return <PagePlaceholder title={`Project Apps: ${projectId ?? "-"}`} description="/console/projects/:projectId/apps" />;
}
