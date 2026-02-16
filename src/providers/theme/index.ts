import { alpha, createTheme } from "@mui/material/styles";

const glass = {
  base: "rgba(255, 255, 255, 0.72)",
  soft: "rgba(255, 255, 255, 0.58)",
  strong: "rgba(255, 255, 255, 0.84)",
  border: "rgba(255, 255, 255, 0.48)",
  highlight: "rgba(255, 255, 255, 0.92)",
};

export const Theme = createTheme({
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
    borderRadius: 18,
  },
  typography: {
    fontFamily: `"Vazirmatn", "Segoe UI", "Tahoma", sans-serif`,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
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
      styleOverrides: {
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
          borderRadius: 12,
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
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.62),
          border: `1px solid ${alpha("#ffffff", 0.74)}`,
          backdropFilter: "blur(10px) saturate(130%)",
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
