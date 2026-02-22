import { alpha, createTheme } from "@mui/material/styles";
import type { TableDensity } from "../../app/store/slices/uiSlice";

const glass = {
  base: "rgba(255, 255, 255, 0.72)",
  soft: "rgba(255, 255, 255, 0.58)",
  strong: "rgba(255, 255, 255, 0.84)",
  border: "rgba(255, 255, 255, 0.48)",
  highlight: "rgba(255, 255, 255, 0.92)",
};

export function buildTheme(tableDensity: TableDensity = "standard") {
  const isCompact = tableDensity === "compact";
  const densityTokens =
    tableDensity === "comfortable"
      ? {
          cellPaddingY: 16,
          cellPaddingX: 18,
          smallCellPaddingY: 14,
          bodyFontSize: "0.93rem",
          headFontSize: "0.84rem",
          lineHeight: 1.55,
          rowMinHeight: 62,
          headRowMinHeight: 54,
        }
      : tableDensity === "compact"
        ? {
            cellPaddingY: 8,
            cellPaddingX: 9,
            smallCellPaddingY: 7,
            bodyFontSize: "0.78rem",
            headFontSize: "0.72rem",
            lineHeight: 1.25,
            rowMinHeight: 31,
            headRowMinHeight: 27,
          }
        : {
            cellPaddingY: 11,
            cellPaddingX: 14,
            smallCellPaddingY: 9,
            bodyFontSize: "0.86rem",
            headFontSize: "0.78rem",
            lineHeight: 1.4,
            rowMinHeight: 46,
            headRowMinHeight: 40,
          };
  const uiDensityTokens =
    tableDensity === "comfortable"
      ? {
          radius: 18,
          controlMinHeight: 42,
          controlPaddingX: 1.55,
          controlPaddingY: 1.1,
          listItemPaddingY: 1.2,
          listItemPaddingX: 1.2,
          contentGap: 1.1,
          bodyFontSize: "0.95rem",
          bodyLineHeight: 1.58,
          captionFontSize: "0.8rem",
          chipHeight: 30,
        }
      : tableDensity === "compact"
        ? {
            radius: 9,
            controlMinHeight: 30,
            controlPaddingX: 0.8,
            controlPaddingY: 0.32,
            listItemPaddingY: 0.34,
            listItemPaddingX: 0.58,
            contentGap: 0.46,
            bodyFontSize: "0.82rem",
            bodyLineHeight: 1.3,
            captionFontSize: "0.66rem",
            chipHeight: 20,
          }
        : {
            radius: 14,
            controlMinHeight: 36,
            controlPaddingX: 1.1,
            controlPaddingY: 0.62,
            listItemPaddingY: 0.72,
            listItemPaddingX: 0.9,
            contentGap: 0.74,
            bodyFontSize: "0.88rem",
            bodyLineHeight: 1.42,
            captionFontSize: "0.72rem",
            chipHeight: 24,
          };

  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1f6feb",
        dark: "#1158c7",
        light: "#5f95ff",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0ea5a4",
        contrastText: "#ffffff",
      },
      background: {
        default: "#eaf2ff",
        paper: glass.base,
      },
      text: {
        primary: "#0f172a",
        secondary: "#334155",
      },
      divider: alpha("#ffffff", 0.45),
    },
  shape: {
    borderRadius: uiDensityTokens.radius,
  },
  typography: {
    fontFamily: `"Vazirmatn", "Segoe UI", "Tahoma", sans-serif`,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: {
      fontSize: uiDensityTokens.bodyFontSize,
      lineHeight: uiDensityTokens.bodyLineHeight,
    },
    body2: {
      fontSize: isCompact ? "0.78rem" : tableDensity === "comfortable" ? "0.9rem" : "0.84rem",
      lineHeight: isCompact ? 1.24 : tableDensity === "comfortable" ? 1.5 : 1.35,
    },
    caption: {
      fontSize: uiDensityTokens.captionFontSize,
      lineHeight: isCompact ? 1.15 : 1.25,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0.2,
      textTransform: "none",
    },
  },
  shadows: [
    "none",
    "0 2px 8px rgba(15, 23, 42, 0.08)",
    "0 6px 18px rgba(15, 23, 42, 0.10)",
    "0 10px 26px rgba(15, 23, 42, 0.12)",
    "0 16px 34px rgba(15, 23, 42, 0.14)",
    "0 20px 42px rgba(15, 23, 42, 0.16)",
    "0 24px 50px rgba(15, 23, 42, 0.18)",
    "0 28px 56px rgba(15, 23, 42, 0.20)",
    "0 32px 62px rgba(15, 23, 42, 0.22)",
    "0 36px 68px rgba(15, 23, 42, 0.24)",
    "0 40px 74px rgba(15, 23, 42, 0.26)",
    "0 44px 80px rgba(15, 23, 42, 0.28)",
    "0 48px 86px rgba(15, 23, 42, 0.30)",
    "0 52px 92px rgba(15, 23, 42, 0.32)",
    "0 56px 98px rgba(15, 23, 42, 0.34)",
    "0 60px 104px rgba(15, 23, 42, 0.36)",
    "0 64px 110px rgba(15, 23, 42, 0.38)",
    "0 68px 116px rgba(15, 23, 42, 0.40)",
    "0 72px 122px rgba(15, 23, 42, 0.42)",
    "0 76px 128px rgba(15, 23, 42, 0.44)",
    "0 80px 134px rgba(15, 23, 42, 0.46)",
    "0 84px 140px rgba(15, 23, 42, 0.48)",
    "0 88px 146px rgba(15, 23, 42, 0.50)",
    "0 92px 152px rgba(15, 23, 42, 0.52)",
    "0 96px 158px rgba(15, 23, 42, 0.54)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(1100px circle at 5% -10%, rgba(96, 165, 250, 0.26), transparent 55%), radial-gradient(1100px circle at 95% -15%, rgba(20, 184, 166, 0.20), transparent 50%), linear-gradient(180deg, #f6f9ff 0%, #eaf2ff 45%, #f5f9ff 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: glass.base,
          border: `1px solid ${glass.border}`,
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
          position: "relative",
          overflow: "hidden",
          borderRadius: uiDensityTokens.radius,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: glass.soft,
          border: `1px solid ${glass.border}`,
          backdropFilter: "blur(16px) saturate(150%)",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.10)",
          borderRadius: uiDensityTokens.radius,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#0f172a",
          backgroundColor: glass.strong,
          borderBottom: `1px solid ${glass.border}`,
          backdropFilter: "blur(14px) saturate(145%)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
          overflow: "visible",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: glass.strong,
          borderRight: `1px solid ${glass.border}`,
          backdropFilter: "blur(16px) saturate(150%)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: glass.strong,
          border: `1px solid ${glass.border}`,
          backdropFilter: "blur(20px) saturate(155%)",
          boxShadow: "0 20px 44px rgba(15, 23, 42, 0.18)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: isCompact ? "small" : "medium",
      },
      styleOverrides: {
        root: {
          minHeight: `${uiDensityTokens.controlMinHeight}px`,
          padding: `${uiDensityTokens.controlPaddingY}rem ${uiDensityTokens.controlPaddingX}rem`,
          borderRadius: uiDensityTokens.radius * (isCompact ? 0.52 : 0.68),
        },
        sizeSmall: {
          minHeight: `${Math.max(26, uiDensityTokens.controlMinHeight - 4)}px`,
          padding: isCompact
            ? "0.22rem 0.62rem"
            : tableDensity === "comfortable"
              ? "0.46rem 0.98rem"
              : "0.34rem 0.82rem",
        },
        containedPrimary: {
          boxShadow: "0 10px 24px rgba(31, 111, 235, 0.28)",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(31, 111, 235, 0.34)",
          },
        },
        outlined: {
          borderColor: alpha("#0f172a", 0.16),
          backgroundColor: alpha("#ffffff", 0.44),
          "&:hover": {
            borderColor: alpha("#0f172a", 0.28),
            backgroundColor: alpha("#ffffff", 0.62),
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha("#ffffff", 0.7),
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: uiDensityTokens.radius * (isCompact ? 0.55 : 0.72),
          paddingTop: `${uiDensityTokens.listItemPaddingY}rem`,
          paddingBottom: `${uiDensityTokens.listItemPaddingY}rem`,
          paddingLeft: `${uiDensityTokens.listItemPaddingX}rem`,
          paddingRight: `${uiDensityTokens.listItemPaddingX}rem`,
          gap: `${uiDensityTokens.contentGap}rem`,
          "&.Mui-selected": {
            backgroundColor: alpha("#1f6feb", 0.12),
            border: `1px solid ${alpha("#1f6feb", 0.2)}`,
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha("#1f6feb", 0.16),
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: glass.soft,
          border: `1px solid ${glass.border}`,
          backdropFilter: "blur(14px) saturate(140%)",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha("#ffffff", 0.64)}`,
          paddingTop: `${densityTokens.cellPaddingY}px`,
          paddingBottom: `${densityTokens.cellPaddingY}px`,
          paddingLeft: `${densityTokens.cellPaddingX}px`,
          paddingRight: `${densityTokens.cellPaddingX}px`,
          fontSize: densityTokens.bodyFontSize,
          lineHeight: densityTokens.lineHeight,
          transition: "padding .18s ease, font-size .18s ease, line-height .18s ease",
        },
        sizeSmall: {
          paddingTop: `${densityTokens.smallCellPaddingY}px`,
          paddingBottom: `${densityTokens.smallCellPaddingY}px`,
          paddingLeft: `${densityTokens.cellPaddingX}px`,
          paddingRight: `${densityTokens.cellPaddingX}px`,
          fontSize: densityTokens.bodyFontSize,
          lineHeight: densityTokens.lineHeight,
        },
        head: {
          fontSize: densityTokens.headFontSize,
          fontWeight: 700,
          letterSpacing: "0.01em",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          minHeight: `${densityTokens.rowMinHeight}px`,
          transition: "min-height .18s ease",
        },
        head: {
          minHeight: `${densityTokens.headRowMinHeight}px`,
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: isCompact ? "small" : "medium",
      },
      styleOverrides: {
        root: {
          height: `${uiDensityTokens.chipHeight}px`,
          backgroundColor: alpha("#ffffff", 0.62),
          border: `1px solid ${alpha("#ffffff", 0.74)}`,
          backdropFilter: "blur(10px) saturate(130%)",
          borderRadius: uiDensityTokens.radius * (isCompact ? 0.5 : 0.66),
          "& .MuiChip-label": {
            paddingInline: isCompact ? 6 : 10,
            fontSize: isCompact ? "0.66rem" : tableDensity === "comfortable" ? "0.82rem" : "0.74rem",
            lineHeight: isCompact ? 1.05 : 1.2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: `${uiDensityTokens.controlMinHeight}px`,
          borderRadius: uiDensityTokens.radius * (isCompact ? 0.52 : 0.68),
          "& .MuiInputAdornment-positionStart": {
            marginRight: isCompact ? 4 : 6,
          },
          "& .MuiInputAdornment-positionEnd": {
            marginLeft: isCompact ? 4 : 6,
          },
        },
        input: {
          paddingTop: `${uiDensityTokens.controlPaddingY}rem`,
          paddingBottom: `${uiDensityTokens.controlPaddingY}rem`,
          paddingLeft: `${uiDensityTokens.controlPaddingX}rem`,
          paddingRight: `${uiDensityTokens.controlPaddingX}rem`,
          fontSize: uiDensityTokens.bodyFontSize,
          lineHeight: uiDensityTokens.bodyLineHeight,
          "&.MuiInputBase-inputAdornedStart": {
            paddingLeft: 0,
          },
          "&.MuiInputBase-inputAdornedEnd": {
            paddingRight: 0,
          },
        },
        inputMultiline: {
          paddingTop: isCompact ? "0.38rem" : tableDensity === "comfortable" ? "0.95rem" : "0.65rem",
          paddingBottom: isCompact ? "0.38rem" : tableDensity === "comfortable" ? "0.95rem" : "0.65rem",
          paddingLeft: isCompact ? "0.62rem" : tableDensity === "comfortable" ? "1rem" : "0.8rem",
          paddingRight: isCompact ? "0.62rem" : tableDensity === "comfortable" ? "1rem" : "0.8rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: isCompact ? "0.8rem" : tableDensity === "comfortable" ? "0.94rem" : "0.86rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: uiDensityTokens.radius * (isCompact ? 0.5 : 0.66),
          paddingTop: isCompact ? "0.2rem" : undefined,
          paddingBottom: isCompact ? "0.2rem" : undefined,
        },
        message: {
          paddingTop: isCompact ? "0.18rem" : undefined,
          paddingBottom: isCompact ? "0.18rem" : undefined,
          fontSize: isCompact ? "0.76rem" : undefined,
          lineHeight: isCompact ? 1.2 : undefined,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha("#0f172a", 0.92),
          border: `1px solid ${alpha("#ffffff", 0.2)}`,
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});
}

export const Theme = buildTheme();
