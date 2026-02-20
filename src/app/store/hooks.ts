import {type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// ====================
// useAppDispatch
// ====================
// جایگزین استاندارد useDispatch با نوع درست
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ====================
// useAppSelector
// ====================
// جایگزین استاندارد useSelector با RootState تایپ شده
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
