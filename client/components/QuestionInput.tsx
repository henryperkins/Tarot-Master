import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts, Typography } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface QuestionInputProps {
  question: string;
  onQuestionChange: (text: string) => void;
  placeholder?: string;
}

const SAMPLE_QUESTIONS = [
  "What do I need to focus on today?",
  "What is blocking my progress?",
  "How can I improve my relationships?",
  "What should I release to move forward?",
  "What opportunity awaits me?",
];

export function QuestionInput({
  question,
  onQuestionChange,
  placeholder = "Ask your question...",
}: QuestionInputProps) {
  const { theme } = useTheme();

  const handleSuggestion = (q: string) => {
    Haptics.selectionAsync();
    onQuestionChange(q);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="caption" style={[styles.label, { color: theme.textMuted }]}>
        Your Intention
      </ThemedText>
      
      <View style={[styles.inputContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.borderLight }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={question}
          onChangeText={onQuestionChange}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          testID="question-input"
        />
        {question.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => onQuestionChange("")}
            testID="clear-question"
          >
            <Feather name="x" size={18} color={theme.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.suggestions}>
        <ThemedText type="caption" style={[styles.suggestionLabel, { color: theme.textMuted }]}>
          Need inspiration?
        </ThemedText>
        <View style={styles.suggestionTags}>
          {SAMPLE_QUESTIONS.slice(0, 3).map((q, i) => (
            <Pressable
              key={i}
              onPress={() => handleSuggestion(q)}
              style={[styles.suggestionTag, { backgroundColor: theme.backgroundTertiary }]}
            >
              <ThemedText style={[styles.suggestionText, { color: theme.primary }]} numberOfLines={1}>
                {q}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    minHeight: 100,
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    flex: 1,
  },
  clearButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
  },
  suggestions: {
    marginTop: Spacing.lg,
  },
  suggestionLabel: {
    marginBottom: Spacing.sm,
  },
  suggestionTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  suggestionTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    maxWidth: "100%",
  },
  suggestionText: {
    fontSize: 13,
  },
});
