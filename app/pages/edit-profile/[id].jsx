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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackIcon, ArrowRightIcon, CheckIcon } from '../../../components/Icons';
import StepIndicator from '../../../components/StepIndicator';
import { Step1, Step2 } from '../../../components/EditProfileSteps';
import { fetchProfileById, updateProfile } from '../../../api/profileApi';

const { width, height } = Dimensions.get('window');

const PROFILE_STEPS = [
  { number: 1, label: 'Details' },
  { number: 2, label: 'Settings' },
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Step 1 state
  const [profileName, setProfileName] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [exactMatch, setExactMatch] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  // Step 2 state
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [refetchEngagement, setRefetchEngagement] = useState(false);
  const [refetchPeriod, setRefetchPeriod] = useState('');
  const [stockMarketAnalysis, setStockMarketAnalysis] = useState(false);

  const isSmallDevice = height < 700;
  const headerTitleSize = isSmallDevice ? 18 : 20;
  const buttonHeight = isSmallDevice ? 46 : 50;

  // Fetch profile data
  useEffect(() => {
    if (!id) return;
    const loadProfile = async () => {
  setIsLoading(true);
  setError('');
  const res = await fetchProfileById(id);
  if (res.success) {
    const data = res.data;
    setProfileName(data.name || '');
    
    // ✅ profile_url field, fallback to pageUrls[0]
    setProfileUrl(data.profile_url || data.pageUrls?.[0] || '');
    
    setStartDate(data.start_date?.split('T')[0] || '');
    setEndDate(data.end_date?.split('T')[0] || '');
    setExactMatch(!!data.exact_keyword);
    setLiveUpdates(!!data.isLiveUpdates);
    setRefetchEngagement(!!data.refetchEngagment);
    setRefetchPeriod(data.refetchPeriod ? String(data.refetchPeriod) : '');
    setStockMarketAnalysis(!!data.stock_analysis);

    // ✅ Handle empty string keywords gracefully
    const kwStr = typeof data.keywords === 'string'
      ? data.keywords
      : (data.keywords?.join(',') || '');
    
    const kwArr = kwStr
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
      .map((val, i) => ({ id: Date.now() + i, value: val, isFirst: i === 0 }));

    // ✅ Always ensure at least one row, and always make first row editable
    setKeywords(
      kwArr.length
        ? kwArr
        : [{ id: Date.now(), value: '', isFirst: true }]
    );
  } else {
    setError(res.message || 'Failed to load profile');
  }
  setIsLoading(false);
};
    loadProfile();
  }, [id]);

  const addKeyword = () => {
    const newId = keywords.length > 0 ? Math.max(...keywords.map((k) => k.id)) + 1 : 1;
    setKeywords([...keywords, { id: newId, value: '', isFirst: false }]);
  };

  const updateKeyword = (kwId, value) =>
    setKeywords(keywords.map((k) => (k.id === kwId ? { ...k, value } : k)));

  const deleteKeyword = (kwId) =>
    setKeywords(keywords.filter((k) => k.id !== kwId));

  const totalSteps = PROFILE_STEPS.length;

  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const keywordsArr = keywords.map(k => k.value.trim()).filter(Boolean);
    const payload = {
      name: profileName.trim(),
      profile_url: profileUrl.trim(),
      keywords: keywordsArr,
      exact_keyword: exactMatch,
      start_date: startDate || null,
      end_date: endDate || null,
      isLiveUpdates: liveUpdates,
      refetchEngagment: refetchEngagement,
      refetchPeriod: refetchPeriod ? parseInt(refetchPeriod, 10) : null,
      stock_analysis: stockMarketAnalysis,
    };

    const res = await updateProfile(id, payload);
    setIsSaving(false);

    if (res.success) {
      Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      Alert.alert('Error', res.message || 'Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface2 items-center justify-center">
        <ActivityIndicator size="large" color="#6e226e" />
        <Text className="text-muted mt-3" style={{ fontSize: 14 }}>Loading profile...</Text>
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

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ─── Header ─── */}
        <View
          className="bg-primary overflow-hidden"
          style={{
            paddingTop: insets.top || StatusBar.currentHeight || 0,
            paddingBottom: isSmallDevice ? 20 : 24,
            paddingHorizontal: width * 0.06,
          }}
        >
          <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />

          <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
            <TouchableOpacity
              onPress={goBack}
              className="items-center justify-center"
              style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 }}
            >
              <BackIcon />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>
                Profile Analysis
              </Text>
              <Text className="text-white font-extrabold" style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}>
                Edit Profile
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Step Indicator ─── */}
        <StepIndicator currentStep={currentStep} isSmallDevice={isSmallDevice} steps={PROFILE_STEPS} />

        {/* ─── Body ─── */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: width * 0.06, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && (
            <Step1
              profileName={profileName}
              setProfileName={setProfileName}
              keywords={keywords}
              addKeyword={addKeyword}
              updateKeyword={updateKeyword}
              deleteKeyword={deleteKeyword}
              exactMatch={exactMatch}
              setExactMatch={setExactMatch}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              profileUrl={profileUrl}
              setProfileUrl={setProfileUrl}
              isSmallDevice={isSmallDevice}
            />
          )}

          {currentStep === 2 && (
            <Step2
              profileName={profileName}
              startDate={startDate}
              endDate={endDate}
              liveUpdates={liveUpdates}
              setLiveUpdates={setLiveUpdates}
              refetchEngagement={refetchEngagement}
              setRefetchEngagement={setRefetchEngagement}
              refetchPeriod={refetchPeriod}
              setRefetchPeriod={setRefetchPeriod}
              stockMarketAnalysis={stockMarketAnalysis}
              setStockMarketAnalysis={setStockMarketAnalysis}
              isSmallDevice={isSmallDevice}
            />
          )}
        </ScrollView>

        {/* ─── Bottom Navigation ─── */}
        <View
          className="flex-row border-t border-border bg-surface2"
          style={{ paddingHorizontal: width * 0.06, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) + 8, gap: 12 }}
        >
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={goBack}
              className="flex-1 items-center justify-center border-2 border-border"
              style={{ height: buttonHeight, borderRadius: 14 }}
            >
              <Text className="text-muted font-bold" style={{ fontSize: 15 }}>Back</Text>
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
              shadowColor: '#6e226e',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 6,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text className="text-white font-bold" style={{ fontSize: 15 }}>
                  {currentStep === totalSteps ? 'Update' : 'Next'}
                </Text>
                {currentStep === totalSteps ? <CheckIcon /> : <ArrowRightIcon />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}