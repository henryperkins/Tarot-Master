import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { HeaderLogo } from "@/components/HeaderLogo";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { getSpreadById } from "@/data/spreads";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface JournalEntry {
  id: number;
  spreadType: string;
  question?: string;
  cards: any[];
  narrative?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
}

const JOURNAL_STORAGE_KEY = "@tableu_journal";

export function JournalScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (data) {
        setEntries(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const toggleFavorite = async (id: number) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    setEntries(updated);
    await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const spread = getSpreadById(item.spreadType);
    
    return (
      <Pressable
        onPress={() => navigation.navigate("JournalDetail", { entryId: item.id })}
        testID={`journal-entry-${item.id}`}
      >
        <Card style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <View style={styles.spreadBadge}>
              <Feather
                name={(spread?.icon || "circle") as any}
                size={14}
                color={theme.primary}
              />
              <ThemedText style={[styles.spreadName, { color: theme.primary }]}>
                {spread?.name || item.spreadType}
              </ThemedText>
            </View>
            <Pressable onPress={() => toggleFavorite(item.id)} hitSlop={8}>
              <Feather
                name={item.isFavorite ? "heart" : "heart"}
                size={18}
                color={item.isFavorite ? theme.error : theme.textMuted}
                style={{ opacity: item.isFavorite ? 1 : 0.5 }}
              />
            </Pressable>
          </View>
          
          {item.question ? (
            <ThemedText style={styles.question} numberOfLines={2}>
              {item.question}
            </ThemedText>
          ) : null}
          
          <ThemedText style={[styles.preview, { color: theme.textMuted }]} numberOfLines={2}>
            {item.narrative || "No insight recorded"}
          </ThemedText>
          
          <View style={styles.entryFooter}>
            <ThemedText style={[styles.date, { color: theme.textMuted }]}>
              {formatDate(item.createdAt)}
            </ThemedText>
            <ThemedText style={[styles.cardCount, { color: theme.textMuted }]}>
              {item.cards.length} cards
            </ThemedText>
          </View>
        </Card>
      </Pressable>
    );
  };

  const goToReading = () => {
    navigation.navigate("MainTabs", { screen: "Home" } as any);
  };

  return (
    <ThemedView variant="root" style={styles.container}>
      <LinearGradient
        colors={[theme.backgroundRoot, theme.backgroundDefault, theme.backgroundRoot]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <HeaderLogo />
        <ThemedText type="caption" style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          Your Reading Journal
        </ThemedText>
      </View>

      {entries.length === 0 && !isLoading ? (
        <EmptyState
          title="Your Journal Awaits"
          description="Complete your first reading to begin recording your journey"
          imageType="journal"
          actionLabel="Start a Reading"
          onAction={goToReading}
        />
      ) : (
        <FlatList
          data={entries.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEntry}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerSubtitle: {
    marginTop: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  entryCard: {
    marginBottom: Spacing.xs,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  spreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  spreadName: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 16,
    fontFamily: Fonts.serifMedium,
    marginBottom: Spacing.sm,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  entryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
  },
  cardCount: {
    fontSize: 12,
  },
});
