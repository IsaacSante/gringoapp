import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const TRACKS = [
  {
    id: '1',
    name: 'Song One',
    description: 'A cool track',
    src: require('@/assets/audio/song1.mp3'),
  },
  {
    id: '2',
    name: 'Song Two',
    description: 'Another cool track',
    src: require('@/assets/audio/song2.mp3'),
  },
];

type Track = typeof TRACKS[0];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const handlePress = async (track: Track) => {
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}>
      <ThemedText type="title" style={styles.title}>GRINGO</ThemedText>
      <FlatList
        data={TRACKS}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isPlaying = playingId === item.id;
          return (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <ThemedView style={[styles.row, isPlaying && styles.rowActive]}>
                <IconSymbol
                  name={isPlaying ? 'pause.fill' : 'play.fill'}
                  size={20}
                  color={isPlaying ? '#4a9eff' : '#888'}
                />
                <View style={styles.trackInfo}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={styles.description}>{item.description}</ThemedText>
                </View>
              </ThemedView>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  rowActive: {
    borderWidth: 1,
    borderColor: '#4a9eff44',
  },
  trackInfo: {
    flex: 1,
    gap: 3,
  },
  description: {
    fontSize: 13,
    opacity: 0.5,
  },
});