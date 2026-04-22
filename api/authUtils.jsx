import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = () => AsyncStorage.getItem('authToken');

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['authToken', 'userData']);
};

export const isUnauthorized = (status) => status === 401;