import { Image, StyleSheet, View } from 'react-native';

export default function AnimationDisplayPlaceholder() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/white_disk.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
