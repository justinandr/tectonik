import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper'
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from "react";
import 'react-native-reanimated'
import { useColorScheme } from '@/hooks/useColorScheme'
import { PaperProvider } from 'react-native-paper'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
<<<<<<< HEAD
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </ThemeProvider>
    </PaperProvider>
||||||| c05dcfa
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </ThemeProvider>
=======
    <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </PaperProvider>
>>>>>>> 944b5717504c0b201a1273666bb49385eb8f2571
  );
}
