import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  index: number;
  name: string;
  description: string;
  isPlaying: boolean;
  onPress: () => void;
};

export default function TrackRow({ index, name, description, isPlaying, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
      <View style={styles.row}>
        <ThemedText style={styles.index}>{String(index).padStart(2, '0')}</ThemedText>
        <View style={styles.trackInfo}>
          <ThemedText style={[styles.name, isPlaying && styles.nameActive]} numberOfLines={1}>
            {name}
          </ThemedText>
          {description ? (
            <ThemedText style={styles.description} numberOfLines={1}>{description}</ThemedText>
          ) : null}
        </View>
        <IconSymbol
          name={isPlaying ? 'pause.fill' : 'play.fill'}
          size={10}
          color={isPlaying ? '#fff' : '#444'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ffffff33',
    backgroundColor: 'transparent',
  },
  index: {
    fontSize: 11,
    opacity: 0.3,
    fontVariant: ['tabular-nums'],
    width: 20,
  },
  trackInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: 0.2,
  },
  nameActive: {
    opacity: 1,
  },
  description: {
    fontSize: 11,
    opacity: 0.35,
    marginTop: 2,
    letterSpacing: 0.1,
  },
});