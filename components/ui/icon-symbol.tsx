// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Health Companion app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "bubble.left.and.bubble.right.fill": "chat",
  "chart.line.uptrend.xyaxis": "show-chart",
  "heart.text.square.fill": "favorite",
  "gearshape.fill": "settings",
  // Health metrics
  "heart.fill": "favorite",
  "bed.double.fill": "hotel",
  "figure.walk": "directions-walk",
  "lungs.fill": "air",
  "brain.head.profile": "psychology",
  "drop.fill": "water-drop",
  "flame.fill": "local-fire-department",
  // UI actions
  "paperplane.fill": "send",
  "mic.fill": "mic",
  "mic.slash.fill": "mic-off",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  // Wellness
  "wind": "air",
  "moon.fill": "nightlight",
  "sun.max.fill": "wb-sunny",
  "star.fill": "star",
  "bolt.fill": "bolt",
  "leaf.fill": "eco",
  "person.fill": "person",
  "person.crop.circle.fill": "account-circle",
  "bell.fill": "notifications",
  "bell.slash.fill": "notifications-off",
  "lock.fill": "lock",
  "shield.fill": "shield",
  "info.circle.fill": "info",
  "exclamationmark.triangle.fill": "warning",
  "calendar": "calendar-today",
  "clock.fill": "schedule",
  "waveform.path.ecg": "monitor-heart",
  "chart.bar.fill": "bar-chart",
  "list.bullet": "list",
  "square.and.arrow.up": "share",
  "trash.fill": "delete",
  "pencil": "edit",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
