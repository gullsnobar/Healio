import { useState } from 'react';
import googleFitService from '../services/googleFit/googleFitService';
import { requestFitnessPermissions } from '../services/googleFit/googleFitPermissions';

export const useGoogleFit = () => {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const connect = async () => { const ok = await requestFitnessPermissions(); if (ok) { await googleFitService.initialize(); setConnected(true); } return ok; };
  const sync = async () => { setSyncing(true); const data = await googleFitService.syncAll(); setSyncing(false); return data; };
  return { connected, syncing, connect, sync };
};
