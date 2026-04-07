// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Linking } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { BackIcon, MoreVerticalIcon, DownloadIcon, ShareIcon } from '../../../components/Icons';
// import { FilterChips, KpiCard, FindingsCard, DonutLegend, HashtagCloud, SectionTitle, SimpleBarChart, IntentCard } from '../../../components/ReportComponents';
// import SentimentWordCloudWebView from '../../../components/SentimentWordCloudWebView';
// import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon, BarChartIcon } from '../../../components/Icons';
// import ReportFilters from '../../../components/ReportFilters';
// import AISummaryCard from '../../../components/AISummaryCard';
// import AIChatButton from '../../../components/AIChatButton';
// import AIChatModal from '../../../components/AIChatModal';
// import { generateReportSummary, chatWithReport } from '../../../services/aiService';
// import { fetchKeywordReport } from '../../../api/keywordReportApi';

// const { width, height } = Dimensions.get('window');
// const formatNumber = (num) => { if (!num && num !== 0) return '0'; const n = Number(num); if (isNaN(n)) return '0'; if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B'; if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(1) + 'K'; return n.toString(); };

// export default function ReportScreen() {
//   const insets = useSafeAreaInsets(); const router = useRouter(); const { id } = useLocalSearchParams();
//   const [reportData, setReportData] = useState(null); const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(''); const [sentimentFilter, setSentimentFilter] = useState('All');
//   const [platformFilter, setPlatformFilter] = useState('All'); const [chatVisible, setChatVisible] = useState(false);
//   const [dateRange, setDateRange] = useState(null);
//   const isSmallDevice = height < 700;

//   // Handle hashtag press - opens first permalink
//   const handleHashtagPress = useCallback((hashtag) => {
//     console.log('Hashtag pressed:', hashtag); // Debug log
//     if (hashtag && hashtag.platformContents && hashtag.platformContents.length > 0) {
//       const permalink = hashtag.platformContents[0].permalink;
//       if (permalink) {
//         Linking.openURL(permalink).catch(err => {
//           console.error('Failed to open URL:', err);
//         });
//       }
//     }
//   }, []);

//   const loadReport = async (range) => {
//     setIsLoading(true); setError('');
//     const result = await fetchKeywordReport(id, range);
//     console.log('Keyword Report Result:', result); // Debug log
//     console.log('Hashtags from API:', result?.data?.hashtags); // Debug log
//     if (result.success) {
//       setReportData(result.data);
//       if (!range && result.data.profile) {
//         setDateRange({ from: new Date(result.data.profile.start_date), to: new Date(result.data.profile.end_date) });
//       }
//     } else setError(result.message || 'Failed to load report data');
//     setIsLoading(false);
//   };

//   useEffect(() => { if (id) loadReport(); }, [id]);
//   const handleDateChange = (range) => { setDateRange(range); loadReport(range); };
//   const handleReset = () => { setDateRange(null); loadReport(null); };

//   const uiData = useMemo(() => {
//     if (!reportData) return null;
//     const { profile, stats, platforms, engagementGraph, commentKeywords, postKeywords, hashtags } = reportData;
    
//     console.log('Processing hashtags:', hashtags); // Debug log
    
//     const commentPos = commentKeywords.percentage?.positive || 0; 
//     const commentNeg = commentKeywords.percentage?.negative || 0;
//     const commentNeu = Math.max(0, 100 - commentPos - commentNeg); 
//     const postPos = postKeywords.percentage?.positive || 0; 
//     const postNeg = postKeywords.percentage?.negative || 0;
//     const riskLevel = commentNeg > 30 || postNeg > 40 ? 'High' : commentNeg > 15 || postNeg > 20 ? 'Medium' : 'Low';
    
//     const posWords = (commentKeywords.words || []).filter(w => w.sentiment === 'positive');
//     const negWords = (commentKeywords.words || []).filter(w => w.sentiment === 'negative');
//     const postPosWords = (postKeywords.words || []).filter(w => w.sentiment === 'positive');
//     const postNegWords = (postKeywords.words || []).filter(w => w.sentiment === 'negative');
    
//     // Keep full hashtag objects with platformContents for linking
//     const hashtagList = hashtags || [];
//     console.log('Hashtag list for UI:', hashtagList); // Debug log
    
//     const platformMentions = (platforms || []).map(p => ({ name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1), value: p.mentions || '0' }));
//     const safeNum = (v) => Number(v) || 0;
//     const transformEng = (f) => engagementGraph.map(d => ({ label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: safeNum(d[f]) }));
//     const mapIntent = (arr, c) => !arr?.length ? [] : arr.map((item, i) => ({ name: typeof item === 'string' ? item : item.name, value: 100 - i*15, color: c[i%3] })).slice(0,3);
//     const fb = reportData.feedback || profile.optionalFeedbacks || {};

//     return {
//       kpis: [
//         { icon: <EyeIcon />, label: 'Total Views', value: formatNumber(stats.total_views), iconBg: '#f3e6f3' },
//         { icon: <UsersIcon />, label: 'Total Reach', value: formatNumber(stats.reach), iconBg: '#ede4ed' },
//         { icon: <MonitorIcon />, label: 'Total Impressions', value: formatNumber(stats.impressions), iconBg: '#e8f0ff' },
//         { icon: <ActivityIcon />, label: 'Total Engagements', value: formatNumber(stats.engagement), iconBg: '#fff7e0' },
//         { icon: <MessageIcon />, label: 'Total Comments', value: formatNumber(stats.total_comments_count), iconBg: '#e6f9f4' },
//         { icon: <View style={{width:18,height:18}}><ShareIcon size={18}/></View>, label: 'Total Shares', value: formatNumber(stats.total_shares), iconBg: '#fff0f3' },
//         { icon: <ThumbsUpIcon />, label: 'Total Likes', value: formatNumber(stats.total_likes), iconBg: '#fce7f3' },
//         { icon: <AtSignIcon />, label: 'Total Mentions', value: formatNumber(stats.mentions), iconBg: '#fef3c7' },
//         { icon: <SmileIcon />, label: 'Posts Sentiment', value: `+${Math.round(postPos - postNeg)}`, iconBg: '#f0fdf4', isPositive: postPos > postNeg },
//         { icon: <MessageIcon size={18} color="#ea580c" />, label: 'Comments Sentiment', value: `+${Math.round(commentPos - commentNeg)}`, iconBg: '#fff7ed', isPositive: commentPos > commentNeg },
//         { icon: <BarChartIcon />, label: 'Eng. over Reach', value: formatNumber(Math.round((stats.engagement / (stats.reach || 1)) * 1000000)), iconBg: '#eff6ff' },
//         { icon: <FileIcon />, label: 'Eng. Per Post', value: formatNumber(Math.round((stats.engagement || 0) / (commentKeywords.totalPosts || 1))), iconBg: '#f5f3ff' },
//       ],
//       commentPos, commentNeg, commentNeu, postPos, postNeg, posWords, negWords, postPosWords, postNegWords,
//       hashtagList, platformMentions,
//       engData: transformEng('engagement'), viewsData: transformEng('total_views'), likesData: transformEng('total_likes'),
//       sharesData: transformEng('total_shares'), commentsData: transformEng('total_comments_count'), reachData: transformEng('reach'),
//       name: profile.name || 'Keyword Report', dateRange: dateRange ? `${dateRange.from.toLocaleDateString()} — ${dateRange.to.toLocaleDateString()}` : 'Loading...',
//       riskLevel, totalAccounts: stats.total_comments_count || 0, totalMentions: stats.mentions || 0,
//       intents: { positiveIntents: mapIntent(fb.positiveIntents, ['#06b6d4','#ec4899','#10b981']), negativeIntents: mapIntent(fb.negativeIntents, ['#f97316','#ef4444','#8b5cf6']), positiveDrivers: mapIntent(fb.positiveDrivers, ['#14b8a6','#a855f7','#0ea5e9']), negativeDrivers: mapIntent(fb.negativeDrivers, ['#f43f5e','#6366f1','#84cc16']) }
//     };
//   }, [reportData, dateRange]);

//   const aiContextData = useMemo(() => uiData ? { name: uiData.name, dateRange: uiData.dateRange, kpis: uiData.kpis.map(k => ({ label: k.label, value: k.value })), fakePercent: 0, realPercent: 100, totalAccounts: uiData.totalAccounts, riskLevel: uiData.riskLevel, commentsSentiment: { positive: uiData.commentPos.toString(), negative: uiData.commentNeg.toString(), neutral: uiData.commentNeu.toString() }, postsSentiment: { positive: uiData.postPos.toString(), negative: uiData.postNeg.toString() }, positiveWords: uiData.posWords, negativeWords: uiData.negWords, hashtags: uiData.hashtagList.map(h => h.name || h), platformMentions: uiData.platformMentions } : null, [uiData]);
//   const handleGenerateSummary = useCallback(async () => aiContextData ? generateReportSummary(aiContextData, 'keyword') : "No data available.", [aiContextData]);
//   const handleChatMessage = useCallback(async (h, m) => aiContextData ? chatWithReport(aiContextData, 'keyword', h, m) : "No data available.", [aiContextData]);

//   if (isLoading) return <View className="flex-1 bg-surface2 items-center justify-center"><ActivityIndicator size="large" color="#6e226e" /><Text className="text-muted mt-3">Loading report data...</Text></View>;
//   if (error || !uiData) return <View className="flex-1 bg-surface2 items-center justify-center px-6"><Text className="text-red-500 text-center mb-4" style={{fontSize:15,fontWeight:'600'}}>{error||'No data'}</Text><TouchableOpacity onPress={()=>loadReport(null)} className="bg-primary px-6 py-3 rounded-xl"><Text className="text-white font-bold">Retry</Text></TouchableOpacity></View>;

//   // Combine all words for word cloud
//   const allCommentWords = [...uiData.posWords, ...uiData.negWords];
//   const allPostWords = [...uiData.postPosWords, ...uiData.postNegWords];

//   return (
//     <View className="flex-1 bg-surface2">
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
//       <View className="bg-primary overflow-hidden" style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: 18, paddingHorizontal: width * 0.05 }}>
//         <View className="absolute rounded-full" style={{ top: -60, right: -60, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.05)' }} />
//         <View className="flex-row items-center" style={{ marginTop: 6, marginBottom: 14, gap: 10 }}>
//           <TouchableOpacity onPress={() => router.back()} className="items-center justify-center" style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 9 }}><BackIcon size={17} /></TouchableOpacity>
//           <Text className="text-white font-extrabold flex-1" style={{ fontSize: isSmallDevice ? 16 : 18, letterSpacing: -0.3 }} numberOfLines={2}>{uiData.name}</Text>
//         </View>
//       </View>

//       <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: '#ede4ed', paddingHorizontal: 16, paddingTop: 10 }}>
//         <ReportFilters fromDate={dateRange?.from} toDate={dateRange?.to} onDateRangeChange={handleDateChange} onClear={handleReset} isDefault={false} />
//       </View>

//       <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
//         <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />
//         <SectionTitle>Overview Metrics</SectionTitle>
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{uiData.kpis.map((kpi, i) => (<View key={i} style={{ width: (width - 42) / 2 }}><KpiCard icon={<View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: kpi.iconBg, alignItems: 'center', justifyContent: 'center' }}>{kpi.icon}</View>} label={kpi.label} value={kpi.value} isPositive={kpi.isPositive} /></View>))}</View>
        
//         <SectionTitle badge={uiData.riskLevel === 'Low' ? '✓ Low Risk' : uiData.riskLevel === 'Medium' ? '⚠ Medium Risk' : '⚠ High Risk'} badgeBg={uiData.riskLevel === 'Low' ? '#e6f9f4' : uiData.riskLevel === 'Medium' ? '#fff7e0' : '#fff0f3'} badgeColor={uiData.riskLevel === 'Low' ? '#047857' : uiData.riskLevel === 'Medium' ? '#92400e' : '#991b1b'}>AI Findings</SectionTitle>
//         <FindingsCard fakePercent={0} realPercent={100} totalAccounts={uiData.totalAccounts} riskLevel={uiData.riskLevel} riskMessage={`Analysis of ${uiData.totalMentions} mentions shows ${uiData.commentPos}% positive sentiment. ${uiData.commentNeg > 20 ? 'Negative sentiment elevated.' : 'Conversation health stable.'}`} />
        
//         <SectionTitle>Activity Over Time</SectionTitle>
//         <SimpleBarChart title="Engagements" data={uiData.engData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Views" data={uiData.viewsData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Likes" data={uiData.likesData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Shares" data={uiData.sharesData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Comments" data={uiData.commentsData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Avg Reach" data={uiData.reachData} isSmallDevice={isSmallDevice} />
        
//         <SectionTitle>Comments Sentiment</SectionTitle>
//         <SentimentWordCloudWebView 
//           percentage={{ positive: uiData.commentPos, negative: uiData.commentNeg }} 
//           words={allCommentWords} 
//           height={isSmallDevice ? 380 : 420}
//         />
//         <DonutLegend title="Comments Breakdown" centerValue="100" centerLabel="score" items={[{ name: 'Positive', value: `${uiData.commentPos}%`, color: '#00a878' }, { name: 'Negative', value: `${uiData.commentNeg}%`, color: '#e8365d' }, { name: 'Neutral', value: `${uiData.commentNeu}%`, color: '#f59e0b' }]} />
        
//         <SectionTitle>Posts Sentiment</SectionTitle>
//         <SentimentWordCloudWebView 
//           percentage={{ positive: uiData.postPos, negative: uiData.postNeg }} 
//           words={allPostWords} 
//           height={isSmallDevice ? 380 : 420}
//         />
        
//         {/* HASHTAGS SECTION */}
//         <SectionTitle badge={`${uiData.hashtagList.length} tags`} badgeBg="#e6f9f4" badgeColor="#047857">Hashtags</SectionTitle>
//         <HashtagCloud hashtags={uiData.hashtagList} onHashtagPress={handleHashtagPress} />
        
//         <SectionTitle>Mentions</SectionTitle>
//         <DonutLegend title="By Platform" centerValue={String(uiData.totalMentions)} centerLabel="total" items={uiData.platformMentions.map(p => ({ name: p.name, value: String(p.value), color: {Facebook:'#3b82f6',Instagram:'#e1306c',Twitter:'#1da1f2',Tiktok:'#1a0a1a',Youtube:'#e8365d',Linkedin:'#2563eb'}[p.name] || '#6e226e' }))} />
        
//         {(uiData.intents.positiveIntents.length > 0 || uiData.intents.negativeIntents.length > 0) && <><SectionTitle>Sentiment Intent</SectionTitle><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{uiData.intents.positiveIntents.length > 0 && <View style={{ width: (width - 42) / 2 }}><IntentCard title="Positive Intents" isSmallDevice={isSmallDevice} items={uiData.intents.positiveIntents} /></View>}{uiData.intents.negativeIntents.length > 0 && <View style={{ width: (width - 42) / 2 }}><IntentCard title="Negative Intents" isSmallDevice={isSmallDevice} items={uiData.intents.negativeIntents} /></View>}{uiData.intents.positiveDrivers.length > 0 && <View style={{ width: (width - 42) / 2 }}><IntentCard title="Positive Drivers" isSmallDevice={isSmallDevice} items={uiData.intents.positiveDrivers} /></View>}{uiData.intents.negativeDrivers.length > 0 && <View style={{ width: (width - 42) / 2 }}><IntentCard title="Negative Drivers" isSmallDevice={isSmallDevice} items={uiData.intents.negativeDrivers} /></View>}</View></>}
//       </ScrollView>
//       <AIChatButton onPress={() => setChatVisible(true)} bottom={Math.max(insets.bottom, 16) + 12} />
//       <AIChatModal visible={chatVisible} onClose={() => setChatVisible(false)} onSendMessage={handleChatMessage} reportType="keyword" />
//     </View>
//   );
// }

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, ShareIcon } from '../../../components/Icons';
import { FilterChips, KpiCard, FindingsCard, DonutLegend, SectionTitle, SimpleBarChart, IntentCard } from '../../../components/ReportComponents';
import SentimentWordCloudWebView from '../../../components/SentimentWordCloudWebView';
import HashtagWordCloudWebView from '../../../components/HashtagWordCloudWebView';
import ActionDropdown from '../../../components/ActionDropdown';
import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon, BarChartIcon } from '../../../components/Icons';
import ReportFilters from '../../../components/ReportFilters';
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
  const [dateRange, setDateRange] = useState(null);
  
  const isSmallDevice = height < 700;

  // Navigation handlers for ActionDropdown
  const handleSocialMediaPress = useCallback(() => {
    router.push({
      pathname: '/pages/social-media/[hash]',
      params: { hash: id, name: uiData?.name || 'Report' },
    });
  }, [router, id]);

  const handleAuthorsPress = useCallback(() => {
    router.push({
      pathname: '/pages/authors/[hash]',
      params: { hash: id, name: uiData?.name || 'Report' },
    });
  }, [router, id]);

  const loadReport = async (range) => {
    setIsLoading(true);
    setError('');
    const result = await fetchKeywordReport(id, range);
    if (result.success) {
      setReportData(result.data);
      if (!range && result.data.profile) {
        setDateRange({
          from: new Date(result.data.profile.start_date),
          to: new Date(result.data.profile.end_date),
        });
      }
    } else {
      setError(result.message || 'Failed to load report data');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) loadReport();
  }, [id]);

  const handleDateChange = (range) => {
    setDateRange(range);
    loadReport(range);
  };

  const handleReset = () => {
    setDateRange(null);
    loadReport(null);
  };

  const uiData = useMemo(() => {
    if (!reportData) return null;
    
    const { profile, stats, platforms, engagementGraph, commentKeywords, postKeywords, hashtags } = reportData;

    const commentPos = commentKeywords.percentage?.positive || 0;
    const commentNeg = commentKeywords.percentage?.negative || 0;
    const commentNeu = Math.max(0, 100 - commentPos - commentNeg);
    const postPos = postKeywords.percentage?.positive || 0;
    const postNeg = postKeywords.percentage?.negative || 0;
    const riskLevel = commentNeg > 30 || postNeg > 40 ? 'High' : commentNeg > 15 || postNeg > 20 ? 'Medium' : 'Low';

    const posWords = (commentKeywords.words || []).filter(w => w.sentiment === 'positive');
    const negWords = (commentKeywords.words || []).filter(w => w.sentiment === 'negative');
    const postPosWords = (postKeywords.words || []).filter(w => w.sentiment === 'positive');
    const postNegWords = (postKeywords.words || []).filter(w => w.sentiment === 'negative');

    // Keep full hashtag objects with platformContents for linking
    const hashtagList = hashtags || [];

    const platformMentions = (platforms || []).map(p => ({
      name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
      value: p.mentions || '0',
    }));

    const safeNum = (v) => Number(v) || 0;

    const transformEng = (f) => engagementGraph.map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: safeNum(d[f]),
    }));

    const mapIntent = (arr, c) => {
      if (!arr?.length) return [];
      return arr.map((item, i) => ({
        name: typeof item === 'string' ? item : item.name,
        value: 100 - i * 15,
        color: c[i % 3],
      })).slice(0, 3);
    };

    const fb = reportData.feedback || profile.optionalFeedbacks || {};

    return {
      kpis: [
        { icon: <EyeIcon />, label: 'Total Views', value: formatNumber(stats.total_views), iconBg: '#f3e6f3' },
        { icon: <UsersIcon />, label: 'Total Reach', value: formatNumber(stats.reach), iconBg: '#ede4ed' },
        { icon: <MonitorIcon />, label: 'Total Impressions', value: formatNumber(stats.impressions), iconBg: '#e8f0ff' },
        { icon: <ActivityIcon />, label: 'Total Engagements', value: formatNumber(stats.engagement), iconBg: '#fff7e0' },
        { icon: <MessageIcon />, label: 'Total Comments', value: formatNumber(stats.total_comments_count), iconBg: '#e6f9f4' },
        { icon: <View style={{ width: 18, height: 18 }}><ShareIcon size={18} /></View>, label: 'Total Shares', value: formatNumber(stats.total_shares), iconBg: '#fff0f3' },
        { icon: <ThumbsUpIcon />, label: 'Total Likes', value: formatNumber(stats.total_likes), iconBg: '#fce7f3' },
        { icon: <AtSignIcon />, label: 'Total Mentions', value: formatNumber(stats.mentions), iconBg: '#fef3c7' },
        { icon: <SmileIcon />, label: 'Posts Sentiment', value: `+${Math.round(postPos - postNeg)}`, iconBg: '#f0fdf4', isPositive: postPos > postNeg },
        { icon: <MessageIcon size={18} color="#ea580c" />, label: 'Comments Sentiment', value: `+${Math.round(commentPos - commentNeg)}`, iconBg: '#fff7ed', isPositive: commentPos > commentNeg },
        { icon: <BarChartIcon />, label: 'Eng. over Reach', value: formatNumber(Math.round((stats.engagement / (stats.reach || 1)) * 1000000)), iconBg: '#eff6ff' },
        { icon: <FileIcon />, label: 'Eng. Per Post', value: formatNumber(Math.round((stats.engagement || 0) / (commentKeywords.totalPosts || 1))), iconBg: '#f5f3ff' },
      ],
      commentPos,
      commentNeg,
      commentNeu,
      postPos,
      postNeg,
      posWords,
      negWords,
      postPosWords,
      postNegWords,
      hashtagList,
      platformMentions,
      engData: transformEng('engagement'),
      viewsData: transformEng('total_views'),
      likesData: transformEng('total_likes'),
      sharesData: transformEng('total_shares'),
      commentsData: transformEng('total_comments_count'),
      reachData: transformEng('reach'),
      name: profile.name || 'Keyword Report',
      dateRange: dateRange
        ? `${dateRange.from.toLocaleDateString()} — ${dateRange.to.toLocaleDateString()}`
        : 'Loading...',
      riskLevel,
      totalAccounts: stats.total_comments_count || 0,
      totalMentions: stats.mentions || 0,
      intents: {
        positiveIntents: mapIntent(fb.positiveIntents, ['#06b6d4', '#ec4899', '#10b981']),
        negativeIntents: mapIntent(fb.negativeIntents, ['#f97316', '#ef4444', '#8b5cf6']),
        positiveDrivers: mapIntent(fb.positiveDrivers, ['#14b8a6', '#a855f7', '#0ea5e9']),
        negativeDrivers: mapIntent(fb.negativeDrivers, ['#f43f5e', '#6366f1', '#84cc16']),
      },
    };
  }, [reportData, dateRange]);

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
      commentsSentiment: {
        positive: uiData.commentPos.toString(),
        negative: uiData.commentNeg.toString(),
        neutral: uiData.commentNeu.toString(),
      },
      postsSentiment: {
        positive: uiData.postPos.toString(),
        negative: uiData.postNeg.toString(),
      },
      positiveWords: uiData.posWords,
      negativeWords: uiData.negWords,
      hashtags: uiData.hashtagList.map(h => h.name || h),
      platformMentions: uiData.platformMentions,
    };
  }, [uiData]);

  const handleGenerateSummary = useCallback(async () => {
    return aiContextData ? generateReportSummary(aiContextData, 'keyword') : "No data available.";
  }, [aiContextData]);

  const handleChatMessage = useCallback(async (h, m) => {
    return aiContextData ? chatWithReport(aiContextData, 'keyword', h, m) : "No data available.";
  }, [aiContextData]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center">
        <ActivityIndicator size="large" color="#6e226e" />
        <Text className="text-muted mt-3">Loading report data...</Text>
      </View>
    );
  }

  if (error || !uiData) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center px-6">
        <Text className="text-red-500 text-center mb-4" style={{ fontSize: 15, fontWeight: '600' }}>
          {error || 'No data'}
        </Text>
        <TouchableOpacity onPress={() => loadReport(null)} className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Combine all words for word cloud
  const allCommentWords = [...uiData.posWords, ...uiData.negWords];
  const allPostWords = [...uiData.postPosWords, ...uiData.postNegWords];

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: 18,
          paddingHorizontal: width * 0.05,
        }}
      >
        <View
          className="absolute rounded-full"
          style={{
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        <View className="flex-row items-center" style={{ marginTop: 6, marginBottom: 14, gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center justify-center"
            style={{
              width: 34,
              height: 34,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 9,
            }}
          >
            <BackIcon size={17} />
          </TouchableOpacity>

          {/* Avatar */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: '#9b4d9b',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
              {uiData.name.charAt(0)}
            </Text>
          </View>

          <Text
            className="text-white font-extrabold flex-1"
            style={{ fontSize: isSmallDevice ? 16 : 18, letterSpacing: -0.3 }}
            numberOfLines={1}
          >
            {uiData.name}
          </Text>

          {/* Actions Dropdown */}
          <ActionDropdown
            onSocialMediaPress={handleSocialMediaPress}
            onAuthorsPress={handleAuthorsPress}
          />
        </View>
      </View>

      {/* Filters */}
      <View
        className="bg-white"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#ede4ed',
          paddingHorizontal: 16,
          paddingTop: 10,
        }}
      >
        <ReportFilters
          fromDate={dateRange?.from}
          toDate={dateRange?.to}
          onDateRangeChange={handleDateChange}
          onClear={handleReset}
          isDefault={false}
        />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Summary */}
        <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />

        {/* Overview Metrics */}
        <SectionTitle>Overview Metrics</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {uiData.kpis.map((kpi, i) => (
            <View key={i} style={{ width: (width - 42) / 2 }}>
              <KpiCard
                icon={
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      backgroundColor: kpi.iconBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {kpi.icon}
                  </View>
                }
                label={kpi.label}
                value={kpi.value}
                isPositive={kpi.isPositive}
              />
            </View>
          ))}
        </View>

        {/* AI Findings */}
        <SectionTitle
          badge={
            uiData.riskLevel === 'Low'
              ? '✓ Low Risk'
              : uiData.riskLevel === 'Medium'
              ? '⚠ Medium Risk'
              : '⚠ High Risk'
          }
          badgeBg={
            uiData.riskLevel === 'Low'
              ? '#e6f9f4'
              : uiData.riskLevel === 'Medium'
              ? '#fff7e0'
              : '#fff0f3'
          }
          badgeColor={
            uiData.riskLevel === 'Low'
              ? '#047857'
              : uiData.riskLevel === 'Medium'
              ? '#92400e'
              : '#991b1b'
          }
        >
          AI Findings
        </SectionTitle>
        <FindingsCard
          fakePercent={0}
          realPercent={100}
          totalAccounts={uiData.totalAccounts}
          riskLevel={uiData.riskLevel}
          riskMessage={`Analysis of ${uiData.totalMentions} mentions shows ${uiData.commentPos}% positive sentiment. ${
            uiData.commentNeg > 20 ? 'Negative sentiment elevated.' : 'Conversation health stable.'
          }`}
        />

        {/* Activity Over Time */}
        <SectionTitle>Activity Over Time</SectionTitle>
        <SimpleBarChart title="Engagements" data={uiData.engData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Views" data={uiData.viewsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Likes" data={uiData.likesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Shares" data={uiData.sharesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Comments" data={uiData.commentsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Avg Reach" data={uiData.reachData} isSmallDevice={isSmallDevice} />

        {/* Comments Sentiment */}
        <SectionTitle>Comments Sentiment</SectionTitle>
        <SentimentWordCloudWebView
          percentage={{ positive: uiData.commentPos, negative: uiData.commentNeg }}
          words={allCommentWords}
          height={isSmallDevice ? 380 : 420}
        />
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

        {/* Posts Sentiment */}
        <SectionTitle>Posts Sentiment</SectionTitle>
        <SentimentWordCloudWebView
          percentage={{ positive: uiData.postPos, negative: uiData.postNeg }}
          words={allPostWords}
          height={isSmallDevice ? 380 : 420}
        />

        {/* Hashtags */}
        <SectionTitle>Hashtags</SectionTitle>
        <HashtagWordCloudWebView
          hashtags={uiData.hashtagList}
          height={isSmallDevice ? 320 : 380}
        />

        {/* Mentions */}
        <SectionTitle>Mentions</SectionTitle>
        <DonutLegend
          title="By Platform"
          centerValue={String(uiData.totalMentions)}
          centerLabel="total"
          items={uiData.platformMentions.map(p => ({
            name: p.name,
            value: String(p.value),
            color:
              {
                Facebook: '#3b82f6',
                Instagram: '#e1306c',
                Twitter: '#1da1f2',
                Tiktok: '#1a0a1a',
                Youtube: '#e8365d',
                Linkedin: '#2563eb',
              }[p.name] || '#6e226e',
          }))}
        />

        {/* Sentiment Intent */}
        {(uiData.intents.positiveIntents.length > 0 || uiData.intents.negativeIntents.length > 0) && (
          <>
            <SectionTitle>Sentiment Intent</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {uiData.intents.positiveIntents.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard
                    title="Positive Intents"
                    isSmallDevice={isSmallDevice}
                    items={uiData.intents.positiveIntents}
                  />
                </View>
              )}
              {uiData.intents.negativeIntents.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard
                    title="Negative Intents"
                    isSmallDevice={isSmallDevice}
                    items={uiData.intents.negativeIntents}
                  />
                </View>
              )}
              {uiData.intents.positiveDrivers.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard
                    title="Positive Drivers"
                    isSmallDevice={isSmallDevice}
                    items={uiData.intents.positiveDrivers}
                  />
                </View>
              )}
              {uiData.intents.negativeDrivers.length > 0 && (
                <View style={{ width: (width - 42) / 2 }}>
                  <IntentCard
                    title="Negative Drivers"
                    isSmallDevice={isSmallDevice}
                    items={uiData.intents.negativeDrivers}
                  />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* AI Chat */}
      <AIChatButton onPress={() => setChatVisible(true)} bottom={Math.max(insets.bottom, 16) + 12} />
      <AIChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onSendMessage={handleChatMessage}
        reportType="keyword"
      />
    </View>
  );
}