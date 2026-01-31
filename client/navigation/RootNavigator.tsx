import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { ReadingScreen } from "@/screens/ReadingScreen";
import { ReadingResultScreen } from "@/screens/ReadingResultScreen";
import { JournalDetailScreen } from "@/screens/JournalDetailScreen";
import LoginScreen from "@/screens/LoginScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { Colors } from "@/constants/theme";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Reading: { spreadId: string; question?: string };
  ReadingResult: { readingId: number };
  JournalDetail: { entryId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reading"
            component={ReadingScreen}
            options={{ headerTitle: "Your Reading" }}
          />
          <Stack.Screen
            name="ReadingResult"
            component={ReadingResultScreen}
            options={{ headerTitle: "Reading Insight" }}
          />
          <Stack.Screen
            name="JournalDetail"
            component={JournalDetailScreen}
            options={{ headerTitle: "Journal Entry" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundRoot,
  },
});
