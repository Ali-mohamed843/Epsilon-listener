import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackIcon, SparkleIcon } from '../../../components/Icons';
import CompareSelector from '../../../components/CompareSelector';
import { buildAlertsDataPackage } from '../../../services/alertsData';

var { width, height } = Dimensions.get('window');

var MAX_SELECTIONS = 3;

export default function CompareSelectionScreen() {
  var insets = useSafeAreaInsets();
  var router = useRouter();
  var isSmallDevice = height < 700;

  var dataPackage = buildAlertsDataPackage();

  var allItems = [];

  dataPackage.keywordReports.forEach(function(report) {
    allItems.push({
      id: 'keyword_' + report.id,
      originalId: report.id,
      type: 'keyword',
      name: report.name,
      dateRange: report.dateRange,
      riskLevel: report.riskLevel,
      kpis: report.kpis,
      fakePercent: report.fakePercent,
      realPercent: report.realPercent,
      totalAccounts: report.totalAccounts,
      commentsSentiment: report.commentsSentiment,
      postsSentiment: report.postsSentiment,
    });
  });

  dataPackage.profileReports.forEach(function(report) {
    allItems.push({
      id: 'profile_' + report.id,
      originalId: report.id,
      type: 'profile',
      name: report.name,
      platform: report.platform,
      dateRange: report.dateRange,
      riskLevel: report.riskLevel,
      kpis: report.kpis,
      fakePercent: report.fakePercent,
      realPercent: report.realPercent,
      totalAccounts: report.totalAccounts,
      commentsSentiment: report.commentsSentiment,
    });
  });

  var [selectedIds, setSelectedIds] = useState([]);

  var handleToggle = function(item) {
    setSelectedIds(function(prev) {
      if (prev.indexOf(item.id) !== -1) {
        return prev.filter(function(id) { return id !== item.id; });
      }
      if (prev.length >= MAX_SELECTIONS) return prev;
      return prev.concat([item.id]);
    });
  };

  var handleCompare = function() {
    var selectedItems = allItems.filter(function(item) {
      return selectedIds.indexOf(item.id) !== -1;
    });
    router.push({
      pathname: '/pages/compare/results',
      params: { items: JSON.stringify(selectedItems) },
    });
  };

  var canCompare = selectedIds.length >= 2;

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
          style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }}
        />

        <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
          <TouchableOpacity
            onPress={function() { router.back(); }}
            className="items-center justify-center"
            style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 }}
          >
            <BackIcon />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>
              Analysis
            </Text>
            <Text className="text-white font-extrabold" style={{ fontSize: isSmallDevice ? 18 : 20, letterSpacing: -0.4 }}>
              Compare
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: width * 0.06, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a0a1a', marginBottom: 4 }}>
          Select items to compare
        </Text>
        <Text style={{ fontSize: 12, color: '#9e859e', lineHeight: 18 }}>
          Choose 2-3 keywords or profiles for AI-powered comparison
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: width * 0.06,
          paddingBottom: 12,
        }}
      >
        <Text style={{ fontSize: 12, color: '#9e859e' }}>
          <Text style={{ fontWeight: '700', color: '#6e226e' }}>{selectedIds.length}</Text>
          {' '}of {MAX_SELECTIONS} selected
        </Text>
        {selectedIds.length > 0 && (
          <TouchableOpacity onPress={function() { setSelectedIds([]); }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#e8365d' }}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: width * 0.06, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 4 }}>
          Keywords
        </Text>
        {allItems.filter(function(i) { return i.type === 'keyword'; }).map(function(item) {
          return (
            <CompareSelector
              key={item.id}
              item={item}
              isSelected={selectedIds.indexOf(item.id) !== -1}
              onToggle={handleToggle}
              disabled={selectedIds.length >= MAX_SELECTIONS}
            />
          );
        })}

        <Text style={{ fontSize: 11, fontWeight: '700', color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>
          Profiles
        </Text>
        {allItems.filter(function(i) { return i.type === 'profile'; }).map(function(item) {
          return (
            <CompareSelector
              key={item.id}
              item={item}
              isSelected={selectedIds.indexOf(item.id) !== -1}
              onToggle={handleToggle}
              disabled={selectedIds.length >= MAX_SELECTIONS}
            />
          );
        })}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: width * 0.06,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
          borderTopWidth: 1,
          borderTopColor: '#ede4ed',
          backgroundColor: '#faf5fa',
        }}
      >
        <TouchableOpacity
          onPress={handleCompare}
          disabled={!canCompare}
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: canCompare ? '#6e226e' : '#ede4ed',
            height: 50,
            borderRadius: 14,
            gap: 8,
            shadowColor: '#6e226e',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: canCompare ? 0.3 : 0,
            shadowRadius: 20,
            elevation: canCompare ? 6 : 0,
          }}
        >
          <SparkleIcon size={18} color={canCompare ? '#fff' : '#c8b2c8'} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: canCompare ? '#fff' : '#c8b2c8' }}>
            Compare with AI
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}