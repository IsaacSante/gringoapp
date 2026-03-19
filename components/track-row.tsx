import { ThemedText } from '@/components/themed-text';
import { accentRed } from '@/constants/theme';
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
      <View style={styles.divider} />
      <View style={styles.row}>
        <ThemedText style={[styles.index, isPlaying && styles.indexActive]}>{String(index).padStart(2, '0')}</ThemedText>
        <View style={styles.trackInfo}>
          <ThemedText style={[styles.name, isPlaying && styles.nameActive]} numberOfLines={1}>
            {name}{isPlaying ? ' ...' : ''}
          </ThemedText>
          {description ? (
            <ThemedText style={styles.description} numberOfLines={1}>{description}</ThemedText>
          ) : null}
        </View>
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
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
  },
  index: {
    fontSize: 11,
    opacity: 0.5,
    fontVariant: ['tabular-nums'],
    width: 20,
  },
  trackInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    opacity: 0.85,
    letterSpacing: 0.2,
  },
  nameActive: {
    opacity: 1,
  },
  indexActive: {
    opacity: 1,
    color: accentRed,
  },
  description: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#00000044',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
  },
});