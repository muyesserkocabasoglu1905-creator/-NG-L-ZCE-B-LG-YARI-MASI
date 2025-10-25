const API_KEY_STORAGE_KEY = 'geminiApiKey';

export const getApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving API key from localStorage:', error);
    return null;
  }
};

export const saveApiKey = (key: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  } catch (error) {
    console.error('Error saving API key to localStorage:', error);
  }
};

export const clearApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing API key from localStorage:', error);
  }
};
