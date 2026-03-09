import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Svg, { Polyline, Line, Text as SvgText, Circle } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 160;
const CHART_PADDING = { top: 16, right: 16, bottom: 32, left: 40 };

type Tab = "sleep" | "activity" | "stress" | "mood";

const TABS: { key: Tab; label: string; icon: React.ComponentProps<typeof IconSymbol>["name"]; color: string }[] = [
  { key: "sleep", label: "Sleep", icon: "moon.fill", color: "#5B8DEF" },
  { key: "activity", label: "Activity", icon: "figure.walk", color: "#34C97B" },
  { key: "stress", label: "Stress", icon: "brain.head.profile", color: "#F5A623" },
  { key: "mood", label: "Mood", icon: "heart.fill", color: "#E8445A" },
];

function MiniLineChart({
  data,
  color,
  minVal,
  maxVal,
  labels,
}: {
  data: number[];
  color: string;
  minVal: number;
  maxVal: number;
  labels: string[];
}) {
  const colors = useColors();
  const plotW = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const plotH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const range = maxVal - minVal || 1;

  const points = data.map((v, i) => {
    const x = CHART_PADDING.left + (i / (data.length - 1)) * plotW;
    const y = CHART_PADDING.top + plotH - ((v - minVal) / range) * plotH;
    return { x, y, v };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Y axis ticks
  const yTicks = [minVal, Math.round((minVal + maxVal) / 2), maxVal];

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Y axis */}
      {yTicks.map((tick, i) => {
        const y = CHART_PADDING.top + plotH - ((tick - minVal) / range) * plotH;
        return (
          <React.Fragment key={i}>
            <Line
              x1={CHART_PADDING.left}
              y1={y}
              x2={CHART_PADDING.left + plotW}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <SvgText
              x={CHART_PADDING.left - 6}
              y={y + 4}
              fontSize="10"
              fill={colors.muted}
              textAnchor="end"
            >
              {tick}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* Line */}
      <Polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
      ))}

      {/* X axis labels */}
      {labels.map((label, i) => {
        if (i % 2 !== 0 && i !== labels.length - 1) return null;
        const x = CHART_PADDING.left + (i / (data.length - 1)) * plotW;
        return (
          <SvgText
            key={i}
            x={x}
            y={CHART_HEIGHT - 4}
            fontSize="10"
            fill={colors.muted}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function StatRow({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  const colors = useColors();
  return (
    <View style={styles.statRow}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
        {unit && <Text style={{ color: colors.muted }}> {unit}</Text>}
      </Text>
    </View>
  );
}

export default function TimelineScreen() {
  const colors = useColors();
  const { history, moodLog } = useHealth();
  const [activeTab, setActiveTab] = useState<Tab>("sleep");
  const [range, setRange] = useState<7 | 30>(7);

  const recent = history.slice(-range);
  const dayLabels = recent.map((d) => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const getChartData = () => {
    switch (activeTab) {
      case "sleep":
        return {
          data: recent.map((d) => d.metrics.sleepScore),
          min: 0,
          max: 100,
          avg: Math.round(recent.reduce((s, d) => s + d.metrics.sleepScore, 0) / recent.length),
          label: "Sleep Score",
          unit: "",
          color: "#5B8DEF",
          extra: [
            { label: "Avg Sleep", value: (recent.reduce((s, d) => s + d.metrics.sleepHours, 0) / recent.length).toFixed(1), unit: "h", color: "#5B8DEF" },
            { label: "Best Score", value: Math.max(...recent.map((d) => d.metrics.sleepScore)), unit: "", color: "#34C97B" },
            { label: "Worst Score", value: Math.min(...recent.map((d) => d.metrics.sleepScore)), unit: "", color: "#E8445A" },
          ],
        };
      case "activity":
        return {
          data: recent.map((d) => d.metrics.steps),
          min: 0,
          max: 15000,
          avg: Math.round(recent.reduce((s, d) => s + d.metrics.steps, 0) / recent.length),
          label: "Daily Steps",
          unit: "steps",
          color: "#34C97B",
          extra: [
            { label: "Avg Steps", value: Math.round(recent.reduce((s, d) => s + d.metrics.steps, 0) / recent.length).toLocaleString(), unit: "", color: "#34C97B" },
            { label: "Best Day", value: Math.max(...recent.map((d) => d.metrics.steps)).toLocaleString(), unit: "", color: "#5B8DEF" },
            { label: "Avg Recovery", value: Math.round(recent.reduce((s, d) => s + d.metrics.recoveryScore, 0) / recent.length), unit: "/100", color: "#A8C5F5" },
          ],
        };
      case "stress":
        return {
          data: recent.map((d) => d.metrics.stressLevel),
          min: 0,
          max: 100,
          avg: Math.round(recent.reduce((s, d) => s + d.metrics.stressLevel, 0) / recent.length),
          label: "Stress Level",
          unit: "",
          color: "#F5A623",
          extra: [
            { label: "Avg Stress", value: Math.round(recent.reduce((s, d) => s + d.metrics.stressLevel, 0) / recent.length), unit: "/100", color: "#F5A623" },
            { label: "Avg HRV", value: Math.round(recent.reduce((s, d) => s + d.metrics.hrv, 0) / recent.length), unit: "ms", color: "#5B8DEF" },
            { label: "Avg Heart Rate", value: Math.round(recent.reduce((s, d) => s + d.metrics.heartRate, 0) / recent.length), unit: "bpm", color: "#E8445A" },
          ],
        };
      case "mood": {
        const moodData = recent.map((d) => {
          const entry = moodLog.find((m) => m.date === d.date);
          return entry ? entry.mood : 3;
        });
        return {
          data: moodData,
          min: 1,
          max: 5,
          avg: Math.round((moodData.reduce((s, v) => s + v, 0) / moodData.length) * 10) / 10,
          label: "Mood (1–5)",
          unit: "",
          color: "#E8445A",
          extra: [
            { label: "Avg Mood", value: (moodData.reduce((s, v) => s + v, 0) / moodData.length).toFixed(1), unit: "/5", color: "#E8445A" },
            { label: "Best Mood", value: Math.max(...moodData), unit: "/5", color: "#34C97B" },
            { label: "Entries Logged", value: moodLog.filter((m) => recent.some((d) => d.date === m.date)).length, unit: "", color: "#A8C5F5" },
          ],
        };
      }
    }
  };

  const chartData = getChartData();
  const activeTabInfo = TABS.find((t) => t.key === activeTab)!;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Health Timeline</Text>
          <View style={styles.rangeToggle}>
            {([7, 30] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() => setRange(r)}
                style={[
                  styles.rangeButton,
                  {
                    backgroundColor: range === r ? colors.primary : colors.surface,
                    borderColor: range === r ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rangeButtonText,
                    { color: range === r ? "#fff" : colors.muted },
                  ]}
                >
                  {r}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === tab.key ? tab.color + "18" : "transparent",
                  borderColor: activeTab === tab.key ? tab.color : "transparent",
                },
              ]}
            >
              <IconSymbol
                name={tab.icon}
                size={16}
                color={activeTab === tab.key ? tab.color : colors.muted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab.key ? tab.color : colors.muted },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleRow}>
              <IconSymbol name={activeTabInfo.icon} size={18} color={activeTabInfo.color} />
              <Text style={[styles.chartTitle, { color: colors.foreground }]}>
                {chartData.label}
              </Text>
            </View>
            <View style={[styles.avgBadge, { backgroundColor: activeTabInfo.color + "22" }]}>
              <Text style={[styles.avgText, { color: activeTabInfo.color }]}>
                Avg: {chartData.avg}
              </Text>
            </View>
          </View>
          <MiniLineChart
            data={chartData.data}
            color={chartData.color}
            minVal={chartData.min}
            maxVal={chartData.max}
            labels={dayLabels}
          />
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statsTitle, { color: colors.foreground }]}>
            {range}-Day Summary
          </Text>
          {chartData.extra.map((stat, i) => (
            <StatRow key={i} label={stat.label} value={stat.value} unit={stat.unit} color={stat.color} />
          ))}
        </View>

        {/* AI Insight for this metric */}
        <View style={[styles.insightCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <View style={styles.insightHeader}>
            <IconSymbol name="brain.head.profile" size={16} color={colors.primary} />
            <Text style={[styles.insightTitle, { color: colors.primary }]}>AI Pattern Insight</Text>
          </View>
          <Text style={[styles.insightText, { color: colors.foreground }]}>
            {activeTab === "sleep" &&
              (chartData.avg < 65
                ? "Your sleep scores have been below average this period. Consistent bedtimes and reduced screen exposure before sleep can help improve your scores."
                : "Your sleep patterns look healthy. Maintaining consistent sleep and wake times will help sustain these scores.")}
            {activeTab === "activity" &&
              (chartData.avg < 6000
                ? "Your step counts suggest lower activity levels this period. Even short walks throughout the day can meaningfully improve your recovery and mood."
                : "You're maintaining good activity levels. Keep up the momentum — consistency is more valuable than intensity.")}
            {activeTab === "stress" &&
              (chartData.avg > 55
                ? "Your stress indicators have been elevated. Regular breathing exercises, adequate sleep, and short movement breaks can help bring your levels down."
                : "Your stress levels appear well-managed. Continue your current routines and notice what helps you stay balanced.")}
            {activeTab === "mood" &&
              (chartData.avg < 3
                ? "Your mood has trended lower this period. Gentle activity, social connection, and adequate rest are among the most effective mood regulators."
                : "Your mood has been positive this period. Notice what activities and habits correlate with your better days.")}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  rangeToggle: {
    flexDirection: "row",
    gap: 6,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  rangeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 1,
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  avgBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  avgText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
