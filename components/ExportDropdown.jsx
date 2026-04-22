import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';
const PRIMARY_COLOR = '#6e226e';

const ChevronDownIcon = ({ size = 14, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);
const DownloadIcon = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </Svg>
);
const PdfIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#e8365d">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <Path d="M14 2v6h6" fill="#fff" fillOpacity={0.3} />
    <Path d="M10 12h4M10 16h4M8 12h.01M8 16h.01" stroke="#fff" strokeWidth={1.5} fill="none" />
  </Svg>
);
const PowerPointIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#f97316">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <Path d="M14 2v6h6" fill="#fff" fillOpacity={0.3} />
    <Path d="M9 13v5M9 13h3a2 2 0 1 1 0 4H9" stroke="#fff" strokeWidth={1.5} fill="none" />
  </Svg>
);
const ExcelIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#10b981">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <Path d="M14 2v6h6" fill="#fff" fillOpacity={0.3} />
    <Path d="M8 13l3 4M11 13l-3 4" stroke="#fff" strokeWidth={1.5} fill="none" />
  </Svg>
);
const CloseIcon = ({ size = 18, color = '#64748b' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);
const CheckIcon = ({ size = 14, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const LanguageOption = ({ lang, label, sublabel, letter, selected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(lang)}
    activeOpacity={0.7}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 12,
      backgroundColor: selected ? '#f3e6f3' : '#f8fafc',
      marginBottom: 10,
      borderWidth: 2,
      borderColor: selected ? PRIMARY_COLOR : '#e2e8f0',
    }}
  >
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>{letter}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a0a1a' }}>{label}</Text>
      <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{sublabel}</Text>
    </View>
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? PRIMARY_COLOR : '#d1d5db',
        backgroundColor: selected ? PRIMARY_COLOR : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected && <CheckIcon />}
    </View>
  </TouchableOpacity>
);

const ExportDropdown = ({ showId, dateRange, reportName = 'Report' }) => {
  const buttonRef = useRef(null);

  const [dropdownVisible, setDropdownVisible]   = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [progressVisible, setProgressVisible]   = useState(false);

  const [selectedFormat, setSelectedFormat]     = useState(null);
  const [selectedLang, setSelectedLang]         = useState(null);
  const [progressText, setProgressText]         = useState('');
  const [dropdownPos, setDropdownPos]           = useState({ top: 100, right: 16 });

  const openDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, w, h) => {
        setDropdownPos({ top: y + h + 8, right: 16 });
        setDropdownVisible(true);
      });
    } else {
      setDropdownVisible(true);
    }
  };

  const onFormatPress = (format) => {
    setDropdownVisible(false);
    setSelectedFormat(format);

    if (format === 'excel') {
      doExport('excel', 'en');
      return;
    }

    setSelectedLang(null);
    setLangModalVisible(true);
  };

  const onConfirmLang = () => {
    if (!selectedLang) {
      Alert.alert('Select Language', 'Please select a language first.');
      return;
    }
    setLangModalVisible(false);
    doExport(selectedFormat, selectedLang);
  };

  const doExport = async (format, lang) => {
    setProgressText('Connecting to server…');
    setProgressVisible(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      let url = '';

      if (format === 'pdf') {
        const from = dateRange?.from
          ? dateRange.from.toISOString().replace('T', ' ').split('.')[0]
          : '';
        const to = dateRange?.to
          ? dateRange.to.toISOString().replace('T', ' ').split('.')[0]
          : '';
        url = `${BASE_URL}/shows/sheets/${showId}/pdf?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      } else if (format === 'powerpoint') {
        url = `${BASE_URL}/shows/sheets/${showId}/powerpoint/v2`;
      } else {
        url = `${BASE_URL}/shows/sheets/${showId}/excel`;
      }

      setProgressText('Generating report…');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: 'posts', lang }),
      });

      let data;
      const rawText = await response.text();

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server error (HTTP ${response.status}). Please check your connection and try again.`
        );
      }

      if (!data.success || !data.data?.url) {
        throw new Error(data.message || 'Server did not return a download link.');
      }

      const fileUrl = data.data.url;
      setProgressVisible(false);

      const canOpen = await Linking.canOpenURL(fileUrl);
      if (canOpen) {
        await Linking.openURL(fileUrl);
        Alert.alert(
          'Report Ready',
          `Your ${format.toUpperCase()} has opened in your browser.\n\nTap the share / download button there to save it to your device.`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Unable to open the download link on this device.');
      }
    } catch (err) {
      setProgressVisible(false);
      Alert.alert('Export Failed', err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={openDropdown}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          gap: 5,
        }}
      >
        <DownloadIcon />
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Export</Text>
        <ChevronDownIcon />
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setDropdownVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: dropdownPos.top,
              right: dropdownPos.right,
              backgroundColor: '#fff',
              borderRadius: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 14,
              elevation: 10,
              minWidth: 210,
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={() => onFormatPress('pdf')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 14, paddingHorizontal: 16, gap: 12,
                borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' }}>
                <PdfIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a0a1a' }}>PDF Document</Text>
                <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>Best for printing</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onFormatPress('powerpoint')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 14, paddingHorizontal: 16, gap: 12,
                borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' }}>
                <PowerPointIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a0a1a' }}>PowerPoint</Text>
                <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>Best for presentations</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onFormatPress('excel')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 14, paddingHorizontal: 16, gap: 12,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}>
                <ExcelIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a0a1a' }}>Excel Spreadsheet</Text>
                <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>Best for data analysis</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', alignSelf: 'center', marginBottom: 20 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a0a1a' }}>Select Language</Text>
                <Text style={{ fontSize: 13, color: '#9e859e', marginTop: 3 }}>
                  Choose the language for your {selectedFormat?.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setLangModalVisible(false)}
                style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>

            <LanguageOption
              lang="en" label="English" sublabel="Left-to-right layout" letter="EN"
              selected={selectedLang === 'en'} onSelect={setSelectedLang}
            />
            <LanguageOption
              lang="ar" label="العربية" sublabel="Right-to-left layout" letter="ع"
              selected={selectedLang === 'ar'} onSelect={setSelectedLang}
            />

            <TouchableOpacity
              onPress={onConfirmLang}
              disabled={!selectedLang}
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 14,
                backgroundColor: selectedLang ? PRIMARY_COLOR : '#d1d5db',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                Download {selectedFormat?.toUpperCase()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLangModalVisible(false)}
              style={{ marginTop: 10, padding: 14, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={progressVisible} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', maxWidth: 300 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#f3e6f3', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a0a1a', marginBottom: 8, textAlign: 'center' }}>
              Generating Report
            </Text>
            <Text style={{ fontSize: 13, color: '#9e859e', textAlign: 'center', lineHeight: 20 }}>
              {progressText}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ExportDropdown;