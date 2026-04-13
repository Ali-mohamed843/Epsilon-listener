import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  BackIcon,
  SparkleIcon,
  RefreshCWIcon,
} from '../../../../components/Icons';
import {
  WinnerBanner,
  HeadToHeadCard,
  SentimentComparisonCard,
  RiskComparisonCard,
  TakeawaysCard,
} from '../../../../components/CompareResultCards';
import AIChatButton from '../../../../components/AIChatButton';
import AIChatModal from '../../../../components/AIChatModal';
import { generateComparison, chatWithReport } from '../../../../services/aiService';

var { width, height } = Dimensions.get('window');

function SectionLabel(props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 12 }}>
      {props.icon}
      <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a0a1a', letterSpacing: -0.2 }}>
        {props.children}
      </Text>
    </View>
  );
}

export default function CompareResultsScreen() {
  var insets = useSafeAreaInsets();
  var router = useRouter();
  var params = useLocalSearchParams();
  var isSmallDevice = height < 700;

  var [items, setItems] = useState([]);
  var [comparisonData, setComparisonData] = useState(null);
  var [isLoading, setIsLoading] = useState(true);
  var [error, setError] = useState('');
  var [chatVisible, setChatVisible] = useState(false);

  useEffect(function() {
    if (params.items) {
      try {
        var parsed = JSON.parse(params.items);
        setItems(parsed);
      } catch (e) {
        setError('Failed to load comparison items');
        setIsLoading(false);
      }
    }
  }, [params.items]);

  useEffect(function() {
    if (items.length >= 2) {
      runComparison();
    }
  }, [items]);

  var runComparison = async function() {
    setIsLoading(true);
    setError('');
    try {
      var result = await generateComparison(items);
      setComparisonData(result);
    } catch (err) {
      setError(err.message || 'Failed to generate comparison');
    } finally {
      setIsLoading(false);
    }
  };

  var handleChatMessage = useCallback(async function(chatHistory, userMessage) {
    var contextData = {
      name: 'Comparison: ' + items.map(function(i) { return i.name; }).join(' vs '),
      dateRange: 'Multiple date ranges',
      kpis: items[0] ? items[0].kpis : [],
      fakePercent: 0,
      realPercent: 100,
      totalAccounts: 0,
      riskLevel: 'Mixed',
      commentsSentiment: items[0] ? items[0].commentsSentiment : {},
      positiveWords: [],
      negativeWords: [],
    };

    return chatWithReport(contextData, 'keyword', chatHistory, userMessage);
  }, [items]);

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
              AI Analysis
            </Text>
            <Text className="text-white font-extrabold" style={{ fontSize: isSmallDevice ? 18 : 20, letterSpacing: -0.4 }}>
              Comparison Results
            </Text>
          </View>
          <TouchableOpacity
            onPress={runComparison}
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

        {items.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {items.map(function(item, i) {
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80,
          flexGrow: isLoading || error ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: '#f3e6f3',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <SparkleIcon size={28} color="#6e226e" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', marginBottom: 6 }}>
              Comparing...
            </Text>
            <Text style={{ fontSize: 13, color: '#9e859e', textAlign: 'center', lineHeight: 19, paddingHorizontal: 40, marginBottom: 20 }}>
              AI is analyzing and comparing your selected items
            </Text>
            <ActivityIndicator size="large" color="#6e226e" />
          </View>
        )}

        {!isLoading && error !== '' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', marginBottom: 6 }}>
              Something went wrong
            </Text>
            <Text style={{ fontSize: 13, color: '#9e859e', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={runComparison}
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

        {!isLoading && error === '' && comparisonData && (
          <View>
            <WinnerBanner data={comparisonData} isSmallDevice={isSmallDevice} />

            <SectionLabel icon={<SparkleIcon size={16} color="#6e226e" />}>
              Head-to-Head Metrics
            </SectionLabel>
            {comparisonData.headToHead.map(function(comparison, i) {
              return (
                <HeadToHeadCard
                  key={i}
                  comparison={comparison}
                  items={items}
                  index={i}
                />
              );
            })}

            <SectionLabel icon={<SparkleIcon size={16} color="#6e226e" />}>
              Sentiment Comparison
            </SectionLabel>
            <SentimentComparisonCard
              data={comparisonData.sentimentComparison}
              isSmallDevice={isSmallDevice}
            />

            <SectionLabel icon={<SparkleIcon size={16} color="#6e226e" />}>
              Risk Assessment
            </SectionLabel>
            <RiskComparisonCard data={comparisonData.riskComparison} />

            <SectionLabel icon={<SparkleIcon size={16} color="#6e226e" />}>
              Key Takeaways
            </SectionLabel>
            <TakeawaysCard
              takeaways={comparisonData.keyTakeaways}
              recommendation={comparisonData.recommendation}
              isSmallDevice={isSmallDevice}
            />
          </View>
        )}
      </ScrollView>

      {!isLoading && comparisonData && (
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