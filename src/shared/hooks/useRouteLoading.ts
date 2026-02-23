import { useNavigation, type Navigation } from "react-router-dom";

export function isRouteLoadingByPrefix(navigation: Navigation, pathPrefix: string): boolean {
  return (
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith(pathPrefix)
  );
}

export function useRouteLoading(pathPrefix: string): boolean {
  const navigation = useNavigation();
  return isRouteLoadingByPrefix(navigation, pathPrefix);
}
