# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start --ios      # Run on iOS simulator
npx expo start --android  # Run on Android emulator
npx expo start --web      # Run in browser
npm run lint              # ESLint (flat config)
```

## Architecture

**Gringoapp** is a React Native music player built with Expo SDK 54, React 19, and expo-router for file-based routing.

### Audio Player System
All playback state lives in `components/track-container.tsx`:
- Uses `expo-av` Audio.Sound for playback (singleton pattern — one sound at a time)
- Tracks are hardcoded in `app/index.tsx` and passed as props
- Expand/collapse animation: container starts at 1/3 screen height, expands to 2/3 on interaction, auto-collapses after 4s idle timeout
- `components/controls-panel.tsx` provides play/pause, next, shuffle buttons
- `components/scroll-indicator.tsx` is a custom animated scrollbar with eased interpolation and smooth transitions during expand/collapse

### Component Hierarchy
```
HomeScreen (app/index.tsx)
├── AnimatedTitle — alternates "GRINGO"/"DAN-AMP" with random ASCII symbol transitions
└── TrackContainer — owns audio state, expand/collapse animation
    ├── ControlsPanel — play/pause, next, shuffle
    ├── ScrollView containing TrackRow[]
    └── ScrollIndicator — Dieter Rams-style outlined rectangle slider
```

### Theming & Fonts
- Dark theme only (forced in `hooks/use-theme-color.ts`)
- All text uses **DotGothic16** dot-matrix font (loaded in `app/_layout.tsx`)
- Theme colors in `constants/theme.ts`, accessed via `useThemeColor` hook
- `ThemedText` and `ThemedView` are the base styled components
- Background: hunter green LinearGradient (`#355e3b` → `#1a2f1e`)

### Key Patterns
- Path alias: `@/*` maps to project root
- `useCallback` + `useRef` for stable animation handlers (prevents ScrollView position resets)
- Row y-offsets measured via `onLayout` for auto-scroll-to-track on selection
- ScrollIndicator uses eased interpolation and a `collapsedHeight` floor for consistent sensitivity across states
- Platform-specific files: `icon-symbol.ios.tsx` (SF Symbols) vs `icon-symbol.tsx` (MaterialIcons)
