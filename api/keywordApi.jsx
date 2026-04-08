import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchKeywords = async (page = 1, perPage = 20, search = '') => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=keyword`,
      { method: 'GET', headers }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch keywords');
    }
    const meta = data.meta || data.pagination || null;
    const shows = data.shows || data.data?.shows || [];
    const hasMore = meta
      ? page < (meta.last_page || meta.totalPages || 1)
      : shows.length === perPage;
    return { success: true, data: { shows }, hasMore };
  } catch (error) {
    return { success: false, message: error.message, hasMore: false };
  }
};


export const fetchUrlGroups = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/url-groups`, { method: 'GET', headers });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch URL groups');
    }
    return { success: true, urlGroups: data.url_groups || [] };
  } catch (error) {
    return { success: false, message: error.message, urlGroups: [] };
  }
};

export const createKeyword = async (payload) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/shows/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create keyword');
    }
    return { success: true, show: data.data?.show };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── DELETE keyword ────────────────────────────────────────────────────────────
export const deleteKeyword = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/shows/${id}/delete`, {
      method: 'POST',
      headers,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete keyword');
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── REFETCH / UPDATE links ────────────────────────────────────────────────────
export const refetchKeyword = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/shows/${id}/refetch-links`, {
      method: 'POST',
      headers,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to refetch links');
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const fetchKeywordById = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/shows/${id}`, { method: 'GET', headers });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch keyword');
    return { success: true, data: data.data?.show || data.show };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateKeyword = async (id, payload) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/shows/${id}/update`, {
      method: 'POST', // Use 'PUT' if your backend requires it
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Failed to update keyword');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};