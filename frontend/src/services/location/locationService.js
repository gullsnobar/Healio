import * as Location from 'expo-location';

export const locationService = {
  requestPermission: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },
  getCurrentLocation: async () => {
    const location = await Location.getCurrentPositionAsync({});
    return { latitude: location.coords.latitude, longitude: location.coords.longitude };
  },
};
