import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path, Line, Polyline } from 'react-native-svg';
import { createProfile } from '../../../api/profileApi';

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

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity onPress={() => setShow(true)} activeOpacity={0.8} style={styles.dateButton}>
        <Text style={[styles.dateButtonText, !value && { color: '#c8b2c8' }]}>
          {value || 'YYYY-MM-DD'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {value ? (
            <TouchableOpacity onPress={() => onChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
              <DateTimePicker value={dateObj} mode="date" display="spinner" onChange={handleChange} style={{ backgroundColor: '#fff' }} />
            </View>
          </View>
        </Modal>
      ) : (
        show && <DateTimePicker value={dateObj} mode="date" display="calendar" onChange={handleChange} />
      )}
    </View>
  );
};

const CheckboxRow = ({ label, value, onChange }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' }}>
    <TouchableOpacity
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
      style={{
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: value ? '#6e226e' : '#ede4ed',
        borderRadius: 6,
        backgroundColor: value ? '#6e226e' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value && <CheckIcon />}
    </TouchableOpacity>
    <Text style={{ fontSize: 14, color: '#1a0a1a', fontWeight: '500' }}>{label}</Text>
  </View>
);

const INITIAL_FORM = {
  name: '',
  profile_url: '',
  exact_keyword: false,
  refetchEngagment: false,
  start_date: '',
  end_date: '',
  expiry_date: '',
  refetchPeriod: 8,
};

export default function CreateProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { platform = 'facebook' } = useLocalSearchParams();

  const [form, setForm] = useState(INITIAL_FORM);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);

  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleAdd = async () => {
    if (!form.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      profile_url: form.profile_url.trim(),
      exact_keyword: form.exact_keyword,
      refetchEngagment: form.refetchEngagment,
      start_date: form.start_date || '',
      end_date: form.end_date || '',
      expiry_date: form.expiry_date || '',
      platform,
      refetchPeriod: form.refetchPeriod,
    };

    const result = await createProfile(platform, payload);
    setSaving(false);

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.message || 'Failed to create profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, paddingTop: insets.top }}>

        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Add {platformLabel} profile</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(t) => { set('name', t); if (t.trim()) setNameError(false); }}
              style={[styles.input, nameError && { borderColor: '#e8365d', backgroundColor: '#fff5f7' }]}
              placeholder="Enter profile name"
              placeholderTextColor="#c8b2c8"
            />
            {nameError && <Text style={styles.errorText}>Name is required</Text>}
          </View>

          {/* Expire Date */}
          <View style={{ marginBottom: 20 }}>
            <DateField label="Expire Date" value={form.expiry_date} onChange={(v) => set('expiry_date', v)} />
          </View>

          {/* Profile URL */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.fieldLabel}>Profile Url</Text>
            <TextInput
              value={form.profile_url}
              onChangeText={(t) => set('profile_url', t)}
              style={styles.input}
              placeholder="https://example.com/profile"
              placeholderTextColor="#c8b2c8"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* Exact Keyword */}
          <View style={{ marginBottom: 20 }}>
            <CheckboxRow label="Exact Keyword" value={form.exact_keyword} onChange={(v) => set('exact_keyword', v)} />
          </View>

          {/* Start Date */}
          <View style={{ marginBottom: 20 }}>
            <DateField label="Start Date" value={form.start_date} onChange={(v) => set('start_date', v)} />
          </View>

          {/* End Date */}
          <View style={{ marginBottom: 20 }}>
            <DateField label="End Date" value={form.end_date} onChange={(v) => set('end_date', v)} />
          </View>

          {/* Refetch Engagement */}
          <View style={{ marginBottom: 20 }}>
            <CheckboxRow label="Refetch Engagement" value={form.refetchEngagment} onChange={(v) => set('refetchEngagment', v)} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAdd} disabled={saving} style={styles.addBtn}>
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.addBtnText}>Add</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5eef5',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a0a1a',
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f5eef5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#9e859e',
    marginBottom: 6,
    fontWeight: '600',
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
  errorText: {
    fontSize: 11,
    color: '#e8365d',
    marginTop: 4,
  },
  dateButton: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#ede4ed',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#faf7fa',
  },
  dateButtonText: {
    fontSize: 13.5,
    color: '#1a0a1a',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5eef5',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a0a1a',
  },
  modalDoneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6e226e',
    borderRadius: 10,
  },
  modalDoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#f5eef5',
  },
  closeBtn: {
    height: 48,
    paddingHorizontal: 40,
    borderRadius: 14,
    backgroundColor: '#f0eaf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6e226e',
  },
  addBtn: {
    height: 48,
    paddingHorizontal: 40,
    borderRadius: 14,
    backgroundColor: '#6e226e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
};