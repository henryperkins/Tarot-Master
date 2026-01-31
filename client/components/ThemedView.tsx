import { View, ViewProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export interface ThemedViewProps extends ViewProps {
  variant?: "root" | "default" | "secondary" | "tertiary";
}

export function ThemedView({ variant = "default", style, ...rest }: ThemedViewProps) {
  const { theme } = useTheme();

  const backgroundColor = 
    variant === "root" ? theme.backgroundRoot :
    variant === "secondary" ? theme.backgroundSecondary :
    variant === "tertiary" ? theme.backgroundTertiary :
    theme.backgroundDefault;

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
