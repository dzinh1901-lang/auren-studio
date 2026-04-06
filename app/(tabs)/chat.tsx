import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealth } from "@/lib/health-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import type { ChatMessage } from "@/lib/health-context";

const QUICK_REPLIES = [
  "How am I doing today?",
  "I feel tired",
  "Help me reduce stress",
  "Tips for better sleep",
  "What's my recovery like?",
];

function ChatBubble({ message }: { message: ChatMessage }) {
  const colors = useColors();
  const isUser = message.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View style={[styles.aiAvatar, { backgroundColor: colors.primary + "22" }]}>
          <Text style={styles.aiAvatarText}>V</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: colors.primary }]
            : [styles.bubbleAI, { backgroundColor: colors.surface, borderColor: colors.border }],
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#fff" : colors.foreground },
          ]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const { profile, todayMetrics, todayMood, chatHistory, addChatMessage, clearChatHistory } =
    useHealth();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatMutation = trpc.health.chat.useMutation();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatHistory.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory.length]);

  const buildHealthContext = () => {
    return `User profile: Name=${profile.name || "User"}, Age=${profile.age || "unknown"}, Goal=${profile.goal}.
Today's metrics: Sleep Score=${todayMetrics.sleepScore}/100, Recovery=${todayMetrics.recoveryScore}/100, Stress=${todayMetrics.stressLevel}/100, Steps=${todayMetrics.steps}, Heart Rate=${todayMetrics.heartRate}bpm, HRV=${todayMetrics.hrv}ms, Sleep=${todayMetrics.sleepHours}h, SpO2=${todayMetrics.bloodOxygen}%.
Today's mood: ${todayMood ? `${todayMood.mood}/5 (${["", "Rough", "Low", "Okay", "Good", "Great"][todayMood.mood]})${todayMood.note ? ` - Note: ${todayMood.note}` : ""}` : "Not logged yet"}.`;
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    await addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const conversationHistory = chatHistory.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      conversationHistory.push({ role: "user", content: trimmed });

        const response = await chatMutation.mutateAsync({
          messages: conversationHistory,
          healthContext: buildHealthContext(),
        });

        const aiMsg: ChatMessage = {
          id: `msg_${Date.now()}_ai`,
          role: "assistant",
          content: typeof response.reply === "string" ? response.reply : "I'm here to help. Could you tell me more?",
        timestamp: Date.now(),
      };
      await addChatMessage(aiMsg);
    } catch {
      const errMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      await addChatMessage(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const allMessages: ChatMessage[] =
    chatHistory.length === 0
      ? [
          {
            id: "welcome",
            role: "assistant",
            content: `Hi${profile.name ? `, ${profile.name}` : ""}! I'm Vitara, your personal health companion. I can help you understand your health data, offer lifestyle tips, or just listen. How are you feeling today?`,
            timestamp: Date.now(),
          },
        ]
      : chatHistory;

  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.headerAvatar, { backgroundColor: colors.primary + "22" }]}>
            <Text style={[styles.headerAvatarText, { color: colors.primary }]}>V</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Vitara</Text>
            <Text style={[styles.headerSubtitle, { color: colors.success }]}>● Active</Text>
          </View>
          <Pressable
            onPress={clearChatHistory}
            style={({ pressed }) => [
              styles.clearButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.6 },
            ]}
          >
            <IconSymbol name="trash.fill" size={16} color={colors.muted} />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primary + "22" }]}>
                  <Text style={styles.aiAvatarText}>V</Text>
                </View>
                <View
                  style={[
                    styles.bubble,
                    styles.bubbleAI,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.typingDots}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.typingText, { color: colors.muted }]}>
                      Vitara is thinking…
                    </Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Replies */}
        {chatHistory.length < 2 && (
          <View style={styles.quickRepliesContainer}>
            <FlatList
              data={QUICK_REPLIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.quickRepliesList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => sendMessage(item)}
                  style={({ pressed }) => [
                    styles.quickReplyChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.quickReplyText, { color: colors.primary }]}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Input */}
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            placeholder="Message Vitara…"
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor:
                  input.trim() && !isTyping ? colors.primary : colors.border,
              },
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
            ]}
          >
            <IconSymbol name="paperplane.fill" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  messageList: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
  },
  bubbleRowAI: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5B8DEF",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typingText: {
    fontSize: 13,
  },
  quickRepliesContainer: {
    paddingVertical: 8,
  },
  quickRepliesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
