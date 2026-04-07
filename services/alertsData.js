import { fetchKeywords } from '../api/keywordApi';
import { fetchProfiles } from '../api/profileApi';
import { fetchKeywordReport } from '../api/keywordReportApi';
import { fetchProfileReport } from '../api/profileReportApi';

const formatNum = (num) => {
  if (!num && num !== 0) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const calcRisk = (commentNeg, postNeg) => {
  if (commentNeg > 30 || postNeg > 40) return 'High';
  if (commentNeg > 15 || postNeg > 20) return 'Medium';
  return 'Low';
};

export async function fetchAlertsData() {
  const keywordReports = [];
  const profileReports = [];

  try {
    const kwResult = await fetchKeywords(1, 5, '');
    const keywords = kwResult.success ? kwResult.data.shows : [];

    const profResultFB = await fetchProfiles('facebook-profile', 1, 3, '');
    const profResultIG = await fetchProfiles('instagram-profile', 1, 3, '');
    const profResultTW = await fetchProfiles('twitter-profile', 1, 3, '');
    
    const profiles = [
      ...(profResultFB.success ? profResultFB.data : []),
      ...(profResultIG.success ? profResultIG.data : []),
      ...(profResultTW.success ? profResultTW.data : []),
    ];

    for (const kw of keywords.slice(0, 5)) {
      if (!kw.hash?.hash) continue;
      const report = await fetchKeywordReport(kw.hash.hash);
      if (report.success) {
        const d = report.data;
        const stats = d.stats || {};
        const commSent = d.commentKeywords?.percentage || {};
        const postSent = d.postKeywords?.percentage || {};
        const cPos = commSent.positive || 0;
        const cNeg = commSent.negative || 0;
        const pPos = postSent.positive || 0;
        const pNeg = postSent.negative || 0;

        keywordReports.push({
          id: String(d.profile.id),
          type: 'keyword',
          name: d.profile.name || 'Unknown',
          dateRange: `${new Date(d.profile.start_date).toLocaleDateString()} — ${new Date(d.profile.end_date).toLocaleDateString()}`,
          kpis: [
            { label: 'Total Views', value: formatNum(stats.total_views) },
            { label: 'Total Reach', value: formatNum(stats.reach) },
            { label: 'Total Impressions', value: formatNum(stats.impressions) },
            { label: 'Total Engagements', value: formatNum(stats.engagement) },
            { label: 'Total Comments', value: formatNum(stats.total_comments_count) },
            { label: 'Total Shares', value: formatNum(stats.total_shares) },
            { label: 'Total Likes', value: formatNum(stats.total_likes) },
            { label: 'Total Mentions', value: formatNum(stats.mentions) },
            { label: 'Posts Sentiment', value: `+${Math.round(pPos - pNeg)}` },
            { label: 'Comments Sentiment', value: `+${Math.round(cPos - cNeg)}` },
          ],
          fakePercent: 0,
          realPercent: 100,
          totalAccounts: stats.total_comments_count || 0,
          riskLevel: calcRisk(cNeg, pNeg),
          commentsSentiment: { positive: String(cPos), negative: String(cNeg), neutral: String(Math.max(0, 100 - cPos - cNeg)) },
          postsSentiment: { positive: String(pPos), negative: String(pNeg) },
          hashtags: (d.hashtags || []).slice(0, 5).map(h => h.name),
          platformMentions: (d.platforms || []).map(p => ({ name: p.platform, value: String(p.mentions) })),
        });
      }
    }

    for (const prof of profiles.slice(0, 5)) {
      const hash = prof.hash?.hash || prof.hash;
      if (!hash) continue;
      
      const report = await fetchProfileReport(hash);
      if (report.success) {
        const d = report.data;
        const stats = d.stats || {};
        const commSent = d.commentKeywords?.percentage || {};
        const postSent = d.postKeywords?.percentage || {};
        const cPos = commSent.positive || 0;
        const cNeg = commSent.negative || 0;
        const pPos = postSent.positive || 0;
        const pNeg = postSent.negative || 0;
        const platform = (d.profile.type || '').replace('-profile', '');

        profileReports.push({
          id: String(d.profile.id),
          type: 'profile',
          name: d.profile.name || 'Unknown',
          platform: platform,
          profileUrl: d.profile.pageUrls?.[0] || '',
          dateRange: `${new Date(d.profile.start_date).toLocaleDateString()} — ${new Date(d.profile.end_date).toLocaleDateString()}`,
          kpis: [
            { label: 'Total Views', value: formatNum(stats.total_views) },
            { label: 'Total Reach', value: formatNum(stats.reach) },
            { label: 'Total Impressions', value: formatNum(stats.impressions) },
            { label: 'Total Engagements', value: formatNum(stats.engagement) },
            { label: 'Total Comments', value: formatNum(stats.total_comments_count) },
            { label: 'Total Shares', value: formatNum(stats.total_shares) },
            { label: 'Total Likes', value: formatNum(stats.total_likes) },
            { label: 'Total Mentions', value: formatNum(stats.mentions) },
            { label: 'Posts Sentiment', value: `+${Math.round(pPos - pNeg)}` },
            { label: 'Comments Sentiment', value: `+${Math.round(cPos - cNeg)}` },
            { label: 'Total Followers', value: formatNum(d.profile.followers) },
          ],
          fakePercent: 0,
          realPercent: 100,
          totalAccounts: d.profile.followers || 0,
          riskLevel: calcRisk(cNeg, pNeg),
          commentsSentiment: { positive: String(cPos), negative: String(cNeg), neutral: String(Math.max(0, 100 - cPos - cNeg)) },
        });
      }
    }
  } catch (error) {
    console.error('Error fetching alerts data:', error);
  }

  return { keywordReports, profileReports };
}

export function formatDataForAI(data) {
  var lines = [];
  lines.push('=== KEYWORD MONITORING REPORTS ===');
  lines.push('');
  data.keywordReports.forEach(function(report) {
    lines.push('--- ' + report.name + ' ---');
    lines.push('Date Range: ' + report.dateRange);
    lines.push('Risk Level: ' + report.riskLevel);
    lines.push('Fake Accounts: ' + report.fakePercent + '%');
    report.kpis.forEach(function(kpi) { lines.push('  ' + kpi.label + ': ' + kpi.value); });
    if (report.commentsSentiment) lines.push('  Comments: +' + report.commentsSentiment.positive + '% / -' + report.commentsSentiment.negative + '%');
    if (report.postsSentiment) lines.push('  Posts: +' + report.postsSentiment.positive + '% / -' + report.postsSentiment.negative + '%');
    if (report.hashtags) lines.push('  Top Hashtags: ' + report.hashtags.join(', '));
    lines.push('');
  });

  lines.push('=== PROFILE MONITORING REPORTS ===');
  lines.push('');
  data.profileReports.forEach(function(report) {
    lines.push('--- ' + report.name + ' (' + report.platform + ') ---');
    lines.push('URL: ' + report.profileUrl);
    lines.push('Date Range: ' + report.dateRange);
    lines.push('Risk Level: ' + report.riskLevel);
    lines.push('Fake Accounts: ' + report.fakePercent + '%');
    report.kpis.forEach(function(kpi) { lines.push('  ' + kpi.label + ': ' + kpi.value); });
    if (report.commentsSentiment) lines.push('  Comments: +' + report.commentsSentiment.positive + '% / -' + report.commentsSentiment.negative + '%');
    lines.push('');
  });
  return lines.join('\n');
}