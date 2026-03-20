import { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const GRID_SPACING = 120;
const ARM_LENGTH = 10;
const LINE_WIDTH = StyleSheet.hairlineWidth;
const LINE_COLOR = '#00000088';

export default function GrainOverlay() {
  const { width, height } = Dimensions.get('window');
  const cols = Math.floor(width / GRID_SPACING);
  const rows = Math.ceil(height / GRID_SPACING);
  const offsetX = (width - cols * GRID_SPACING) / 2;

  const crosshairs = useMemo(() => {
    const items = [];
    for (let r = 2; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        items.push(
          <View key={`${r}-${c}`} style={[styles.crosshair, { top: r * GRID_SPACING, left: offsetX + c * GRID_SPACING }]}>
            <View style={styles.horizontal} />
            <View style={styles.vertical} />
          </View>
        );
      }
    }
    return items;
  }, [cols, rows, offsetX]);

  return (
    <View style={styles.container} pointerEvents="none">
      {crosshairs}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  crosshair: {
    position: 'absolute',
    width: ARM_LENGTH * 2,
    height: ARM_LENGTH * 2,
    marginLeft: -ARM_LENGTH,
    marginTop: -ARM_LENGTH,
  },
  horizontal: {
    position: 'absolute',
    top: ARM_LENGTH,
    left: 0,
    right: 0,
    height: LINE_WIDTH,
    backgroundColor: LINE_COLOR,
  },
  vertical: {
    position: 'absolute',
    left: ARM_LENGTH,
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
    backgroundColor: LINE_COLOR,
  },
});
