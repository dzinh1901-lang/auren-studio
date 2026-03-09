# AI Health Companion — Mobile App Design

## Brand Identity

**App Name:** Vitara  
**Tagline:** Your everyday AI health companion.  
**Personality:** Calm, supportive, non-judgmental, trustworthy

### Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `primary` | `#5B8DEF` | `#5B8DEF` | Accent, CTAs, active states |
| `background` | `#F7F9FC` | `#0F1117` | Screen backgrounds |
| `surface` | `#FFFFFF` | `#1A1D27` | Cards, modals |
| `foreground` | `#1A1D27` | `#EEF0F5` | Primary text |
| `muted` | `#7A849A` | `#8A95AB` | Secondary text |
| `border` | `#E4E9F2` | `#2A2F40` | Dividers, card borders |
| `success` | `#34C97B` | `#34C97B` | Positive metrics |
| `warning` | `#F5A623` | `#F5A623` | Caution states |
| `error` | `#E8445A` | `#E8445A` | Alerts |
| `calm` | `#A8C5F5` | `#3A5FA0` | Breathing/mindfulness accents |
| `recovery` | `#7ECBA1` | `#2E8A5C` | Recovery/sleep accents |
| `stress` | `#F5A623` | `#C47D10` | Stress level accents |

---

## Screen List

1. **Onboarding** — Welcome, value proposition, permission requests
2. **Home Dashboard** — Daily health snapshot with key metrics
3. **AI Chat** — Conversational AI companion interface
4. **Mood Tracker** — Daily mood logging and history
5. **Health Timeline** — Historical trends for sleep, stress, activity
6. **Lifestyle Coaching** — Personalized recommendations and reminders
7. **Breathing Exercise** — Guided breathing/mindfulness session
8. **Settings** — Profile, data preferences, notifications, theme

---

## Primary Content and Functionality

### 1. Onboarding (3 slides + setup)
- Slide 1: Hero illustration + tagline "Your everyday AI health companion"
- Slide 2: Feature highlights (dashboard, AI chat, insights)
- Slide 3: Privacy promise (local-first, encrypted)
- Setup screen: Name input, age, primary health goal selection

### 2. Home Dashboard
- Greeting header with time-of-day context ("Good morning, Alex")
- AI Companion card with quick status ("You're recovering well today")
- Metric row: Sleep Score, Recovery, Stress, Steps
- Today's insight card (AI-generated daily tip)
- Quick action buttons: Log Mood, Start Breathing, Chat with AI
- Upcoming reminders strip

### 3. AI Chat
- Chat bubbles (user right, AI left with soft avatar)
- Typing indicator animation
- Suggested quick replies (chips)
- Context-aware responses using stored health data
- Voice input button (microphone icon)
- Health data summary injected into AI context

### 4. Mood Tracker
- Emoji-based mood selector (5 levels: great → rough)
- Optional text note
- Today's mood card
- 7-day mood history chart (bar/emoji)
- Mood patterns summary

### 5. Health Timeline
- Tabbed view: Sleep | Activity | Stress | Mood
- Line charts for 7-day and 30-day trends
- Simulated/mock biometric data (since real wearable integration requires device)
- Export summary button

### 6. Lifestyle Coaching
- Personalized recommendation cards (walking, hydration, sleep hygiene)
- Daily challenge tracker
- Completed vs. pending coaching items
- Adaptive suggestions based on mood and simulated metrics

### 7. Breathing Exercise
- Animated breathing circle (expand/contract)
- 4-7-8 and box breathing patterns
- Session timer
- Completion celebration

### 8. Settings
- User profile (name, age, health goals)
- Notification preferences
- Dark/light mode toggle
- Data management (clear history)
- About / Privacy policy

---

## Key User Flows

### Flow 1: Morning Check-in
Home → AI Chat → "How are you feeling?" → User responds → AI gives insight → Mood logged

### Flow 2: Stress Relief
Home → "Start Breathing" quick action → Breathing Exercise screen → 4-minute session → Return to Home

### Flow 3: Review Health Trends
Home → Health Timeline tab → Select "Sleep" → View 7-day chart → AI insight on pattern

### Flow 4: Lifestyle Coaching
Lifestyle tab → View today's recommendations → Mark walking reminder complete → See streak

---

## Navigation Structure

```
Tab Bar (5 tabs):
├── Home (house.fill)
├── Chat (bubble.left.and.bubble.right.fill)
├── Timeline (chart.line.uptrend.xyaxis)
├── Coaching (heart.text.square.fill)
└── Settings (gearshape.fill)
```

Modal screens (presented over tabs):
- Mood Tracker (from Home quick action)
- Breathing Exercise (from Home quick action)
- Onboarding (first launch only)

---

## Visual Design Principles

- **Rounded corners:** 16–24px radius on cards, 12px on buttons
- **Spacing:** 16px base unit, 24px section gaps
- **Typography:** System font (SF Pro / Roboto), bold headers, regular body
- **Shadows:** Subtle (elevation 2–4), no harsh drop shadows
- **Animations:** Gentle fade-ins (250ms), breathing circle uses Reanimated
- **Icons:** SF Symbols (iOS) / Material Icons (Android) via IconSymbol
- **Charts:** SVG-based using react-native-svg
