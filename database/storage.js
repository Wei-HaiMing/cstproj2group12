import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Store data in AsyncStorage
 * @param {string} key - Storage key (use STORAGE_KEYS)
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error(`Error storing data for key ${key}:`, e);
    return false;
  }
};

/**
 * Get data from AsyncStorage
 * @param {string} key - Storage key (use STORAGE_KEYS)
 * @returns {Promise<any|null>} Parsed value or null if not found
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error reading data for key ${key}:`, e);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key to remove
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Error removing data for key ${key}:`, e);
    return false;
  }
};

/**
 * Clear all AsyncStorage data
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing all data:', e);
    return false;
  }
};

/**
 * Get multiple values at once
 * @param {string[]} keys - Array of storage keys
 */
export const getMultiple = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
  } catch (e) {
    console.error('Error getting multiple values:', e);
    return [];
  }
};

/**
 * Store multiple values at once
 * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
 */
export const storeMultiple = async (keyValuePairs) => {
  try {
    const jsonPairs = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(jsonPairs);
    return true;
  } catch (e) {
    console.error('Error storing multiple values:', e);
    return false;
  }
};

// Export storage keys for convenience
export { STORAGE_KEYS };