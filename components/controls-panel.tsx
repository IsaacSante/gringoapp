import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onShuffle: () => void;
};

export default function ControlsPanel({ isPlaying, onPlayPause, onNext, onShuffle }: Props) {
  const [playHover, setPlayHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [shuffleHover, setShuffleHover] = useState(false);

  const playColor = isPlaying ? '#ffffff' : playHover ? '#ffffffaa' : '#ffffff55';
  const nextColor = nextHover ? '#ffffffaa' : '#ffffff55';
  const shuffleColor = shuffleHover ? '#ffffffaa' : '#ffffff55';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPlayPause}
        onPressIn={() => setPlayHover(true)}
        onPressOut={() => setPlayHover(false)}
        // @ts-ignore
        onHoverIn={() => setPlayHover(true)}
        // @ts-ignore
        onHoverOut={() => setPlayHover(false)}
      >
        <Text style={[styles.icon, { color: playColor }]}>
          {isPlaying ? '❚❚' : '▷'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        onPressIn={() => setNextHover(true)}
        onPressOut={() => setNextHover(false)}
        // @ts-ignore
        onHoverIn={() => setNextHover(true)}
        // @ts-ignore
        onHoverOut={() => setNextHover(false)}
      >
        <Text style={[styles.icon, { color: nextColor }]}>
          {'▷▷'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onShuffle}
        onPressIn={() => setShuffleHover(true)}
        onPressOut={() => setShuffleHover(false)}
        // @ts-ignore
        onHoverIn={() => setShuffleHover(true)}
        // @ts-ignore
        onHoverOut={() => setShuffleHover(false)}
      >
        <Text style={[styles.shuffleIcon, { color: shuffleColor }]}>
          {'⤮'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 46,
    marginBottom: 16,
  },
  icon: {
    fontFamily: 'DotGothic16',
    fontSize: 16,
  },
  shuffleIcon: {
    fontFamily: 'DotGothic16',
    fontSize: 26,
    lineHeight: 26,
    marginTop: 7,
  },
});
