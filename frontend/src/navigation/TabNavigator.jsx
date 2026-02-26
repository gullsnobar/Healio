import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import MedicationListScreen from '../screens/medication/MedicationListScreen';
import FitnessOverviewScreen from '../screens/fitness/FitnessOverviewScreen';
import ChatbotScreen from '../screens/chatbot/ChatbotScreen';

import colors from '../styles/colors';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, focused) => {
  const icons = {
    Home: focused ? 'home' : 'home-outline',
    Dashboard: focused ? 'grid' : 'grid-outline',
    Medications: focused ? 'medkit' : 'medkit-outline',
    Fitness: focused ? 'fitness' : 'fitness-outline',
    AIChat: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
  };
  return icons[routeName] || 'ellipse-outline';
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={getTabIcon(route.name, focused)} size={size} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGrey,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'HEALIO' }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Medications"
        component={MedicationListScreen}
        options={{ title: 'Meds' }}
      />
      <Tab.Screen
        name="Fitness"
        component={FitnessOverviewScreen}
        options={{ title: 'Fitness' }}
      />
      <Tab.Screen
        name="AIChat"
        component={ChatbotScreen}
        options={{ title: 'AI Chat' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
