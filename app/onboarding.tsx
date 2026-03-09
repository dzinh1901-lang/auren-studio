import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type HealthGoal = "balance" | "sleep" | "stress" | "fitness" | "mindfulness";

const SLIDES = [
  {
    icon: "waveform.path.ecg" as const,
    title: "Your Health,\nUnderstood",
    subtitle:
      "Vitara monitors your biometric patterns and translates them into simple, actionable insights you can act on every day.",
    color: "#5B8DEF",
  },
  {
    icon: "bubble.left.and.bubble.right.fill" as const,
    title: "A Companion\nThat Listens",
    subtitle:
      "Chat with your AI health companion anytime. Ask questions, share how you feel, and receive calm, supportive guidance.",
    color: "#34C97B",
  },
  {
    icon: "shield.fill" as const,
    title: "Private by\nDesign",
    subtitle:
      "Your health data stays on your device. Vitara is built with privacy-first principles — your data belongs to you.",
    color: "#A8C5F5",
  },
];

const GOALS: { key: HealthGoal; label: string; icon: string }[] = [
  { key: "balance", label: "Overall Balance", icon: "⚖️" },
  { key: "sleep", label: "Better Sleep", icon: "🌙" },
  { key: "stress", label: "Reduce Stress", icon: "🧘" },
  { key: "fitness", label: "Stay Active", icon: "🏃" },
  { key: "mindfulness", label: "Mindfulness", icon: "🌿" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const { updateProfile } = useHealth();
  const scrollRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSetup, setShowSetup] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal>("balance");

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (currentSlide < SLIDES.length - 1) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    } else {
      setShowSetup(true);
    }
  };

  const handleGetStarted = async () => {
    if (!name.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await updateProfile({
      name: name.trim(),
      age: parseInt(age) || 0,
      goal: selectedGoal,
      onboardingComplete: true,
    });
    router.replace("/(tabs)");
  };

  if (showSetup) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView
          contentContainerStyle={styles.setupContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.setupHeader}>
            <Text style={[styles.setupTitle, { color: colors.foreground }]}>
              Let's personalize{"\n"}your experience
            </Text>
            <Text style={[styles.setupSubtitle, { color: colors.muted }]}>
              This helps Vitara give you more relevant insights.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Your first name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. Alex"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Your age (optional)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. 32"
              placeholderTextColor={colors.muted}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Primary health goal</Text>
            <View style={styles.goalGrid}>
              {GOALS.map((g) => (
                <Pressable
                  key={g.key}
                  onPress={() => setSelectedGoal(g.key)}
                  style={[
                    styles.goalChip,
                    {
                      backgroundColor:
                        selectedGoal === g.key ? colors.primary : colors.surface,
                      borderColor:
                        selectedGoal === g.key ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.goalEmoji}>{g.icon}</Text>
                  <Text
                    style={[
                      styles.goalLabel,
                      {
                        color: selectedGoal === g.key ? "#fff" : colors.foreground,
                      },
                    ]}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: name.trim() ? colors.primary : colors.border },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.primaryButtonText}>Start My Journey</Text>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={[styles.iconCircle, { backgroundColor: slide.color + "22" }]}>
              <IconSymbol name={slide.icon} size={56} color={slide.color} />
            </View>
            <Text style={[styles.slideTitle, { color: colors.foreground }]}>
              {slide.title}
            </Text>
            <Text style={[styles.slideSubtitle, { color: colors.muted }]}>
              {slide.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === currentSlide ? colors.primary : colors.border,
                width: i === currentSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {currentSlide < SLIDES.length - 1 ? "Continue" : "Get Started"}
          </Text>
        </Pressable>
        {currentSlide < SLIDES.length - 1 && (
          <Pressable
            onPress={() => {
              setShowSetup(true);
            }}
            style={styles.skipButton}
          >
            <Text style={[styles.skipText, { color: colors.muted }]}>Skip</Text>
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 20,
  },
  slideSubtitle: {
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
  },
  // Setup screen
  setupContainer: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 60,
    gap: 28,
  },
  setupHeader: {
    gap: 8,
  },
  setupTitle: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  setupSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 17,
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  goalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  goalEmoji: {
    fontSize: 16,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
