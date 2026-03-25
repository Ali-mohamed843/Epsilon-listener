import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, ArrowRightIcon, CheckIcon } from '../../../components/Icons';
import StepIndicator from '../../../components/StepIndicator';
import { Step1, Step2, Step3 } from '../../../components/EditKeywordSteps';

const { width, height } = Dimensions.get('window');

const keywordsDatabase = {
  '1': {
    name: 'Climate Summit 2026',
    platforms: ['tiktok', 'instagram', 'youtube'],
    keywords: [
      { id: 1, value: '#climate_summit', isFirst: true },
      { id: 2, value: 'climate summit 2026', isFirst: false },
      { id: 3, value: 'قمة المناخ 2026', isFirst: false },
      { id: 4, value: 'climate_summit_egypt', isFirst: false },
      { id: 5, value: 'COP2026', isFirst: false },
      { id: 6, value: '#قمة_المناخ', isFirst: false },
    ],
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
  '2': {
    name: 'Tech Layoffs Wave',
    platforms: ['twitter', 'linkedin'],
    keywords: [
      { id: 1, value: '#tech_layoffs', isFirst: true },
      { id: 2, value: 'tech layoffs 2026', isFirst: false },
      { id: 3, value: 'mass layoffs tech', isFirst: false },
      { id: 4, value: '#TechLayoffs', isFirst: false },
    ],
    startDate: '2026-02-15',
    endDate: '2026-03-15',
  },
  '3': {
    name: 'Renewable Energy Egypt',
    platforms: ['facebook', 'youtube'],
    keywords: [
      { id: 1, value: '#renewable_energy_egypt', isFirst: true },
      { id: 2, value: 'طاقة متجددة مصر', isFirst: false },
      { id: 3, value: 'solar energy egypt', isFirst: false },
    ],
    startDate: '2026-01-01',
    endDate: '2026-02-28',
  },
  '4': {
    name: 'Gaza Ceasefire Talks',
    platforms: ['twitter', 'tiktok', 'snapchat'],
    keywords: [
      { id: 1, value: '#gaza_ceasefire', isFirst: true },
      { id: 2, value: 'ceasefire talks', isFirst: false },
      { id: 3, value: 'وقف إطلاق النار غزة', isFirst: false },
      { id: 4, value: '#CeasefireNow', isFirst: false },
      { id: 5, value: 'gaza peace talks', isFirst: false },
    ],
    startDate: '2026-03-10',
    endDate: '2026-03-17',
  },
};

export default function EditKeywordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [keywordName, setKeywordName] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [urlGroup, setUrlGroup] = useState('');
  const [urls, setUrls] = useState([{ id: 1, value: '' }]);

  const isSmallDevice = height < 700;
  const headerTitleSize = isSmallDevice ? 18 : 20;
  const buttonHeight = isSmallDevice ? 46 : 50;

  useEffect(() => {
    if (id && keywordsDatabase[id]) {
      const data = keywordsDatabase[id];
      setKeywordName(data.name);
      setSelectedPlatforms([...data.platforms]);
      setKeywords(data.keywords.map((k) => ({ ...k })));
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setIsLoaded(true);
    }
  }, [id]);

  const togglePlatform = (pid) => {
    setSelectedPlatforms((prev) => prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]);
  };

  const addKeyword = () => {
    const newId = keywords.length > 0 ? Math.max(...keywords.map((k) => k.id)) + 1 : 1;
    setKeywords([...keywords, { id: newId, value: '', isFirst: false }]);
  };

  const updateKeyword = (kwId, value) => setKeywords(keywords.map((k) => k.id === kwId ? { ...k, value } : k));
  const deleteKeyword = (kwId) => setKeywords(keywords.filter((k) => k.id !== kwId));

  const addUrl = () => {
    const newId = urls.length > 0 ? Math.max(...urls.map((u) => u.id)) + 1 : 1;
    setUrls([...urls, { id: newId, value: '' }]);
  };

  const updateUrl = (uid, value) => setUrls(urls.map((u) => u.id === uid ? { ...u, value } : u));
  const deleteUrl = (uid) => { if (urls.length > 1) setUrls(urls.filter((u) => u.id !== uid)); };

  const goNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); else handleSave(); };
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); else router.back(); };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); router.back(); }, 1500);
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center">
        <Text className="text-muted" style={{ fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="bg-primary overflow-hidden" style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: isSmallDevice ? 20 : 24, paddingHorizontal: width * 0.06 }}>
          <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
            <TouchableOpacity onPress={goBack} className="items-center justify-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              <BackIcon />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>Keyword Analysis</Text>
              <Text className="text-white font-extrabold" style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}>Edit Keyword</Text>
            </View>
          </View>
        </View>

        <StepIndicator currentStep={currentStep} isSmallDevice={isSmallDevice} />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: width * 0.06, paddingBottom: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {currentStep === 1 && (
            <Step1
              keywordName={keywordName} setKeywordName={setKeywordName}
              selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform}
              keywords={keywords} addKeyword={addKeyword} updateKeyword={updateKeyword} deleteKeyword={deleteKeyword}
              isSmallDevice={isSmallDevice}
            />
          )}
          {currentStep === 2 && (
            <Step2 startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} isSmallDevice={isSmallDevice} />
          )}
          {currentStep === 3 && (
            <Step3 urlGroup={urlGroup} setUrlGroup={setUrlGroup} urls={urls} addUrl={addUrl} updateUrl={updateUrl} deleteUrl={deleteUrl} isSmallDevice={isSmallDevice} />
          )}
        </ScrollView>

        <View className="flex-row border-t border-border bg-surface2" style={{ paddingHorizontal: width * 0.06, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) + 8, gap: 12 }}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={goBack} className="flex-1 items-center justify-center border-2 border-border" style={{ height: buttonHeight, borderRadius: 14 }}>
              <Text className="text-muted font-bold" style={{ fontSize: 15 }}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={goNext} activeOpacity={0.85}
            className="flex-row items-center justify-center"
            style={{ flex: currentStep > 1 ? 2 : 1, height: buttonHeight, borderRadius: 14, backgroundColor: isSaving ? '#00a878' : '#6e226e', gap: 8, shadowColor: '#6e226e', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 6 }}
          >
            <Text className="text-white font-bold" style={{ fontSize: 15 }}>
              {isSaving ? '✓ Saved!' : currentStep === 3 ? 'Save' : 'Next'}
            </Text>
            {!isSaving && (currentStep === 3 ? <CheckIcon /> : <ArrowRightIcon />)}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}