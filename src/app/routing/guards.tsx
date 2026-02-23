import { Navigate, Outlet } from "react-router-dom";
import ConsoleLayout from "@/layout/ConsoleLayout";
import { useAppSelector } from "@/app/store/hooks";
import { selectToken } from "@/app/store/slices/authSlice";

export function GuardedConsole() {
  const token = useAppSelector(selectToken);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ConsoleLayout>
      <Outlet />
    </ConsoleLayout>
  );
}

export function PublicOnly() {
  const token = useAppSelector(selectToken);
  if (token) {
    return <Navigate to="/console" replace />;
  }

  return <Outlet />;
}
