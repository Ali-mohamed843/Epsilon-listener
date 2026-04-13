// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Linking } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import Svg, { Path } from 'react-native-svg';
// import { BackIcon, MoreVerticalIcon, DownloadIcon, ShareIcon } from '../../../components/Icons';
// import { FilterChips, KpiCard, FindingsCard, DonutLegend, HashtagCloud, SectionTitle, SimpleBarChart } from '../../../components/ReportComponents';
// import SentimentWordCloudWebView from '../../../components/SentimentWordCloudWebView';
// import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon, BarChartIcon } from '../../../components/Icons';
// import ReportFilters from '../../../components/ReportFilters';
// import AISummaryCard from '../../../components/AISummaryCard';
// import AIChatButton from '../../../components/AIChatButton';
// import AIChatModal from '../../../components/AIChatModal';
// import { generateReportSummary, chatWithReport } from '../../../services/aiService';
// import { fetchProfileReport } from '../../../api/profileReportApi';

// const { width, height } = Dimensions.get('window');
// const formatNumber = (num) => { if (!num && num !== 0) return '0'; const n = Number(num); if (isNaN(n)) return '0'; if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B'; if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(1) + 'K'; return n.toString(); };

// const FacebookBadge = ({ size = 10 }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2"><Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></Svg>);
// const InstagramBadge = ({ size = 10 }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="#e1306c"><Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></Svg>);
// const TwitterBadge = ({ size = 10 }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="#1da1f2"><Path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></Svg>);
// const platformBadges = { facebook: FacebookBadge, instagram: InstagramBadge, twitter: TwitterBadge, 'facebook-profile': FacebookBadge, 'instagram-profile': InstagramBadge, 'twitter-profile': TwitterBadge };
// const platformGradients = { facebook: '#1877f2', instagram: '#e1306c', twitter: '#1da1f2', 'facebook-profile': '#1877f2', 'instagram-profile': '#e1306c', 'twitter-profile': '#1da1f2' };

// export default function ProfileReportScreen() {
//   const insets = useSafeAreaInsets(); const router = useRouter(); const { id } = useLocalSearchParams();
//   const [reportData, setReportData] = useState(null); const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(''); const [sentimentFilter, setSentimentFilter] = useState('All');
//   const [chatVisible, setChatVisible] = useState(false); const [dateRange, setDateRange] = useState(null);
//   const isSmallDevice = height < 700;

//   // Handle hashtag press
//   const handleHashtagPress = useCallback((hashtag) => {
//     console.log('Hashtag pressed:', hashtag);
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
//     const result = await fetchProfileReport(id, range);
//     console.log('Profile Report Result:', result);
//     console.log('Hashtags from API:', result?.data?.hashtags);
//     if (result.success) {
//       setReportData(result.data);
//       if (!range && result.data.profile) setDateRange({ from: new Date(result.data.profile.start_date), to: new Date(result.data.profile.end_date) });
//     } else setError(result.message || 'Failed to load report data');
//     setIsLoading(false);
//   };

//   useEffect(() => { if (id) loadReport(); }, [id]);
//   const handleDateChange = (range) => { setDateRange(range); loadReport(range); };
//   const handleReset = () => { setDateRange(null); loadReport(null); };

//   const uiData = useMemo(() => {
//     if (!reportData) return null;
//     const { profile, stats, engagementGraph, dayGraph, commentKeywords, postKeywords, hashtags } = reportData;
    
//     console.log('Profile hashtags:', hashtags);
    
//     const commentPos = commentKeywords.percentage?.positive || 0; 
//     const commentNeg = commentKeywords.percentage?.negative || 0;
//     const commentNeu = Math.max(0, 100 - commentPos - commentNeg); 
//     const postPos = postKeywords.percentage?.positive || 0; 
//     const postNeg = postKeywords.percentage?.negative || 0;
    
//     // Full word objects for word cloud
//     const posWordsData = (commentKeywords.words || []).filter(w => w.sentiment === 'positive');
//     const negWordsData = (commentKeywords.words || []).filter(w => w.sentiment === 'negative');
    
//     // String arrays for AI context
//     const posWords = posWordsData.slice(0, 10).map(w => w.text);
//     const negWords = negWordsData.slice(0, 8).map(w => w.text);
    
//     // Keep full hashtag objects
//     const hashtagList = hashtags || [];
    
//     const platformType = profile.type || 'facebook-profile'; 
//     const platformName = platformType.replace('-profile', '').charAt(0).toUpperCase() + platformType.replace('-profile', '').slice(1);
//     const safeNum = (v) => Number(v) || 0; 
//     const transformEng = (f) => engagementGraph.map(d => ({ label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: safeNum(d[f]) }));
//     const postsData = dayGraph.map(([ts, val]) => ({ label: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: val || 0 }));
//     const riskLevel = commentNeg > 30 || postNeg > 40 ? 'High' : commentNeg > 15 || postNeg > 20 ? 'Medium' : 'Low';
    
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
//       commentPos, commentNeg, commentNeu, postPos, postNeg, 
//       posWords, negWords,
//       posWordsData, negWordsData,
//       hashtagList, // Full hashtag objects
//       platformName,
//       profileName: profile.name || 'Profile Report',
//       pageUrl: profile.pageUrls?.[0] || '',
//       dateRange: dateRange ? `${dateRange.from.toLocaleDateString()} — ${dateRange.to.toLocaleDateString()}` : 'Loading...',
//       followers: formatNumber(profile.followers || 0), riskLevel, postsData,
//       engData: transformEng('engagement'), viewsData: transformEng('total_views'), likesData: transformEng('total_likes'),
//       sharesData: transformEng('total_shares'), commentsData: transformEng('total_comments_count'), reachData: transformEng('reach'),
//     };
//   }, [reportData, dateRange]);

//   const aiContextData = useMemo(() => uiData ? { 
//     name: uiData.profileName, 
//     platform: uiData.platformName, 
//     profileUrl: uiData.pageUrl, 
//     dateRange: uiData.dateRange, 
//     kpis: uiData.kpis.map(k => ({ label: k.label, value: k.value })), 
//     fakePercent: 0, 
//     realPercent: 100, 
//     totalAccounts: 0, 
//     riskLevel: uiData.riskLevel, 
//     commentsSentiment: { positive: uiData.commentPos.toString(), negative: uiData.commentNeg.toString(), neutral: uiData.commentNeu.toString() }, 
//     postsSentiment: { positive: uiData.postPos.toString(), negative: uiData.postNeg.toString() }, 
//     positiveWords: uiData.posWords, 
//     negativeWords: uiData.negWords, 
//     hashtags: uiData.hashtagList.map(h => h.name || h), 
//     platformMentions: [{ name: uiData.platformName, value: uiData.kpis[7]?.value || '0' }] 
//   } : null, [uiData]);
  
//   const handleGenerateSummary = useCallback(async () => aiContextData ? generateReportSummary(aiContextData, 'profile') : "No data available.", [aiContextData]);
//   const handleChatMessage = useCallback(async (h, m) => aiContextData ? chatWithReport(aiContextData, 'profile', h, m) : "No data available.", [aiContextData]);

//   if (isLoading) return <View className="flex-1 bg-surface2 items-center justify-center"><ActivityIndicator size="large" color="#6e226e" /><Text className="text-muted mt-3">Loading report data...</Text></View>;
//   if (error || !uiData) return <View className="flex-1 bg-surface2 items-center justify-center px-6"><Text className="text-red-500 text-center mb-4" style={{fontSize:15,fontWeight:'600'}}>{error||'No data'}</Text><TouchableOpacity onPress={()=>loadReport(null)} className="bg-primary px-6 py-3 rounded-xl"><Text className="text-white font-bold">Retry</Text></TouchableOpacity></View>;

//   const BadgeIcon = platformBadges[reportData.profile.type] || FacebookBadge; 
//   const avatarBg = platformGradients[reportData.profile.type] || '#1877f2';

//   // Combine words for word cloud
//   const allCommentWords = [...uiData.posWordsData, ...uiData.negWordsData];

//   return (
//     <View className="flex-1 bg-surface2">
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
//       <View className="bg-primary overflow-hidden" style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: 18, paddingHorizontal: width * 0.05 }}>
//         <View className="absolute rounded-full" style={{ top: -60, right: -60, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.05)' }} />
//         <View className="flex-row items-center" style={{ marginTop: 6, marginBottom: 14, gap: 10 }}>
//           <TouchableOpacity onPress={() => router.back()} className="items-center justify-center" style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 9 }}><BackIcon size={17} /></TouchableOpacity>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
//             <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: avatarBg, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
//               <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>{uiData.profileName.charAt(0)}</Text>
//               <View style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 2 }}><BadgeIcon /></View>
//             </View>
//             <View style={{ flex: 1, minWidth: 0 }}>
//               <Text className="text-white font-extrabold" style={{ fontSize: isSmallDevice ? 15 : 16, letterSpacing: -0.3 }} numberOfLines={1}>{uiData.profileName}</Text>
//             </View>
//           </View>
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
//         <FindingsCard fakePercent={0} realPercent={100} totalAccounts={uiData.followers} riskLevel={uiData.riskLevel} riskMessage={`Analysis of ${uiData.kpis[4]?.value || 0} comments shows ${uiData.commentPos}% positive sentiment. Conversation health stable.`} />
        
//         <SectionTitle>Activity Over Time</SectionTitle>
//         <SimpleBarChart title="Posts Per Day" data={uiData.postsData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Engagements Per Day" data={uiData.engData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Views Per Day" data={uiData.viewsData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Likes Per Day" data={uiData.likesData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Shares Per Day" data={uiData.sharesData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Comments Per Day" data={uiData.commentsData} isSmallDevice={isSmallDevice} />
//         <SimpleBarChart title="Avg Reach Per Day" data={uiData.reachData} isSmallDevice={isSmallDevice} />
        
//         <SectionTitle>Comments Sentiment Analysis</SectionTitle>
//         <SentimentWordCloudWebView 
//           percentage={{ positive: uiData.commentPos, negative: uiData.commentNeg }} 
//           words={allCommentWords} 
//           height={isSmallDevice ? 380 : 420}
//         />
//         <DonutLegend title="Sentiment Breakdown" centerValue="100" centerLabel="score" items={[{ name: 'Positive', value: `${uiData.commentPos}%`, color: '#00a878' }, { name: 'Negative', value: `${uiData.commentNeg}%`, color: '#e8365d' }, { name: 'Neutral', value: `${uiData.commentNeu}%`, color: '#f59e0b' }]} />

//         {/* HASHTAGS SECTION - ADDED */}
//         <SectionTitle badge={`${uiData.hashtagList.length} tags`} badgeBg="#e6f9f4" badgeColor="#047857">Hashtags</SectionTitle>
//         <HashtagCloud hashtags={uiData.hashtagList} onHashtagPress={handleHashtagPress} />
//       </ScrollView>
      
//       <AIChatButton onPress={() => setChatVisible(true)} bottom={Math.max(insets.bottom, 16) + 12} />
//       <AIChatModal visible={chatVisible} onClose={() => setChatVisible(false)} onSendMessage={handleChatMessage} reportType="profile" />
//     </View>
//   );
// }

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { BackIcon, ShareIcon } from '../../../../components/Icons';
import { KpiCard, FindingsCard, DonutLegend, SectionTitle, SimpleBarChart } from '../../../../components/ReportComponents';
import SentimentWordCloudWebView from '../../../../components/SentimentWordCloudWebView';
import HashtagWordCloudWebView from '../../../../components/HashtagWordCloudWebView';
import ActionDropdown from '../../../../components/ActionDropdown';
import ExportDropdown from '../../../../components/ExportDropdown';
import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon, BarChartIcon } from '../../../../components/Icons';
import ReportFilters from '../../../../components/ReportFilters';
import AISummaryCard from '../../../../components/AISummaryCard';
import AIChatButton from '../../../../components/AIChatButton';
import AIChatModal from '../../../../components/AIChatModal';
import { generateReportSummary, chatWithReport } from '../../../../services/aiService';
import { fetchProfileReport } from '../../../../api/profileReportApi';

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

const FacebookBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const InstagramBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#e1306c">
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
  </Svg>
);

const TwitterBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1da1f2">
    <Path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
  </Svg>
);

const TiktokBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <Path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </Svg>
);

const YoutubeBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#ff0000">
    <Path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </Svg>
);

const platformBadges = {
  facebook: FacebookBadge,
  instagram: InstagramBadge,
  twitter: TwitterBadge,
  tiktok: TiktokBadge,
  youtube: YoutubeBadge,
  'facebook-profile': FacebookBadge,
  'instagram-profile': InstagramBadge,
  'twitter-profile': TwitterBadge,
  'tiktok-profile': TiktokBadge,
  'youtube-profile': YoutubeBadge,
};

const platformGradients = {
  facebook: '#1877f2',
  instagram: '#e1306c',
  twitter: '#1da1f2',
  tiktok: '#000000',
  youtube: '#ff0000',
  'facebook-profile': '#1877f2',
  'instagram-profile': '#e1306c',
  'twitter-profile': '#1da1f2',
  'tiktok-profile': '#000000',
  'youtube-profile': '#ff0000',
};

export default function ProfileReportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const isSmallDevice = height < 700;

  const handleSocialMediaPress = useCallback(() => {
    router.push({
      pathname: '/pages/social-media/[hash]',
      params: { hash: id, name: reportData?.profile?.name || 'Profile' },
    });
  }, [router, id, reportData]);

  const handleAuthorsPress = useCallback(() => {
    router.push({
      pathname: '/pages/authors/[hash]',
      params: { hash: id, name: reportData?.profile?.name || 'Profile' },
    });
  }, [router, id, reportData]);

  const loadReport = async (range) => {
    setIsLoading(true);
    setError('');
    const result = await fetchProfileReport(id, range);
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

    const { profile, stats, engagementGraph, dayGraph, commentKeywords, postKeywords, hashtags } = reportData;

    const commentPos = commentKeywords.percentage?.positive || 0;
    const commentNeg = commentKeywords.percentage?.negative || 0;
    const commentNeu = Math.max(0, 100 - commentPos - commentNeg);
    const postPos = postKeywords.percentage?.positive || 0;
    const postNeg = postKeywords.percentage?.negative || 0;

    const posWordsData = (commentKeywords.words || []).filter(w => w.sentiment === 'positive');
    const negWordsData = (commentKeywords.words || []).filter(w => w.sentiment === 'negative');

    const posWords = posWordsData.slice(0, 10).map(w => w.text);
    const negWords = negWordsData.slice(0, 8).map(w => w.text);

    const hashtagList = hashtags || [];

    const platformType = profile.type || 'facebook-profile';
    const platformName = platformType.replace('-profile', '').charAt(0).toUpperCase() + platformType.replace('-profile', '').slice(1);

    const safeNum = (v) => Number(v) || 0;

    const transformEng = (f) => engagementGraph.map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: safeNum(d[f]),
    }));

    const postsData = dayGraph.map(([ts, val]) => ({
      label: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: val || 0,
    }));

    const riskLevel = commentNeg > 30 || postNeg > 40 ? 'High' : commentNeg > 15 || postNeg > 20 ? 'Medium' : 'Low';

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
      posWordsData,
      negWordsData,
      hashtagList,
      platformName,
      profileName: profile.name || 'Profile Report',
      pageUrl: profile.pageUrls?.[0] || '',
      dateRange: dateRange
        ? `${dateRange.from.toLocaleDateString()} — ${dateRange.to.toLocaleDateString()}`
        : 'Loading...',
      followers: formatNumber(profile.followers || 0),
      riskLevel,
      postsData,
      engData: transformEng('engagement'),
      viewsData: transformEng('total_views'),
      likesData: transformEng('total_likes'),
      sharesData: transformEng('total_shares'),
      commentsData: transformEng('total_comments_count'),
      reachData: transformEng('reach'),
    };
  }, [reportData, dateRange]);

  const aiContextData = useMemo(() => {
    if (!uiData) return null;
    return {
      name: uiData.profileName,
      platform: uiData.platformName,
      profileUrl: uiData.pageUrl,
      dateRange: uiData.dateRange,
      kpis: uiData.kpis.map(k => ({ label: k.label, value: k.value })),
      fakePercent: 0,
      realPercent: 100,
      totalAccounts: 0,
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
      platformMentions: [{ name: uiData.platformName, value: uiData.kpis[7]?.value || '0' }],
    };
  }, [uiData]);

  const handleGenerateSummary = useCallback(async () => {
    return aiContextData ? generateReportSummary(aiContextData, 'profile') : "No data available.";
  }, [aiContextData]);

  const handleChatMessage = useCallback(async (h, m) => {
    return aiContextData ? chatWithReport(aiContextData, 'profile', h, m) : "No data available.";
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

  const BadgeIcon = platformBadges[reportData.profile.type] || FacebookBadge;
  const avatarBg = platformGradients[reportData.profile.type] || '#1877f2';

  const allCommentWords = [...uiData.posWordsData, ...uiData.negWordsData];

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: 18,
          paddingHorizontal: width * 0.04,
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
        <View className="flex-row items-center" style={{ marginTop: 6, marginBottom: 14, gap: 8 }}>
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

          <Text
            className="text-white font-extrabold flex-1"
            style={{ fontSize: isSmallDevice ? 14 : 16, letterSpacing: -0.3 }}
            numberOfLines={1}
          >
            {uiData.profileName}
          </Text>

          <ExportDropdown
            showId={reportData?.profile?.id}
            dateRange={dateRange}
            reportName={uiData.profileName}
          />

          <ActionDropdown
            onSocialMediaPress={handleSocialMediaPress}
            onAuthorsPress={handleAuthorsPress}
          />
        </View>
      </View>

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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />

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

        <SectionTitle>Activity Over Time</SectionTitle>
        <SimpleBarChart title="Posts Per Day" data={uiData.postsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Engagements Per Day" data={uiData.engData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Views Per Day" data={uiData.viewsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Likes Per Day" data={uiData.likesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Shares Per Day" data={uiData.sharesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Comments Per Day" data={uiData.commentsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Avg Reach Per Day" data={uiData.reachData} isSmallDevice={isSmallDevice} />

        <SectionTitle>Comments Sentiment Analysis</SectionTitle>
        <SentimentWordCloudWebView
          percentage={{ positive: uiData.commentPos, negative: uiData.commentNeg }}
          words={allCommentWords}
          height={isSmallDevice ? 380 : 420}
          showHash={id} 
        />
        <DonutLegend
          title="Sentiment Breakdown"
          centerValue="100"
          centerLabel="score"
          items={[
            { name: 'Positive', value: `${uiData.commentPos}%`, color: '#00a878' },
            { name: 'Negative', value: `${uiData.commentNeg}%`, color: '#e8365d' },
            { name: 'Neutral', value: `${uiData.commentNeu}%`, color: '#f59e0b' },
          ]}
        />

        <SectionTitle>Hashtags</SectionTitle>
        <HashtagWordCloudWebView
          hashtags={uiData.hashtagList}
          height={isSmallDevice ? 350 : 400}
          showHash={id}
        />
      </ScrollView>

      <AIChatButton onPress={() => setChatVisible(true)} bottom={Math.max(insets.bottom, 16) + 12} />
      <AIChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onSendMessage={handleChatMessage}
        reportType="profile"
      />
    </View>
  );
}