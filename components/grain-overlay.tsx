import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

function generateGridBase64(size = 64, lineWidth = 1): string {
  const width = size;
  const height = size;
  const pixels = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (x < lineWidth || y < lineWidth) {
        pixels[idx] = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
        pixels[idx + 3] = 255;
      }
    }
  }

  const rowSize = width * 4;
  const fileSize = 54 + rowSize * height;
  const bmp = new Uint8Array(fileSize);
  const view = new DataView(bmp.buffer);

  bmp[0] = 0x42; bmp[1] = 0x4D;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, -height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 32, true);
  view.setUint32(30, 0, true);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * 4;
    const dstIdx = 54 + i * 4;
    bmp[dstIdx] = pixels[srcIdx + 2];
    bmp[dstIdx + 1] = pixels[srcIdx + 1];
    bmp[dstIdx + 2] = pixels[srcIdx];
    bmp[dstIdx + 3] = pixels[srcIdx + 3];
  }

  let binary = '';
  for (let i = 0; i < bmp.length; i++) {
    binary += String.fromCharCode(bmp[i]);
  }
  return btoa(binary);
}

export default function GrainOverlay() {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const base64 = generateGridBase64(48, 1);
    setUri(`data:image/bmp;base64,${base64}`);
  }, []);

  if (!uri) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={{ uri }}
        style={styles.grid}
        resizeMode="repeat"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  grid: {
    flex: 1,
    opacity: 0.05,
  },
});
