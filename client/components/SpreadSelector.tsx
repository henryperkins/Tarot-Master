import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { spreads, Spread } from "@/data/spreads";
import * as Haptics from "expo-haptics";

interface SpreadSelectorProps {
  selectedSpread: Spread | null;
  onSelect: (spread: Spread) => void;
}

export function SpreadSelector({ selectedSpread, onSelect }: SpreadSelectorProps) {
  const { theme } = useTheme();

  const handleSelect = (spread: Spread) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(spread);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="caption" style={[styles.label, { color: theme.textMuted }]}>
        Choose Your Spread
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {spreads.map((spread) => {
          const isSelected = selectedSpread?.id === spread.id;
          return (
            <Pressable
              key={spread.id}
              onPress={() => handleSelect(spread)}
              testID={`spread-${spread.id}`}
            >
              <View
                style={[
                  styles.spreadCard,
                  {
                    backgroundColor: isSelected ? theme.backgroundTertiary : theme.backgroundSecondary,
                    borderColor: isSelected ? theme.primary : theme.borderLight,
                  },
                  isSelected && Shadows.glow,
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: theme.backgroundRoot }]}>
                  <Feather
                    name={spread.icon as any}
                    size={20}
                    color={isSelected ? theme.primary : theme.textMuted}
                  />
                </View>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.spreadName, { color: isSelected ? theme.primary : theme.text }]}
                  numberOfLines={1}
                >
                  {spread.name}
                </ThemedText>
                <ThemedText style={[styles.cardCount, { color: theme.textMuted }]}>
                  {spread.cardCount} {spread.cardCount === 1 ? "card" : "cards"}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      
      {selectedSpread && (
        <View style={[styles.descriptionBox, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={{ color: theme.textMuted }}>
            {selectedSpread.description}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.md,
    marginLeft: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  spreadCard: {
    width: 110,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  spreadName: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  cardCount: {
    fontSize: 12,
  },
  descriptionBox: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});
