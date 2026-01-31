import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { TarotCard } from "@/components/TarotCard";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";

import { getSpreadById, Spread } from "@/data/spreads";
import { getRandomCards, TarotCard as TarotCardType } from "@/data/tarotDeck";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const JOURNAL_STORAGE_KEY = "@tableu_journal";

type RouteProps = RouteProp<RootStackParamList, "Reading">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DrawnCard {
  card: TarotCardType;
  isReversed: boolean;
  positionId: number;
  isRevealed: boolean;
}

export function ReadingScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const { spreadId, question } = route.params;
  const spread = getSpreadById(spreadId) || getSpreadById("single")!;

  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Draw cards on mount
  useEffect(() => {
    drawCards();
  }, []);

  const drawCards = () => {
    setIsDrawing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const cards = getRandomCards(spread.cardCount);
    const drawn: DrawnCard[] = cards.map((card, idx) => ({
      card,
      isReversed: Math.random() > 0.7, // 30% chance of reversed
      positionId: spread.positions[idx].id,
      isRevealed: false,
    }));

    setDrawnCards(drawn);
    setIsDrawing(false);
  };

  const handleCardReveal = (positionId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setDrawnCards((prev) =>
      prev.map((c) =>
        c.positionId === positionId ? { ...c, isRevealed: true } : c
      )
    );
  };

  useEffect(() => {
    if (drawnCards.length > 0 && drawnCards.every((c) => c.isRevealed)) {
      setAllRevealed(true);
    }
  }, [drawnCards]);

  const handleRevealAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setDrawnCards((prev) => prev.map((c) => ({ ...c, isRevealed: true })));
  };

  const handleGetReading = async () => {
    setIsGenerating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Save reading to journal
    try {
      const existingData = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      const entries = existingData ? JSON.parse(existingData) : [];
      
      const newEntry = {
        id: Date.now(),
        spreadType: spreadId,
        question,
        cards: drawnCards.map((dc) => ({
          cardId: dc.card.id,
          name: dc.card.name,
          isReversed: dc.isReversed,
          position: spread.positions.find((p) => p.id === dc.positionId)?.name,
        })),
        narrative: null,
        notes: null,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      entries.push(newEntry);
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

      // Navigate to result screen
      navigation.replace("ReadingResult", { readingId: newEntry.id });
    } catch (error) {
      console.error("Failed to save reading:", error);
      setIsGenerating(false);
    }
  };

  const getCardPosition = (positionId: number) => {
    const position = spread.positions.find((p) => p.id === positionId);
    if (!position) return { left: 0, top: 0 };

    const containerWidth = SCREEN_WIDTH - Spacing.lg * 2;
    const containerHeight = 400;

    return {
      left: position.x * containerWidth - 50,
      top: position.y * containerHeight - 70,
    };
  };

  const revealedCount = drawnCards.filter((c) => c.isRevealed).length;

  return (
    <ThemedView variant="root" style={styles.container}>
      <LinearGradient
        colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: headerHeight + Spacing.lg }]}>
        {/* Question display */}
        {question ? (
          <View style={[styles.questionBox, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText style={[styles.questionLabel, { color: theme.textMuted }]}>
              Your Question
            </ThemedText>
            <ThemedText style={styles.questionText}>{question}</ThemedText>
          </View>
        ) : null}

        {/* Spread name */}
        <View style={styles.spreadInfo}>
          <ThemedText type="caption" style={{ color: theme.primary }}>
            {spread.name}
          </ThemedText>
          <ThemedText style={[styles.progress, { color: theme.textMuted }]}>
            {revealedCount} of {spread.cardCount} revealed
          </ThemedText>
        </View>

        {/* Cards layout */}
        <View style={styles.cardsContainer}>
          {drawnCards.map((dc) => {
            const position = getCardPosition(dc.positionId);
            const positionData = spread.positions.find((p) => p.id === dc.positionId);
            
            return (
              <View
                key={dc.positionId}
                style={[styles.cardWrapper, { left: position.left, top: position.top }]}
              >
                <TarotCard
                  card={dc.card}
                  isReversed={dc.isReversed}
                  isRevealed={dc.isRevealed}
                  onPress={() => !dc.isRevealed && handleCardReveal(dc.positionId)}
                  size="sm"
                  position={positionData?.name}
                  testID={`card-position-${dc.positionId}`}
                />
              </View>
            );
          })}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          {!allRevealed ? (
            <>
              <ThemedText style={[styles.instructionText, { color: theme.textMuted }]}>
                Tap each card to reveal its wisdom
              </ThemedText>
              <Button
                title="Reveal All Cards"
                onPress={handleRevealAll}
                variant="ghost"
                size="sm"
                testID="button-reveal-all"
              />
            </>
          ) : (
            <Button
              title={isGenerating ? "Channeling Insight..." : "Receive Your Reading"}
              onPress={handleGetReading}
              loading={isGenerating}
              disabled={isGenerating}
              icon="sunrise"
              size="lg"
              style={styles.readingButton}
              testID="button-get-reading"
            />
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  questionBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  questionLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  questionText: {
    fontFamily: Fonts.serifMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  spreadInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  progress: {
    fontSize: 13,
  },
  cardsContainer: {
    flex: 1,
    position: "relative",
    minHeight: 400,
  },
  cardWrapper: {
    position: "absolute",
  },
  instructions: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    gap: Spacing.md,
  },
  instructionText: {
    textAlign: "center",
  },
  readingButton: {
    width: "100%",
  },
});
