import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  BackIcon,
  MoreVerticalIcon,
  DownloadIcon,
  ShareIcon,
  CalendarIcon,
} from '../../../components/Icons';
import {
  FilterChips,
  KpiCard,
  FindingsCard,
  SentimentWordCloud,
  DonutLegend,
  SectionTitle,
  SimpleBarChart,
} from '../../../components/ReportComponents';
import {
  profileReportDatabase,
  profileKpis,
  profilePostsData,
  profileEngData,
  profileViewsData,
  profileLikesData,
  profileSharesData,
  profileCommentsData,
  profileReachData,
  profilePositiveWords,
  profileNegativeWords,
} from '../../../components/ProfileReportData';
import AISummaryCard from '../../../components/AISummaryCard';
import AIChatButton from '../../../components/AIChatButton';
import AIChatModal from '../../../components/AIChatModal';
import { generateReportSummary, chatWithReport } from '../../../services/aiService';

const { width, height } = Dimensions.get('window');

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

const platformBadges = {
  facebook: FacebookBadge,
  instagram: InstagramBadge,
  twitter: TwitterBadge,
};

const platformGradients = {
  facebook: '#1877f2',
  instagram: '#e1306c',
  twitter: '#1da1f2',
};

export default function ProfileReportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [chatVisible, setChatVisible] = useState(false);

  const isSmallDevice = height < 700;
  const report = profileReportDatabase[id] || profileReportDatabase['1'];
  const BadgeIcon = platformBadges[report.platform] || FacebookBadge;
  const avatarBg = platformGradients[report.platform] || '#1877f2';

  const aiContextData = {
    name: report.name,
    platform: report.platform,
    profileUrl: report.profileUrl,
    dateRange: report.dateRange,
    kpis: profileKpis.map((k) => ({ label: k.label, value: k.value })),
    fakePercent: 0,
    realPercent: 100,
    totalAccounts: 0,
    riskLevel: 'Low',
    commentsSentiment: { positive: '60', negative: '0', neutral: '40' },
    positiveWords: profilePositiveWords,
    negativeWords: profileNegativeWords,
  };

  const handleGenerateSummary = useCallback(async () => {
    return generateReportSummary(aiContextData, 'profile');
  }, [id]);

  const handleChatMessage = useCallback(async (chatHistory, userMessage) => {
    return chatWithReport(aiContextData, 'profile', chatHistory, userMessage);
  }, [id]);

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: isSmallDevice ? 18 : 22,
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

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: avatarBg,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
                {report.name.charAt(0)}
              </Text>
              <View
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.18,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <BadgeIcon />
              </View>
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                className="text-white font-extrabold"
                style={{ fontSize: isSmallDevice ? 15 : 16, letterSpacing: -0.3 }}
                numberOfLines={1}
              >
                {report.name}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                {report.profileUrl}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
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
              <Text className="text-white font-bold" style={{ fontSize: 12 }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
        <FilterChips
          label="Sentiment"
          options={['All', 'Positive', 'Negative']}
          active={sentimentFilter}
          onSelect={setSentimentFilter}
        />
        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: '#9e859e',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Date Range
          </Text>
          <View
            className="flex-row items-center"
            style={{
              backgroundColor: '#1a0a1a',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              gap: 6,
              alignSelf: 'flex-start',
            }}
          >
            <CalendarIcon size={13} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
              {report.dateRange}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <AISummaryCard onGenerate={handleGenerateSummary} isSmallDevice={isSmallDevice} />

        <SectionTitle>Overview Metrics</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {profileKpis.map((kpi, i) => (
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
                isZero={kpi.isZero}
              />
            </View>
          ))}
        </View>

        <SectionTitle badge="✓ Low Risk" badgeBg="#e6f9f4" badgeColor="#047857">
          Our Findings
        </SectionTitle>
        <FindingsCard
          fakePercent={0}
          realPercent={100}
          totalAccounts={0}
          riskLevel="Low"
          riskMessage="No inauthentic accounts detected within this profile's audience. Conversation integrity is confirmed healthy for this monitoring period."
        />

        <SectionTitle>Activity Over Time</SectionTitle>
        <SimpleBarChart title="Social Media Posts Per Day" data={profilePostsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Engagements Per Day" data={profileEngData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Views Per Day" data={profileViewsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Likes Per Day" data={profileLikesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Shares Per Day" data={profileSharesData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Comments Per Day" data={profileCommentsData} isSmallDevice={isSmallDevice} />
        <SimpleBarChart title="Avg Reach Per Day" data={profileReachData} isSmallDevice={isSmallDevice} />

        <SectionTitle>Comments Sentiment Analysis</SectionTitle>
        <View className="flex-row" style={{ gap: 10, marginBottom: 10 }}>
          <SentimentWordCloud
            title="Positive"
            percentage="60"
            words={profilePositiveWords}
            type="positive"
          />
          <SentimentWordCloud
            title="Negative"
            percentage="0"
            words={profileNegativeWords}
            type="negative"
          />
        </View>

        <DonutLegend
          title="Sentiment Breakdown"
          centerValue="100"
          centerLabel="score"
          items={[
            { name: 'Positive', value: '60%', color: '#00a878' },
            { name: 'Negative', value: '0%', color: '#e8365d' },
            { name: 'Neutral', value: '40%', color: '#f59e0b' },
          ]}
        />
      </ScrollView>

      <AIChatButton
        onPress={() => setChatVisible(true)}
        bottom={Math.max(insets.bottom, 16) + 12}
      />

      <AIChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onSendMessage={handleChatMessage}
        reportType="profile"
      />
    </View>
  );
}