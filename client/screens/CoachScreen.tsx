import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { HeaderLogo } from "@/components/HeaderLogo";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { spreads } from "@/data/spreads";
import * as Haptics from "expo-haptics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface IntentionCategory {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  description: string;
  questions: string[];
  recommendedSpread: string;
}

const INTENTION_CATEGORIES: IntentionCategory[] = [
  {
    id: "self",
    title: "Self-Discovery",
    icon: "user",
    description: "Explore your inner landscape",
    questions: [
      "What aspect of myself am I not seeing clearly?",
      "What hidden strength can I tap into?",
      "What patterns am I ready to release?",
      "How can I honor my authentic self today?",
    ],
    recommendedSpread: "five-card",
  },
  {
    id: "love",
    title: "Love & Relationships",
    icon: "heart",
    description: "Navigate matters of the heart",
    questions: [
      "What energy am I bringing to my relationships?",
      "How can I deepen my connections?",
      "What do I need to understand about this person?",
      "What is blocking me from receiving love?",
    ],
    recommendedSpread: "relationship",
  },
  {
    id: "career",
    title: "Career & Purpose",
    icon: "briefcase",
    description: "Find your path forward",
    questions: [
      "What opportunity should I pursue?",
      "How can I align my work with my purpose?",
      "What is holding back my professional growth?",
      "What new skill should I develop?",
    ],
    recommendedSpread: "three-card",
  },
  {
    id: "decisions",
    title: "Major Decisions",
    icon: "git-branch",
    description: "Clarity for life's crossroads",
    questions: [
      "Should I take this leap of faith?",
      "What am I not considering about this choice?",
      "Which path aligns with my highest good?",
      "What do I need to know before deciding?",
    ],
    recommendedSpread: "decision",
  },
  {
    id: "daily",
    title: "Daily Guidance",
    icon: "sun",
    description: "Wisdom for today",
    questions: [
      "What do I need to focus on today?",
      "What message does the universe have for me?",
      "How can I make the most of this day?",
      "What energy should I embody today?",
    ],
    recommendedSpread: "single",
  },
  {
    id: "healing",
    title: "Healing & Growth",
    icon: "feather",
    description: "Support your transformation",
    questions: [
      "What needs healing in my life right now?",
      "How can I move through this challenge?",
      "What lesson is this situation teaching me?",
      "What do I need to forgive or release?",
    ],
    recommendedSpread: "celtic-cross",
  },
];

export function CoachScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleQuestionPress = (question: string, spreadId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Reading", { spreadId, question });
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
          { paddingTop: insets.top + Spacing.lg, paddingBottom: tabBarHeight + Spacing["2xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <HeaderLogo />
          <ThemedText type="caption" style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            Intention Coach
          </ThemedText>
        </View>

        <View style={styles.intro}>
          <ThemedText type="subtitle" style={styles.introTitle}>
            Set Your Intention
          </ThemedText>
          <ThemedText style={[styles.introText, { color: theme.textMuted }]}>
            Choose a theme that resonates with you, then select a guiding question to begin your reading.
          </ThemedText>
        </View>

        <View style={styles.categories}>
          {INTENTION_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.id;
            const spread = spreads.find((s) => s.id === category.recommendedSpread);
            
            return (
              <View key={category.id}>
                <Pressable onPress={() => handleCategoryPress(category.id)}>
                  <Card
                    variant={isExpanded ? "glow" : "default"}
                    style={styles.categoryCard}
                  >
                    <View style={styles.categoryHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: theme.backgroundRoot }]}>
                        <Feather name={category.icon} size={20} color={theme.primary} />
                      </View>
                      <View style={styles.categoryInfo}>
                        <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>
                          {category.title}
                        </ThemedText>
                        <ThemedText style={[styles.categoryDesc, { color: theme.textMuted }]}>
                          {category.description}
                        </ThemedText>
                      </View>
                      <Feather
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={theme.textMuted}
                      />
                    </View>
                  </Card>
                </Pressable>

                {isExpanded && (
                  <View style={styles.questionsContainer}>
                    {category.questions.map((question, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => handleQuestionPress(question, category.recommendedSpread)}
                        style={({ pressed }) => [
                          styles.questionItem,
                          { 
                            backgroundColor: theme.backgroundSecondary,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <ThemedText style={styles.questionText}>{question}</ThemedText>
                        <View style={styles.questionMeta}>
                          <Feather name={(spread?.icon || "circle") as any} size={12} color={theme.textMuted} />
                          <ThemedText style={[styles.spreadLabel, { color: theme.textMuted }]}>
                            {spread?.name}
                          </ThemedText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
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
    marginBottom: Spacing["2xl"],
  },
  headerSubtitle: {
    marginTop: Spacing.sm,
  },
  intro: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  introTitle: {
    marginBottom: Spacing.sm,
  },
  introText: {
    lineHeight: 22,
  },
  categories: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoryCard: {
    marginBottom: 0,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: 13,
  },
  questionsContainer: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.xl,
    gap: Spacing.sm,
  },
  questionItem: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  questionText: {
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  questionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  spreadLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
