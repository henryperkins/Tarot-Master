import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/HomeScreen";
import { JournalScreen } from "@/screens/JournalScreen";
import { CoachScreen } from "@/screens/CoachScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

export type MainTabParamList = {
  Home: undefined;
  Journal: undefined;
  Coach: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabBarBackground() {
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  );
}

export function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: {
          fontFamily: Fonts.body,
          fontSize: 11,
          marginBottom: Platform.OS === "ios" ? 0 : Spacing.sm,
        },
        tabBarStyle: {
          backgroundColor: Platform.OS === "ios" ? "transparent" : theme.backgroundDefault,
          borderTopColor: theme.borderLight,
          borderTopWidth: 1,
          position: "absolute",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: Spacing.sm,
        },
        tabBarBackground: Platform.OS === "ios" ? TabBarBackground : undefined,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Reading",
          tabBarIcon: ({ color, size }) => (
            <Feather name="sun" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Coach"
        component={CoachScreen}
        options={{
          tabBarLabel: "Coach",
          tabBarIcon: ({ color, size }) => (
            <Feather name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
