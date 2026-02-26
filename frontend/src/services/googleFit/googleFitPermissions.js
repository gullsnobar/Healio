import { Platform, PermissionsAndroid } from 'react-native';

export const requestFitnessPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
