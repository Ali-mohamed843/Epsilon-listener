import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const formatApiDate = (date) => date ? date.toISOString().replace('T', ' ').split('.')[0] : null;

export const fetchProfileReport = async (hash, dateRange) => {
  try {
    const headers = await getHeaders();
    const profileRes = await fetch(`${BASE_URL}/shows/${hash}/profile`, { headers }).then(r => r.json());
    if (!profileRes.success) throw new Error(profileRes.message || 'Failed to load profile');

    const profile = profileRes.data.show;
    const from = formatApiDate(dateRange?.from || new Date(profile.start_date));
    const to = formatApiDate(dateRange?.to || new Date(profile.end_date));
    const q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

    const endpoints = [
      `shows/${hash}/stats${q}`, `shows/${hash}/graph/engagement${q}`,
      `shows/${hash}/graph/day${q}`, `comments/${hash}/keywords${q}`,
      `posts/${hash}/keywords${q}`, `shows/${hash}/hashtags${q}`,
      `shows/${hash}/stats/platform${q}`
    ];

    const responses = await Promise.all(endpoints.map(ep => fetch(`${BASE_URL}/${ep}`, { headers }).then(r => r.json())));
    const [statsRes, engRes, dayRes, commentsRes, postsRes, hashtagsRes, platformRes] = responses;

    return {
      success: true,
      data: {
        profile,
        stats: statsRes.results || {},
        engagementGraph: engRes.results || [],
        dayGraph: dayRes.results || [],
        commentKeywords: commentsRes.data || {},
        postKeywords: postsRes.data || {},
        hashtags: hashtagsRes.data?.hashtags || [],
        platforms: platformRes.results || []
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchKeywordContents = async (hash, keyword, sentiment, page = 1, perPage = 10) => {
  try {
    const headers = await getHeaders();
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      hash,
      keyword,
      sentiment,
    });
    
    const res = await fetch(
      `${BASE_URL}/contents/keywords?${params.toString()}`,
      { headers }
    );
    const json = await res.json();
    
    if (!json.success) throw new Error(json.message || 'Failed to load keyword contents');
    
    return {
      success: true,
      data: json.data || [],
      pageInfo: json.pageInfo || { totalItems: 0, totalPages: 1, currentPage: 1 },
    };
  } catch (error) {
    return { success: false, message: error.message, data: [], pageInfo: {} };
  }
};