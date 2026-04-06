import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import type { CoachingItem } from "@/lib/health-context";

const COACHING_ICONS: Record<CoachingItem["type"], React.ComponentProps<typeof IconSymbol>["name"]> = {
  walking: "figure.walk",
  hydration: "drop.fill",
  sleep: "moon.fill",
  breathing: "wind",
  stretch: "flame.fill",
  mindfulness: "leaf.fill",
};

const COACHING_COLORS: Record<CoachingItem["type"], string> = {
  walking: "#34C97B",
  hydration: "#5B8DEF",
  sleep: "#A8C5F5",
  breathing: "#7ECBA1",
  stretch: "#F5A623",
  mindfulness: "#34C97B",
};

const WELLNESS_TIPS = [
  {
    icon: "sun.max.fill" as const,
    title: "Morning Light",
    tip: "Getting natural light within 30 minutes of waking helps regulate your circadian rhythm and improves sleep quality at night.",
    color: "#F5A623",
  },
  {
    icon: "drop.fill" as const,
    title: "Hydration Rhythm",
    tip: "Drinking water consistently throughout the day — rather than in large amounts at once — supports better energy and cognitive function.",
    color: "#5B8DEF",
  },
  {
    icon: "moon.fill" as const,
    title: "Sleep Consistency",
    tip: "Going to bed and waking at the same time each day — even on weekends — is one of the most effective ways to improve sleep quality.",
    color: "#A8C5F5",
  },
  {
    icon: "figure.walk" as const,
    title: "Movement Breaks",
    tip: "Short 5-minute walks every hour can offset the effects of prolonged sitting and help maintain steady energy levels throughout the day.",
    color: "#34C97B",
  },
];

function CoachingCard({ item, onToggle }: { item: CoachingItem; onToggle: () => void }) {
  const colors = useColors();
  const icon = COACHING_ICONS[item.type];
  const color = COACHING_COLORS[item.type];

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.coachingCard,
        {
          backgroundColor: colors.surface,
          borderColor: item.completed ? color + "60" : colors.border,
          opacity: item.completed ? 0.75 : 1,
        },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={[styles.coachingIconBg, { backgroundColor: color + "22" }]}>
        <IconSymbol name={icon} size={22} color={color} />
      </View>
      <View style={styles.coachingContent}>
        <Text
          style={[
            styles.coachingTitle,
            {
              color: colors.foreground,
              textDecorationLine: item.completed ? "line-through" : "none",
            },
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.coachingDescription, { color: colors.muted }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <View
        style={[
          styles.checkCircle,
          {
            backgroundColor: item.completed ? color : "transparent",
            borderColor: item.completed ? color : colors.border,
          },
        ]}
      >
        {item.completed && (
          <IconSymbol name="checkmark" size={14} color="#fff" />
        )}
      </View>
    </Pressable>
  );
}

export default function CoachingScreen() {
  const colors = useColors();
  const { coachingItems, toggleCoachingItem, todayMetrics } = useHealth();

  const completedCount = coachingItems.filter((i) => i.completed).length;
  const totalCount = coachingItems.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleCoachingItem(id);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <FlatList
        data={coachingItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CoachingCard item={item} onToggle={() => handleToggle(item.id)} />
        )}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.foreground }]}>Lifestyle Coaching</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Personalized for your wellbeing
              </Text>
            </View>

            {/* Progress Card */}
            <View style={[styles.progressCard, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
                <Text style={styles.progressCount}>
                  {completedCount}/{totalCount}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` as any },
                  ]}
                />
              </View>
              <Text style={styles.progressSubtext}>
                {completedCount === totalCount
                  ? "🎉 All done! Excellent work today."
                  : `${totalCount - completedCount} recommendation${totalCount - completedCount !== 1 ? "s" : ""} remaining`}
              </Text>
            </View>

            {/* Personalized Note */}
            {todayMetrics.stressLevel > 55 && (
              <View
                style={[
                  styles.alertCard,
                  { backgroundColor: "#F5A62318", borderColor: "#F5A62340" },
                ]}
              >
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#F5A623" />
                <Text style={[styles.alertText, { color: colors.foreground }]}>
                  Your stress indicators are elevated today. Prioritize the breathing and mindfulness recommendations.
                </Text>
              </View>
            )}

            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Today&apos;s Recommendations
            </Text>
          </>
        }
        ListFooterComponent={
          <>
            {/* Breathing CTA */}
            <Pressable
              onPress={() => router.push("/breathing")}
              style={({ pressed }) => [
                styles.breathingCta,
                { backgroundColor: "#7ECBA122", borderColor: "#7ECBA140" },
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
            >
              <IconSymbol name="wind" size={22} color="#2E8A5C" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.breathingCtaTitle, { color: colors.foreground }]}>
                  Guided Breathing Session
                </Text>
                <Text style={[styles.breathingCtaSubtitle, { color: colors.muted }]}>
                  4 minutes · Reduces stress · Improves HRV
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.muted} />
            </Pressable>

            {/* Wellness Tips */}
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Wellness Insights
            </Text>
            {WELLNESS_TIPS.map((tip, i) => (
              <View
                key={i}
                style={[
                  styles.tipCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={[styles.tipIconBg, { backgroundColor: tip.color + "22" }]}>
                  <IconSymbol name={tip.icon} size={18} color={tip.color} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.tipTitle, { color: colors.foreground }]}>{tip.title}</Text>
                  <Text style={[styles.tipText, { color: colors.muted }]}>{tip.tip}</Text>
                </View>
              </View>
            ))}
          </>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  header: {
    paddingTop: 4,
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "600",
  },
  progressCount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  progressSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
  },
  coachingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  coachingIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  coachingContent: {
    flex: 1,
    gap: 4,
  },
  coachingTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  coachingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  breathingCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  breathingCtaTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  breathingCtaSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
