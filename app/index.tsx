import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import TrackRow from '@/components/track-row';
import { LinearGradient } from 'expo-linear-gradient';

const TRACKS = [
  { id: '1', name: 'know what u know', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '2', name: 'Masterpiece', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '3', name: 'Kiss Me', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '4', name: 'Ugly', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '5', name: 'Strange', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '6', name: 'i love u', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '7', name: 'Am I Honoring Myself? Am I Honoring the Ones I Love?', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '8', name: 'beautiful dreamer', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '9', name: 'Bigger Place', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '10', name: 'Beauty Star', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '11', name: 'Fling', description: '', src: require('@/assets/audio/song1.mp3') },
  { id: '12', name: 'if i die tomorrow', description: '', src: require('@/assets/audio/song1.mp3') },
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
  <LinearGradient
  colors={['#e3670e', '#1a0800']}
  style={{ flex: 1 }}>
  <ScrollView
    style={styles.container}
    contentContainerStyle={{
      paddingTop: insets.top + 20,
      paddingHorizontal: 20,
      paddingBottom: 40,
    }}>
    <ThemedText type="title" style={styles.title}>GRINGO</ThemedText>
    {TRACKS.map((item, i) => (
      <TrackRow
        key={item.id}
        index={i + 1}
        name={item.name}
        description={item.description}
        isPlaying={playingId === item.id}
        onPress={() => handlePress(item)}
      />
    ))}
  </ScrollView>
</LinearGradient>
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