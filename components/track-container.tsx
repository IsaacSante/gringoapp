import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

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
  renderControls?: (controls: {
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onShuffle: () => void;
  }) => React.ReactNode;
};

export default function TrackContainer({ tracks, renderControls }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false);
  const { height: screenHeight } = useWindowDimensions();

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animHeight = useRef(new Animated.Value(screenHeight / 3)).current;
  const scrollRef = useRef<ScrollView>(null);
  const rowOffsets = useRef<number[]>([]);
  const [rowHeight, setRowHeight] = useState(0);

  const collapsedHeight = screenHeight / 3;
  const expandedHeight = (screenHeight * 2) / 3;

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
    setPaused(false);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setPlayingId(null);
    });
  };


  const handlePlayPause = async () => {
    if (!soundRef.current || !playingId) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.current.pauseAsync();
      setPaused(true);
    } else if (status.isLoaded) {
      await soundRef.current.playAsync();
      setPaused(false);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === playingId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handlePress(tracks[nextIndex], nextIndex);
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex((t) => t.id === playingId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePress(tracks[prevIndex], prevIndex);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    handlePress(tracks[randomIndex], randomIndex);
  };

  return (
    <>
      {renderControls?.({
        isPlaying: playingId !== null && !paused,
        onPlayPause: handlePlayPause,
        onNext: handleNext,
        onPrev: handlePrev,
        onShuffle: handleShuffle,
      })}
      <Animated.View style={[styles.container, { height: animHeight }]}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(0, collapsedHeight - rowHeight) },
          ]}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={resetIdleTimer}
          onMomentumScrollEnd={resetIdleTimer}
        >
          {tracks.map((track, i) => (
            <View
              key={track.id}
              onLayout={(e) => {
                rowOffsets.current[i] = e.nativeEvent.layout.y;
                if (i === 0 && !rowHeight) setRowHeight(e.nativeEvent.layout.height);
              }}
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
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#e8e6df',
    zIndex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
