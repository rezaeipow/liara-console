export const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    alignItems: "center",
  },
  "& .MuiOutlinedInput-input": {
    py: 1.3,
    lineHeight: 1.4,
    "&::placeholder": {
      opacity: 1,
    },
  },
} as const;

export const authLabelSx = {
  "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
    transform: "translate(42px, 12px) scale(1)",
  },
} as const;
