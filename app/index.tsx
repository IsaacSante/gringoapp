import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import TrackContainer from '@/components/track-container';
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#e3670e', '#1a0800']} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText type="title">GRINGO</ThemedText>
      </View>
      <TrackContainer tracks={TRACKS} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
