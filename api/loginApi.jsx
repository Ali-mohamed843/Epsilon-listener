import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

export const loginUser = async ({ email, password, remember = false, token = null }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember, token }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.success && data.data?.token) {
      await AsyncStorage.setItem('authToken', data.data.token);
      if (data.data.admin) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.data.admin));
      }
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};