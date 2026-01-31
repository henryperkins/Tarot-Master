import { View, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { SpreadSelector } from "@/components/SpreadSelector";
import { QuestionInput } from "@/components/QuestionInput";
import { HeaderLogo } from "@/components/HeaderLogo";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { spreads, Spread, getDefaultSpread } from "@/data/spreads";
import { RootStackParamList } from "@/navigation/RootNavigator";
import * as Haptics from "expo-haptics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(getDefaultSpread());
  const [question, setQuestion] = useState("");

  const handleStartReading = () => {
    if (!selectedSpread) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate("Reading", {
      spreadId: selectedSpread.id,
      question: question.trim() || undefined,
    });
  };

  return (
    <ThemedView variant="root" style={styles.container}>
      <LinearGradient
        colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing["2xl"], paddingBottom: tabBarHeight + Spacing["2xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <HeaderLogo />
          <ThemedText style={[styles.greeting, { color: theme.textMuted }]}>
            Welcome, Seeker
          </ThemedText>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText type="display" style={[styles.heroTitle, { color: theme.text }]}>
            Illuminate{"\n"}Your Path
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: theme.textMuted }]}>
            The cards hold wisdom for those who seek
          </ThemedText>
        </View>

        {/* Spread Selector */}
        <SpreadSelector
          selectedSpread={selectedSpread}
          onSelect={setSelectedSpread}
        />

        {/* Question Input */}
        <QuestionInput
          question={question}
          onQuestionChange={setQuestion}
        />

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Draw Your Cards"
            onPress={handleStartReading}
            disabled={!selectedSpread}
            icon="sunrise"
            size="lg"
            testID="button-start-reading"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["3xl"],
  },
  greeting: {
    marginTop: Spacing.sm,
    fontSize: 14,
  },
  heroSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  heroTitle: {
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing["2xl"],
  },
});
