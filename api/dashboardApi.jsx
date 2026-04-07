import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const fetchDashboards = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/dashboards`, { method: 'GET', headers });
    const data = await response.json();
    if (!response.ok || !data.dashboards) throw new Error(data.message || 'Failed to fetch dashboards');

    return { 
      success: true, 
      data: data.dashboards.map((d) => ({
        id: String(d.id),
        name: d.name || 'Untitled Dashboard',
        link: `https://listener.epsilonfinder.com/comparison-dashboard/${d.hash}`,
        keywords: d.shows?.slice(0, 3).map((s) => s.name || s.keywords || 'Show') || [],
        hash: d.hash,
        createdAt: d.createdAt,
      }))
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchShows = async (type = 'keyword', page = 1, perPage = 50, search = '') => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=${type}`,
      { method: 'GET', headers }
    );
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch shows');
    return { success: true, data: data.shows };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createDashboard = async (payload) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/dashboards/create`, {
      method: 'POST', headers, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Failed to create dashboard');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};