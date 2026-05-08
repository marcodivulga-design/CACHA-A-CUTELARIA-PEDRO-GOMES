import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { EventEmitter } from 'events';

interface SyncQueue {
  id: string;
  action: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  ttl: number;
}

class OfflineSyncService extends EventEmitter {
  private syncQueue: SyncQueue[] = [];
  private cachedData: Map<string, CachedData> = new Map();
  private isOnline = true;
  private isSyncing = false;

  constructor() {
    super();
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (!wasOnline && this.isOnline) {
        this.emit('online');
        this.syncQueue();
      } else if (wasOnline && !this.isOnline) {
        this.emit('offline');
      }
    });
  }

  // Add action to sync queue
  async queueAction(action: string, data: any) {
    const queueItem: SyncQueue = {
      id: `${action}-${Date.now()}`,
      action,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.syncQueue.push(queueItem);
    await this.persistQueue();

    if (this.isOnline) {
      await this.syncQueue();
    }

    return queueItem.id;
  }

  // Sync queue with server
  async syncQueue() {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      while (this.syncQueue.length > 0) {
        const item = this.syncQueue[0];

        try {
          await this.executeAction(item);
          this.syncQueue.shift();
          await this.persistQueue();
          this.emit('synced', item);
        } catch (error) {
          item.retries++;

          if (item.retries > 3) {
            this.syncQueue.shift();
            this.emit('syncFailed', item);
          }

          await this.persistQueue();
          break;
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async executeAction(item: SyncQueue) {
    const response = await fetch('https://api.example.com/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: item.action,
        data: item.data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Cache data
  async cacheData(key: string, data: any, ttl: number = 3600000) {
    const cachedItem: CachedData = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cachedData.set(key, cachedItem);
    await AsyncStorage.setItem(`cache:${key}`, JSON.stringify(cachedItem));
  }

  // Get cached data
  async getCachedData(key: string) {
    const cached = this.cachedData.get(key);

    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < cached.ttl) {
        return cached.data;
      }
    }

    // Try to load from storage
    try {
      const stored = await AsyncStorage.getItem(`cache:${key}`);
      if (stored) {
        const item = JSON.parse(stored) as CachedData;
        const age = Date.now() - item.timestamp;

        if (age < item.ttl) {
          this.cachedData.set(key, item);
          return item.data;
        }
      }
    } catch (error) {
      console.error('Cache retrieval error:', error);
    }

    return null;
  }

  // Clear cache
  async clearCache(key?: string) {
    if (key) {
      this.cachedData.delete(key);
      await AsyncStorage.removeItem(`cache:${key}`);
    } else {
      this.cachedData.clear();
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache:'));
      await AsyncStorage.multiRemove(cacheKeys);
    }
  }

  // Persist queue to storage
  private async persistQueue() {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Queue persistence error:', error);
    }
  }

  // Restore queue from storage
  async restoreQueue() {
    try {
      const stored = await AsyncStorage.getItem('syncQueue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Queue restoration error:', error);
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      cachedItems: this.cachedData.size,
    };
  }

  // Get queue
  getQueue() {
    return [...this.syncQueue];
  }

  // Clear queue
  async clearQueue() {
    this.syncQueue = [];
    await AsyncStorage.removeItem('syncQueue');
  }
}

export const offlineSyncService = new OfflineSyncService();
