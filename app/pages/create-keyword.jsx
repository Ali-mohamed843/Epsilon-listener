import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg';
import { fetchUrlGroups, createKeyword } from '../../api/keywordApi';

const CloseIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6e226e" strokeWidth={2.5} strokeLinecap="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const TrashIcon = ({ size = 14, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <Path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9e859e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9e859e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </Svg>
  </Svg>
);

const PLATFORMS = [
  { key: 'twitter', label: 'Twitter' },
  { key: 'youtube', label: 'Youtube' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'Tiktok' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'snapchat', label: 'Snapchat' },
];

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

const formatDate = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DateField = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);
  const dateObj = value ? new Date(value) : new Date();

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShow(false);
    if (selectedDate) onChange(formatDate(selectedDate));
  };

  const handleClear = () => onChange('');

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity onPress={() => setShow(true)} activeOpacity={0.8} style={styles.dateButton}>
        <Text style={[styles.dateButtonText, !value && { color: '#c8b2c8' }]}>
          {value || 'YYYY-MM-DD'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {value ? (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#9e859e" strokeWidth={2.5} strokeLinecap="round">
                <Line x1={18} y1={6} x2={6} y2={18} />
                <Line x1={6} y1={6} x2={18} y2={18} />
              </Svg>
            </TouchableOpacity>
          ) : null}
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9e859e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M8 2v4M16 2v4M3 10h18" />
            <Path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </Svg>
        </View>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setShow(false)} style={styles.modalDoneBtn}>
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="spinner"
                onChange={handleChange}
                style={{ backgroundColor: '#fff' }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="calendar"
            onChange={handleChange}
          />
        )
      )}
    </View>
  );
};

const Step1 = ({ form, setForm, nameError }) => {
  const togglePlatform = (key) =>
    setForm((prev) => ({ ...prev, autoFetch: { ...prev.autoFetch, [key]: !prev.autoFetch[key] } }));
  const addKeyword = () => setForm((prev) => ({ ...prev, keywords: [...prev.keywords, ''] }));
  const updateKeyword = (index, text) =>
    setForm((prev) => { const u = [...prev.keywords]; u[index] = text; return { ...prev, keywords: u }; });
  const removeKeyword = (index) =>
    setForm((prev) => ({ ...prev, keywords: prev.keywords.filter((_, i) => i !== index) }));

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          value={form.name}
          onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
          placeholder=""
          placeholderTextColor="#c8b2c8"
          style={[styles.input, nameError && { borderColor: '#e8365d', backgroundColor: '#fff5f7' }]}
        />
        {nameError && <Text style={{ fontSize: 11, color: '#e8365d', marginTop: 4 }}>Name Field Is Required</Text>}
      </View>

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
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, borderWidth: 1.5, borderColor: active ? '#6e226e' : '#ddd', backgroundColor: active ? '#6e226e' : '#fff' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#555' }}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.fieldLabel}>Keywords</Text>
          <TouchableOpacity onPress={addKeyword} style={{ backgroundColor: '#1a0a1a', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}>
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

      <ToggleRow
        label="Exact Keyword"
        value={form.exact_keyword}
        onChange={(v) => setForm((p) => ({ ...p, exact_keyword: v }))}
      />

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
    <View style={{ marginTop: 24 }}>
      <Text style={styles.fieldLabel}>Page URL Group</Text>
      {loadingGroups ? (
        <ActivityIndicator size="small" color="#6e226e" style={{ marginTop: 12 }} />
      ) : (
        <View style={{ gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => setForm((p) => ({ ...p, url_group: null, pageUrls: [] }))}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: !form.url_group ? '#6e226e' : '#ede4ed', backgroundColor: !form.url_group ? '#faf3fa' : '#fff' }}
          >
            <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: !form.url_group ? '#6e226e' : '#ccc', backgroundColor: !form.url_group ? '#6e226e' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {!form.url_group && <CheckIcon />}
            </View>
            <Text style={{ fontSize: 13.5, color: '#1a0a1a', fontWeight: '500' }}>None</Text>
          </TouchableOpacity>
          {urlGroups.map((g) => {
            const selected = form.url_group?.value === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setForm((p) => ({ ...p, url_group: { label: g.name, value: g.id, urls: g.urls }, pageUrls: g.urls }))}
                activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: selected ? '#6e226e' : '#ede4ed', backgroundColor: selected ? '#faf3fa' : '#fff' }}
              >
                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: selected ? '#6e226e' : '#ccc', backgroundColor: selected ? '#6e226e' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
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

const Step3 = ({ form, setForm }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <ToggleRow label="Live Updates" value={form.isLiveUpdates} onChange={(v) => setForm((p) => ({ ...p, isLiveUpdates: v }))} />
    <ToggleRow label="Refetch Engagement" value={form.refetchEngagment} onChange={(v) => setForm((p) => ({ ...p, refetchEngagment: v }))} />
    <ToggleRow label="Stock Market Analysis" value={form.stock_analysis} onChange={(v) => setForm((p) => ({ ...p, stock_analysis: v }))} />
    <View style={{ height: 24 }} />
  </ScrollView>
);

const INITIAL_FORM = {
  name: '', autoFetch: {}, keywords: [''], exact_keyword: false, start_date: '', end_date: '',
  customized_intents: false, ai_intents: true, url_group: null, pageUrls: [],
  isLiveUpdates: false, refetchEngagment: false, stock_analysis: false,
};

export default function CreateKeywordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [nameError, setNameError] = useState(false);
  const [urlGroups, setUrlGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoadingGroups(true);
    fetchUrlGroups().then((res) => {
      if (res.success) setUrlGroups(res.urlGroups);
      setLoadingGroups(false);
    });
  }, []);

  const handleCancel = () => router.back();

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
    const keywordsArr = form.keywords.map((k) => k.trim()).filter(Boolean);
    const payload = {
      name: form.name.trim(), keywords: keywordsArr, autoFetch: form.autoFetch,
      start_date: form.start_date || '', end_date: form.end_date || '',
      exact_keyword: form.exact_keyword, isLiveUpdates: form.isLiveUpdates,
      refetchEngagment: form.refetchEngagment, stock_analysis: form.stock_analysis,
      useIntentsAndDrivers: form.customized_intents || form.ai_intents,
      customized_intents: form.customized_intents, ai_intents: form.ai_intents,
      pageUrls: form.pageUrls, url_group: form.url_group,
      rangeFactor: { from: 25, to: 30, videos: 1 }, rangeFactorFrom: 25, rangeFactorTo: 30,
      videosReachFactor: 1, categories: [], contactIds: [], whatsappGroupIds: [],
      intents: [], drivers: [], expiry_date: '', refetchPeriod: null,
      stock_related_company: null, stock_related_end_date: null, stock_related_start_date: null,
      type: null,
    };

    const result = await createKeyword(payload);
    setSaving(false);

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.message || 'Failed to create keyword. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={handleCancel} style={styles.iconBtn}><CloseIcon /></TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.pageTitle}>Add Crisis Keyword</Text>
            <StepDots current={step} total={3} />
          </View>
          <View style={{ width: 34 }} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {step === 0 && <Step1 form={form} setForm={setForm} nameError={nameError} />}
          {step === 1 && <Step2 form={form} setForm={setForm} urlGroups={urlGroups} loadingGroups={loadingGroups} />}
          {step === 2 && <Step3 form={form} setForm={setForm} />}
        </View>

        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < 2 ? (
            <TouchableOpacity onPress={handleNext} style={[styles.primaryBtn, step === 0 && { flex: 1 }]}>
              <Text style={styles.primaryBtnText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.primaryBtn, { flex: 1 }]}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>Save</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5eef5' },
  pageTitle: { fontSize: 18, fontWeight: '800', color: '#1a0a1a', marginBottom: 8, letterSpacing: -0.3 },
  iconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f5eef5', alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 34 : 20, gap: 10, borderTopWidth: 1, borderTopColor: '#f5eef5' },
  backBtn: { height: 48, paddingHorizontal: 24, borderRadius: 14, backgroundColor: '#f0eaf0', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 15, fontWeight: '700', color: '#6e226e' },
  primaryBtn: { height: 48, paddingHorizontal: 32, borderRadius: 14, backgroundColor: '#6e226e', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  fieldLabel: { fontSize: 12, color: '#9e859e', marginBottom: 6, fontWeight: '600' },
  input: { height: 46, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, paddingHorizontal: 14, fontSize: 13.5, color: '#1a0a1a', backgroundColor: '#faf7fa' },
  dateButton: { height: 46, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#faf7fa' },
  dateButtonText: { fontSize: 13.5, color: '#1a0a1a' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 34 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5eef5' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1a0a1a' },
  modalDoneBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#6e226e', borderRadius: 10 },
  modalDoneText: { fontSize: 14, fontWeight: '700', color: '#fff' },
};