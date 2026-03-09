import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeContext } from "@/lib/theme-provider";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const GOALS = [
  { key: "balance" as const, label: "Overall Balance", emoji: "⚖️" },
  { key: "sleep" as const, label: "Better Sleep", emoji: "🌙" },
  { key: "stress" as const, label: "Reduce Stress", emoji: "🧘" },
  { key: "fitness" as const, label: "Stay Active", emoji: "🏃" },
  { key: "mindfulness" as const, label: "Mindfulness", emoji: "🌿" },
];

function SettingsRow({
  icon,
  iconColor,
  label,
  value,
  onPress,
  rightElement,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsRow,
        { borderBottomColor: colors.border },
        pressed && onPress ? { backgroundColor: colors.border + "40" } : {},
      ]}
    >
      <View style={[styles.settingsIconBg, { backgroundColor: iconColor + "22" }]}>
        <IconSymbol name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.settingsLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.settingsRight}>
        {value && <Text style={[styles.settingsValue, { color: colors.muted }]}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && (
          <IconSymbol name="chevron.right" size={16} color={colors.muted} />
        )}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { profile, updateProfile, clearChatHistory } = useHealth();
  const { colorScheme: themeScheme, setColorScheme } = useThemeContext();
  const toggleColorScheme = () => setColorScheme(themeScheme === "dark" ? "light" : "dark");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hydrationReminders, setHydrationReminders] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      await updateProfile({ name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will remove your chat history, mood logs, and coaching progress. Your profile will be kept. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await clearChatHistory();
            await AsyncStorage.multiRemove(["hc_mood_log"]);
            Alert.alert("Done", "Your health data has been cleared.");
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will take you back to the onboarding flow.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            await updateProfile({ onboardingComplete: false });
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  const goalLabel = GOALS.find((g) => g.key === profile.goal)?.label ?? "Balance";
  const goalEmoji = GOALS.find((g) => g.key === profile.goal)?.emoji ?? "⚖️";

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {profile.name ? profile.name[0].toUpperCase() : "V"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <TextInput
                style={[styles.nameInput, { color: "#fff", borderBottomColor: "rgba(255,255,255,0.5)" }]}
                value={nameInput}
                onChangeText={setNameInput}
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
                autoFocus
                returnKeyType="done"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            ) : (
              <Text style={styles.profileName}>{profile.name || "Your Name"}</Text>
            )}
            <Text style={styles.profileGoal}>
              {goalEmoji} {goalLabel}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setNameInput(profile.name);
              setEditingName(true);
            }}
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="pencil" size={16} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        {/* Profile Section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>PROFILE</Text>
          <SettingsRow
            icon="person.fill"
            iconColor="#5B8DEF"
            label="Age"
            value={profile.age ? `${profile.age} years` : "Not set"}
          />
          <SettingsRow
            icon="star.fill"
            iconColor="#F5A623"
            label="Health Goal"
            value={`${goalEmoji} ${goalLabel}`}
          />
        </View>

        {/* Goal Selection */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>CHANGE GOAL</Text>
          <View style={styles.goalGrid}>
            {GOALS.map((g) => (
              <Pressable
                key={g.key}
                onPress={() => updateProfile({ goal: g.key })}
                style={({ pressed }) => [
                  styles.goalChip,
                  {
                    backgroundColor: profile.goal === g.key ? colors.primary : colors.background,
                    borderColor: profile.goal === g.key ? colors.primary : colors.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.goalEmoji}>{g.emoji}</Text>
                <Text
                  style={[
                    styles.goalLabel,
                    { color: profile.goal === g.key ? "#fff" : colors.foreground },
                  ]}
                >
                  {g.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>NOTIFICATIONS</Text>
          <SettingsRow
            icon="bell.fill"
            iconColor="#5B8DEF"
            label="All Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingsRow
            icon="drop.fill"
            iconColor="#34C97B"
            label="Hydration Reminders"
            rightElement={
              <Switch
                value={hydrationReminders}
                onValueChange={setHydrationReminders}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingsRow
            icon="figure.walk"
            iconColor="#F5A623"
            label="Activity Reminders"
            rightElement={
              <Switch
                value={activityReminders}
                onValueChange={setActivityReminders}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>APPEARANCE</Text>
          <SettingsRow
            icon={themeScheme === "dark" ? "moon.fill" : "sun.max.fill"}
            iconColor="#A8C5F5"
            label={themeScheme === "dark" ? "Dark Mode" : "Light Mode"}
            rightElement={
              <Switch
                value={themeScheme === "dark"}
                onValueChange={toggleColorScheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* Data & Privacy */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>DATA & PRIVACY</Text>
          <SettingsRow
            icon="shield.fill"
            iconColor="#34C97B"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <SettingsRow
            icon="trash.fill"
            iconColor="#E8445A"
            label="Clear Health Data"
            onPress={handleClearData}
          />
          <SettingsRow
            icon="arrow.left"
            iconColor="#F5A623"
            label="Reset Onboarding"
            onPress={handleResetOnboarding}
          />
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>ABOUT</Text>
          <SettingsRow
            icon="info.circle.fill"
            iconColor="#5B8DEF"
            label="Version"
            value="1.0.0 Beta"
          />
          <SettingsRow
            icon="waveform.path.ecg"
            iconColor="#5B8DEF"
            label="Vitara Health Companion"
            value="Your everyday AI health companion"
          />
        </View>

        <Text style={[styles.disclaimer, { color: colors.muted }]}>
          Vitara is a wellness companion and does not provide medical advice. Always consult a healthcare professional for medical concerns.
        </Text>
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
    paddingTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  profileGoal: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "700",
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  settingsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingsValue: {
    fontSize: 14,
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    paddingTop: 8,
  },
  goalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6,
  },
  goalEmoji: {
    fontSize: 14,
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
