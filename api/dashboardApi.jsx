import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

export const fetchDashboards = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/dashboards`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    if (!response.ok || !data.dashboards) {
      throw new Error(data.message || 'Failed to fetch dashboards');
    }

    const formatted = data.dashboards.map((d) => ({
      id: String(d.id),
      name: d.name || 'Untitled Dashboard',
      link: `https://epsilon.io/d/${d.hash}`,
      keywords: d.shows 
        ? d.shows.slice(0, 3).map((s) => s.name || s.keywords || 'Show') 
        : [],
      hash: d.hash,
      createdAt: d.createdAt,
    }));

    return { success: true, data: formatted };
  } catch (error) {
    return { success: false, message: error.message };
  }
};