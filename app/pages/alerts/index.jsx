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
import {
  BackIcon,
  BellIcon,
  SparkleIcon,
  RefreshCWIcon,
} from '../../../components/Icons';
import AlertCard from '../../../components/AlertCard';
import AlertsEmptyState from '../../../components/AlertsEmptyState';
import AIChatButton from '../../../components/AIChatButton';
import AIChatModal from '../../../components/AIChatModal';
import { generateAlerts, chatWithReport } from '../../../services/aiService';
import { buildAlertsDataPackage, formatDataForAI } from '../../../services/alertsData';

const { width, height } = Dimensions.get('window');

const FILTER_OPTIONS = ['All', 'Critical', 'Warning', 'Info', 'Positive'];

export default function AlertsScreen() {
  var insets = useSafeAreaInsets();
  var router = useRouter();

  var [alerts, setAlerts] = useState([]);
  var [activeFilter, setActiveFilter] = useState('All');
  var [isLoading, setIsLoading] = useState(true);
  var [hasLoaded, setHasLoaded] = useState(false);
  var [error, setError] = useState('');
  var [chatVisible, setChatVisible] = useState(false);
  var [refreshing, setRefreshing] = useState(false);
  var [dismissedIds, setDismissedIds] = useState([]);

  var isSmallDevice = height < 700;

  var dataPackage = buildAlertsDataPackage();
  var formattedData = formatDataForAI(dataPackage);

  var chatContextData = {
    name: 'All Monitoring Data',
    dateRange: 'Multiple date ranges',
    kpis: [
      { label: 'Total Keywords Monitored', value: '4' },
      { label: 'Total Profiles Monitored', value: '3' },
      { label: 'Active Alerts', value: String(alerts.length) },
    ],
    fakePercent: 0,
    realPercent: 100,
    totalAccounts: 0,
    riskLevel: 'Mixed',
    commentsSentiment: { positive: 'Various', negative: 'Various', neutral: 'Various' },
  };

  var loadAlerts = useCallback(async function() {
    setIsLoading(true);
    setError('');
    try {
      var result = await generateAlerts(formattedData);
      setAlerts(result);
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

  useEffect(function() {
    loadAlerts();
  }, []);

  var handleRefresh = function() {
    setRefreshing(true);
    loadAlerts();
  };

  var handleDismiss = function(alertId) {
    setDismissedIds(function(prev) {
      return prev.concat([alertId]);
    });
  };

  var handleViewReport = function(alert) {
    if (alert.reportType === 'profile') {
      router.push('/pages/report-profile/' + alert.reportId);
    } else {
      router.push('/pages/report/' + alert.reportId);
    }
  };

  var handleChatMessage = useCallback(async function(chatHistory, userMessage) {
    var alertsSummary = alerts.map(function(a) {
      return '- [' + a.priority.toUpperCase() + '] ' + a.title + ': ' + a.message;
    }).join('\n');

    var fullContext = formattedData + '\n\nCurrent Active Alerts:\n' + alertsSummary;

    var contextData = {
      name: 'All Monitoring Data & Alerts',
      dateRange: 'Multiple date ranges',
      kpis: [
        { label: 'Total Keywords', value: '4' },
        { label: 'Total Profiles', value: '3' },
        { label: 'Active Alerts', value: String(alerts.length) },
      ],
      fakePercent: 0,
      realPercent: 100,
      totalAccounts: 0,
      riskLevel: 'Mixed',
      commentsSentiment: { positive: 'Various', negative: 'Various', neutral: 'Various' },
      positiveWords: [],
      negativeWords: [],
    };

    return chatWithReport(contextData, 'keyword', chatHistory, userMessage);
  }, [alerts, formattedData]);

  var visibleAlerts = alerts.filter(function(alert) {
    if (dismissedIds.indexOf(alert.id) !== -1) return false;
    if (activeFilter === 'All') return true;
    return alert.priority === activeFilter.toLowerCase();
  });

  var alertCounts = {
    all: alerts.filter(function(a) { return dismissedIds.indexOf(a.id) === -1; }).length,
    critical: alerts.filter(function(a) { return a.priority === 'critical' && dismissedIds.indexOf(a.id) === -1; }).length,
    warning: alerts.filter(function(a) { return a.priority === 'warning' && dismissedIds.indexOf(a.id) === -1; }).length,
    info: alerts.filter(function(a) { return a.priority === 'info' && dismissedIds.indexOf(a.id) === -1; }).length,
    positive: alerts.filter(function(a) { return a.priority === 'positive' && dismissedIds.indexOf(a.id) === -1; }).length,
  };

  var getFilterCount = function(filter) {
    if (filter === 'All') return alertCounts.all;
    return alertCounts[filter.toLowerCase()] || 0;
  };

  var getFilterColor = function(filter) {
    if (filter === 'Critical') return '#e8365d';
    if (filter === 'Warning') return '#f59e0b';
    if (filter === 'Info') return '#3b82f6';
    if (filter === 'Positive') return '#00a878';
    return '#6e226e';
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: isSmallDevice ? 20 : 24,
          paddingHorizontal: width * 0.06,
        }}
      >
        <View
          className="absolute rounded-full"
          style={{
            top: -50,
            right: -50,
            width: 160,
            height: 160,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />

        <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
          <TouchableOpacity
            onPress={function() { router.back(); }}
            className="items-center justify-center"
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 10,
            }}
          >
            <BackIcon />
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className="uppercase"
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              Intelligence
            </Text>
            <Text
              className="text-white font-extrabold"
              style={{ fontSize: isSmallDevice ? 18 : 20, letterSpacing: -0.4 }}
            >
              Smart Alerts
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRefresh}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.18)',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              gap: 6,
            }}
          >
            <RefreshCWIcon size={14} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {hasLoaded && !isLoading && alertCounts.all > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 16,
              gap: 16,
            }}
          >
            {alertCounts.critical > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e8365d' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                  {alertCounts.critical} Critical
                </Text>
              </View>
            )}
            {alertCounts.warning > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                  {alertCounts.warning} Warning
                </Text>
              </View>
            )}
            {alertCounts.positive > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00a878' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                  {alertCounts.positive} Positive
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {hasLoaded && !isLoading && alertCounts.all > 0 && (
        <View
          className="bg-white"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ede4ed',
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 8,
            }}
          >
            {FILTER_OPTIONS.map(function(filter) {
              var isActive = activeFilter === filter;
              var count = getFilterCount(filter);
              var color = getFilterColor(filter);

              return (
                <TouchableOpacity
                  key={filter}
                  onPress={function() { setActiveFilter(filter); }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isActive ? color : 'transparent',
                    borderWidth: 1.5,
                    borderColor: isActive ? color : '#ede4ed',
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isActive ? '#fff' : '#9e859e',
                    }}
                  >
                    {filter}
                  </Text>
                  {count > 0 && (
                    <View
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#f3e6f3',
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 10,
                        minWidth: 20,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: isActive ? '#fff' : color,
                        }}
                      >
                        {count}
                      </Text>
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
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80,
          flexGrow: isLoading || visibleAlerts.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6e226e"
            colors={['#6e226e']}
          />
        }
      >
        {isLoading && !hasLoaded && (
          <AlertsEmptyState isLoading={true} />
        )}

        {hasLoaded && !isLoading && error !== '' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: '#fff0f3',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <BellIcon size={32} color="#e8365d" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', marginBottom: 6 }}>
              Something went wrong
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#9e859e',
                textAlign: 'center',
                lineHeight: 19,
                paddingHorizontal: 40,
                marginBottom: 20,
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#6e226e',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                gap: 8,
              }}
            >
              <RefreshCWIcon size={14} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasLoaded && !isLoading && error === '' && visibleAlerts.length === 0 && (
          <AlertsEmptyState isLoading={false} />
        )}

        {hasLoaded && !isLoading && error === '' && visibleAlerts.length > 0 && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SparkleIcon size={16} color="#6e226e" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a0a1a' }}>
                  {visibleAlerts.length} Alert{visibleAlerts.length !== 1 ? 's' : ''} Found
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '500' }}>
                AI-powered analysis
              </Text>
            </View>

            {visibleAlerts.map(function(alert, index) {
              return (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  index={index}
                  onViewReport={handleViewReport}
                  onDismiss={handleDismiss}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      {hasLoaded && !isLoading && (
        <AIChatButton
          onPress={function() { setChatVisible(true); }}
          bottom={Math.max(insets.bottom, 16) + 12}
        />
      )}

      <AIChatModal
        visible={chatVisible}
        onClose={function() { setChatVisible(false); }}
        onSendMessage={handleChatMessage}
        reportType="keyword"
      />
    </View>
  );
}