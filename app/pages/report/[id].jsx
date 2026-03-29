import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, MoreVerticalIcon, DownloadIcon, ShareIcon, CalendarIcon, BarChartIcon } from '../../../components/Icons';
import { FilterChips, KpiCard, FindingsCard, SentimentWordCloud, DonutLegend, HashtagCloud, SectionTitle, SimpleBarChart, IntentCard } from '../../../components/ReportComponents';
import { EyeIcon, UsersIcon, MonitorIcon, ActivityIcon, MessageIcon, ThumbsUpIcon, AtSignIcon, SmileIcon, FileIcon } from '../../../components/Icons';
import AISummaryCard from '../../../components/AISummaryCard';
import AIChatButton from '../../../components/AIChatButton';
import AIChatModal from '../../../components/AIChatModal';
import { generateReportSummary, chatWithReport } from '../../../services/aiService';

const { width, height } = Dimensions.get('window');

const reportData = {
  '1': { name: 'Climate Summit 2026', dateRange: '01 Mar 2026 — 31 Mar 2026' },
  '2': { name: 'Tech Layoffs Wave', dateRange: '15 Feb 2026 — 15 Mar 2026' },
  '3': { name: 'Renewable Energy Egypt', dateRange: '01 Jan 2026 — 28 Feb 2026' },
  '4': { name: 'Gaza Ceasefire Talks', dateRange: '10 Mar 2026 — 17 Mar 2026' },
};

const kpis = [
  { icon: <EyeIcon />, label: 'Total Views', value: '28M', iconBg: '#f3e6f3' },
  { icon: <UsersIcon />, label: 'Total Avg Reach', value: '1.8B', iconBg: '#ede4ed' },
  { icon: <MonitorIcon />, label: 'Total Impressions', value: '4.2B', iconBg: '#e8f0ff' },
  { icon: <ActivityIcon />, label: 'Total Engagements', value: '95K', iconBg: '#fff7e0' },
  { icon: <MessageIcon />, label: 'Total Comments', value: '12K', iconBg: '#e6f9f4' },
  { icon: <View style={{ width: 18, height: 18 }}><ShareIcon size={18} /></View>, label: 'Total Shares', value: '3.5K', iconBg: '#fff0f3' },
  { icon: <ThumbsUpIcon />, label: 'Total Likes', value: '78K', iconBg: '#fce7f3' },
  { icon: <AtSignIcon />, label: 'Total Mentions', value: '4.1K', iconBg: '#fef3c7' },
  { icon: <SmileIcon />, label: 'Posts Sentiment', value: '+68', iconBg: '#f0fdf4', isPositive: true },
  { icon: <MessageIcon size={18} color="#ea580c" />, label: 'Comments Sentiment', value: '+82', iconBg: '#fff7ed', isPositive: true },
  { icon: <BarChartIcon />, label: 'Eng. over Avg Reach', value: '9.4M', iconBg: '#eff6ff' },
  { icon: <FileIcon />, label: 'Eng. Per Post', value: '95K', iconBg: '#f5f3ff' },
];

const chartLabels = ['01 Mar', '03 Mar', '05 Mar', '08 Mar', '10 Mar', '15 Mar', '17 Mar', '19 Mar', '22 Mar', '24 Mar', '26 Mar', '28 Mar'];

const postsData = [42, 120, 95, 210, 180, 255, 170, 195, 148, 230, 160, 175].map((v, i) => ({ label: chartLabels[i], value: v }));
const engData = [1.2, 5.6, 3.4, 18, 9.2, 22, 8.4, 11, 6.8, 15, 7.2, 8.9].map((v, i) => ({ label: chartLabels[i], value: v }));
const viewsData = [0.8, 3.2, 1.9, 12, 5.5, 14, 6, 7.8, 4.2, 9.8, 4.9, 5.6].map((v, i) => ({ label: chartLabels[i], value: v }));
const likesData = [0.95, 4.2, 2.6, 14, 7.1, 17.5, 6.4, 8.9, 5.1, 11.2, 5.8, 6.7].map((v, i) => ({ label: chartLabels[i], value: v }));
const sharesData = [60, 280, 190, 820, 440, 960, 380, 510, 290, 680, 320, 410].map((v, i) => ({ label: chartLabels[i], value: v }));
const commentsData = [190, 820, 560, 2100, 1400, 2800, 1100, 1600, 900, 1850, 980, 1200].map((v, i) => ({ label: chartLabels[i], value: v }));
const reachData = [320, 1200, 890, 3400, 2100, 4500, 1800, 2600, 1400, 3200, 1600, 2000].map((v, i) => ({ label: chartLabels[i], value: v }));

const positiveWords = ['رائع', 'ممتاز', 'مبادرة', 'تفاؤل', 'amazing', 'hope', 'progress', 'شكراً', 'green', 'نجاح'];
const negativeWords = ['أزمة', 'تأخر', 'فشل', 'weak', 'delay', 'broken', 'ظلم', 'fake'];
const postPosWords = ['future', 'change', 'مستقبل', 'energy', 'clean', 'بيئة'];
const postNegWords = ['crisis', 'flood', 'تلوث', 'drought', 'خطر'];

const hashtags = ['#climate_summit', '#COP2026', '#قمة_المناخ', '#GreenEgypt', '#ClimateAction', '#renewableenergy', '#NetZero2026', '#طاقة_نظيفة', '#foryou', '#ClimateChange', '#EgyptGreen', '#solar', '#MENA_climate', '#sustainability', '#تغير_المناخ', '#fyp', '#2026Summit', '#greentech'];

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [chatVisible, setChatVisible] = useState(false);

  const isSmallDevice = height < 700;
  const report = reportData[id] || reportData['1'];

  const aiContextData = {
    name: report.name,
    dateRange: report.dateRange,
    kpis: kpis.map((k) => ({ label: k.label, value: k.value })),
    fakePercent: 14.2,
    realPercent: 85.8,
    totalAccounts: 342,
    riskLevel: 'Medium',
    commentsSentiment: { positive: '71.4', negative: '5.8', neutral: '22.8' },
    postsSentiment: { positive: '9.6', negative: '3.1' },
    positiveWords,
    negativeWords,
    hashtags,
    platformMentions: [
      { name: 'Facebook', value: '1,240' },
      { name: 'Twitter', value: '1,680' },
      { name: 'Youtube', value: '820' },
      { name: 'Tiktok', value: '360' },
    ],
  };

  const handleGenerateSummary = useCallback(async () => {
    return generateReportSummary(aiContextData, 'keyword');
  }, [id]);

  const handleChatMessage = useCallback(async (chatHistory, userMessage) => {
    return chatWithReport(aiContextData, 'keyword', chatHistory, userMessage);
  }, [id]);

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
            {report.name}
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
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>{report.dateRange}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />

        <SectionTitle>Overview Metrics</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {kpis.map((kpi, i) => (
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

        <SectionTitle badge="⚠ Medium Risk" badgeBg="#fff7e0" badgeColor="#d97706">Our Findings</SectionTitle>
        <FindingsCard
          fakePercent={14.2}
          realPercent={85.8}
          totalAccounts={342}
          riskLevel="Medium"
          riskMessage="14.2% of accounts (49 of 342) are suspected inauthentic — above the 12% threshold. Monitor for coordinated amplification patterns."
        />

        <SectionTitle>Activity Over Time</SectionTitle>
        <SimpleBarChart title="Social Media Posts Per Day" data={postsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Engagements Per Day" data={engData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Views Per Day" data={viewsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Likes Per Day" data={likesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Shares Per Day" data={sharesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Comments Per Day" data={commentsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Avg Reach Per Day" data={reachData} isSmallDevice={isSmallDevice} />

        <SectionTitle>Comments Sentiment</SectionTitle>
        <View className="flex-row" style={{ gap: 10, marginBottom: 10 }}>
          <SentimentWordCloud title="Positive" percentage="71.4" words={positiveWords} type="positive" />
          <SentimentWordCloud title="Negative" percentage="5.8" words={negativeWords} type="negative" />
        </View>

        <DonutLegend
          title="Comments Breakdown"
          centerValue="100"
          centerLabel="score"
          items={[
            { name: 'Positive', value: '71.4%', color: '#00a878' },
            { name: 'Negative', value: '5.8%', color: '#e8365d' },
            { name: 'Neutral', value: '22.8%', color: '#f59e0b' },
          ]}
        />

        <SectionTitle>Posts Sentiment</SectionTitle>
        <View className="flex-row" style={{ gap: 10, marginBottom: 10 }}>
          <SentimentWordCloud title="Positive" percentage="9.6" words={postPosWords} type="positive" />
          <SentimentWordCloud title="Negative" percentage="3.1" words={postNegWords} type="negative" />
        </View>

        <SectionTitle>Hashtags Analysis</SectionTitle>
        <HashtagCloud hashtags={hashtags} />

        <SectionTitle>Social Media Mentions</SectionTitle>
        <DonutLegend
          title="By Platform"
          centerValue="4.1K"
          centerLabel="total"
          items={[
            { name: 'Facebook', value: '1,240', color: '#3b82f6' },
            { name: 'Twitter', value: '1,680', color: '#06b6d4' },
            { name: 'Youtube', value: '820', color: '#e8365d' },
            { name: 'Tiktok', value: '360', color: '#1a0a1a' },
          ]}
        />

        <SectionTitle>Sentiment Intent</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ width: (width - 42) / 2 }}>
            <IntentCard title="Positive Intents" isSmallDevice={isSmallDevice} items={[
              { name: 'Express Support', value: 76.2, color: '#06b6d4' },
              { name: 'Recommend', value: 5.6, color: '#ec4899' },
              { name: 'Watch & Follow', value: 18.2, color: '#10b981' },
            ]} />
          </View>
          <View style={{ width: (width - 42) / 2 }}>
            <IntentCard title="Negative Intents" isSmallDevice={isSmallDevice} items={[
              { name: 'Disapproval', value: 68.5, color: '#06b6d4' },
              { name: 'Criticism', value: 4.2, color: '#ec4899' },
              { name: 'Question', value: 27.3, color: '#10b981' },
            ]} />
          </View>
          <View style={{ width: (width - 42) / 2 }}>
            <IntentCard title="Positive Drivers" isSmallDevice={isSmallDevice} items={[
              { name: 'Compliments', value: 72.1, color: '#06b6d4' },
              { name: 'Enjoyment', value: 16.4, color: '#ec4899' },
              { name: 'Feedback', value: 11.5, color: '#10b981' },
            ]} />
          </View>
          <View style={{ width: (width - 42) / 2 }}>
            <IntentCard title="Negative Drivers" isSmallDevice={isSmallDevice} items={[
              { name: 'Criticism', value: 64.8, color: '#06b6d4' },
              { name: 'Concerns', value: 27.6, color: '#ec4899' },
              { name: 'Dislike', value: 7.6, color: '#10b981' },
            ]} />
          </View>
        </View>
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