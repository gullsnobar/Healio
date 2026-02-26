import googleFitService from './googleFitService';
import { fitnessAPI } from '../api/fitnessAPI';

export const syncGoogleFitData = async () => {
  const data = await googleFitService.syncAll();
  await fitnessAPI.syncGoogleFit(data);
  return data;
};
