import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleSidebar,
  selectSidebarOpen,
} from "@/store/uiSlice";

export function useSidebarToggle() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);

  function toggle() {
    dispatch(toggleSidebar());
  }

  return {
    isOpen,
    toggle,
  };
}
