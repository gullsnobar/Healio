import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';

// Medication Screens
import AddMedicationScreen from '../screens/medication/AddMedicationScreen';
import EditMedicationScreen from '../screens/medication/EditMedicationScreen';
import MedicationDetailsScreen from '../screens/medication/MedicationDetailsScreen';

// Appointment Screens
import AddAppointmentScreen from '../screens/appointments/AddAppointmentScreen';
import EditAppointmentScreen from '../screens/appointments/EditAppointmentScreen';
import AppointmentDetailsScreen from '../screens/appointments/AppointmentDetailsScreen';

// Lab Report Screens
import UploadLabReportScreen from '../screens/labReports/UploadLabReportScreen';
import ViewLabReportScreen from '../screens/labReports/ViewLabReportScreen';

// Fitness Screens
import StepsScreen from '../screens/fitness/StepsScreen';
import SleepScreen from '../screens/fitness/SleepScreen';
import WaterIntakeScreen from '../screens/fitness/WaterIntakeScreen';
import DietLogScreen from '../screens/fitness/DietLogScreen';
import ManualEntryScreen from '../screens/fitness/ManualEntryScreen';

// Reports
import WeeklyReportScreen from '../screens/reports/WeeklyReportScreen';
import MonthlyReportScreen from '../screens/reports/MonthlyReportScreen';

// Trusted Contacts
import TrustedContactsScreen from '../screens/trustedContacts/TrustedContactsScreen';
import AddContactScreen from '../screens/trustedContacts/AddContactScreen';

// Settings
import SettingsScreen from '../screens/settings/SettingsScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/settings/PrivacySettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';

// Profile
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4A90D9' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Medication Stack */}
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} options={{ title: 'Add Medication' }} />
      <Stack.Screen name="EditMedication" component={EditMedicationScreen} options={{ title: 'Edit Medication' }} />
      <Stack.Screen name="MedicationDetails" component={MedicationDetailsScreen} options={{ title: 'Medication Details' }} />

      {/* Appointment Stack */}
      <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} options={{ title: 'Add Appointment' }} />
      <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} options={{ title: 'Edit Appointment' }} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={{ title: 'Appointment Details' }} />

      {/* Lab Reports */}
      <Stack.Screen name="UploadLabReport" component={UploadLabReportScreen} options={{ title: 'Upload Report' }} />
      <Stack.Screen name="ViewLabReport" component={ViewLabReportScreen} options={{ title: 'Lab Report' }} />

      {/* Fitness */}
      <Stack.Screen name="Steps" component={StepsScreen} options={{ title: 'Steps' }} />
      <Stack.Screen name="Sleep" component={SleepScreen} options={{ title: 'Sleep Tracking' }} />
      <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} options={{ title: 'Water Intake' }} />
      <Stack.Screen name="DietLog" component={DietLogScreen} options={{ title: 'Diet Log' }} />
      <Stack.Screen name="ManualEntry" component={ManualEntryScreen} options={{ title: 'Manual Entry' }} />

      {/* Reports */}
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} options={{ title: 'Weekly Report' }} />
      <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} options={{ title: 'Monthly Report' }} />

      {/* Trusted Contacts */}
      <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} options={{ title: 'Trusted Contacts' }} />
      <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: 'Add Contact' }} />

      {/* Settings */}
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ title: 'Privacy' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About HEALIO' }} />

      {/* Profile */}
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
