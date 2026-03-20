import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AnimatedTitle from '@/components/animated-title';
import AnimationDisplayPlaceholder from '@/components/animation-display-placeholder';
import ControlsPanel from '@/components/controls-panel';
import GrainOverlay from '@/components/grain-overlay';
import TrackContainer from '@/components/track-container';
import { Surface } from '@/constants/theme';
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
    <LinearGradient colors={[Surface.gradientTop, Surface.gradientBottom]} style={styles.gradient}>
      <GrainOverlay />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <AnimatedTitle />
      </View>
      <AnimationDisplayPlaceholder />
      <TrackContainer
        tracks={TRACKS}
        renderControls={(controls) => (
          <ControlsPanel {...controls} />
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
});
