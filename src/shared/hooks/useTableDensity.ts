import { useAppSelector } from "@/app/store/hooks";
import { selectTableDensity, type TableDensity } from "@/app/store/slices/uiSlice";

export type TableDensityState = {
  tableDensity: TableDensity;
  isCompact: boolean;
  isStandard: boolean;
  isComfortable: boolean;
};

export function useTableDensity(): TableDensityState {
  const tableDensity = useAppSelector(selectTableDensity);
  return {
    tableDensity,
    isCompact: tableDensity === "compact",
    isStandard: tableDensity === "standard",
    isComfortable: tableDensity === "comfortable",
  };
}
