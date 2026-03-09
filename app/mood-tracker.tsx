import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import type { MoodLevel } from "@/lib/health-context";

const MOODS: { level: MoodLevel; emoji: string; label: string; color: string }[] = [
  { level: 1, emoji: "😔", label: "Rough", color: "#E8445A" },
  { level: 2, emoji: "😕", label: "Low", color: "#F5A623" },
  { level: 3, emoji: "😐", label: "Okay", color: "#A8C5F5" },
  { level: 4, emoji: "🙂", label: "Good", color: "#5B8DEF" },
  { level: 5, emoji: "😊", label: "Great", color: "#34C97B" },
];

const MOOD_NOTES: Record<MoodLevel, string[]> = {
  1: ["Feeling exhausted", "Anxious today", "Overwhelmed", "Not sleeping well"],
  2: ["A bit down", "Low energy", "Stressed", "Unmotivated"],
  3: ["Just okay", "Neutral", "Getting through the day", "Steady"],
  4: ["Feeling positive", "Good energy", "Productive", "Calm"],
  5: ["Feeling great!", "Full of energy", "Very happy", "Excellent day"],
};

export default function MoodTrackerScreen() {
  const colors = useColors();
  const { addMoodEntry, todayMood, moodLog } = useHealth();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(todayMood?.mood ?? null);
  const [note, setNote] = useState(todayMood?.note ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await addMoodEntry(selectedMood, note.trim() || undefined);
    setSaved(true);
    setTimeout(() => router.back(), 1200);
  };

  const recentMoods = moodLog.slice(0, 7);

  if (saved) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.savedContainer}>
          <Text style={styles.savedEmoji}>
            {MOODS.find((m) => m.level === selectedMood)?.emoji ?? "✅"}
          </Text>
          <Text style={[styles.savedTitle, { color: colors.foreground }]}>Mood Logged!</Text>
          <Text style={[styles.savedSubtitle, { color: colors.muted }]}>
            Your mood has been saved.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.6 },
            ]}
          >
            <IconSymbol name="xmark" size={16} color={colors.muted} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>How are you feeling?</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Mood Selector */}
        <View style={styles.moodRow}>
          {MOODS.map((mood) => (
            <Pressable
              key={mood.level}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSelectedMood(mood.level);
              }}
              style={({ pressed }) => [
                styles.moodButton,
                {
                  backgroundColor:
                    selectedMood === mood.level ? mood.color + "22" : colors.surface,
                  borderColor:
                    selectedMood === mood.level ? mood.color : colors.border,
                  transform: [{ scale: selectedMood === mood.level ? 1.1 : 1 }],
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  {
                    color: selectedMood === mood.level ? mood.color : colors.muted,
                    fontWeight: selectedMood === mood.level ? "700" : "400",
                  },
                ]}
              >
                {mood.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Notes */}
        {selectedMood && (
          <View style={styles.quickNotesSection}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Quick tags</Text>
            <View style={styles.quickNotesRow}>
              {MOOD_NOTES[selectedMood].map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => setNote(note ? `${note}, ${tag}` : tag)}
                  style={({ pressed }) => [
                    styles.tagChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.foreground }]}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Note Input */}
        <View style={styles.noteSection}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Add a note (optional)</Text>
          <TextInput
            style={[
              styles.noteInput,
              {
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            placeholder="What's on your mind today?"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            maxLength={200}
            returnKeyType="done"
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!selectedMood}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: selectedMood
                ? MOODS.find((m) => m.level === selectedMood)?.color ?? colors.primary
                : colors.border,
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
        >
          <Text style={styles.saveButtonText}>
            {todayMood ? "Update Mood" : "Save Mood"}
          </Text>
        </Pressable>

        {/* Recent History */}
        {recentMoods.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Recent mood history</Text>
            <View style={styles.historyRow}>
              {recentMoods.map((entry) => {
                const moodInfo = MOODS.find((m) => m.level === entry.mood);
                const date = new Date(entry.date);
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <Text style={styles.historyEmoji}>{moodInfo?.emoji}</Text>
                    <Text style={[styles.historyDate, { color: colors.muted }]}>
                      {date.getMonth() + 1}/{date.getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  quickNotesSection: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickNotesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },
  noteSection: {
    gap: 10,
  },
  noteInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 90,
    textAlignVertical: "top",
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  historySection: {
    gap: 12,
  },
  historyRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  historyItem: {
    alignItems: "center",
    gap: 4,
  },
  historyEmoji: {
    fontSize: 24,
  },
  historyDate: {
    fontSize: 11,
  },
  savedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  savedEmoji: {
    fontSize: 64,
  },
  savedTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  savedSubtitle: {
    fontSize: 16,
  },
});
