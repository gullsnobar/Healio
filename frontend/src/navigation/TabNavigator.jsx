import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../styles/ThemeContext";

import HomeScreen from "../screens/main/HomeScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import RemindersScreen from "../screens/reminder/RemindersScreen";
import FitnessOverviewScreen from "../screens/fitness/FitnessOverviewScreen";
import ChatbotScreen from "../screens/chatbot/ChatbotScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home", label: "Home", icon: "home", component: HomeScreen },
  {
    name: "Dashboard",
    label: "Analytics",
    icon: "stats-chart",
    component: DashboardScreen,
  },
  {
    name: "Reminders",
    label: "Reminders",
    icon: "notifications",
    component: RemindersScreen,
  },
  {
    name: "Fitness",
    label: "Fitness",
    icon: "heart-circle",
    component: FitnessOverviewScreen,
  },
  {
    name: "AI",
    label: "AI",
    icon: "chatbubble-ellipses",
    component: ChatbotScreen,
  },
];

const TabNavigator = () => {
  const { colors, isDark } = useAppTheme();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;

  const tabBarHeight = Platform.select({
    ios: 88,
    android: 64,
    default: isMobile ? 60 : 68,
  });
  const tabBarPaddingBottom = Platform.select({
    ios: 28,
    android: 8,
    default: isMobile ? 6 : 10,
  });

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        paddingBottom: tabBarHeight + 16,
        backgroundColor: colors.background,
      }}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
          includeFontPadding: false,
          lineHeight: 14,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 6,
          paddingBottom: 4,
          flex: 1,
          height: '100%',
        },
        tabBarStyle: {
          height: 65,
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarIcon: ({ focused, color }) => {
          const tab = TABS.find((t) => t.name === route.name);
          return (
            <View
              style={[
                ts.iconWrap,
                isMobile && ts.iconWrapSmall,
                focused && { backgroundColor: colors.tabActiveBg },
              ]}
            >
              <Ionicons
                name={focused ? tab.icon : `${tab.icon}-outline`}
                size={isMobile ? 20 : 24}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      {TABS.map(({ name, label, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title: label,
            headerTitle: name === "Home" ? "HEALIO" : label,
            headerShown: name === "Home" ? false : true,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const ts = StyleSheet.create({
iconWrap: {
  width: 36,
  height: 32,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
},
iconWrapSmall: {
  width: 30,
  height: 28,
  borderRadius: 8,
},
});

export default TabNavigator;
