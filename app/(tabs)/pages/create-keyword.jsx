import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackIcon, ArrowRightIcon, CheckIcon } from '../../../components/Icons';
import StepIndicator from '../../../components/StepIndicator';
import { Step1, Step2, Step3 } from '../../../components/EditKeywordSteps';
import { fetchUrlGroups, createKeyword } from '../../../api/keywordApi';

const { width, height } = Dimensions.get('window');

const INITIAL_FORM = {
  name: '',
  autoFetch: {},
  keywords: [''],
  exact_keyword: false,
  start_date: '',
  end_date: '',
  customized_intents: false,
  ai_intents: true,
  url_group: null,
  pageUrls: [],
  isLiveUpdates: false,
  refetchEngagment: false,
  stock_analysis: false,
};

export default function CreateKeywordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [urlGroups, setUrlGroups] = useState([]);

  const [keywordName, setKeywordName] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState([{ id: 1, value: '', isFirst: true }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [urlGroup, setUrlGroup] = useState(null);
  const [customizedIntents, setCustomizedIntents] = useState(false);
  const [aiIntents, setAiIntents]                 = useState(true);
  const [intents, setIntents]                     = useState(['']);
  const [drivers, setDrivers]                     = useState(['']);
  const [isLiveUpdates, setIsLiveUpdates]         = useState(false);
  const [refetchEngagment, setRefetchEngagment]   = useState(false);
  const [refetchPeriod, setRefetchPeriod]         = useState(null);
  const [stockAnalysis, setStockAnalysis]         = useState(false);
  const [stockCompany, setStockCompany]           = useState(null);
  const [stockStartDate, setStockStartDate]       = useState('');
  const [stockEndDate, setStockEndDate]           = useState('');

  const isSmallDevice = height < 700;
  const headerTitleSize = isSmallDevice ? 18 : 20;
  const buttonHeight = isSmallDevice ? 46 : 50;

  useEffect(() => {
    fetchUrlGroups().then((res) => {
      if (res.success) setUrlGroups(res.urlGroups || []);
    });
  }, []);

  const togglePlatform = (pid) => {
    setSelectedPlatforms((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    );
  };

  const addKeyword = () => {
    const newId =
      keywords.length > 0 ? Math.max(...keywords.map((k) => k.id)) + 1 : 1;
    setKeywords([...keywords, { id: newId, value: '', isFirst: false }]);
  };

  const updateKeywordFn = (kwId, value) =>
    setKeywords(keywords.map((k) => (k.id === kwId ? { ...k, value } : k)));

  const deleteKeywordFn = (kwId) =>
    setKeywords(keywords.filter((k) => k.id !== kwId));

  const goNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleSave();
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
  name: keywordName.trim(),
  keywords: keywords.map((k) => k.value.trim()).filter(Boolean),
  autoFetch: {
    twitter:   selectedPlatforms.includes('twitter'),
    facebook:  selectedPlatforms.includes('facebook'),
    instagram: selectedPlatforms.includes('instagram'),
    youtube:   selectedPlatforms.includes('youtube'),
    tiktok:    selectedPlatforms.includes('tiktok'),
    linkedin:  selectedPlatforms.includes('linkedin'),
    snapchat:  selectedPlatforms.includes('snapchat'),
  },
  start_date: startDate || null,
  end_date:   endDate   || null,
  url_group:  urlGroup?.id || null,
  pageUrls:   urlGroup?.urls || [],
  customized_intents:   customizedIntents,
  ai_intents:           aiIntents,
  useIntentsAndDrivers: customizedIntents || aiIntents,
  intents:  intents.filter(Boolean),
  drivers:  drivers.filter(Boolean),
  isLiveUpdates,
  refetchEngagment,
  refetchPeriod,
  stock_analysis:            stockAnalysis,
  stock_related_company:     stockCompany,
  stock_related_start_date:  stockStartDate || null,
  stock_related_end_date:    stockEndDate   || null,
  exact_keyword: false,
  rangeFactor: { from: 25, to: 30, videos: 1 },
  rangeFactorFrom: 25, rangeFactorTo: 30, videosReachFactor: 1,
  categories: [], contactIds: [], whatsappGroupIds: [],
  expiry_date: null, type: null,
};

    const result = await createKeyword(payload);
    setIsSaving(false);

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.message || 'Failed to create keyword. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              onPress={goBack}
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
                Keyword Analysis
              </Text>
              <Text
                className="text-white font-extrabold"
                style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}
              >
                Add Crisis Keyword
              </Text>
            </View>
          </View>
        </View>

        <StepIndicator currentStep={currentStep} isSmallDevice={isSmallDevice} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: width * 0.06,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && (
  <Step1
    keywordName={keywordName} setKeywordName={setKeywordName}
    selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform}
    keywords={keywords} addKeyword={addKeyword}
    updateKeyword={updateKeywordFn} deleteKeyword={deleteKeywordFn}
    startDate={startDate} setStartDate={setStartDate}
    endDate={endDate} setEndDate={setEndDate}
    isSmallDevice={isSmallDevice}
  />
)}
{currentStep === 2 && (
  <Step2
    urlGroup={urlGroup} setUrlGroup={setUrlGroup}
    urlGroups={urlGroups} isSmallDevice={isSmallDevice}
  />
)}
{currentStep === 3 && (
  <Step3
    customizedIntents={customizedIntents} setCustomizedIntents={setCustomizedIntents}
    aiIntents={aiIntents} setAiIntents={setAiIntents}
    intents={intents} setIntents={setIntents}
    drivers={drivers} setDrivers={setDrivers}
    isLiveUpdates={isLiveUpdates} setIsLiveUpdates={setIsLiveUpdates}
    refetchEngagment={refetchEngagment} setRefetchEngagment={setRefetchEngagment}
    refetchPeriod={refetchPeriod} setRefetchPeriod={setRefetchPeriod}
    stockAnalysis={stockAnalysis} setStockAnalysis={setStockAnalysis}
    stockCompany={stockCompany} setStockCompany={setStockCompany}
    stockStartDate={stockStartDate} setStockStartDate={setStockStartDate}
    stockEndDate={stockEndDate} setStockEndDate={setStockEndDate}
    isSmallDevice={isSmallDevice}
  />
)}
        </ScrollView>

        <View
          className="flex-row border-t border-border bg-surface2"
          style={{
            paddingHorizontal: width * 0.06,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            gap: 12,
          }}
        >
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={goBack}
              className="flex-1 items-center justify-center border-2 border-border"
              style={{ height: buttonHeight, borderRadius: 14 }}
            >
              <Text className="text-muted font-bold" style={{ fontSize: 15 }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={goNext}
            disabled={isSaving}
            activeOpacity={0.85}
            className="flex-row items-center justify-center"
            style={{
              flex: currentStep > 1 ? 2 : 1,
              height: buttonHeight,
              borderRadius: 14,
              backgroundColor: isSaving ? '#00a878' : '#6e226e',
              gap: 8,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text className="text-white font-bold" style={{ fontSize: 15 }}>
                  {currentStep === 3 ? 'Save' : 'Next'}
                </Text>
                {currentStep === 3 ? <CheckIcon /> : <ArrowRightIcon />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}