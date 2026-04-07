import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, ArrowRightIcon, CheckIcon } from '../../../components/Icons';
import StepIndicator from '../../../components/StepIndicator';
import { Step1, Step2, Step3 } from '../../../components/EditKeywordSteps';
import { fetchKeywordById, updateKeyword, fetchUrlGroups } from '../../../api/keywordApi';

const { width, height } = Dimensions.get('window');

export default function EditKeywordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [keywordName, setKeywordName] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [urlGroup, setUrlGroup] = useState(null);
  const [urlGroups, setUrlGroups] = useState([]);

  const isSmallDevice = height < 700;
  const headerTitleSize = isSmallDevice ? 18 : 20;
  const buttonHeight = isSmallDevice ? 46 : 50;

  // Load data & URL groups
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
  setIsLoading(true);
  try {
    const [kwRes, ugRes] = await Promise.all([
      fetchKeywordById(id),
      fetchUrlGroups()
    ]);

    // Load URL groups first so we can reference them below
    const groups = ugRes.success ? (ugRes.urlGroups || []) : [];
    setUrlGroups(groups);

    if (kwRes.success) {
      const d = kwRes.data;
      setKeywordName(d.name || '');
      setStartDate(d.start_date?.split('T')[0] || '');
      setEndDate(d.end_date?.split('T')[0] || '');

      const platforms = Object.keys(d.autoFetch || {}).filter(k => d.autoFetch[k]);
      setSelectedPlatforms(platforms);

      const kwStr = typeof d.keywords === 'string' ? d.keywords : d.keywords?.join(',') || '';
      const kwArr = kwStr.split(',').filter(Boolean).map((val, i) => ({
        id: Date.now() + i,
        value: val.trim(),
        isFirst: i === 0
      }));
      setKeywords(kwArr.length ? kwArr : [{ id: Date.now(), value: '', isFirst: true }]);

      // ✅ Match groupId to the already-loaded groups list
      if (d.groupId) {
        const matched = groups.find(g => g.id === d.groupId);
        if (matched) setUrlGroup(matched);
      }
    } else {
      setError(kwRes.message || 'Failed to load keyword');
    }

  } catch (err) {
    setError('Network error occurred');
  } finally {
    setIsLoading(false);
  }
};
    loadData();
  }, [id]);

  // Handlers
  const togglePlatform = (pid) => {
    setSelectedPlatforms(prev => prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]);
  };

  const addKeyword = () => {
    const newId = keywords.length > 0 ? Math.max(...keywords.map(k => k.id)) + 1 : 1;
    setKeywords([...keywords, { id: newId, value: '', isFirst: false }]);
  };

  const updateKeywordFn = (kwId, value) => setKeywords(keywords.map(k => k.id === kwId ? { ...k, value } : k));
  const deleteKeywordFn = (kwId) => setKeywords(keywords.filter(k => k.id !== kwId));

  const goNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); else handleSave(); };
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); else router.back(); };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      name: keywordName.trim(),
      keywords: keywords.map(k => k.value.trim()).filter(Boolean),
      autoFetch: {
        twitter: selectedPlatforms.includes('twitter'),
        facebook: selectedPlatforms.includes('facebook'),
        instagram: selectedPlatforms.includes('instagram'),
        youtube: selectedPlatforms.includes('youtube'),
        tiktok: selectedPlatforms.includes('tiktok'),
        linkedin: selectedPlatforms.includes('linkedin'),
        snapchat: selectedPlatforms.includes('snapchat'),
      },
      start_date: startDate || null,
      end_date: endDate || null,
      url_group: urlGroup?.id || null,
      pageUrls: urlGroup?.urls || [],
      exact_keyword: false,
      isLiveUpdates: false,
      refetchEngagment: false,
      stock_analysis: false,
      useIntentsAndDrivers: false,
      customized_intents: false,
      ai_intents: false,
      rangeFactor: { from: 25, to: 30, videos: 1 },
      categories: [],
      contactIds: [],
      whatsappGroupIds: [],
      intents: [],
      drivers: [],
      expiry_date: null,
      refetchPeriod: null,
      stock_related_company: null,
      stock_related_end_date: null,
      stock_related_start_date: null,
      type: null,
    };

    const res = await updateKeyword(id, payload);
    setIsSaving(false);

    if (res.success) {
      Alert.alert('Success', 'Keyword updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      Alert.alert('Error', res.message || 'Failed to update keyword');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center">
        <ActivityIndicator size="large" color="#6e226e" />
        <Text className="text-muted mt-3" style={{ fontSize: 14 }}>Loading keyword data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center px-6">
        <Text className="text-[#e8365d] text-center mb-4" style={{ fontSize: 15 }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#6e226e] px-6 py-3 rounded-xl">
          <Text className="text-white font-bold" style={{ fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
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
              keywords={keywords} addKeyword={addKeyword} updateKeyword={updateKeywordFn} deleteKeyword={deleteKeywordFn}
              isSmallDevice={isSmallDevice}
            />
          )}
          {currentStep === 2 && (
            <Step2 startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} isSmallDevice={isSmallDevice} />
          )}
          {currentStep === 3 && (
            <Step3 
              urlGroup={urlGroup} 
              setUrlGroup={setUrlGroup} 
              urlGroups={urlGroups} 
              isSmallDevice={isSmallDevice} 
            />
          )}
        </ScrollView>

        {/* Footer */}
        <View className="flex-row border-t border-border bg-surface2" style={{ paddingHorizontal: width * 0.06, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) + 8, gap: 12 }}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={goBack} className="flex-1 items-center justify-center border-2 border-border" style={{ height: buttonHeight, borderRadius: 14 }}>
              <Text className="text-muted font-bold" style={{ fontSize: 15 }}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={goNext} disabled={isSaving} activeOpacity={0.85}
            className="flex-row items-center justify-center"
            style={{ flex: currentStep > 1 ? 2 : 1, height: buttonHeight, borderRadius: 14, backgroundColor: isSaving ? '#00a878' : '#6e226e', gap: 8 }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text className="text-white font-bold" style={{ fontSize: 15 }}>
                  {currentStep === 3 ? 'Update' : 'Next'}
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