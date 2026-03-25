import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from './Icons';

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(dateStr) {
  if (!dateStr) return 'Select date...';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DatePickerCard({ title, subtitle, value, onChange, iconType = 'start', isSmallDevice }) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const handlePress = () => {
    setTempDate(value ? new Date(value) : new Date());
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        onChange(formatDate(selectedDate));
      }
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    onChange(formatDate(tempDate));
    setShow(false);
  };

  return (
    <>
      <View
        className="bg-white"
        style={{
          borderRadius: 18,
          padding: isSmallDevice ? 14 : 18,
          marginBottom: 12,
          shadowColor: 'rgba(110,34,110,0.06)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center" style={{ gap: 10, marginBottom: 12 }}>
          <View
            className="items-center justify-center"
            style={{
              width: isSmallDevice ? 34 : 38,
              height: isSmallDevice ? 34 : 38,
              borderRadius: 11,
              backgroundColor: iconType === 'start' ? '#f3e6f3' : '#e8f0ff',
            }}
          >
            {iconType === 'start' ? <ClockIcon size={18} color="#6e226e" /> : <CheckCircleIcon size={18} color="#2563eb" />}
          </View>
          <View>
            <Text className="text-dark font-bold" style={{ fontSize: 13 }}>{title}</Text>
            <Text className="text-muted" style={{ fontSize: 11.5, marginTop: 1 }}>{subtitle}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: '#faf5fa',
            borderWidth: 1.5,
            borderColor: '#ede4ed',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: isSmallDevice ? 12 : 14,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '500', color: value ? '#1a0a1a' : '#c8b2c8' }}>
            {formatDisplay(value)}
          </Text>
          <CalendarIcon size={18} />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' && show && (
        <Modal transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34 }}>
              <View className="flex-row items-center justify-between" style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{ fontSize: 16, color: '#9e859e', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <Text className="text-dark font-bold" style={{ fontSize: 16 }}>{title}</Text>
                <TouchableOpacity onPress={handleIOSConfirm}>
                  <Text style={{ fontSize: 16, color: '#6e226e', fontWeight: '700' }}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                style={{ height: 200 }}
                textColor="#1a0a1a"
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </>
  );
}