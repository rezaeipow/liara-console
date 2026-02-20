import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  toggleSidebarMode,
  selectSidebarMode,
} from "../../app/store/slices/uiSlice";

export function useSidebarToggle() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarMode) === "expanded";

  function toggle() {
    dispatch(toggleSidebarMode());
  }

  return {
    isOpen,
    toggle,
  };
}
