import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  useEffect(() => {
    const prepare = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [loaded]);

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="minion/minion" options={{ headerShown: false }} />
      <Stack.Screen name="minion/countdown" options={{ headerShown: false }} />
      <Stack.Screen name="minion/map" options={{ headerShown: false }} />

      <Stack.Screen name="gru" options={{ headerShown: false }} />
      <Stack.Screen name="team" options={{ headerShown: false }} />

      <Stack.Screen name="loading" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
