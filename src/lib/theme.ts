export const theme = {
  colors: {
    void: "#05060a",
    ink: "#0c0f18",
    panel: "#141824",
    line: "#2a3144",
    mist: "#93a0b8",
    paper: "#e8eef8",
    cyan: "#5ce1ff",
    violet: "#9b8cff",
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;
