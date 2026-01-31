import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { ReadingScreen } from "@/screens/ReadingScreen";
import { ReadingResultScreen } from "@/screens/ReadingResultScreen";
import { JournalDetailScreen } from "@/screens/JournalDetailScreen";
import PricingScreen from "@/screens/PricingScreen";
import LoginScreen from "@/screens/LoginScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Reading: { spreadId: string; question?: string };
  ReadingResult: { readingId: number };
  JournalDetail: { entryId: number };
  Pricing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pricing"
        component={PricingScreen}
        options={{ headerTitle: "Subscription Plans" }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

