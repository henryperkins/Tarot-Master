import { View, StyleSheet, ScrollView, TextInput, Alert, Pressable } from "react-native";
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
import * as Haptics from "expo-haptics";

const JOURNAL_STORAGE_KEY = "@tableu_journal";

type RouteProps = RouteProp<RootStackParamList, "JournalDetail">;
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

export function JournalDetailScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const { entryId } = route.params;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        const entries: JournalEntry[] = JSON.parse(data);
        const found = entries.find((e) => e.id === entryId);
        if (found) {
          setEntry(found);
          setNotes(found.notes || "");
        }
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
    }
  };

  const saveNotes = async () => {
    if (!entry) return;

    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        const entries: JournalEntry[] = JSON.parse(data);
        const updatedEntries = entries.map((e) =>
          e.id === entry.id ? { ...e, notes } : e
        );
        await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
        setEntry({ ...entry, notes });
        setIsEditing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!entry) return;

    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        const entries: JournalEntry[] = JSON.parse(data);
        const updatedEntries = entries.map((e) =>
          e.id === entry.id ? { ...e, isFavorite: !e.isFavorite } : e
        );
        await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
        setEntry({ ...entry, isFavorite: !entry.isFavorite });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteEntry = () => {
    Alert.alert(
      "Delete Reading",
      "Are you sure you want to delete this reading? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
              if (data) {
                const entries: JournalEntry[] = JSON.parse(data);
                const updatedEntries = entries.filter((e) => e.id !== entryId);
                await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigation.goBack();
              }
            } catch (error) {
              console.error("Failed to delete entry:", error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!entry) {
    return (
      <ThemedView variant="root" style={styles.container}>
        <LinearGradient
          colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centered}>
          <ThemedText style={{ color: theme.textMuted }}>Loading...</ThemedText>
        </View>
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
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Pressable onPress={toggleFavorite} hitSlop={12}>
            <Feather
              name="heart"
              size={22}
              color={entry.isFavorite ? theme.error : theme.textMuted}
              style={{ opacity: entry.isFavorite ? 1 : 0.5 }}
            />
          </Pressable>
          <Pressable onPress={deleteEntry} hitSlop={12}>
            <Feather name="trash-2" size={22} color={theme.error} style={{ opacity: 0.7 }} />
          </Pressable>
        </View>

        {/* Date and Spread */}
        <ThemedText style={[styles.date, { color: theme.textMuted }]}>
          {formatDate(entry.createdAt)}
        </ThemedText>

        <View style={styles.spreadBadge}>
          <Feather name={(spread?.icon || "circle") as any} size={16} color={theme.primary} />
          <ThemedText style={[styles.spreadName, { color: theme.primary }]}>
            {spread?.name || entry.spreadType}
          </ThemedText>
        </View>

        {/* Question */}
        {entry.question ? (
          <ThemedText type="title" style={styles.question}>
            {entry.question}
          </ThemedText>
        ) : null}

        {/* Cards */}
        <Card style={styles.cardsCard}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
            Cards Drawn
          </ThemedText>
          {entry.cards.map((c, idx) => {
            const cardData = getCardById(c.cardId);
            const meaning = c.isReversed ? cardData?.reversed : cardData?.upright;
            
            return (
              <View key={idx} style={styles.cardDetail}>
                <View style={styles.cardHeader}>
                  <ThemedText style={[styles.cardPosition, { color: theme.primary }]}>
                    {c.position}
                  </ThemedText>
                  <ThemedText style={styles.cardName}>
                    {c.name}
                    {c.isReversed ? " (Reversed)" : ""}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.cardMeaning, { color: theme.textMuted }]}>
                  {meaning}
                </ThemedText>
              </View>
            );
          })}
        </Card>

        {/* Narrative */}
        {entry.narrative ? (
          <Card variant="glow" style={styles.narrativeCard}>
            <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
              Reading Insight
            </ThemedText>
            <ThemedText style={styles.narrative}>
              {entry.narrative}
            </ThemedText>
          </Card>
        ) : null}

        {/* Notes */}
        <Card style={styles.notesCard}>
          <View style={styles.notesTitleRow}>
            <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textMuted }]}>
              Your Reflections
            </ThemedText>
            {!isEditing && (
              <Pressable onPress={() => setIsEditing(true)}>
                <Feather name="edit-2" size={16} color={theme.primary} />
              </Pressable>
            )}
          </View>
          
          {isEditing ? (
            <>
              <TextInput
                style={[styles.notesInput, { color: theme.text, borderColor: theme.borderLight }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Record your thoughts and insights..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus
                testID="input-notes"
              />
              <View style={styles.notesActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setNotes(entry.notes || "");
                    setIsEditing(false);
                  }}
                  variant="ghost"
                  size="sm"
                />
                <Button
                  title="Save"
                  onPress={saveNotes}
                  size="sm"
                />
              </View>
            </>
          ) : (
            <ThemedText style={[styles.notesText, !entry.notes && { color: theme.textMuted }]}>
              {entry.notes || "No reflections recorded yet. Tap to add your thoughts."}
            </ThemedText>
          )}
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  date: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  spreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
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
  cardDetail: {
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3A2F3F", // Manually set to Colors.dark.border
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  cardPosition: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardName: {
    fontFamily: Fonts.serifMedium,
    fontSize: 16,
  },
  cardMeaning: {
    fontSize: 14,
    lineHeight: 20,
  },
  narrativeCard: {
    marginBottom: Spacing.lg,
  },
  narrative: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 26,
  },
  notesCard: {
    marginBottom: Spacing.lg,
  },
  notesTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  notesInput: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 100,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  notesActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
