import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";

type Pattern = {
  key: string;
  name: string;
  description: string;
  phases: { label: string; duration: number; color: string }[];
  totalCycles: number;
};

const PATTERNS: Pattern[] = [
  {
    key: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale 4s · Hold 7s · Exhale 8s. Activates the parasympathetic nervous system.",
    phases: [
      { label: "Inhale", duration: 4, color: "#5B8DEF" },
      { label: "Hold", duration: 7, color: "#A8C5F5" },
      { label: "Exhale", duration: 8, color: "#7ECBA1" },
    ],
    totalCycles: 4,
  },
  {
    key: "box",
    name: "Box Breathing",
    description: "Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Used by Navy SEALs for focus.",
    phases: [
      { label: "Inhale", duration: 4, color: "#5B8DEF" },
      { label: "Hold", duration: 4, color: "#A8C5F5" },
      { label: "Exhale", duration: 4, color: "#7ECBA1" },
      { label: "Hold", duration: 4, color: "#A8C5F5" },
    ],
    totalCycles: 4,
  },
  {
    key: "calm",
    name: "Calm Breathing",
    description: "Inhale 5s · Exhale 5s. Simple and effective for everyday stress relief.",
    phases: [
      { label: "Inhale", duration: 5, color: "#5B8DEF" },
      { label: "Exhale", duration: 5, color: "#7ECBA1" },
    ],
    totalCycles: 5,
  },
];

export default function BreathingScreen() {
  const colors = useColors();
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useKeepAwake();

  const currentPhase = selectedPattern.phases[phaseIndex];

  const runPhaseAnimation = (phase: Pattern["phases"][0]) => {
    if (animRef.current) animRef.current.stop();
    const isInhale = phase.label === "Inhale";
    const isHold = phase.label === "Hold";
    const targetScale = isInhale ? 1.0 : isHold ? 1.0 : 0.6;
    const targetOpacity = isInhale ? 1.0 : isHold ? 1.0 : 0.4;

    animRef.current = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: phase.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: targetOpacity,
        duration: phase.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);
    animRef.current.start();
  };

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) animRef.current.stop();
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0.4);
      return;
    }

    setPhaseIndex(0);
    setSecondsLeft(selectedPattern.phases[0].duration);
    runPhaseAnimation(selectedPattern.phases[0]);

    let currentPhaseIdx = 0;
    let currentCycle = 0;
    let secondsRemaining = selectedPattern.phases[0].duration;

    intervalRef.current = setInterval(() => {
      secondsRemaining -= 1;
      setSecondsLeft(secondsRemaining);

      if (secondsRemaining <= 0) {
        currentPhaseIdx += 1;
        if (currentPhaseIdx >= selectedPattern.phases.length) {
          currentPhaseIdx = 0;
          currentCycle += 1;
          setCycleCount(currentCycle);

          if (currentCycle >= selectedPattern.totalCycles) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            setCompleted(true);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            return;
          }
        }
        setPhaseIndex(currentPhaseIdx);
        secondsRemaining = selectedPattern.phases[currentPhaseIdx].duration;
        setSecondsLeft(secondsRemaining);
        runPhaseAnimation(selectedPattern.phases[currentPhaseIdx]);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCompleted(false);
    setCycleCount(0);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setCycleCount(0);
    setPhaseIndex(0);
  };

  if (completed) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🌿</Text>
          <Text style={[styles.completedTitle, { color: colors.foreground }]}>
            Session Complete
          </Text>
          <Text style={[styles.completedSubtitle, { color: colors.muted }]}>
            You completed {selectedPattern.totalCycles} cycles of {selectedPattern.name}.
            {"\n"}Take a moment to notice how you feel.
          </Text>
          <Pressable
            onPress={() => {
              setCompleted(false);
              router.back();
            }}
            style={({ pressed }) => [
              styles.doneButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setCompleted(false);
              handleStart();
            }}
            style={({ pressed }) => [
              styles.againButton,
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.againButtonText, { color: colors.foreground }]}>
              Go Again
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              handleStop();
              router.back();
            }}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.6 },
            ]}
          >
            <IconSymbol name="xmark" size={16} color={colors.muted} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Breathing Exercise
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Pattern Selector */}
        {!isActive && (
          <View style={styles.patternSelector}>
            {PATTERNS.map((pattern) => (
              <Pressable
                key={pattern.key}
                onPress={() => setSelectedPattern(pattern)}
                style={({ pressed }) => [
                  styles.patternChip,
                  {
                    backgroundColor:
                      selectedPattern.key === pattern.key
                        ? colors.primary
                        : colors.surface,
                    borderColor:
                      selectedPattern.key === pattern.key
                        ? colors.primary
                        : colors.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.patternChipText,
                    {
                      color:
                        selectedPattern.key === pattern.key ? "#fff" : colors.muted,
                    },
                  ]}
                >
                  {pattern.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Breathing Circle */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.outerRing,
              {
                borderColor: isActive ? currentPhase.color + "40" : colors.border,
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.innerCircle,
              {
                backgroundColor: isActive ? currentPhase.color : colors.primary,
                transform: [{ scale: scaleAnim }],
                opacity: Animated.add(opacityAnim, new Animated.Value(0.2)),
              },
            ]}
          />
          <View style={styles.circleContent}>
            {isActive ? (
              <>
                <Text style={styles.phaseLabel}>{currentPhase.label}</Text>
                <Text style={styles.phaseSeconds}>{secondsLeft}</Text>
                <Text style={styles.cycleCount}>
                  {cycleCount + 1}/{selectedPattern.totalCycles}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.readyLabel, { color: "#fff" }]}>Ready</Text>
                <Text style={[styles.readySubLabel, { color: "rgba(255,255,255,0.7)" }]}>
                  Tap to begin
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Description */}
        {!isActive && (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.patternName, { color: colors.foreground }]}>
              {selectedPattern.name}
            </Text>
            <Text style={[styles.patternDescription, { color: colors.muted }]}>
              {selectedPattern.description}
            </Text>
            <Text style={[styles.patternDuration, { color: colors.muted }]}>
              {selectedPattern.totalCycles} cycles ·{" "}
              {Math.round(
                (selectedPattern.phases.reduce((s, p) => s + p.duration, 0) *
                  selectedPattern.totalCycles) /
                  60
              )}{" "}
              min
            </Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {isActive ? (
            <Pressable
              onPress={handleStop}
              style={({ pressed }) => [
                styles.stopButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.stopButtonText, { color: colors.foreground }]}>Stop</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text style={styles.startButtonText}>Begin Session</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  patternSelector: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  patternChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  patternChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  circleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
  },
  innerCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  circleContent: {
    alignItems: "center",
    gap: 4,
  },
  phaseLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  phaseSeconds: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 56,
  },
  cycleCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  readyLabel: {
    fontSize: 22,
    fontWeight: "700",
  },
  readySubLabel: {
    fontSize: 14,
  },
  descriptionContainer: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
  },
  patternName: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  patternDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  patternDuration: {
    fontSize: 13,
    fontWeight: "500",
  },
  controls: {
    paddingBottom: 16,
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  stopButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  stopButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  completedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  completedEmoji: {
    fontSize: 72,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  completedSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  doneButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  againButton: {
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1.5,
  },
  againButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
