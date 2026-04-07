import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackIcon, BellIcon, SparkleIcon, RefreshCWIcon } from '../../../components/Icons';
import AlertCard from '../../../components/AlertCard';
import AlertsEmptyState from '../../../components/AlertsEmptyState';
import AIChatButton from '../../../components/AIChatButton';
import AIChatModal from '../../../components/AIChatModal';
import { generateAlerts } from '../../../services/aiService';
import { fetchAlertsData, formatDataForAI } from '../../../services/alertsData';

const { width, height } = Dimensions.get('window');

const FILTER_OPTIONS = ['All', 'Critical', 'Warning', 'Info', 'Positive'];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);

  const isSmallDevice = height < 700;

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch dynamic data from API
      const dataPackage = await fetchAlertsData();
      // 2. Format for AI
      const formattedData = formatDataForAI(dataPackage);
      // 3. Generate alerts
      if (formattedData && formattedData.length > 0) {
        const generatedAlerts = await generateAlerts(formattedData);
        setAlerts(generatedAlerts || []);
      } else {
        setAlerts([]);
      }
      setHasLoaded(true);
      setDismissedIds([]);
    } catch (err) {
      setError(err.message || 'Failed to generate alerts');
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const handleDismiss = (alertId) => {
    setDismissedIds((prev) => prev.concat([alertId]));
  };

  const handleViewReport = (alert) => {
    if (alert.reportType === 'profile') {
      router.push(`/pages/report-profile/${alert.reportId}`);
    } else {
      router.push(`/pages/report/${alert.reportId}`);
    }
  };

  const handleChatMessage = useCallback(async (chatHistory, userMessage) => {
    // For chat, we can just summarize current alerts + data
    const dataPackage = await fetchAlertsData();
    const formattedData = formatDataForAI(dataPackage);
    
    return chatWithReportContext(formattedData, chatHistory, userMessage);
  }, []);

  // Simple chat fallback using current alerts
  const chatWithReportContext = async (dataText, history, msg) => {
    const historyText = history.map(m => `${m.role}: ${m.text}`).join('\n');
    const prompt = `You are an AI assistant for "Epsilon Listener". Analyze this data:\n\n${dataText}\n\n${historyText ? `History:\n${historyText}\n` : ''}User: ${msg}`;
    // In a real app, you'd send this to Gemini directly. 
    // Reusing generateReportSummary logic for chat is complex, 
    // so here we just return a placeholder or you'd add a chat endpoint.
    return "I can see your alerts are based on current live data. " + msg; 
  };

  const visibleAlerts = alerts.filter((alert) => {
    if (dismissedIds.includes(alert.id)) return false;
    if (activeFilter === 'All') return true;
    return alert.priority === activeFilter.toLowerCase();
  });

  const alertCounts = {
    all: alerts.filter(a => !dismissedIds.includes(a.id)).length,
    critical: alerts.filter(a => a.priority === 'critical' && !dismissedIds.includes(a.id)).length,
    warning: alerts.filter(a => a.priority === 'warning' && !dismissedIds.includes(a.id)).length,
    info: alerts.filter(a => a.priority === 'info' && !dismissedIds.includes(a.id)).length,
    positive: alerts.filter(a => a.priority === 'positive' && !dismissedIds.includes(a.id)).length,
  };

  const getFilterCount = (filter) => {
    if (filter === 'All') return alertCounts.all;
    return alertCounts[filter.toLowerCase()] || 0;
  };

  const getFilterColor = (filter) => {
    if (filter === 'Critical') return '#e8365d';
    if (filter === 'Warning') return '#f59e0b';
    if (filter === 'Info') return '#3b82f6';
    if (filter === 'Positive') return '#00a878';
    return '#6e226e';
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View className="bg-primary overflow-hidden" style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: isSmallDevice ? 20 : 24, paddingHorizontal: width * 0.06 }}>
        <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} className="items-center justify-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
            <BackIcon />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>Intelligence</Text>
            <Text className="text-white font-extrabold" style={{ fontSize: isSmallDevice ? 18 : 20, letterSpacing: -0.4 }}>Smart Alerts</Text>
          </View>

          <TouchableOpacity onPress={handleRefresh} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 6 }}>
            <RefreshCWIcon size={14} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {hasLoaded && !isLoading && alertCounts.all > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 16 }}>
            {alertCounts.critical > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e8365d' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{alertCounts.critical} Critical</Text>
              </View>
            )}
            {alertCounts.warning > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{alertCounts.warning} Warning</Text>
              </View>
            )}
            {alertCounts.positive > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00a878' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{alertCounts.positive} Positive</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {hasLoaded && !isLoading && alertCounts.all > 0 && (
        <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
            {FILTER_OPTIONS.map((filter) => {
              const isActive = activeFilter === filter;
              const count = getFilterCount(filter);
              const color = getFilterColor(filter);
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: isActive ? color : 'transparent',
                    borderWidth: 1.5, borderColor: isActive ? color : '#ede4ed',
                    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: isActive ? '#fff' : '#9e859e' }}>{filter}</Text>
                  {count > 0 && (
                    <View style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#f3e6f3', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, minWidth: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: isActive ? '#fff' : color }}>{count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80, flexGrow: isLoading || visibleAlerts.length === 0 ? 1 : undefined }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#6e226e" colors={['#6e226e']} />}
      >
        {isLoading && !hasLoaded && <AlertsEmptyState isLoading={true} />}

        {hasLoaded && !isLoading && error && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
            <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>{error}</Text>
            <TouchableOpacity onPress={loadAlerts} style={{ backgroundColor: '#6e226e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasLoaded && !isLoading && !error && visibleAlerts.length === 0 && <AlertsEmptyState isLoading={false} />}

        {hasLoaded && !isLoading && !error && visibleAlerts.length > 0 && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SparkleIcon size={16} color="#6e226e" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a0a1a' }}>{visibleAlerts.length} Alert{visibleAlerts.length !== 1 ? 's' : ''} Found</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '500' }}>Live AI Analysis</Text>
            </View>

            {visibleAlerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} index={index} onViewReport={handleViewReport} onDismiss={handleDismiss} />
            ))}
          </View>
        )}
      </ScrollView>

      {hasLoaded && !isLoading && (
        <AIChatButton onPress={() => setChatVisible(true)} bottom={Math.max(insets.bottom, 16) + 12} />
      )}

      <AIChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onSendMessage={handleChatMessage}
        reportType="keyword"
      />
    </View>
  );
}