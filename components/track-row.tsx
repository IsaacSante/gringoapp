import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  name: string;
  description: string;
  isPlaying: boolean;
  onPress: () => void;
};

export default function TrackRow({ name, description, isPlaying, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <ThemedView style={[styles.row, isPlaying && styles.rowActive]}>
        <IconSymbol
          name={isPlaying ? 'pause.fill' : 'play.fill'}
          size={12}
          color={isPlaying ? '#4a9eff' : '#555'}
        />
        <View style={styles.trackInfo}>
          <ThemedText style={[styles.name, isPlaying && styles.nameActive]} numberOfLines={1}>
            {name}
          </ThemedText>
          {description ? (
            <ThemedText style={styles.description} numberOfLines={1}>{description}</ThemedText>
          ) : null}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff11',
    backgroundColor: 'transparent',
  },
  rowActive: {
    borderBottomColor: '#ffffff11',
  },
  trackInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    opacity: 0.8,
  },
  nameActive: {
    opacity: 1,
    color: '#4a9eff',
  },
  description: {
    fontSize: 11,
    opacity: 0.4,
    marginTop: 1,
  },
});