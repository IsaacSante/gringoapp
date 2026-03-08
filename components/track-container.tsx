import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrackRow from '@/components/track-row';

const IDLE_TIMEOUT_MS = 4000;

type Track = {
  id: string;
  name: string;
  description: string;
  src: ReturnType<typeof require>;
};

type Props = {
  tracks: Track[];
};

export default function TrackContainer({ tracks }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false);
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);
  const animHeight = useRef(new Animated.Value(screenHeight / 3)).current;
  const scrollRef = useRef<ScrollView>(null);
  const rowOffsets = useRef<number[]>([]);

  const collapsedHeight = screenHeight / 3;
  const expandedHeight = (screenHeight * 2) / 3;

  // Stable scroll handler — created once so the native handler never reinstalls
  const onScrollHandler = useRef(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )
  ).current;

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => {
      soundRef.current?.unloadAsync();
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const collapse = useCallback(() => {
    expandedRef.current = false;
    setExpanded(false);
    Animated.timing(animHeight, {
      toValue: collapsedHeight,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [animHeight, collapsedHeight]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(collapse, IDLE_TIMEOUT_MS);
  }, [collapse]);

  const expand = useCallback(() => {
    if (!expandedRef.current) {
      expandedRef.current = true;
      setExpanded(true);
      Animated.timing(animHeight, {
        toValue: expandedHeight,
        duration: 320,
        useNativeDriver: false,
      }).start();
    }
    resetIdleTimer();
  }, [animHeight, expandedHeight, resetIdleTimer]);

  const handlePress = async (track: Track, index: number) => {
    expand();
    scrollRef.current?.scrollTo({ y: rowOffsets.current[index] ?? 0, animated: true });

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    if (playingId === track.id) {
      setPlayingId(null);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(track.src);
    soundRef.current = sound;
    setPlayingId(track.id);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setPlayingId(null);
    });
  };

  const thumbHeight = Math.max(
    20,
    (viewportHeight.current / Math.max(contentHeight.current, 1)) * viewportHeight.current
  );
  const maxThumbOffset = viewportHeight.current - thumbHeight;
  const maxScroll = Math.max(1, contentHeight.current - viewportHeight.current);

  return (
    <Animated.View style={[styles.container, { height: animHeight }]}>
      <Pressable
        onPress={expand}
        // @ts-ignore – onHoverIn is web-only
        onHoverIn={expand}
        style={styles.handle}
      >
        <View style={styles.pill} />
      </Pressable>

      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: collapsedHeight },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScrollHandler}
          onScrollBeginDrag={resetIdleTimer}
          onMomentumScrollEnd={resetIdleTimer}
          onLayout={(e: LayoutChangeEvent) => { viewportHeight.current = e.nativeEvent.layout.height; }}
          onContentSizeChange={(_w: number, h: number) => { contentHeight.current = h; }}
        >
          {tracks.map((track, i) => (
            <View
              key={track.id}
              onLayout={(e) => { rowOffsets.current[i] = e.nativeEvent.layout.y; }}
            >
              <TrackRow
                index={i + 1}
                name={track.name}
                description={track.description}
                isPlaying={playingId === track.id}
                onPress={() => handlePress(track, i)}
              />
            </View>
          ))}
        </ScrollView>

        {expanded && (
          <View style={styles.scrollbarTrack} pointerEvents="none">
            <Animated.View
              style={[
                styles.scrollbarThumb,
                {
                  height: thumbHeight,
                  transform: [{
                    translateY: scrollY.interpolate({
                      inputRange: [0, maxScroll],
                      outputRange: [0, maxThumbOffset],
                      extrapolate: 'clamp',
                    }),
                  }],
                },
              ]}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff33',
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scrollbarTrack: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    width: 2,
    justifyContent: 'flex-start',
  },
  scrollbarThumb: {
    width: 2,
    borderRadius: 1,
    backgroundColor: '#ffffff44',
  },
});
