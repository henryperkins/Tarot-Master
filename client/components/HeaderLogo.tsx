import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Fonts } from "@/constants/theme";

export function HeaderLogo() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.icon}
        contentFit="contain"
      />
      <ThemedText style={[styles.title, { color: theme.primary }]}>
        TABLEU
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  title: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    letterSpacing: 3,
  },
});
