import { ScrollView, StyleSheet } from 'react-native';
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
    <TrackContainer tracks={TRACKS} />
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
});