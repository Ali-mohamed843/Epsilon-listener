import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const fetchByType = async (type, page, perPage, search) => {
  const headers = await getHeaders();
  const res = await fetch(
    `${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=${type}`,
    { method: 'GET', headers }
  );
  const data = await res.json();
  return data.success && data.shows ? data.shows : [];
};

export const fetchProfiles = async (selectedType, page = 1, perPage = 50, search = '') => {
  try {
    const shows = await fetchByType(selectedType, page, perPage, search);
    return { success: true, data: shows };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createProfile = async (platform, payload) => {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/profiles/${platform}/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data.message || 'Failed to create profile' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── REFETCH / UPDATE profile links ────────────────────────────────────────────
export const refetchProfile = async (id) => {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/shows/${id}/refetch-links`, {
      method: 'POST',
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || 'Failed to update profile' };
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── DELETE profile ────────────────────────────────────────────────────────────
export const deleteProfile = async (id) => {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/shows/${id}/delete`, {
      method: 'POST',
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || 'Failed to delete profile' };
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchProfileById = async (id) => {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/shows/${id}`, { method: 'GET', headers });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch profile');
    return { success: true, data: data.data?.show || data.show };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProfile = async (id, payload) => {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/shows/${id}/update`, {
      method: 'POST', // Change to 'PUT' if your API requires it
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update profile');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};