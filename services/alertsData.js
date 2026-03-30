export function buildAlertsDataPackage() {
  var keywordReports = [
    {
      id: '1',
      type: 'keyword',
      name: 'Climate Summit 2026',
      dateRange: '01 Mar 2026 — 31 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '28M' },
        { label: 'Total Avg Reach', value: '1.8B' },
        { label: 'Total Impressions', value: '4.2B' },
        { label: 'Total Engagements', value: '95K' },
        { label: 'Total Comments', value: '12K' },
        { label: 'Total Shares', value: '3.5K' },
        { label: 'Total Likes', value: '78K' },
        { label: 'Total Mentions', value: '4.1K' },
        { label: 'Posts Sentiment', value: '+68' },
        { label: 'Comments Sentiment', value: '+82' },
        { label: 'Eng. over Avg Reach', value: '9.4M' },
        { label: 'Eng. Per Post', value: '95K' },
      ],
      fakePercent: 14.2,
      realPercent: 85.8,
      totalAccounts: 342,
      riskLevel: 'Medium',
      commentsSentiment: { positive: '71.4', negative: '5.8', neutral: '22.8' },
      postsSentiment: { positive: '9.6', negative: '3.1' },
      hashtags: ['#climate_summit', '#COP2026', '#قمة_المناخ', '#GreenEgypt', '#ClimateAction'],
    },
    {
      id: '2',
      type: 'keyword',
      name: 'Tech Layoffs Wave',
      dateRange: '15 Feb 2026 — 15 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '15M' },
        { label: 'Total Avg Reach', value: '920M' },
        { label: 'Total Impressions', value: '2.1B' },
        { label: 'Total Engagements', value: '120K' },
        { label: 'Total Comments', value: '18K' },
        { label: 'Total Shares', value: '8.2K' },
        { label: 'Total Likes', value: '92K' },
        { label: 'Total Mentions', value: '6.3K' },
        { label: 'Posts Sentiment', value: '-42' },
        { label: 'Comments Sentiment', value: '-55' },
        { label: 'Eng. over Avg Reach', value: '5.2M' },
        { label: 'Eng. Per Post', value: '45K' },
      ],
      fakePercent: 8.5,
      realPercent: 91.5,
      totalAccounts: 890,
      riskLevel: 'Low',
      commentsSentiment: { positive: '22.1', negative: '58.4', neutral: '19.5' },
      postsSentiment: { positive: '18.2', negative: '62.8' },
      hashtags: ['#TechLayoffs', '#tech_layoffs', '#layoffs2026'],
    },
    {
      id: '3',
      type: 'keyword',
      name: 'Renewable Energy Egypt',
      dateRange: '01 Jan 2026 — 28 Feb 2026',
      kpis: [
        { label: 'Total Views', value: '5.2M' },
        { label: 'Total Avg Reach', value: '340M' },
        { label: 'Total Impressions', value: '780M' },
        { label: 'Total Engagements', value: '32K' },
        { label: 'Total Comments', value: '4.1K' },
        { label: 'Total Shares', value: '2.8K' },
        { label: 'Total Likes', value: '24K' },
        { label: 'Total Mentions', value: '1.2K' },
        { label: 'Posts Sentiment', value: '+85' },
        { label: 'Comments Sentiment', value: '+78' },
        { label: 'Eng. over Avg Reach', value: '2.1M' },
        { label: 'Eng. Per Post', value: '18K' },
      ],
      fakePercent: 3.2,
      realPercent: 96.8,
      totalAccounts: 156,
      riskLevel: 'Low',
      commentsSentiment: { positive: '82.5', negative: '2.1', neutral: '15.4' },
      postsSentiment: { positive: '88.0', negative: '1.5' },
      hashtags: ['#renewable_energy_egypt', '#solar', '#طاقة_نظيفة'],
    },
    {
      id: '4',
      type: 'keyword',
      name: 'Gaza Ceasefire Talks',
      dateRange: '10 Mar 2026 — 17 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '45M' },
        { label: 'Total Avg Reach', value: '3.2B' },
        { label: 'Total Impressions', value: '6.8B' },
        { label: 'Total Engagements', value: '280K' },
        { label: 'Total Comments', value: '42K' },
        { label: 'Total Shares', value: '35K' },
        { label: 'Total Likes', value: '195K' },
        { label: 'Total Mentions', value: '15K' },
        { label: 'Posts Sentiment', value: '-12' },
        { label: 'Comments Sentiment', value: '-28' },
        { label: 'Eng. over Avg Reach', value: '18M' },
        { label: 'Eng. Per Post', value: '140K' },
      ],
      fakePercent: 22.8,
      realPercent: 77.2,
      totalAccounts: 1240,
      riskLevel: 'High',
      commentsSentiment: { positive: '31.2', negative: '45.6', neutral: '23.2' },
      postsSentiment: { positive: '28.4', negative: '48.2' },
      hashtags: ['#gaza_ceasefire', '#CeasefireNow', '#وقف_إطلاق_النار'],
    },
  ];

  var profileReports = [
    {
      id: '1',
      type: 'profile',
      name: 'NileSoft Solutions',
      platform: 'facebook',
      profileUrl: 'facebook.com/NileSoftEgypt',
      dateRange: '01 Feb 2026 — 31 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '18K' },
        { label: 'Total Avg Reach', value: '60K' },
        { label: 'Total Impressions', value: '120K' },
        { label: 'Total Engagements', value: '1K' },
        { label: 'Total Comments', value: '56' },
        { label: 'Total Shares', value: '203' },
        { label: 'Total Likes', value: '780' },
        { label: 'Total Mentions', value: '10' },
        { label: 'Posts Sentiment', value: '0' },
        { label: 'Comments Sentiment', value: '+100' },
        { label: 'Eng. Per Post', value: '1K' },
        { label: 'Total Followers', value: '11M' },
      ],
      fakePercent: 0,
      realPercent: 100,
      totalAccounts: 0,
      riskLevel: 'Low',
      commentsSentiment: { positive: '60', negative: '0', neutral: '40' },
    },
    {
      id: '2',
      type: 'profile',
      name: 'Desert Wind Media',
      platform: 'instagram',
      profileUrl: 'instagram.com/DesertWindMedia',
      dateRange: '01 Feb 2026 — 31 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '245K' },
        { label: 'Total Avg Reach', value: '890K' },
        { label: 'Total Impressions', value: '1.8M' },
        { label: 'Total Engagements', value: '18K' },
        { label: 'Total Comments', value: '2.1K' },
        { label: 'Total Shares', value: '1.4K' },
        { label: 'Total Likes', value: '14K' },
        { label: 'Total Mentions', value: '340' },
        { label: 'Posts Sentiment', value: '+45' },
        { label: 'Comments Sentiment', value: '+38' },
        { label: 'Eng. Per Post', value: '3.2K' },
        { label: 'Total Followers', value: '870K' },
      ],
      fakePercent: 6.8,
      realPercent: 93.2,
      totalAccounts: 220,
      riskLevel: 'Low',
      commentsSentiment: { positive: '55.2', negative: '12.4', neutral: '32.4' },
    },
    {
      id: '3',
      type: 'profile',
      name: 'Apex News Network',
      platform: 'twitter',
      profileUrl: 'twitter.com/ApexNewsNet',
      dateRange: '01 Mar 2026 — 31 Mar 2026',
      kpis: [
        { label: 'Total Views', value: '3.8M' },
        { label: 'Total Avg Reach', value: '12M' },
        { label: 'Total Impressions', value: '28M' },
        { label: 'Total Engagements', value: '45K' },
        { label: 'Total Comments', value: '8.2K' },
        { label: 'Total Shares', value: '12K' },
        { label: 'Total Likes', value: '24K' },
        { label: 'Total Mentions', value: '2.8K' },
        { label: 'Posts Sentiment', value: '-15' },
        { label: 'Comments Sentiment', value: '-22' },
        { label: 'Eng. Per Post', value: '5.6K' },
        { label: 'Total Followers', value: '5.1M' },
      ],
      fakePercent: 18.4,
      realPercent: 81.6,
      totalAccounts: 680,
      riskLevel: 'Medium',
      commentsSentiment: { positive: '28.5', negative: '42.1', neutral: '29.4' },
    },
  ];

  return {
    keywordReports: keywordReports,
    profileReports: profileReports,
  };
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

    report.kpis.forEach(function(kpi) {
      lines.push('  ' + kpi.label + ': ' + kpi.value);
    });

    if (report.commentsSentiment) {
      lines.push('  Comments: +' + report.commentsSentiment.positive + '% / -' + report.commentsSentiment.negative + '%');
    }
    if (report.postsSentiment) {
      lines.push('  Posts: +' + report.postsSentiment.positive + '% / -' + report.postsSentiment.negative + '%');
    }
    if (report.hashtags) {
      lines.push('  Top Hashtags: ' + report.hashtags.join(', '));
    }
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

    report.kpis.forEach(function(kpi) {
      lines.push('  ' + kpi.label + ': ' + kpi.value);
    });

    if (report.commentsSentiment) {
      lines.push('  Comments: +' + report.commentsSentiment.positive + '% / -' + report.commentsSentiment.negative + '%');
    }
    lines.push('');
  });

  return lines.join('\n');
}