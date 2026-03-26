import React from 'react';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

export const BackIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

export const PlusIcon = ({ size = 12, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

export const ArrowRightIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

export const CheckIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const DeleteIcon = ({ size = 15, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Svg>
);

export const CalendarIcon = ({ size = 18, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
);

export const ChevronDownIcon = ({ size = 16, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const ClockIcon = ({ size = 18, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={10} />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

export const CheckCircleIcon = ({ size = 18, color = '#2563eb' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

export const ShieldIcon = ({ size = 15, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

export const LinkIcon = ({ size = 18, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

export const InfoIcon = ({ size = 18, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={10} />
    <Line x1={12} y1={8} x2={12} y2={12} />
    <Line x1={12} y1={16} x2={12.01} y2={16} />
  </Svg>
);

export const TwitterIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
  </Svg>
);

export const TiktokIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
  </Svg>
);

export const InstagramIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </Svg>
);

export const FacebookIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

export const YoutubeIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </Svg>
);

export const LinkedinIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </Svg>
);

export const SnapchatIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.166 8.795a3.555 3.555 0 0 0-3.549 3.549 3.555 3.555 0 0 0 3.549 3.55 3.555 3.555 0 0 0 3.549-3.55 3.555 3.555 0 0 0-3.549-3.549zm0 5.851a2.302 2.302 0 1 1 0-4.605 2.302 2.302 0 0 1 0 4.605zm4.51-5.998c0 .469-.378.847-.847.847a.847.847 0 1 1 .847-.847zM12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm6.02 15.29a5.9 5.9 0 0 1-.376 1.965 3.963 3.963 0 0 1-2.262 2.261 5.9 5.9 0 0 1-1.965.376c-.861.04-1.136.05-3.324.05-2.187 0-2.466-.01-3.324-.05a5.9 5.9 0 0 1-1.965-.376A3.963 3.963 0 0 1 2.54 17.255a5.9 5.9 0 0 1-.376-1.965C2.124 14.43 2.113 14.154 2.113 12c0-2.154.01-2.43.05-3.29a5.9 5.9 0 0 1 .377-1.965A3.963 3.963 0 0 1 4.802 4.484a5.9 5.9 0 0 1 1.965-.377C7.628 4.067 7.904 4.057 12 4.057c4.095 0 4.372.01 5.29.05a5.9 5.9 0 0 1 1.966.377 3.963 3.963 0 0 1 2.261 2.261A5.9 5.9 0 0 1 21.893 8.71c.04.86.05 1.136.05 3.29 0 2.154-.01 2.43-.05 3.29z" />
  </Svg>
);

export const platformsData = [
  { id: 'twitter', name: 'Twitter', icon: TwitterIcon },
  { id: 'tiktok', name: 'Tiktok', icon: TiktokIcon },
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon },
  { id: 'youtube', name: 'Youtube', icon: YoutubeIcon },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon },
  { id: 'snapchat', name: 'Snapchat', icon: SnapchatIcon },
];

export const EyeIcon = ({ size = 18, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx={12} cy={12} r={3} />
  </Svg>
);

export const UsersIcon = ({ size = 18, color = '#7c3aed' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx={9} cy={7} r={4} />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const MonitorIcon = ({ size = 18, color = '#3b82f6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Rect x={2} y={3} width={20} height={14} rx={2} />
    <Line x1={8} y1={21} x2={16} y2={21} />
    <Line x1={12} y1={17} x2={12} y2={21} />
  </Svg>
);

export const ActivityIcon = ({ size = 18, color = '#f59e0b' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </Svg>
);

export const MessageIcon = ({ size = 18, color = '#00a878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const ShareIcon = ({ size = 18, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={18} cy={5} r={3} />
    <Circle cx={6} cy={12} r={3} />
    <Circle cx={18} cy={19} r={3} />
    <Line x1={8.59} y1={13.51} x2={15.42} y2={17.49} />
    <Line x1={15.41} y1={6.51} x2={8.59} y2={10.49} />
  </Svg>
);

export const ThumbsUpIcon = ({ size = 18, color = '#ec4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <Path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </Svg>
);

export const AtSignIcon = ({ size = 18, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={4} />
    <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </Svg>
);

export const SmileIcon = ({ size = 18, color = '#00a878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={10} />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <Line x1={9} y1={9} x2={9.01} y2={9} />
    <Line x1={15} y1={9} x2={15.01} y2={9} />
  </Svg>
);

export const BarChartIcon = ({ size = 18, color = '#1d4ed8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Line x1={18} y1={20} x2={18} y2={10} />
    <Line x1={12} y1={20} x2={12} y2={4} />
    <Line x1={6} y1={20} x2={6} y2={14} />
  </Svg>
);

export const FileIcon = ({ size = 18, color = '#7c3aed' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
  </Svg>
);

export const DownloadIcon = ({ size = 13, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1={12} y1={15} x2={12} y2={3} />
  </Svg>
);

export const MoreVerticalIcon = ({ size = 13, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={1} />
    <Circle cx={12} cy={5} r={1} />
    <Circle cx={12} cy={19} r={1} />
  </Svg>
);

export const AlertTriangleIcon = ({ size = 14, color = '#92400e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1={12} y1={9} x2={12} y2={13} />
    <Line x1={12} y1={17} x2={12.01} y2={17} />
  </Svg>
);

export const XCircleIcon = ({ size = 14, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Circle cx={12} cy={12} r={10} />
    <Line x1={15} y1={9} x2={9} y2={15} />
    <Line x1={9} y1={9} x2={15} y2={15} />
  </Svg>
);

export const UserIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);


export const EditPencilIcon = ({ size = 17, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
  </Svg>
);

export const RefreshIcon = ({ size = 17, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="23 4 23 10 17 10" />
    <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);

export const StockChartIcon = ({ size = 17, color = '#2563eb' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={18} y1={20} x2={18} y2={10} />
    <Line x1={12} y1={20} x2={12} y2={4} />
    <Line x1={6} y1={20} x2={6} y2={14} />
    <Polyline points="6 10 12 4 16 8 22 2" />
  </Svg>
);

export const CopyIcon = ({ size = 13, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={9} y={9} width={13} height={13} rx={2} />
    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Svg>
);