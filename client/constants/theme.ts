import { Platform } from "react-native";

// Tableu Mystical Theme - Luxurious dark theme with warm gold accents
export const Colors = {
  light: {
    // Light mode uses the same mystical dark theme
    text: "#E8E6E3",
    textMuted: "#9A8C7F",
    buttonText: "#0F0B14",
    tabIconDefault: "#7A6F7F",
    tabIconSelected: "#D4B896",
    link: "#D4B896",
    backgroundRoot: "#0F0B14",
    backgroundDefault: "#181221",
    backgroundSecondary: "#1C1525",
    backgroundTertiary: "#241C30",
    border: "#3A2F3F",
    borderLight: "rgba(212, 184, 150, 0.2)",
    primary: "#D4B896",
    primaryLight: "#E5C48E",
    primarySoft: "#F5E5C8",
    glowGold: "rgba(212, 184, 150, 0.35)",
    glowBlue: "rgba(120, 161, 255, 0.24)",
    glowPink: "rgba(255, 132, 178, 0.28)",
    error: "#FF6B6B",
    success: "#4ECDC4",
  },
  dark: {
    text: "#E8E6E3",
    textMuted: "#9A8C7F",
    buttonText: "#0F0B14",
    tabIconDefault: "#7A6F7F",
    tabIconSelected: "#D4B896",
    link: "#D4B896",
    backgroundRoot: "#0F0B14",
    backgroundDefault: "#181221",
    backgroundSecondary: "#1C1525",
    backgroundTertiary: "#241C30",
    border: "#3A2F3F",
    borderLight: "rgba(212, 184, 150, 0.2)",
    primary: "#D4B896",
    primaryLight: "#E5C48E",
    primarySoft: "#F5E5C8",
    glowGold: "rgba(212, 184, 150, 0.35)",
    glowBlue: "rgba(120, 161, 255, 0.24)",
    glowPink: "rgba(255, 132, 178, 0.28)",
    error: "#FF6B6B",
    success: "#4ECDC4",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  inputHeight: 48,
  buttonHeight: 52,
  cardPadding: 20,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "400" as const,
    letterSpacing: 2.4,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "500" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodySerif: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: "#D4B896",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "CormorantGaramond_400Regular",
    serifMedium: "CormorantGaramond_500Medium",
    serifSemiBold: "CormorantGaramond_600SemiBold",
    body: "IbarraRealNova_400Regular",
    bodyItalic: "IbarraRealNova_400Regular_Italic",
    bodyMedium: "IbarraRealNova_500Medium",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "CormorantGaramond_400Regular",
    serifMedium: "CormorantGaramond_500Medium",
    serifSemiBold: "CormorantGaramond_600SemiBold",
    body: "IbarraRealNova_400Regular",
    bodyItalic: "IbarraRealNova_400Regular_Italic",
    bodyMedium: "IbarraRealNova_500Medium",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Cormorant Garamond', Georgia, serif",
    serifMedium: "'Cormorant Garamond', Georgia, serif",
    serifSemiBold: "'Cormorant Garamond', Georgia, serif",
    body: "'Ibarra Real Nova', Georgia, serif",
    bodyItalic: "'Ibarra Real Nova', Georgia, serif",
    bodyMedium: "'Ibarra Real Nova', Georgia, serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Mystic gradient colors for LinearGradient
export const Gradients = {
  mysticPanel: {
    colors: ["#181221", "#1C1525", "#0F0B14"],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  cardGlow: {
    colors: ["rgba(212, 184, 150, 0.15)", "rgba(120, 161, 255, 0.1)", "rgba(255, 132, 178, 0.1)"],
    locations: [0, 0.5, 1],
  },
  darkFade: {
    colors: ["transparent", "#0F0B14"],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};
