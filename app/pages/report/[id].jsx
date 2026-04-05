import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, MoreVerticalIcon, DownloadIcon, ShareIcon, CalendarIcon, BarChartIcon } from '../../../components/Icons';
import { FilterChips, KpiCard, FindingsCard, SentimentWordCloud, DonutLegend, HashtagCloud, SectionTitle, SimpleBarChart, IntentCard } from '../../../components/ReportComponents';
import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon } from '../../../components/Icons';
import AISummaryCard from '../../../components/AISummaryCard';
import AIChatButton from '../../../components/AIChatButton';
import AIChatModal from '../../../components/AIChatModal';
import { generateReportSummary, chatWithReport } from '../../../services/aiService';
import { fetchKeywordReport } from '../../../api/keywordReportApi';

const { width, height } = Dimensions.get('window');

const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const formatDateRange = (start, end) => {
  if (!start || !end) return 'Monitoring Active';
  const f = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${f(start)} — ${f(end)}`;
};

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [chatVisible, setChatVisible] = useState(false);

  const isSmallDevice = height < 700;

  useEffect(() => {
    if (!id) return;
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setIsLoading(true);
    setError('');
    const result = await fetchKeywordReport(id);
    if (result.success) {
      setReportData(result.data);
    } else {
      setError(result.message || 'Failed to load report data');
    }
    setIsLoading(false);
  };

  // Transform raw data to UI format
  const uiData = useMemo(() => {
    if (!reportData) return null;
    
    const { profile, stats, platforms, engagementGraph, commentKeywords, postKeywords, hashtags, feedback } = reportData;

    const commentPos = commentKeywords.percentage?.positive || 0;
    const commentNeg = commentKeywords.percentage?.negative || 0;
    const commentNeu = Math.max(0, 100 - commentPos - commentNeg);
    const postPos = postKeywords.percentage?.positive || 0;
    const postNeg = postKeywords.percentage?.negative || 0;

    const riskLevel = commentNeg > 30 || postNeg > 40 ? 'High' : commentNeg > 15 || postNeg > 20 ? 'Medium' : 'Low';
    
    const posWords = (commentKeywords.words || []).filter(w => w.sentiment === 'positive').slice(0, 10).map(w => w.text);
    const negWords = (commentKeywords.words || []).filter(w => w.sentiment === 'negative').slice(0, 8).map(w => w.text);
    const postPosWords = (postKeywords.words || []).filter(w => w.sentiment === 'positive').slice(0, 6).map(w => w.text);
    const postNegWords = (postKeywords.words || []).filter(w => w.sentiment === 'negative').slice(0, 4).map(w => w.text);
    const hashtagList = (hashtags || []).slice(0, 18).map(h => h.name);
    
    const platformMentions = (platforms || []).map(p => ({ 
      name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1), 
      value: p.mentions || '0' 
    }));

    const safeNum = (val) => Number(val) || 0;
    const transformEng = (field) => engagementGraph.map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: safeNum(d[field])
    }));

    const mapIntent = (arr, colorSet) => {
      if (!arr || !arr.length) return [];
      return arr.map((item, i) => ({
        name: typeof item === 'string' ? item : item.name,
        value: 100 - (i * 15),
        color: colorSet[i % colorSet.length]
      })).slice(0, 3);
    };

    const feedbackData = feedback || profile.optionalFeedbacks || {};

    return {
      kpis: [
        { icon: <EyeIcon />, label: 'Total Views', value: formatNumber(stats.total_views), iconBg: '#f3e6f3' },
        { icon: <UsersIcon />, label: 'Total Reach', value: formatNumber(stats.reach), iconBg: '#ede4ed' },
        { icon: <MonitorIcon />, label: 'Total Impressions', value: formatNumber(stats.impressions), iconBg: '#e8f0ff' },
        { icon: <ActivityIcon />, label: 'Total Engagements', value: formatNumber(stats.engagement), iconBg: '#fff7e0' },
        { icon: <MessageIcon />, label: 'Total Comments', value: formatNumber(stats.total_comments_count), iconBg: '#e6f9f4' },
        { icon: <View style={{width:18,height:18}}><ShareIcon size={18}/></View>, label: 'Total Shares', value: formatNumber(stats.total_shares), iconBg: '#fff0f3' },
        { icon: <ThumbsUpIcon />, label: 'Total Likes', value: formatNumber(stats.total_likes), iconBg: '#fce7f3' },
        { icon: <AtSignIcon />, label: 'Total Mentions', value: formatNumber(stats.mentions), iconBg: '#fef3c7' },
        { icon: <SmileIcon />, label: 'Posts Sentiment', value: `+${Math.round(postPos - postNeg)}`, iconBg: '#f0fdf4', isPositive: postPos > postNeg },
        { icon: <MessageIcon size={18} color="#ea580c" />, label: 'Comments Sentiment', value: `+${Math.round(commentPos - commentNeg)}`, iconBg: '#fff7ed', isPositive: commentPos > commentNeg },
        { icon: <BarChartIcon />, label: 'Eng. over Reach', value: formatNumber(Math.round((stats.engagement / (stats.reach || 1)) * 1000000)), iconBg: '#eff6ff' },
        { icon: <FileIcon />, label: 'Eng. Per Post', value: formatNumber(Math.round((stats.engagement || 0) / (commentKeywords.totalPosts || 1))), iconBg: '#f5f3ff' },
      ],
      commentPos, commentNeg, commentNeu, postPos, postNeg,
      posWords, negWords, postPosWords, postNegWords,
      hashtagList, platformMentions,
      engData: transformEng('engagement'),
      viewsData: transformEng('total_views'),
      likesData: transformEng('total_likes'),
      sharesData: transformEng('total_shares'),
      commentsData: transformEng('total_comments_count'),
      reachData: transformEng('reach'),
      name: profile.name || 'Keyword Report',
      dateRange: formatDateRange(profile.start_date, profile.end_date),
      riskLevel,
      totalAccounts: stats.total_comments_count || 0,
      totalMentions: stats.mentions || 0, // Exposed for easy access in JSX
      intents: {
        positiveIntents: mapIntent(feedbackData.positiveIntents || [], ['#06b6d4', '#ec4899', '#10b981']),
        negativeIntents: mapIntent(feedbackData.negativeIntents || [], ['#f97316', '#ef4444', '#8b5cf6']),
        positiveDrivers: mapIntent(feedbackData.positiveDrivers || [], ['#14b8a6', '#a855f7', '#0ea5e9']),
        negativeDrivers: mapIntent(feedbackData.negativeDrivers || [], ['#f43f5e', '#6366f1', '#84cc16']),
      }
    };
  }, [reportData]);

  const aiContextData = useMemo(() => {
    if (!uiData) return null;
    return {
      name: uiData.name,
      dateRange: uiData.dateRange,
      kpis: uiData.kpis.map(k => ({ label: k.label, value: k.value })),
      fakePercent: 0,
      realPercent: 100,
      totalAccounts: uiData.totalAccounts,
      riskLevel: uiData.riskLevel,
      commentsSentiment: { positive: uiData.commentPos.toString(), negative: uiData.commentNeg.toString(), neutral: uiData.commentNeu.toString() },
      postsSentiment: { positive: uiData.postPos.toString(), negative: uiData.postNeg.toString() },
      positiveWords: uiData.posWords,
      negativeWords: uiData.negWords,
      hashtags: uiData.hashtagList,
      platformMentions: uiData.platformMentions,
    };
  }, [uiData]);

  const handleGenerateSummary = useCallback(async () => {
    if (!aiContextData) return "No data available.";
    return generateReportSummary(aiContextData, 'keyword');
  }, [aiContextData]);

  const handleChatMessage = useCallback(async (chatHistory, userMessage) => {
    if (!aiContextData) return "I don't have access to this report's data right now.";
    return chatWithReport(aiContextData, 'keyword', chatHistory, userMessage);
  }, [aiContextData]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center">
        <ActivityIndicator size="large" color="#6e226e" />
        <Text className="text-muted mt-3" style={{ fontSize: 14 }}>Loading report data...</Text>
      </View>
    );
  }

  if (error || !uiData) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center px-6">
        <Text className="text-red-500 text-center mb-4" style={{ fontSize: 15, fontWeight: '600' }}>
          {error || 'No data available for this report.'}
        </Text>
        <TouchableOpacity onPress={loadReport} className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-bold text-sm">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View className="bg-primary overflow-hidden" style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: isSmallDevice ? 18 : 22, paddingHorizontal: width * 0.05 }}>
        <View className="absolute rounded-full" style={{ top: -60, right: -60, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.05)' }} />

        <View className="flex-row items-center" style={{ marginTop: 6, marginBottom: 14, gap: 10 }}>
          <TouchableOpacity onPress={() => router.back()} className="items-center justify-center" style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 9 }}>
            <BackIcon size={17} />
          </TouchableOpacity>
          <Text className="text-white font-extrabold flex-1" style={{ fontSize: isSmallDevice ? 16 : 18, letterSpacing: -0.3, lineHeight: 22 }} numberOfLines={2}>
            {uiData.name}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {[
            { icon: <MoreVerticalIcon />, label: 'Action' },
            { icon: <DownloadIcon />, label: 'Export' },
            { icon: <ShareIcon size={13} color="#fff" />, label: 'Share' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 6,
                gap: 5,
              }}
            >
              {action.icon}
              <Text className="text-white font-bold" style={{ fontSize: 12 }}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
        <FilterChips label="Sentiment" options={['All', 'Positive', 'Negative']} active={sentimentFilter} onSelect={setSentimentFilter} />
        <FilterChips label="Platform" options={['All', 'Facebook', 'Instagram', 'Twitter', 'Tiktok', 'Youtube']} active={platformFilter} onSelect={setPlatformFilter} />
        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Date Range</Text>
          <View className="flex-row items-center" style={{ backgroundColor: '#1a0a1a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, gap: 6, alignSelf: 'flex-start' }}>
            <CalendarIcon size={13} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>{uiData.dateRange}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />

        <SectionTitle>Overview Metrics</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {uiData.kpis.map((kpi, i) => (
            <View key={i} style={{ width: (width - 42) / 2 }}>
              <KpiCard
                icon={<View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: kpi.iconBg, alignItems: 'center', justifyContent: 'center' }}>{kpi.icon}</View>}
                label={kpi.label}
                value={kpi.value}
                isPositive={kpi.isPositive}
              />
            </View>
          ))}
        </View>

        <SectionTitle 
          badge={uiData.riskLevel === 'Low' ? '✓ Low Risk' : uiData.riskLevel === 'Medium' ? '⚠ Medium Risk' : '⚠ High Risk'} 
          badgeBg={uiData.riskLevel === 'Low' ? '#e6f9f4' : uiData.riskLevel === 'Medium' ? '#fff7e0' : '#fff0f3'} 
          badgeColor={uiData.riskLevel === 'Low' ? '#047857' : uiData.riskLevel === 'Medium' ? '#92400e' : '#991b1b'}
        >
          AI Findings
        </SectionTitle>
        <FindingsCard
          fakePercent={0}
          realPercent={100}
          totalAccounts={uiData.totalAccounts}
          riskLevel={uiData.riskLevel}
          // FIX: Used uiData.totalMentions instead of undefined 'stats' variable
          riskMessage={`Analysis of ${uiData.totalMentions} mentions shows ${uiData.commentPos}% positive sentiment. ${uiData.commentNeg > 20 ? 'Negative sentiment is elevated; monitor for brand impact.' : 'Conversation health is stable with consistent engagement.'}`}
        />

        <SectionTitle>Activity Over Time</SectionTitle>
        <SimpleBarChart title="Engagements Per Day" data={uiData.engData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Views Per Day" data={uiData.viewsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Likes Per Day" data={uiData.likesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Shares Per Day" data={uiData.sharesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Comments Per Day" data={uiData.commentsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Avg Reach Per Day" data={uiData.reachData} isSmallDevice={isSmallDevice} />

        <SectionTitle>Comments Sentiment</SectionTitle>
        <View className="flex-row" style={{ gap: 10, marginBottom: 10 }}>
          <SentimentWordCloud title="Positive" percentage={String(uiData.commentPos)} words={uiData.posWords} type="positive" />
          <SentimentWordCloud title="Negative" percentage={String(uiData.commentNeg)} words={uiData.negWords} type="negative" />
        </View>

        <DonutLegend
          title="Comments Breakdown"
          centerValue="100"
          centerLabel="score"
          items={[
            { name: 'Positive', value: `${uiData.commentPos}%`, color: '#00a878' },
            { name: 'Negative', value: `${uiData.commentNeg}%`, color: '#e8365d' },
            { name: 'Neutral', value: `${uiData.commentNeu}%`, color: '#f59e0b' },
          ]}
        />

        <SectionTitle>Posts Sentiment</SectionTitle>
        <View className="flex-row" style={{ gap: 10, marginBottom: 10 }}>
          <SentimentWordCloud title="Positive" percentage={String(uiData.postPos)} words={uiData.postPosWords} type="positive" />
          <SentimentWordCloud title="Negative" percentage={String(uiData.postNeg)} words={uiData.postNegWords} type="negative" />
        </View>

        <SectionTitle>Hashtags Analysis</SectionTitle>
        <HashtagCloud hashtags={uiData.hashtagList} />

        <SectionTitle>Social Media Mentions</SectionTitle>
        <DonutLegend
          // FIX: Used uiData.kpis[7].value which contains the formatted mentions count
          centerValue={String(uiData.kpis[7]?.value || '0')}
          centerLabel="total"
          items={uiData.platformMentions.map(p => {
            const colors = { Facebook: '#3b82f6', Instagram: '#e1306c', Twitter: '#1da1f2', Tiktok: '#1a0a1a', Youtube: '#e8365d', Linkedin: '#2563eb' };
            return { name: p.name, value: String(p.value), color: colors[p.name] || '#6e226e' };
          })}
        />

        {(uiData.intents.positiveIntents.length > 0 || uiData.intents.negativeIntents.length > 0) && (
          <>
            <SectionTitle>Sentiment Intent</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {uiData.intents.positiveIntents.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard title="Positive Intents" isSmallDevice={isSmallDevice} items={uiData.intents.positiveIntents} />
                </View>
              )}
              {uiData.intents.negativeIntents.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard title="Negative Intents" isSmallDevice={isSmallDevice} items={uiData.intents.negativeIntents} />
                </View>
              )}
              {uiData.intents.positiveDrivers.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard title="Positive Drivers" isSmallDevice={isSmallDevice} items={uiData.intents.positiveDrivers} />
                </View>
              )}
              {uiData.intents.negativeDrivers.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard title="Negative Drivers" isSmallDevice={isSmallDevice} items={uiData.intents.negativeDrivers} />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <AIChatButton
        onPress={() => setChatVisible(true)}
        bottom={Math.max(insets.bottom, 16) + 12}
      />

      <AIChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onSendMessage={handleChatMessage}
        reportType="keyword"
      />
    </View>
  );
}