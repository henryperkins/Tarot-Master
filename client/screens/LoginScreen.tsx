import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, Typography } from "@/constants/theme";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <LinearGradient
          colors={[Colors.dark.backgroundRoot, Colors.dark.backgroundSecondary]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={[Colors.dark.backgroundRoot, Colors.dark.backgroundSecondary]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <ThemedText style={styles.title}>Tableu</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your mystical companion for tarot wisdom
        </ThemedText>

        <View style={styles.featureList}>
          <FeatureItem icon="star" text="AI-powered readings" />
          <FeatureItem icon="book" text="Personal journal" />
          <FeatureItem icon="compass" text="Guided intentions" />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Sign in with Replit"
          onPress={handleLogin}
          icon="log-in"
          testID="button-login"
        />

        <ThemedText style={styles.disclaimer}>
          Sign in to save your readings and access them anywhere
        </ThemedText>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Feather name={icon} size={20} color={Colors.dark.primary} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.dark.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textMuted,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  featureList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featureText: {
    ...Typography.body,
    color: Colors.dark.text,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.dark.textMuted,
    textAlign: "center",
  },
});
