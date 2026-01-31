import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { TarotCard as TarotCardType } from "@/data/tarotDeck";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.28;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface TarotCardProps {
  card?: TarotCardType;
  isReversed?: boolean;
  isRevealed?: boolean;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  position?: string;
  testID?: string;
}

export function TarotCard({
  card,
  isReversed = false,
  isRevealed = false,
  onPress,
  size = "md",
  showName = true,
  position,
  testID,
}: TarotCardProps) {
  const { theme } = useTheme();
  const flipProgress = useSharedValue(isRevealed ? 1 : 0);
  const scale = useSharedValue(1);

  const sizeMultiplier = size === "sm" ? 0.7 : size === "lg" ? 1.3 : 1;
  const cardWidth = CARD_WIDTH * sizeMultiplier;
  const cardHeight = CARD_HEIGHT * sizeMultiplier;

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Animate flip
      flipProgress.value = withSpring(flipProgress.value === 0 ? 1 : 0, {
        damping: 15,
        stiffness: 100,
      });
      
      onPress();
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
      { scale: scale.value },
      ...(isReversed ? [{ rotate: "180deg" }] : []),
    ],
    opacity: interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
      { scale: scale.value },
    ],
    opacity: interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0]),
  }));

  return (
    <View style={styles.container}>
      {position && (
        <ThemedText style={[styles.positionLabel, { color: theme.textMuted }]}>
          {position}
        </ThemedText>
      )}
      
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
      >
        <View style={[styles.cardWrapper, { width: cardWidth, height: cardHeight }]}>
          {/* Card Back */}
          <Animated.View style={[styles.cardSide, backAnimatedStyle]}>
            <LinearGradient
              colors={[theme.backgroundTertiary, theme.backgroundSecondary]}
              style={[styles.cardBack, { borderColor: theme.borderLight }]}
            >
              <Image
                source={require("../../assets/images/card-back.png")}
                style={styles.cardBackImage}
                contentFit="cover"
              />
              <View style={[styles.cardBackOverlay, { borderColor: theme.primary }]} />
            </LinearGradient>
          </Animated.View>

          {/* Card Front */}
          <Animated.View style={[styles.cardSide, styles.cardFront, frontAnimatedStyle]}>
            <LinearGradient
              colors={[theme.backgroundSecondary, theme.backgroundTertiary]}
              style={[styles.cardFrontInner, { borderColor: theme.borderLight }]}
            >
              <View style={styles.cardContent}>
                <ThemedText style={[styles.cardNumber, { color: theme.primary }]}>
                  {card?.arcana === "major" ? romanize(card?.number ?? 0) : card?.number || ""}
                </ThemedText>
                {showName && card && (
                  <ThemedText
                    type="subtitle"
                    style={[styles.cardName, { color: theme.text }]}
                    numberOfLines={2}
                  >
                    {card.name}
                  </ThemedText>
                )}
                {card?.suit && (
                  <ThemedText style={[styles.cardSuit, { color: theme.textMuted }]}>
                    {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}
                  </ThemedText>
                )}
              </View>
              {isReversed && (
                <View style={[styles.reversedBadge, { backgroundColor: theme.glowPink }]}>
                  <ThemedText style={styles.reversedText}>Reversed</ThemedText>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

function romanize(num: number): string {
  if (num === 0) return "0";
  const lookup: { [key: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
  };
  let roman = "";
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  positionLabel: {
    fontSize: 12,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardWrapper: {
    ...Shadows.lg,
  },
  cardSide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardBackImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cardBackOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderRadius: BorderRadius.md - 1,
    margin: 6,
  },
  cardFrontInner: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  cardName: {
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  cardSuit: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reversedBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  reversedText: {
    fontSize: 10,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
