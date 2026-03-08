import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export default function RootLayout() {
  const colorScheme = useColorScheme();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}