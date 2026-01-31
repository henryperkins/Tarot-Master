import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useTheme() {
  // Always use dark theme for mystical tarot app
  const colorScheme = useColorScheme();
  const isDark = true; // Force dark mode for mystical aesthetic
  const theme = Colors.dark;

  return {
    theme,
    isDark,
  };
}
