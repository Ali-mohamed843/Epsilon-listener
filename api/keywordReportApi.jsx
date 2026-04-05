import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Helper to format date for the API (e.g., "2026-03-01 00:00:00")
const formatApiDate = (isoDate) => {
  if (!isoDate) return null;
  return isoDate.replace('T', ' ').replace('.000Z', '').replace('.000+00:00', '');
};

export const fetchKeywordReport = async (hash) => {
  try {
    const headers = await getHeaders();

    // Step 1: Get Profile to find the Date Range
    const profileRes = await fetch(`${BASE_URL}/shows/${hash}/profile`, { headers }).then(res => res.json());
    
    if (!profileRes.success) throw new Error(profileRes.message || 'Failed to load profile');

    const profile = profileRes.data.show;
    const from = formatApiDate(profile.start_date);
    const to = formatApiDate(profile.end_date);

    // Build query string
    const queryParams = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

    // Step 2: Fetch all data endpoints with the date range
    const endpoints = [
      `shows/${hash}/stats${queryParams}`,
      `shows/${hash}/stats/platform${queryParams}`,
      `shows/${hash}/graph/engagement${queryParams}`,
      `shows/${hash}/graph/day${queryParams}`,
      `shows/${hash}/graph/engagement/hourly${queryParams}`,
      `shows/${hash}/graph/top/content${queryParams}`,
      `shows/${hash}/hashtags${queryParams}`,
      `comments/${hash}/keywords${queryParams}`,
      `posts/${hash}/keywords${queryParams}`,
      `comments/${hash}/feedback${queryParams}` // New: For Intents & Drivers
    ];

    const responses = await Promise.all(
      endpoints.map(ep => fetch(`${BASE_URL}/${ep}`, { headers }).then(res => res.json()))
    );

    const [
      statsRes, platformRes, engRes, dayRes, hourlyRes, contentRes, hashtagsRes, 
      commentsKeywordsRes, postsKeywordsRes, feedbackRes
    ] = responses;

    return {
      success: true,
      data: {
        profile,
        stats: statsRes.results || {},
        platforms: platformRes.results || [],
        engagementGraph: engRes.results || [],
        dayGraph: dayRes.results || [],
        hourlyGraph: hourlyRes.data || { labels: [], values: [] },
        topContent: contentRes.data?.labels || [],
        hashtags: hashtagsRes.data?.hashtags || [],
        commentKeywords: commentsKeywordsRes.data || {},
        postKeywords: postsKeywordsRes.data || {},
        feedback: feedbackRes.data || {}
      }
    };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: error.message };
  }
};