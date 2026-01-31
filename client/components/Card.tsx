import { View, ViewProps, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "glow";
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
}

export function Card({ variant = "default", style, children, icon, iconColor, ...rest }: CardProps) {
  const { theme } = useTheme();

  const renderIconWithContent = () => {
    if (!icon) return children;
    
    return (
      <View style={styles.iconWrapper}>
        <View style={[styles.iconContainer, { backgroundColor: theme.backgroundRoot }]}>
          <Feather name={icon} size={20} color={iconColor || theme.primary} />
        </View>
        <View style={styles.contentWithIcon}>{children}</View>
      </View>
    );
  };

  if (variant === "glow") {
    return (
      <View style={[styles.glowOuter, style]} {...rest}>
        <LinearGradient
          colors={[theme.backgroundSecondary, theme.backgroundTertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowInner}
        >
          {renderIconWithContent()}
        </LinearGradient>
      </View>
    );
  }

  const backgroundColor = 
    variant === "elevated" ? theme.backgroundTertiary : theme.backgroundSecondary;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderColor: theme.borderLight },
        variant === "elevated" && Shadows.md,
        style,
      ]}
      {...rest}
    >
      {renderIconWithContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
  },
  glowOuter: {
    borderRadius: BorderRadius.lg,
    ...Shadows.glow,
  },
  glowInner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.dark.borderLight,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  contentWithIcon: {
    flex: 1,
  },
});
