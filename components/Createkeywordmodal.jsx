// components/CreateKeywordModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Path, Line, Polyline, Circle, Rect } from 'react-native-svg';
import { fetchUrlGroups, createKeyword } from '../api/keywordApi';

const { width, height } = Dimensions.get('window');
const isSmall = height < 700;

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6e226e" strokeWidth={2.5} strokeLinecap="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);

const PlusIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const TrashIcon = ({ size = 14, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <Path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

// ── Platform list ─────────────────────────────────────────────────────────────

const PLATFORMS = [
  { key: 'twitter',   label: 'Twitter' },
  { key: 'youtube',   label: 'Youtube' },
  { key: 'facebook',  label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok',    label: 'Tiktok' },
  { key: 'linkedin',  label: 'LinkedIn' },
  { key: 'snapchat',  label: 'Snapchat' },
];

// ── Step indicator ────────────────────────────────────────────────────────────

const StepDots = ({ current, total }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          width: i === current ? 20 : 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: i === current ? '#6e226e' : '#ede4ed',
        }}
      />
    ))}
  </View>
);

// ── Small reusable row: label + Switch ────────────────────────────────────────

const ToggleRow = ({ label, value, onChange, disabled = false }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5eef5' }}>
    <Text style={{ fontSize: 15, color: disabled ? '#c0b0c0' : '#1a0a1a', flex: 1 }}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      trackColor={{ false: '#e8dce8', true: '#9e4a9e' }}
      thumbColor={value ? '#6e226e' : '#fff'}
      ios_backgroundColor="#e8dce8"
    />
  </View>
);

// ── Date input (iOS/Android friendly) ────────────────────────────────────────

const DateField = ({ label, value, onChange }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 12, color: '#9e859e', marginBottom: 6, fontWeight: '600' }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
      placeholderTextColor="#c8b2c8"
      style={{
        height: 46,
        borderWidth: 1.5,
        borderColor: '#ede4ed',
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 13.5,
        color: '#1a0a1a',
        backgroundColor: '#faf7fa',
      }}
    />
  </View>
);

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — Basic Info
// ═════════════════════════════════════════════════════════════════════════════

const Step1 = ({ form, setForm, nameError }) => {
  const togglePlatform = (key) => {
    setForm((prev) => ({
      ...prev,
      autoFetch: { ...prev.autoFetch, [key]: !prev.autoFetch[key] },
    }));
  };

  const addKeyword = () => {
    setForm((prev) => ({ ...prev, keywords: [...prev.keywords, ''] }));
  };

  const updateKeyword = (index, text) => {
    setForm((prev) => {
      const updated = [...prev.keywords];
      updated[index] = text;
      return { ...prev, keywords: updated };
    });
  };

  const removeKeyword = (index) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Name */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          value={form.name}
          onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
          placeholder=""
          placeholderTextColor="#c8b2c8"
          style={[styles.input, nameError && { borderColor: '#e8365d', backgroundColor: '#fff5f7' }]}
        />
        {nameError ? (
          <Text style={{ fontSize: 11, color: '#e8365d', marginTop: 4 }}>Name Field Is Required</Text>
        ) : null}
      </View>

      {/* Platforms */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.fieldLabel}>Keyword Platforms</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {PLATFORMS.map((p) => {
            const active = !!form.autoFetch[p.key];
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => togglePlatform(p.key)}
                activeOpacity={0.75}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 24,
                  borderWidth: 1.5,
                  borderColor: active ? '#6e226e' : '#ddd',
                  backgroundColor: active ? '#6e226e' : '#fff',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#555' }}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Keywords */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.fieldLabel}>Keywords</Text>
          <TouchableOpacity
            onPress={addKeyword}
            style={{ backgroundColor: '#1a0a1a', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Add More</Text>
          </TouchableOpacity>
        </View>
        {form.keywords.map((kw, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TextInput
              value={kw}
              onChangeText={(t) => updateKeyword(i, t)}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder={`Keyword ${i + 1}`}
              placeholderTextColor="#c8b2c8"
            />
            {form.keywords.length > 1 && (
              <TouchableOpacity onPress={() => removeKeyword(i)} style={{ padding: 6 }}>
                <TrashIcon />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Exact Keyword toggle */}
      <ToggleRow
        label="Exact Keyword"
        value={form.exact_keyword}
        onChange={(v) => setForm((p) => ({ ...p, exact_keyword: v }))}
      />

      {/* Dates */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <DateField
          label="Start Date"
          value={form.start_date}
          onChange={(t) => setForm((p) => ({ ...p, start_date: t }))}
        />
        <DateField
          label="End Date"
          value={form.end_date}
          onChange={(t) => setForm((p) => ({ ...p, end_date: t }))}
        />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — Intent & Drivers
// ═════════════════════════════════════════════════════════════════════════════

const Step2 = ({ form, setForm, urlGroups, loadingGroups }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <ToggleRow
      label="Customize Your Intent and Drivers"
      value={form.customized_intents}
      onChange={(v) => setForm((p) => ({ ...p, customized_intents: v }))}
    />
    <ToggleRow
      label="Use AI to Detect Intent and Drivers"
      value={form.ai_intents}
      onChange={(v) => setForm((p) => ({ ...p, ai_intents: v }))}
    />

    {/* URL Group picker */}
    <View style={{ marginTop: 24 }}>
      <Text style={styles.fieldLabel}>Page URL Group</Text>
      {loadingGroups ? (
        <ActivityIndicator size="small" color="#6e226e" style={{ marginTop: 12 }} />
      ) : (
        <View style={{ gap: 8, marginTop: 8 }}>
          {/* None option */}
          <TouchableOpacity
            onPress={() => setForm((p) => ({ ...p, url_group: null, pageUrls: [] }))}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 10,
              padding: 12, borderRadius: 12, borderWidth: 1.5,
              borderColor: !form.url_group ? '#6e226e' : '#ede4ed',
              backgroundColor: !form.url_group ? '#faf3fa' : '#fff',
            }}
          >
            <View style={{
              width: 18, height: 18, borderRadius: 9, borderWidth: 2,
              borderColor: !form.url_group ? '#6e226e' : '#ccc',
              backgroundColor: !form.url_group ? '#6e226e' : 'transparent',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {!form.url_group && <CheckIcon />}
            </View>
            <Text style={{ fontSize: 13.5, color: '#1a0a1a', fontWeight: '500' }}>None</Text>
          </TouchableOpacity>

          {urlGroups.map((g) => {
            const selected = form.url_group?.value === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setForm((p) => ({
                  ...p,
                  url_group: { label: g.name, value: g.id, urls: g.urls },
                  pageUrls: g.urls,
                }))}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  padding: 12, borderRadius: 12, borderWidth: 1.5,
                  borderColor: selected ? '#6e226e' : '#ede4ed',
                  backgroundColor: selected ? '#faf3fa' : '#fff',
                }}
              >
                <View style={{
                  width: 18, height: 18, borderRadius: 9, borderWidth: 2,
                  borderColor: selected ? '#6e226e' : '#ccc',
                  backgroundColor: selected ? '#6e226e' : 'transparent',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected && <CheckIcon />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, color: '#1a0a1a', fontWeight: '600' }}>{g.name}</Text>
                  <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 2 }}>{g.urls.length} URLs</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
    <View style={{ height: 24 }} />
  </ScrollView>
);

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3 — Advanced Settings
// ═════════════════════════════════════════════════════════════════════════════

const Step3 = ({ form, setForm }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <ToggleRow
      label="Live Updates"
      value={form.isLiveUpdates}
      onChange={(v) => setForm((p) => ({ ...p, isLiveUpdates: v }))}
    />
    <ToggleRow
      label="Refetch Engagement"
      value={form.refetchEngagment}
      onChange={(v) => setForm((p) => ({ ...p, refetchEngagment: v }))}
    />
    <ToggleRow
      label="Stock Market Analysis"
      value={form.stock_analysis}
      onChange={(v) => setForm((p) => ({ ...p, stock_analysis: v }))}
    />
    <View style={{ height: 24 }} />
  </ScrollView>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN MODAL
// ═════════════════════════════════════════════════════════════════════════════

const INITIAL_FORM = {
  name: '',
  autoFetch: {},
  keywords: [''],
  exact_keyword: false,
  start_date: '',
  end_date: '',
  // step 2
  customized_intents: false,
  ai_intents: true,
  url_group: null,
  pageUrls: [],
  // step 3
  isLiveUpdates: false,
  refetchEngagment: false,
  stock_analysis: false,
};

export default function CreateKeywordModal({ visible, onClose, onCreated }) {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [form, setForm] = useState(INITIAL_FORM);
  const [nameError, setNameError] = useState(false);
  const [urlGroups, setUrlGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load URL groups when modal opens
  useEffect(() => {
    if (visible) {
      setLoadingGroups(true);
      fetchUrlGroups().then((res) => {
        if (res.success) setUrlGroups(res.urlGroups);
        setLoadingGroups(false);
      });
    }
  }, [visible]);

  const resetAndClose = () => {
    setStep(0);
    setForm(INITIAL_FORM);
    setNameError(false);
    onClose();
  };

  const handleNext = () => {
    if (step === 0) {
      if (!form.name.trim()) { setNameError(true); return; }
      setNameError(false);
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSave = async () => {
    setSaving(true);

    // Build keywords array — filter empty strings
    const keywordsArr = form.keywords.map((k) => k.trim()).filter(Boolean);

    const payload = {
      name: form.name.trim(),
      keywords: keywordsArr,
      autoFetch: form.autoFetch,
      start_date: form.start_date || '',
      end_date: form.end_date || '',
      exact_keyword: form.exact_keyword,
      isLiveUpdates: form.isLiveUpdates,
      refetchEngagment: form.refetchEngagment,
      stock_analysis: form.stock_analysis,
      useIntentsAndDrivers: form.customized_intents || form.ai_intents,
      customized_intents: form.customized_intents,
      ai_intents: form.ai_intents,
      pageUrls: form.pageUrls,
      url_group: form.url_group,
      rangeFactor: { from: 25, to: 30, videos: 1 },
      rangeFactorFrom: 25,
      rangeFactorTo: 30,
      videosReachFactor: 1,
      categories: [],
      contactIds: [],
      whatsappGroupIds: [],
      intents: [],
      drivers: [],
      expiry_date: '',
      refetchPeriod: null,
      stock_related_company: null,
      stock_related_end_date: null,
      stock_related_start_date: null,
      type: null,
    };

    const result = await createKeyword(payload);
    setSaving(false);

    if (result.success) {
      resetAndClose();
      onCreated && onCreated(result.show);
    } else {
      Alert.alert('Error', result.message || 'Failed to create keyword. Please try again.');
    }
  };

  const stepTitles = ['Add Crisis Keyword', 'Add Crisis Keyword', 'Add Crisis Keyword'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={resetAndClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={resetAndClose}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
        />

        {/* Sheet */}
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{stepTitles[step]}</Text>
              <StepDots current={step} total={3} />
            </View>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeBtn}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {step === 0 && <Step1 form={form} setForm={setForm} nameError={nameError} />}
            {step === 1 && <Step2 form={form} setForm={setForm} urlGroups={urlGroups} loadingGroups={loadingGroups} />}
            {step === 2 && <Step3 form={form} setForm={setForm} />}
          </View>

          {/* Footer buttons */}
          <View style={styles.footer}>
            {step > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}

            {step < 2 ? (
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.primaryBtn, step === 0 && { flex: 1 }]}
              >
                <Text style={styles.primaryBtnText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={[styles.primaryBtn, { flex: 1 }]}
              >
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.primaryBtnText}>Save</Text>
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    minHeight: height * 0.55,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5eef5',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a0a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f5eef5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5eef5',
  },
  backBtn: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#f0eaf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6e226e',
  },
  primaryBtn: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: '#6e226e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#ede4ed',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: '#1a0a1a',
    backgroundColor: '#faf7fa',
  },
};