import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
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

const MOOD_LABELS: Record<number, string> = {
  1: "Rough",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const MOOD_EMOJIS: Record<number, string> = {
  1: "😔",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getAIInsight(metrics: ReturnType<typeof useHealth>["todayMetrics"], name: string) {
  const { sleepScore, recoveryScore, stressLevel, steps } = metrics;
  if (sleepScore < 60) {
    return `Your sleep quality was lower than usual last night, ${name || "there"}. A short rest or light activity may help restore your energy today.`;
  }
  if (stressLevel > 60) {
    return `Your stress indicators are elevated today. A brief breathing exercise or short walk can help bring balance back.`;
  }
  if (recoveryScore > 80) {
    return `Your recovery looks excellent today${name ? `, ${name}` : ""}. This is a great time for moderate activity or tackling something meaningful.`;
  }
  if (steps < 4000) {
    return `You've taken ${steps.toLocaleString()} steps so far. Even a 10-minute walk can make a meaningful difference to your wellbeing.`;
  }
  return `Your body is in good balance today${name ? `, ${name}` : ""}. Keep up your healthy routines and stay hydrated.`;
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  color,
  score,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  score?: number;
}) {
  const colors = useColors();
  return (
    <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.metricIconBg, { backgroundColor: color + "22" }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>
        {value}
        {unit && <Text style={[styles.metricUnit, { color: colors.muted }]}> {unit}</Text>}
      </Text>
      {score !== undefined && (
        <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: `${score}%` as any,
                backgroundColor: score > 70 ? "#34C97B" : score > 40 ? "#F5A623" : "#E8445A",
              },
            ]}
          />
        </View>
      )}
      <Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  label: string;
  color: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + "22" }]}>
        <IconSymbol name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { profile, todayMetrics, todayMood, isLoading } = useHealth();

  // Redirect to onboarding if not complete
  useEffect(() => {
    if (!isLoading && !profile.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isLoading, profile.onboardingComplete]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.muted }]}>Loading your health data…</Text>
        </View>
      </ScreenContainer>
    );
  }

  const greeting = getGreeting();
  const insight = getAIInsight(todayMetrics, profile.name);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>{greeting}</Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {profile.name || "Welcome"}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/settings")}
            style={({ pressed }) => [
              styles.avatarButton,
              { backgroundColor: colors.primary + "22" },
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="person.crop.circle.fill" size={28} color={colors.primary} />
          </Pressable>
        </View>

        {/* AI Insight Card */}
        <Pressable
          onPress={() => router.push("/(tabs)/chat")}
          style={({ pressed }) => [
            styles.insightCard,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.insightHeader}>
            <View style={styles.insightAvatarDot} />
            <Text style={styles.insightLabel}>Vitara · AI Companion</Text>
          </View>
          <Text style={styles.insightText}>{insight}</Text>
          <View style={styles.insightFooter}>
            <Text style={styles.insightCta}>Chat now →</Text>
          </View>
        </Pressable>

        {/* Metrics Grid */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Today's Snapshot</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="bed.double.fill"
            label="Sleep Score"
            value={todayMetrics.sleepScore}
            color="#5B8DEF"
            score={todayMetrics.sleepScore}
          />
          <MetricCard
            icon="bolt.fill"
            label="Recovery"
            value={todayMetrics.recoveryScore}
            color="#34C97B"
            score={todayMetrics.recoveryScore}
          />
          <MetricCard
            icon="brain.head.profile"
            label="Stress"
            value={todayMetrics.stressLevel}
            color="#F5A623"
            score={100 - todayMetrics.stressLevel}
          />
          <MetricCard
            icon="figure.walk"
            label="Steps"
            value={todayMetrics.steps.toLocaleString()}
            color="#A8C5F5"
          />
        </View>

        {/* Vitals Row */}
        <View style={styles.vitalsRow}>
          <View style={[styles.vitalChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="heart.fill" size={14} color="#E8445A" />
            <Text style={[styles.vitalText, { color: colors.foreground }]}>
              {todayMetrics.heartRate} <Text style={{ color: colors.muted }}>bpm</Text>
            </Text>
          </View>
          <View style={[styles.vitalChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="waveform.path.ecg" size={14} color="#5B8DEF" />
            <Text style={[styles.vitalText, { color: colors.foreground }]}>
              HRV {todayMetrics.hrv} <Text style={{ color: colors.muted }}>ms</Text>
            </Text>
          </View>
          <View style={[styles.vitalChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="drop.fill" size={14} color="#34C97B" />
            <Text style={[styles.vitalText, { color: colors.foreground }]}>
              SpO₂ {todayMetrics.bloodOxygen}<Text style={{ color: colors.muted }}>%</Text>
            </Text>
          </View>
        </View>

        {/* Mood */}
        <View style={styles.moodRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Today's Mood</Text>
          {todayMood ? (
            <View style={[styles.moodBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.moodEmoji}>{MOOD_EMOJIS[todayMood.mood]}</Text>
              <Text style={[styles.moodBadgeLabel, { color: colors.foreground }]}>
                {MOOD_LABELS[todayMood.mood]}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push("/mood-tracker")}
              style={({ pressed }) => [
                styles.logMoodButton,
                { backgroundColor: colors.primary + "18", borderColor: colors.primary + "44" },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.logMoodText, { color: colors.primary }]}>+ Log mood</Text>
            </Pressable>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon="bubble.left.and.bubble.right.fill"
            label="Chat with AI"
            color="#5B8DEF"
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/chat");
            }}
          />
          <QuickAction
            icon="wind"
            label="Breathe"
            color="#A8C5F5"
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/breathing");
            }}
          />
          <QuickAction
            icon="heart.fill"
            label="Log Mood"
            color="#E8445A"
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/mood-tracker");
            }}
          />
          <QuickAction
            icon="chart.line.uptrend.xyaxis"
            label="Timeline"
            color="#34C97B"
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/timeline");
            }}
          />
        </View>

        {/* Sleep detail */}
        <View style={[styles.sleepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sleepCardHeader}>
            <IconSymbol name="moon.fill" size={18} color="#5B8DEF" />
            <Text style={[styles.sleepCardTitle, { color: colors.foreground }]}>Last Night's Sleep</Text>
          </View>
          <View style={styles.sleepStats}>
            <View style={styles.sleepStat}>
              <Text style={[styles.sleepStatValue, { color: colors.foreground }]}>
                {todayMetrics.sleepHours}h
              </Text>
              <Text style={[styles.sleepStatLabel, { color: colors.muted }]}>Duration</Text>
            </View>
            <View style={[styles.sleepDivider, { backgroundColor: colors.border }]} />
            <View style={styles.sleepStat}>
              <Text style={[styles.sleepStatValue, { color: colors.foreground }]}>
                {todayMetrics.sleepScore}
              </Text>
              <Text style={[styles.sleepStatLabel, { color: colors.muted }]}>Score</Text>
            </View>
            <View style={[styles.sleepDivider, { backgroundColor: colors.border }]} />
            <View style={styles.sleepStat}>
              <Text
                style={[
                  styles.sleepStatValue,
                  {
                    color:
                      todayMetrics.sleepScore > 70
                        ? "#34C97B"
                        : todayMetrics.sleepScore > 50
                        ? "#F5A623"
                        : "#E8445A",
                  },
                ]}
              >
                {todayMetrics.sleepScore > 70 ? "Good" : todayMetrics.sleepScore > 50 ? "Fair" : "Poor"}
              </Text>
              <Text style={[styles.sleepStatLabel, { color: colors.muted }]}>Quality</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "500",
  },
  userName: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  insightCard: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightAvatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  insightLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  insightText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  insightFooter: {
    alignItems: "flex-end",
  },
  insightCta: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: -8,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  metricUnit: {
    fontSize: 13,
    fontWeight: "400",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  scoreBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  vitalChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  vitalText: {
    fontSize: 13,
    fontWeight: "600",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodBadgeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  logMoodButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  logMoodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  sleepCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  sleepCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sleepCardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  sleepStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  sleepStat: {
    alignItems: "center",
    gap: 4,
  },
  sleepStatValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  sleepStatLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  sleepDivider: {
    width: 1,
    height: 40,
  },
});
