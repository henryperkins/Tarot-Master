import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Colors, Fonts } from "@/constants/theme";
import { Platform } from "react-native";

interface ScreenOptionsConfig {
  transparent?: boolean;
}

export function useScreenOptions(config: ScreenOptionsConfig = {}): NativeStackNavigationOptions {
  const { transparent = true } = config;
  const theme = Colors.dark;

  const baseOptions: NativeStackNavigationOptions = {
    headerTintColor: theme.primary,
    headerTitleStyle: {
      fontFamily: Fonts.serifMedium,
      fontWeight: "500",
      fontSize: 18,
      color: theme.text,
    },
    headerBackTitleVisible: false,
  };

  if (transparent) {
    return {
      ...baseOptions,
      headerTransparent: true,
      headerBlurEffect: "dark",
      headerStyle: {
        backgroundColor: Platform.OS === "ios" ? "transparent" : theme.backgroundRoot,
      },
    };
  }

  return {
    ...baseOptions,
    headerTransparent: false,
    headerStyle: {
      backgroundColor: theme.backgroundDefault,
    },
  };
}
