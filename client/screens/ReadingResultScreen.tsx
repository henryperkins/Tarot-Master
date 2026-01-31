import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { getSpreadById } from "@/data/spreads";
import { getCardById } from "@/data/tarotDeck";
import { apiRequest, getApiUrl } from "@/lib/query-client";

const JOURNAL_STORAGE_KEY = "@tableu_journal";

type RouteProps = RouteProp<RootStackParamList, "ReadingResult">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface JournalEntry {
  id: number;
  spreadType: string;
  question?: string;
  cards: {
    cardId: string;
    name: string;
    isReversed: boolean;
    position: string;
  }[];
  narrative?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
}

export function ReadingResultScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const { readingId } = route.params;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadEntry();
  }, [readingId]);

  const loadEntry = async () => {
    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        const entries: JournalEntry[] = JSON.parse(data);
        const found = entries.find((e) => e.id === readingId);
        if (found) {
          setEntry(found);
          setNotes(found.notes || "");
          
          // Generate narrative if not already done
          if (!found.narrative) {
            generateNarrative(found);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNarrative = async (journalEntry: JournalEntry) => {
    setIsGeneratingNarrative(true);

    try {
      const spread = getSpreadById(journalEntry.spreadType);
      
      // Build the reading context for AI
      const cardsContext = journalEntry.cards
        .map((c) => {
          const cardData = getCardById(c.cardId);
          const meaning = c.isReversed ? cardData?.reversed : cardData?.upright;
          return `${c.position}: ${c.name}${c.isReversed ? " (Reversed)" : ""} - ${meaning}`;
        })
        .join("\n");

      const prompt = {
        spreadType: spread?.name || journalEntry.spreadType,
        question: journalEntry.question || "General guidance",
        cards: cardsContext,
      };

      const response = await apiRequest("POST", "/api/readings/generate", prompt);
      const data = await response.json();
      
      // Update entry with narrative
      const updatedEntry = { ...journalEntry, narrative: data.narrative };
      setEntry(updatedEntry);
      
      // Save to storage
      await updateEntryInStorage(updatedEntry);
    } catch (error) {
      console.error("Failed to generate narrative:", error);
      // Set a fallback narrative
      const fallbackNarrative = generateFallbackNarrative(journalEntry);
      const updatedEntry = { ...journalEntry, narrative: fallbackNarrative };
      setEntry(updatedEntry);
      await updateEntryInStorage(updatedEntry);
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const generateFallbackNarrative = (journalEntry: JournalEntry): string => {
    const cards = journalEntry.cards;
    let narrative = "Your reading reveals a journey of discovery.\n\n";
    
    cards.forEach((c) => {
      const cardData = getCardById(c.cardId);
      const meaning = c.isReversed ? cardData?.reversed : cardData?.upright;
      narrative += `**${c.position}**: ${c.name}${c.isReversed ? " (Reversed)" : ""}\n${meaning}\n\n`;
    });
    
    narrative += "Take time to reflect on how these cards speak to your current situation.";
    return narrative;
  };

  const updateEntryInStorage = async (updatedEntry: JournalEntry) => {
    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        const entries: JournalEntry[] = JSON.parse(data);
        const updatedEntries = entries.map((e) =>
          e.id === updatedEntry.id ? updatedEntry : e
        );
        await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
      }
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!entry) return;
    const updatedEntry = { ...entry, notes };
    setEntry(updatedEntry);
    await updateEntryInStorage(updatedEntry);
  };

  const handleDone = () => {
    handleSaveNotes();
    navigation.popToTop();
  };

  if (isLoading || !entry) {
    return (
      <ThemedView variant="root" style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  const spread = getSpreadById(entry.spreadType);

  return (
    <ThemedView variant="root" style={styles.container}>
      <LinearGradient
        colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + Spacing["2xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Spread Info */}
        <View style={styles.spreadBadge}>
          <Feather name={(spread?.icon || "circle") as any} size={16} color={theme.primary} />
          <ThemedText style={[styles.spreadName, { color: theme.primary }]}>
            {spread?.name || entry.spreadType}
          </ThemedText>
        </View>

        {/* Question */}
        {entry.question ? (
          <ThemedText type="subtitle" style={styles.question}>
            {entry.question}
          </ThemedText>
        ) : null}

        {/* Cards Summary */}
        <Card style={styles.cardsCard}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
            Cards Drawn
          </ThemedText>
          <View style={styles.cardsList}>
            {entry.cards.map((c, idx) => (
              <View key={idx} style={styles.cardItem}>
                <ThemedText style={[styles.cardPosition, { color: theme.textMuted }]}>
                  {c.position}
                </ThemedText>
                <ThemedText style={styles.cardName}>
                  {c.name}
                  {c.isReversed ? " (R)" : ""}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Narrative */}
        <Card variant="glow" style={styles.narrativeCard}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
            Your Reading
          </ThemedText>
          
          {isGeneratingNarrative ? (
            <View style={styles.loadingNarrative}>
              <ActivityIndicator size="small" color={theme.primary} />
              <ThemedText style={[styles.loadingText, { color: theme.textMuted }]}>
                The cards are speaking...
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.narrative}>
              {entry.narrative || "Generating your reading..."}
            </ThemedText>
          )}
        </Card>

        {/* Notes */}
        <Card style={styles.notesCard}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
            Your Reflections
          </ThemedText>
          <TextInput
            style={[styles.notesInput, { color: theme.text, borderColor: theme.borderLight }]}
            value={notes}
            onChangeText={setNotes}
            onBlur={handleSaveNotes}
            placeholder="Record your thoughts and insights..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            testID="input-notes"
          />
        </Card>

        {/* Done Button */}
        <Button
          title="Complete Reading"
          onPress={handleDone}
          icon="check"
          style={styles.doneButton}
          testID="button-done"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  spreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  spreadName: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  question: {
    marginBottom: Spacing["2xl"],
  },
  cardsCard: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    marginBottom: Spacing.md,
  },
  cardsList: {
    gap: Spacing.sm,
  },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3A2F3F", // Manually set to Colors.dark.border
  },
  cardPosition: {
    fontSize: 13,
    flex: 1,
  },
  cardName: {
    fontFamily: Fonts.serifMedium,
    flex: 2,
    textAlign: "right",
  },
  narrativeCard: {
    marginBottom: Spacing.lg,
  },
  loadingNarrative: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    fontStyle: "italic",
  },
  narrative: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 26,
  },
  notesCard: {
    marginBottom: Spacing["2xl"],
  },
  notesInput: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 100,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  doneButton: {
    marginBottom: Spacing.lg,
  },
});
