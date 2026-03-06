import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../styles/ThemeContext';

import HomeScreen from '../screens/main/HomeScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import MedicationListScreen from '../screens/medication/MedicationListScreen';
import FitnessOverviewScreen from '../screens/fitness/FitnessOverviewScreen';
import ChatbotScreen from '../screens/chatbot/ChatbotScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',        label: 'Home',       icon: 'home',                  component: HomeScreen },
  { name: 'Dashboard',   label: 'Analytics',  icon: 'stats-chart',           component: DashboardScreen },
  { name: 'Medications', label: 'Meds',       icon: 'medkit',                component: MedicationListScreen },
  { name: 'Fitness',     label: 'Fitness',    icon: 'heart-circle',          component: FitnessOverviewScreen },
  { name: 'AIChat',      label: 'AI Chat',    icon: 'chatbubble-ellipses',   component: ChatbotScreen },
];

const TabNavigator = () => {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary, elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...Platform.select({
            ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
            android: { elevation: 8 },
          }),
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -2 },
        tabBarIcon: ({ focused, color }) => {
          const tab = TABS.find((t) => t.name === route.name);
          return (
            <View style={[ts.iconWrap, focused && { backgroundColor: colors.tabActiveBg }]}>
              <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={22} color={color} />
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
            headerTitle: name === 'Home' ? 'HEALIO' : label,
            headerShown: name === 'Home' ? false : true,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const ts = StyleSheet.create({
  iconWrap: {
    width: 44, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default TabNavigator;
