import { Text, StyleSheet, TextStyle, TextProps } from "react-native";
import { Colors, Typography, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type TextType = "default" | "title" | "subtitle" | "defaultSemiBold" | "link" | "body" | "caption" | "display";

export interface ThemedTextProps extends TextProps {
  type?: TextType;
  style?: TextStyle | TextStyle[];
}

export function ThemedText({ type = "default", style, ...rest }: ThemedTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.body,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  title: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: Typography.h2.fontSize,
    lineHeight: Typography.h2.lineHeight,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: Fonts.serifMedium,
    fontSize: Typography.h4.fontSize,
    lineHeight: Typography.h4.lineHeight,
  },
  defaultSemiBold: {
    fontFamily: Fonts.bodyMedium,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: "600",
  },
  link: {
    fontFamily: Fonts.body,
    fontSize: Typography.link.fontSize,
    lineHeight: Typography.link.lineHeight,
    color: Colors.dark.link,
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: Typography.bodySerif.fontSize,
    lineHeight: Typography.bodySerif.lineHeight,
  },
  caption: {
    fontFamily: Fonts.body,
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    letterSpacing: Typography.caption.letterSpacing,
    textTransform: "uppercase" as const,
  },
  display: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: Typography.display.fontSize,
    lineHeight: Typography.display.lineHeight,
    letterSpacing: Typography.display.letterSpacing,
  },
});
