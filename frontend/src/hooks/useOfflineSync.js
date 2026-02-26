import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { storage } from '../services/storage/asyncStorage';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => { setIsOnline(state.isConnected); if (state.isConnected) syncPending(); });
    return () => unsubscribe();
  }, []);

  const queueAction = async (action) => { const queue = [...pendingActions, action]; setPendingActions(queue); await storage.set('offline_queue', queue); };
  const syncPending = async () => { const queue = await storage.get('offline_queue') || []; /* process queue */ setPendingActions([]); await storage.remove('offline_queue'); };
  return { isOnline, pendingActions, queueAction };
};
