import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import TabNavigator from './TabNavigator';

// Lazy-load screens to improve startup performance
const lazyScreen = (importFn) => {
  const LazyComponent = lazy(importFn);
  return (props) => (
    <Suspense fallback={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#4A90D9" /></View>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Medication Screens
const AddMedicationScreen = lazyScreen(() => import('../screens/medication/AddMedicationScreen'));
const EditMedicationScreen = lazyScreen(() => import('../screens/medication/EditMedicationScreen'));
const MedicationDetailsScreen = lazyScreen(() => import('../screens/medication/MedicationDetailsScreen'));

// Appointment Screens
const AddAppointmentScreen = lazyScreen(() => import('../screens/appointments/AddAppointmentScreen'));
const EditAppointmentScreen = lazyScreen(() => import('../screens/appointments/EditAppointmentScreen'));
const AppointmentDetailsScreen = lazyScreen(() => import('../screens/appointments/AppointmentDetailsScreen'));

// Lab Report Screens
const UploadLabReportScreen = lazyScreen(() => import('../screens/labReports/UploadLabReportScreen'));
const ViewLabReportScreen = lazyScreen(() => import('../screens/labReports/ViewLabReportScreen'));

// Fitness Screens
const StepsScreen = lazyScreen(() => import('../screens/fitness/StepsScreen'));
const SleepScreen = lazyScreen(() => import('../screens/fitness/SleepScreen'));
const WaterIntakeScreen = lazyScreen(() => import('../screens/fitness/WaterIntakeScreen'));
const DietLogScreen = lazyScreen(() => import('../screens/fitness/DietLogScreen'));
const ManualEntryScreen = lazyScreen(() => import('../screens/fitness/ManualEntryScreen'));

// Reports
const WeeklyReportScreen = lazyScreen(() => import('../screens/reports/WeeklyReportScreen'));
const MonthlyReportScreen = lazyScreen(() => import('../screens/reports/MonthlyReportScreen'));

// Trusted Contacts
const TrustedContactsScreen = lazyScreen(() => import('../screens/trustedContacts/TrustedContactsScreen'));
const AddContactScreen = lazyScreen(() => import('../screens/trustedContacts/AddContactScreen'));

// Settings
const SettingsScreen = lazyScreen(() => import('../screens/settings/SettingsScreen'));
const NotificationSettingsScreen = lazyScreen(() => import('../screens/settings/NotificationSettingsScreen'));
const PrivacySettingsScreen = lazyScreen(() => import('../screens/settings/PrivacySettingsScreen'));
const AboutScreen = lazyScreen(() => import('../screens/settings/AboutScreen'));

// Profile
const ProfileScreen = lazyScreen(() => import('../screens/main/ProfileScreen'));

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
