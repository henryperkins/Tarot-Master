import { Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, BorderRadius, Spacing, Fonts, Typography, Shadows } from "@/constants/theme";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: Spacing.lg, fontSize: 14 },
    md: { height: Spacing.buttonHeight, paddingHorizontal: Spacing["2xl"], fontSize: 16 },
    lg: { height: 60, paddingHorizontal: Spacing["3xl"], fontSize: 18 },
  };

  const currentSize = sizeStyles[size];

  const renderContent = (textColor: string) => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Feather name={icon} size={currentSize.fontSize + 2} color={textColor} style={styles.iconLeft} />
          )}
          <ThemedText
            style={[
              styles.text,
              { color: textColor, fontSize: currentSize.fontSize },
            ]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === "right" && (
            <Feather name={icon} size={currentSize.fontSize + 2} color={textColor} style={styles.iconRight} />
          )}
        </>
      )}
    </View>
  );

  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          {
            height: currentSize.height,
            paddingHorizontal: currentSize.paddingHorizontal,
            opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          },
          Shadows.glow,
          style,
        ]}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: BorderRadius.md }]}
        >
          {renderContent(theme.buttonText)}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyles = {
    secondary: {
      backgroundColor: theme.backgroundTertiary,
      borderColor: theme.borderLight,
      textColor: theme.text,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      textColor: theme.primary,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: theme.primary,
      textColor: theme.primary,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        styles.nonPrimary,
        {
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {renderContent(currentVariant.textColor)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  nonPrimary: {
    borderWidth: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Fonts.serifMedium,
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
