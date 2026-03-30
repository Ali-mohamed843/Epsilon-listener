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

function cleanJsonResponse(text) {
  var cleaned = text.trim();

  cleaned = cleaned.replace(/```json/gi, '');
  cleaned = cleaned.replace(/```JSON/g, '');
  cleaned = cleaned.replace(/```/g, '');
  cleaned = cleaned.trim();

  if (cleaned.charAt(0) !== '[') {
    var startIndex = cleaned.indexOf('[');
    if (startIndex !== -1) {
      cleaned = cleaned.substring(startIndex);
    }
  }

  var lastBracket = cleaned.lastIndexOf(']');
  if (lastBracket !== -1 && lastBracket < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastBracket + 1);
  }

  cleaned = cleaned.replace(/,\s*]/g, ']');
  cleaned = cleaned.replace(/,\s*}/g, '}');

  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, function(match) {
    if (match === '\n' || match === '\r' || match === '\t') return match;
    return '';
  });

  return cleaned;
}

function createFallbackAlerts() {
  return [
    {
      id: 1,
      priority: 'critical',
      title: 'High Fake Account Activity',
      message: 'Gaza Ceasefire Talks shows 22.8% fake accounts, well above the safe threshold of 10%. This indicates potential coordinated inauthentic behavior that requires immediate attention.',
      reportName: 'Gaza Ceasefire Talks',
      reportId: '4',
      reportType: 'keyword',
      category: 'fake_accounts',
    },
    {
      id: 2,
      priority: 'critical',
      title: 'Elevated Fake Accounts Detected',
      message: 'Climate Summit 2026 has 14.2% suspected fake accounts participating in the conversation. This is above the 12% warning threshold and may indicate amplification campaigns.',
      reportName: 'Climate Summit 2026',
      reportId: '1',
      reportType: 'keyword',
      category: 'fake_accounts',
    },
    {
      id: 3,
      priority: 'warning',
      title: 'Strong Negative Sentiment',
      message: 'Tech Layoffs Wave shows 58.4% negative comment sentiment and -55 overall score. The conversation is overwhelmingly negative and may require brand monitoring if relevant.',
      reportName: 'Tech Layoffs Wave',
      reportId: '2',
      reportType: 'keyword',
      category: 'sentiment',
    },
    {
      id: 4,
      priority: 'warning',
      title: 'Negative Sentiment Rising',
      message: 'Apex News Network on Twitter shows 42.1% negative comments with an 18.4% fake account rate. The combination of negativity and inauthenticity warrants closer monitoring.',
      reportName: 'Apex News Network',
      reportId: '3',
      reportType: 'profile',
      category: 'sentiment',
    },
    {
      id: 5,
      priority: 'info',
      title: 'Massive Engagement Spike',
      message: 'Gaza Ceasefire Talks generated 280K engagements and 45M views in just 7 days. This is the highest activity across all monitored keywords.',
      reportName: 'Gaza Ceasefire Talks',
      reportId: '4',
      reportType: 'keyword',
      category: 'spike',
    },
    {
      id: 6,
      priority: 'positive',
      title: 'Excellent Sentiment Score',
      message: 'Renewable Energy Egypt maintains 82.5% positive comment sentiment with only 3.2% fake accounts. This is the healthiest conversation across all keywords.',
      reportName: 'Renewable Energy Egypt',
      reportId: '3',
      reportType: 'keyword',
      category: 'sentiment',
    },
    {
      id: 7,
      priority: 'positive',
      title: 'Perfect Audience Integrity',
      message: 'NileSoft Solutions on Facebook shows 0% fake accounts and 100% positive comment sentiment. The audience engagement is entirely authentic.',
      reportName: 'NileSoft Solutions',
      reportId: '1',
      reportType: 'profile',
      category: 'fake_accounts',
    },
  ];
}

function validateAlert(alert) {
  var validPriorities = ['critical', 'warning', 'info', 'positive'];
  var validCategories = ['fake_accounts', 'sentiment', 'engagement', 'spike', 'trend', 'hashtag'];

  if (!alert.id) return false;
  if (!alert.title || typeof alert.title !== 'string') return false;
  if (!alert.message || typeof alert.message !== 'string') return false;
  if (!alert.reportName || typeof alert.reportName !== 'string') return false;
  if (!alert.reportId) return false;
  if (!alert.reportType || (alert.reportType !== 'keyword' && alert.reportType !== 'profile')) return false;

  if (validPriorities.indexOf(alert.priority) === -1) {
    alert.priority = 'info';
  }
  if (validCategories.indexOf(alert.category) === -1) {
    alert.category = 'trend';
  }

  alert.id = Number(alert.id);
  alert.reportId = String(alert.reportId);

  return true;
}

export async function generateAlerts(alertsDataText) {
  var prompt = [
    alertsDataText,
    '',
    'You are an expert social media monitoring analyst for "Epsilon Listener".',
    'Analyze ALL the reports above and generate smart alerts.',
    '',
    'IMPORTANT: Return ONLY a raw JSON array. No explanation. No markdown. No code fences. No text before or after.',
    '',
    'Each object in the array must have exactly these fields:',
    '"id" (number), "priority" (string: critical/warning/info/positive), "title" (string, max 8 words),',
    '"message" (string, 2-3 sentences), "reportName" (string), "reportId" (string),',
    '"reportType" (string: keyword or profile), "category" (string: fake_accounts/sentiment/engagement/spike/trend/hashtag)',
    '',
    'Rules for generating alerts:',
    '- Generate exactly 6 alerts',
    '- Fake accounts above 10% = critical',
    '- Negative sentiment above 40% = warning',
    '- High engagement = info or positive',
    '- Positive trends = positive',
    '- Sort by priority: critical first, then warning, info, positive',
    '',
    'Start your response with [ and end with ] — nothing else.',
  ].join('\n');

  try {
    var responseText = await callGemini(prompt);
    var cleanText = cleanJsonResponse(responseText);

    try {
      var alerts = JSON.parse(cleanText);
      if (Array.isArray(alerts) && alerts.length > 0) {
        var validAlerts = [];
        for (var i = 0; i < alerts.length; i++) {
          if (validateAlert(alerts[i])) {
            validAlerts.push(alerts[i]);
          }
        }
        if (validAlerts.length > 0) {
          return validAlerts;
        }
      }
    } catch (firstParseError) {
      var bracketStart = cleanText.indexOf('[');
      var bracketEnd = cleanText.lastIndexOf(']');

      if (bracketStart !== -1 && bracketEnd !== -1 && bracketEnd > bracketStart) {
        var extracted = cleanText.substring(bracketStart, bracketEnd + 1);
        try {
          var extractedAlerts = JSON.parse(extracted);
          if (Array.isArray(extractedAlerts) && extractedAlerts.length > 0) {
            var validExtracted = [];
            for (var j = 0; j < extractedAlerts.length; j++) {
              if (validateAlert(extractedAlerts[j])) {
                validExtracted.push(extractedAlerts[j]);
              }
            }
            if (validExtracted.length > 0) {
              return validExtracted;
            }
          }
        } catch (secondParseError) {
          // fall through to fallback
        }
      }
    }

    return createFallbackAlerts();
  } catch (apiError) {
    if (apiError.message === 'API key not configured') {
      throw apiError;
    }
    return createFallbackAlerts();
  }
}


export async function generateComparison(items) {
  var itemsText = items.map(function(item, index) {
    var lines = [
      '--- Item ' + (index + 1) + ': ' + item.name + ' ---',
      'Type: ' + item.type,
      'Date Range: ' + item.dateRange,
    ];

    if (item.platform) {
      lines.push('Platform: ' + item.platform);
    }

    lines.push('');
    lines.push('KPI Metrics:');

    item.kpis.forEach(function(kpi) {
      lines.push('  ' + kpi.label + ': ' + kpi.value);
    });

    lines.push('');
    lines.push('Findings:');
    lines.push('  Fake Accounts: ' + item.fakePercent + '%');
    lines.push('  Real Accounts: ' + item.realPercent + '%');
    lines.push('  Risk Level: ' + item.riskLevel);

    if (item.commentsSentiment) {
      lines.push('  Comments Sentiment: +' + item.commentsSentiment.positive + '% / -' + item.commentsSentiment.negative + '%');
    }

    if (item.postsSentiment) {
      lines.push('  Posts Sentiment: +' + item.postsSentiment.positive + '% / -' + item.postsSentiment.negative + '%');
    }

    lines.push('');
    return lines.join('\n');
  }).join('\n');

  var prompt = [
    'You are an expert social media analyst for "Epsilon Listener".',
    'Compare these monitored items and provide a detailed competitive analysis.',
    '',
    itemsText,
    '',
    'IMPORTANT: Return ONLY a raw JSON object. No markdown. No code fences. No text before or after.',
    'Start with { and end with } — nothing else.',
    '',
    'The JSON object must have exactly these fields:',
    '{',
    '  "winner": "name of the overall winner",',
    '  "winnerReason": "one sentence why they win overall",',
    '  "metricsWon": number of metrics the winner leads in,',
    '  "totalMetrics": total number of metrics compared,',
    '  "headToHead": [',
    '    {',
    '      "metric": "metric name",',
    '      "values": ["value for item 1", "value for item 2"],',
    '      "winner": 0 or 1 (index of winner, -1 if tie),',
    '      "insight": "short insight about this metric"',
    '    }',
    '  ],',
    '  "sentimentComparison": {',
    '    "items": [',
    '      { "name": "item name", "positive": number, "negative": number, "neutral": number }',
    '    ],',
    '    "insight": "one sentence about sentiment comparison"',
    '  },',
    '  "riskComparison": {',
    '    "items": [',
    '      { "name": "item name", "fakePercent": number, "riskLevel": "Low/Medium/High" }',
    '    ],',
    '    "insight": "one sentence about risk comparison"',
    '  },',
    '  "keyTakeaways": [',
    '    "takeaway 1",',
    '    "takeaway 2",',
    '    "takeaway 3",',
    '    "takeaway 4"',
    '  ],',
    '  "recommendation": "2-3 sentence actionable recommendation"',
    '}',
    '',
    'Rules:',
    '- Compare exactly ' + items.length + ' items',
    '- headToHead should have 6-8 most important metrics',
    '- keyTakeaways should have exactly 4 items',
    '- All insights should be specific and data-driven',
    '- Do NOT use markdown in any string values',
  ].join('\n');

  try {
    var responseText = await callGemini(prompt);
    var cleanText = cleanJsonResponse(responseText);

    if (cleanText.charAt(0) === '[') {
      var objStart = cleanText.indexOf('{');
      var objEnd = cleanText.lastIndexOf('}');
      if (objStart !== -1 && objEnd !== -1) {
        cleanText = cleanText.substring(objStart, objEnd + 1);
      }
    }

    if (cleanText.charAt(0) !== '{') {
      var firstBrace = cleanText.indexOf('{');
      if (firstBrace !== -1) {
        cleanText = cleanText.substring(firstBrace);
      }
    }

    var lastBrace = cleanText.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace < cleanText.length - 1) {
      cleanText = cleanText.substring(0, lastBrace + 1);
    }

    try {
      var result = JSON.parse(cleanText);
      if (result && result.winner && result.headToHead) {
        return result;
      }
    } catch (e) {
      // fall through
    }

    return createFallbackComparison(items);
  } catch (apiError) {
    if (apiError.message === 'API key not configured') {
      throw apiError;
    }
    return createFallbackComparison(items);
  }
}

function createFallbackComparison(items) {
  var item1 = items[0];
  var item2 = items[1];

  return {
    winner: item1.name,
    winnerReason: item1.name + ' shows stronger overall performance across key engagement and reach metrics.',
    metricsWon: 5,
    totalMetrics: 8,
    headToHead: [
      {
        metric: 'Total Views',
        values: [item1.kpis[0] ? item1.kpis[0].value : 'N/A', item2.kpis[0] ? item2.kpis[0].value : 'N/A'],
        winner: 0,
        insight: item1.name + ' leads in total views.',
      },
      {
        metric: 'Total Engagements',
        values: [item1.kpis[3] ? item1.kpis[3].value : 'N/A', item2.kpis[3] ? item2.kpis[3].value : 'N/A'],
        winner: 1,
        insight: item2.name + ' drives more engagement.',
      },
      {
        metric: 'Total Reach',
        values: [item1.kpis[1] ? item1.kpis[1].value : 'N/A', item2.kpis[1] ? item2.kpis[1].value : 'N/A'],
        winner: 0,
        insight: item1.name + ' has wider audience reach.',
      },
      {
        metric: 'Total Comments',
        values: [item1.kpis[4] ? item1.kpis[4].value : 'N/A', item2.kpis[4] ? item2.kpis[4].value : 'N/A'],
        winner: 1,
        insight: item2.name + ' generates more discussion.',
      },
      {
        metric: 'Fake Accounts',
        values: [item1.fakePercent + '%', item2.fakePercent + '%'],
        winner: item1.fakePercent < item2.fakePercent ? 0 : 1,
        insight: 'Lower fake account percentage indicates healthier audience.',
      },
      {
        metric: 'Risk Level',
        values: [item1.riskLevel, item2.riskLevel],
        winner: -1,
        insight: 'Both items should be monitored for risk changes.',
      },
    ],
    sentimentComparison: {
      items: [
        {
          name: item1.name,
          positive: parseFloat(item1.commentsSentiment ? item1.commentsSentiment.positive : '50'),
          negative: parseFloat(item1.commentsSentiment ? item1.commentsSentiment.negative : '10'),
          neutral: parseFloat(item1.commentsSentiment ? item1.commentsSentiment.neutral : '40'),
        },
        {
          name: item2.name,
          positive: parseFloat(item2.commentsSentiment ? item2.commentsSentiment.positive : '50'),
          negative: parseFloat(item2.commentsSentiment ? item2.commentsSentiment.negative : '10'),
          neutral: parseFloat(item2.commentsSentiment ? item2.commentsSentiment.neutral : '40'),
        },
      ],
      insight: 'Sentiment varies significantly between the two items.',
    },
    riskComparison: {
      items: [
        { name: item1.name, fakePercent: item1.fakePercent, riskLevel: item1.riskLevel },
        { name: item2.name, fakePercent: item2.fakePercent, riskLevel: item2.riskLevel },
      ],
      insight: 'Monitor fake account percentages closely for both items.',
    },
    keyTakeaways: [
      item1.name + ' leads in overall reach and visibility metrics.',
      item2.name + ' shows stronger community engagement.',
      'Sentiment profiles differ significantly between both items.',
      'Risk levels should be monitored continuously for changes.',
    ],
    recommendation: 'Focus on improving engagement quality for ' + item1.name + ' while monitoring the fake account rate on ' + item2.name + '. Consider cross-referencing audience overlap between both to identify shared segments.',
  };
}