import {MMKV} from 'react-native-mmkv';

export class KVStorage {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = this.storage.getString(key);
      return value ?? null;
    } catch (error) {
      console.error('Error reading from MMKV:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.set(key, value);
    } catch (error) {
      console.error('Error writing to MMKV:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error('Error removing item from MMKV:', error);
    }
  }
}
