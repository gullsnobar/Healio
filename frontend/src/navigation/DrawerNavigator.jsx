import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TrustedContactsScreen from '../screens/trustedContacts/TrustedContactsScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import RecommendationsScreen from '../screens/recommendations/RecommendationsScreen';
import AboutScreen from '../screens/settings/AboutScreen';

import colors from '../styles/colors';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.darkGrey,
        drawerStyle: { width: 280 },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={TabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ReportsDrawer"
        component={ReportsScreen}
        options={{
          title: 'Health Reports',
          drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="RecommendationsDrawer"
        component={RecommendationsScreen}
        options={{
          title: 'AI Insights',
          drawerIcon: ({ color, size }) => <Ionicons name="bulb-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ContactsDrawer"
        component={TrustedContactsScreen}
        options={{
          title: 'Trusted Contacts',
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="SettingsDrawer"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AboutDrawer"
        component={AboutScreen}
        options={{
          title: 'About HEALIO',
          drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
