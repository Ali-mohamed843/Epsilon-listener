import React from 'react';
import { View } from 'react-native';
import {
  EyeIcon,
  UsersIcon,
  MonitorIcon,
  ActivityIcon,
  MessageIcon,
  ShareIcon,
  ThumbsUpIcon,
  AtSignIcon,
  SmileIcon,
  BarChartIcon,
  FileIcon,
} from './Icons';

export const profileReportDatabase = {
  '1': {
    name: 'NileSoft Solutions',
    platform: 'facebook',
    platformColor: '#1877f2',
    profileUrl: 'facebook.com/NileSoftEgypt',
    dateRange: '01 Feb 2026 — 31 Mar 2026',
  },
  '2': {
    name: 'Desert Wind Media',
    platform: 'instagram',
    platformColor: '#e1306c',
    profileUrl: 'instagram.com/DesertWindMedia',
    dateRange: '01 Feb 2026 — 31 Mar 2026',
  },
  '3': {
    name: 'Apex News Network',
    platform: 'twitter',
    platformColor: '#1da1f2',
    profileUrl: 'twitter.com/ApexNewsNet',
    dateRange: '01 Mar 2026 — 31 Mar 2026',
  },
};

export const profileKpis = [
  { icon: <EyeIcon />, label: 'Total Views', value: '18K', iconBg: '#f3e6f3' },
  { icon: <UsersIcon />, label: 'Total Avg Reach', value: '60K', iconBg: '#ede4ed' },
  { icon: <MonitorIcon />, label: 'Total Impressions', value: '120K', iconBg: '#e8f0ff' },
  { icon: <ActivityIcon />, label: 'Total Engagements', value: '1K', iconBg: '#fff7e0' },
  { icon: <MessageIcon />, label: 'Total Comments', value: '56', iconBg: '#e6f9f4' },
  {
    icon: (
      <View style={{ width: 18, height: 18 }}>
        <ShareIcon size={18} />
      </View>
    ),
    label: 'Total Shares',
    value: '203',
    iconBg: '#fff0f3',
  },
  { icon: <ThumbsUpIcon />, label: 'Total Likes', value: '780', iconBg: '#fce7f3' },
  { icon: <AtSignIcon />, label: 'Total Mentions', value: '10', iconBg: '#fef3c7' },
  { icon: <SmileIcon />, label: 'Posts Sentiment', value: '0', iconBg: '#f0fdf4', isZero: true },
  {
    icon: <MessageIcon size={18} color="#ea580c" />,
    label: 'Comments Sentiment',
    value: '+100',
    iconBg: '#fff7ed',
    isPositive: true,
  },
  { icon: <BarChartIcon />, label: 'Eng. over Avg Reach', value: '104K', iconBg: '#eff6ff' },
  { icon: <FileIcon />, label: 'Eng. Per Post', value: '1K', iconBg: '#f5f3ff' },
  { icon: <ActivityIcon size={18} color="#00a878" />, label: 'Eng. over 1K Followers', value: '0.00%', iconBg: '#ecfdf5', isZero: true },
  { icon: <UsersIcon size={18} color="#6e226e" />, label: 'Total Followers', value: '11M', iconBg: '#f3e6f3' },
];

const chartLabels = ['03 Feb', '04 Feb', '05 Feb', '09 Feb', '10 Feb', '12 Feb', '13 Feb', '14 Feb', '18 Feb', '26 Feb'];

export const profilePostsData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileEngData = [65, 38, 18, 52, 430, 40, 48, 24, 68, 295].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileViewsData = [720, 195, 120, 200, 6400, 290, 360, 180, 480, 6600].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileLikesData = [48, 30, 14, 46, 272, 18, 28, 16, 48, 232].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileSharesData = [12, 8, 2, 2, 124, 4, 6, 2, 10, 44].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileCommentsData = [0, 0, 2, 4, 20, 2, 4, 2, 2, 20].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profileReachData = [2800, 1200, 800, 800, 27000, 1400, 1600, 800, 1800, 27200].map((v, i) => ({
  label: chartLabels[i],
  value: v,
}));

export const profilePositiveWords = ['اتحرك', 'تصفيق', 'حماس', 'كريم', 'علامات', 'ضروري', 'رمضان', 'بعت'];
export const profileNegativeWords = [];