import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { accentRed } from '@/constants/theme';

type Props = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
};

export default function ControlsPanel({ isPlaying, onPlayPause, onNext, onPrev, onShuffle }: Props) {
  const [playHover, setPlayHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [prevHover, setPrevHover] = useState(false);
  const [shuffleHover, setShuffleHover] = useState(false);
  const insets = useSafeAreaInsets();

  const playColor = isPlaying ? (playHover ? '#111111cc' : '#111111aa') : (playHover ? accentRed : accentRed);
  const nextColor = nextHover ? '#111111cc' : '#111111aa';
  const prevColor = prevHover ? '#111111cc' : '#111111aa';
  const shuffleColor = shuffleHover ? '#111111cc' : '#111111aa';

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Pressable
          style={[styles.section, styles.sectionBorder, { paddingBottom: 16 + insets.bottom }]}
          onPress={onPlayPause}
          onPressIn={() => setPlayHover(true)}
          onPressOut={() => setPlayHover(false)}
        >
          <LinearGradient colors={['#00000008', 'transparent', '#ffffff22']} start={{ x: 0.1, y: 0.5 }} end={{ x: 0.9, y: 0.5 }} style={styles.innerShadow} />
          <Text style={[styles.icon, { color: playColor }]}>
            {isPlaying ? '❚❚' : '▶\uFE0E'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.section, styles.sectionBorder, { paddingBottom: 16 + insets.bottom }]}
          onPress={onNext}
          onPressIn={() => setNextHover(true)}
          onPressOut={() => setNextHover(false)}
        >
          <LinearGradient colors={['#00000008', 'transparent', '#ffffff22']} start={{ x: -0.2, y: 0.5 }} end={{ x: 0.7, y: 0.5 }} style={styles.innerShadow} />
          <Text style={[styles.icon, { color: nextColor }]}>
            {'▷▷'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.section, styles.sectionBorder, { paddingBottom: 16 + insets.bottom }]}
          onPress={onPrev}
          onPressIn={() => setPrevHover(true)}
          onPressOut={() => setPrevHover(false)}
        >
          <LinearGradient colors={['#00000008', 'transparent', '#ffffff22']} start={{ x: 0.3, y: 0.5 }} end={{ x: 1.2, y: 0.5 }} style={styles.innerShadow} />
          <Text style={[styles.largeIcon, { color: prevColor }]}>
            {'↺'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.section, { paddingBottom: 16 + insets.bottom }]}
          onPress={onShuffle}
          onPressIn={() => setShuffleHover(true)}
          onPressOut={() => setShuffleHover(false)}
        >
          <LinearGradient colors={['#00000008', 'transparent', '#ffffff22']} start={{ x: -0.1, y: 0.5 }} end={{ x: 0.8, y: 0.5 }} style={styles.innerShadow} />
          <Text style={[styles.shuffleIcon, { color: shuffleColor }]}>
            {'⤮'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#00000055',
    backgroundColor: '#f0efe9',
  },
  section: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sectionBorder: {
    borderRightWidth: 1,
    borderRightColor: '#00000022',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
  },
  icon: {
    fontFamily: 'DotGothic16',
    fontSize: 16,
  },
  largeIcon: {
    fontFamily: 'DotGothic16',
    fontSize: 22,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  shuffleIcon: {
    fontFamily: 'DotGothic16',
    fontSize: 29,
    lineHeight: 29,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
