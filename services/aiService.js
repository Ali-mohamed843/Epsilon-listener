const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function buildKeywordReportContext(data) {
  const platformMentionsText = data.platformMentions
    ? data.platformMentions.map(function(p) { return '- ' + p.name + ': ' + p.value; }).join('\n')
    : 'N/A';

  const kpisText = data.kpis
    .map(function(k) { return '- ' + k.label + ': ' + k.value; })
    .join('\n');

  const positiveWordsText = data.positiveWords ? data.positiveWords.join(', ') : 'N/A';
  const negativeWordsText = data.negativeWords ? data.negativeWords.join(', ') : 'N/A';
  const hashtagsText = data.hashtags ? data.hashtags.join(', ') : 'N/A';

  const commPos = data.commentsSentiment ? data.commentsSentiment.positive : 'N/A';
  const commNeg = data.commentsSentiment ? data.commentsSentiment.negative : 'N/A';
  const commNeu = data.commentsSentiment ? data.commentsSentiment.neutral : 'N/A';
  const postPos = data.postsSentiment ? data.postsSentiment.positive : 'N/A';
  const postNeg = data.postsSentiment ? data.postsSentiment.negative : 'N/A';

  return [
    'You are an expert social media analyst for a monitoring tool called "Epsilon Listener".',
    'Analyze this KEYWORD monitoring report and provide insights.',
    '',
    'Report Name: ' + data.name,
    'Date Range: ' + data.dateRange,
    'Type: Keyword Monitoring Report',
    '',
    'KPI Metrics:',
    kpisText,
    '',
    'Findings:',
    '- Fake Accounts: ' + data.fakePercent + '%',
    '- Real Accounts: ' + data.realPercent + '%',
    '- Total Accounts Analyzed: ' + data.totalAccounts,
    '- Risk Level: ' + data.riskLevel,
    '',
    'Sentiment Analysis:',
    '- Comments Sentiment: Positive ' + commPos + '%, Negative ' + commNeg + '%, Neutral ' + commNeu + '%',
    '- Posts Sentiment: Positive ' + postPos + '%, Negative ' + postNeg + '%',
    '',
    'Top Positive Words: ' + positiveWordsText,
    'Top Negative Words: ' + negativeWordsText,
    'Top Hashtags: ' + hashtagsText,
    '',
    'Platform Mentions:',
    platformMentionsText,
  ].join('\n');
}

function buildProfileReportContext(data) {
  const kpisText = data.kpis
    .map(function(k) { return '- ' + k.label + ': ' + k.value; })
    .join('\n');

  const positiveWordsText = data.positiveWords ? data.positiveWords.join(', ') : 'N/A';
  const negativeWordsText = data.negativeWords ? data.negativeWords.join(', ') : 'N/A';

  const commPos = data.commentsSentiment ? data.commentsSentiment.positive : 'N/A';
  const commNeg = data.commentsSentiment ? data.commentsSentiment.negative : 'N/A';
  const commNeu = data.commentsSentiment ? data.commentsSentiment.neutral : 'N/A';

  return [
    'You are an expert social media analyst for a monitoring tool called "Epsilon Listener".',
    'Analyze this PROFILE monitoring report and provide insights.',
    '',
    'Profile Name: ' + data.name,
    'Platform: ' + data.platform,
    'Profile URL: ' + data.profileUrl,
    'Date Range: ' + data.dateRange,
    'Type: Profile Monitoring Report',
    '',
    'KPI Metrics:',
    kpisText,
    '',
    'Findings:',
    '- Fake Accounts: ' + data.fakePercent + '%',
    '- Real Accounts: ' + data.realPercent + '%',
    '- Total Accounts Analyzed: ' + data.totalAccounts,
    '- Risk Level: ' + data.riskLevel,
    '',
    'Comments Sentiment:',
    '- Positive: ' + commPos + '%',
    '- Negative: ' + commNeg + '%',
    '- Neutral: ' + commNeu + '%',
    '',
    'Top Positive Words: ' + positiveWordsText,
    'Top Negative Words: ' + negativeWordsText,
  ].join('\n');
}

async function callGemini(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('API key not configured');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(function() { return {}; });
    throw new Error(
      errorData && errorData.error && errorData.error.message
        ? errorData.error.message
        : 'API error: ' + response.status
    );
  }

  const result = await response.json();

  var text = null;
  if (
    result &&
    result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts &&
    result.candidates[0].content.parts[0]
  ) {
    text = result.candidates[0].content.parts[0].text;
  }

  if (!text) {
    throw new Error('No response generated');
  }

  return text;
}

export async function generateReportSummary(reportData, reportType) {
  if (!reportType) {
    reportType = 'keyword';
  }

  var context;
  if (reportType === 'profile') {
    context = buildProfileReportContext(reportData);
  } else {
    context = buildKeywordReportContext(reportData);
  }

  var instructions = [
    '',
    'Based on the data above, write a concise executive summary (3-4 sentences max).',
    'Highlight the most important metrics, any risks or concerns, and one actionable recommendation.',
    'Keep it professional but easy to understand.',
    'Do NOT use markdown formatting, bullet points, or headers. Just plain text paragraphs.',
  ].join('\n');

  var prompt = context + instructions;

  return callGemini(prompt);
}

export async function chatWithReport(reportData, reportType, chatHistory, userMessage) {
  if (!reportType) {
    reportType = 'keyword';
  }
  if (!chatHistory) {
    chatHistory = [];
  }

  var context;
  if (reportType === 'profile') {
    context = buildProfileReportContext(reportData);
  } else {
    context = buildKeywordReportContext(reportData);
  }

  var historyText = '';
  if (chatHistory.length > 0) {
    historyText = chatHistory
      .map(function(msg) {
        var role = msg.role === 'user' ? 'User' : 'Assistant';
        return role + ': ' + msg.text;
      })
      .join('\n');
  }

  var parts = [
    context,
    '',
    'You are a helpful AI assistant that answers questions about this social media monitoring report.',
    'Keep answers concise (2-3 sentences unless asked for detail).',
    'Do NOT use markdown formatting. Just plain text.',
    'If asked something not related to this report data, politely redirect to report-related topics.',
    '',
  ];

  if (historyText) {
    parts.push('Previous conversation:');
    parts.push(historyText);
    parts.push('');
  }

  parts.push('User: ' + userMessage);
  parts.push('');
  parts.push('Assistant:');

  var prompt = parts.join('\n');

  return callGemini(prompt);
}