import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  PlusIcon,
  DeleteIcon,
  CalendarIcon,
  LinkIcon,
  InfoIcon,
  ClockIcon,
  ChevronDownIcon,
  CheckIcon,
  EditPencilIcon,
  RefreshIcon,
  StockChartIcon,
} from './Icons';

const { width, height } = Dimensions.get('window');

/* ───────────────────────── Reusable helpers ───────────────────────── */

const ToggleSwitch = ({ value, onToggle }) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 23],
  });

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ede4ed', '#6e226e'],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View
        style={{
          width: 46,
          height: 26,
          borderRadius: 13,
          backgroundColor: bgColor,
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 3,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            transform: [{ translateX }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ───────────── Compact date picker (side-by-side layout) ──────────── */

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateShort(dateStr) {
  if (!dateStr) return 'Select...';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const CompactDateInput = ({ label, value, onChange, isSmallDevice }) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const handlePress = () => {
    setTempDate(value ? new Date(value) : new Date());
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) onChange(formatDateISO(selectedDate));
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    onChange(formatDateISO(tempDate));
    setShow(false);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            color: '#9e859e',
            marginBottom: 5,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>

        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#fff',
            borderWidth: 1.5,
            borderColor: '#ede4ed',
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: isSmallDevice ? 11 : 13,
            paddingRight: 38,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: '500',
              color: value ? '#1a0a1a' : '#c8b2c8',
            }}
            numberOfLines={1}
          >
            {formatDateShort(value)}
          </Text>
          <View style={{ position: 'absolute', right: 12 }}>
            <CalendarIcon size={16} color="#9e859e" />
          </View>
        </TouchableOpacity>
      </View>

      {/* iOS date picker modal */}
      {Platform.OS === 'ios' && show && (
        <Modal transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: 34,
              }}
            >
              <View
                className="flex-row items-center justify-between"
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ede4ed',
                }}
              >
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{ fontSize: 16, color: '#9e859e', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <Text className="text-dark font-bold" style={{ fontSize: 16 }}>
                  {label} Date
                </Text>
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

      {/* Android date picker */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker value={tempDate} mode="date" display="default" onChange={handleChange} />
      )}
    </>
  );
};

/* ─────────────────────── Keyword row ─────────────────────── */

const KeywordRow = ({ value, onChange, onDelete, isFirst, isSmallDevice }) => (
  <View className="flex-row items-center" style={{ marginBottom: 8, gap: 8 }}>
    <TextInput
      className="flex-1 text-dark"
      style={{
        borderWidth: 1.5,
        borderColor: '#ede4ed',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: isSmallDevice ? 10 : 12,
        fontSize: 14,
        backgroundColor: isFirst ? '#faf5fa' : '#fff',
      }}
      value={value}
      onChangeText={onChange}
      placeholder="Enter keyword…"
      placeholderTextColor="#c8b2c8"
      editable={!isFirst}
    />
    <TouchableOpacity
      onPress={onDelete}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: isFirst ? 'transparent' : '#fff0f3',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFirst ? 0 : 1,
      }}
      disabled={isFirst}
    >
      <DeleteIcon />
    </TouchableOpacity>
  </View>
);

/* ─────────────────────── Toggle row ─────────────────────── */

const ToggleRow = ({
  iconBg,
  iconComponent,
  title,
  subtitle,
  value,
  onToggle,
  borderBottom = true,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      paddingHorizontal: 16,
      borderBottomWidth: borderBottom ? 1 : 0,
      borderBottomColor: '#ede4ed',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {iconComponent}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1a0a1a' }}>{title}</Text>
        <Text style={{ fontSize: 11.5, color: '#9e859e', marginTop: 1 }}>{subtitle}</Text>
      </View>
    </View>
    <ToggleSwitch value={value} onToggle={onToggle} />
  </View>
);

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — Profile Details
   ═══════════════════════════════════════════════════════════════ */

export function Step1({
  profileName,
  setProfileName,
  keywords,
  addKeyword,
  updateKeyword,
  deleteKeyword,
  exactMatch,
  setExactMatch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  profileUrl,
  setProfileUrl,
  isSmallDevice,
}) {
  return (
    <View>
      {/* ── Profile Name ── */}
      <Text
        className="text-muted font-bold uppercase"
        style={{ fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 18 }}
      >
        Profile Name
      </Text>
      <TextInput
        className="bg-white text-dark"
        style={{
          borderWidth: 1.5,
          borderColor: '#ede4ed',
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: isSmallDevice ? 12 : 14,
          fontSize: 15,
        }}
        value={profileName}
        onChangeText={setProfileName}
        placeholder="Enter profile name…"
        placeholderTextColor="#c8b2c8"
      />

      {/* ── Keywords ── */}
      <View
        className="flex-row items-center justify-between"
        style={{ marginTop: 18, marginBottom: 10 }}
      >
        <Text
          className="text-muted font-bold uppercase"
          style={{ fontSize: 11, letterSpacing: 1 }}
        >
          Keywords
        </Text>
        <TouchableOpacity
          onPress={addKeyword}
          className="flex-row items-center bg-primary"
          style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 5 }}
        >
          <PlusIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>
            Add More
          </Text>
        </TouchableOpacity>
      </View>

      {keywords.map((kw) => (
        <KeywordRow
          key={kw.id}
          value={kw.value}
          onChange={(v) => updateKeyword(kw.id, v)}
          onDelete={() => deleteKeyword(kw.id)}
          isFirst={kw.isFirst}
          isSmallDevice={isSmallDevice}
        />
      ))}

      {/* ── Exact Keyword Match ── */}
      <View
        className="bg-white"
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          marginTop: 18,
          shadowColor: 'rgba(110,34,110,0.05)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <ToggleRow
          iconBg="#f3e6f3"
          iconComponent={<EditPencilIcon size={17} color="#6e226e" />}
          title="Exact Keyword Match"
          subtitle="Match full phrase only"
          value={exactMatch}
          onToggle={() => setExactMatch(!exactMatch)}
          borderBottom={false}
        />
      </View>

      {/* ── Monitoring Period ── */}
      <Text
        className="text-muted font-bold uppercase"
        style={{ fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 20 }}
      >
        Monitoring Period
      </Text>
      <View className="flex-row" style={{ gap: 12 }}>
        <CompactDateInput
          label="Start"
          value={startDate}
          onChange={setStartDate}
          isSmallDevice={isSmallDevice}
        />
        <CompactDateInput
          label="End"
          value={endDate}
          onChange={setEndDate}
          isSmallDevice={isSmallDevice}
        />
      </View>

      {/* ── Profile URL ── */}
      <Text
        className="text-muted font-bold uppercase"
        style={{ fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 20 }}
      >
        Profile URL
      </Text>
      <View className="relative">
        <View
          className="absolute"
          style={{ left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}
        >
          <LinkIcon size={16} color="#9e859e" />
        </View>
        <TextInput
          className="bg-white text-dark"
          style={{
            borderWidth: 1.5,
            borderColor: '#ede4ed',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingLeft: 38,
            paddingVertical: isSmallDevice ? 12 : 14,
            fontSize: 14,
          }}
          value={profileUrl}
          onChangeText={setProfileUrl}
          placeholder="https://example.com/profile"
          placeholderTextColor="#c8b2c8"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
      <Text className="text-muted" style={{ fontSize: 12, marginTop: 6, paddingLeft: 4, lineHeight: 18 }}>
        Paste the full profile URL for this platform
      </Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — Settings
   ═══════════════════════════════════════════════════════════════ */

const PERIOD_OPTIONS = [
  { label: 'Every 6 Hours', value: '6' },
  { label: 'Every 12 Hours', value: '12' },
  { label: 'Every 24 Hours', value: '24' },
  { label: 'Every 48 Hours', value: '48' },
  { label: 'Every 72 Hours', value: '72' },
];

export function Step2({
  profileName,
  startDate,
  endDate,
  liveUpdates,
  setLiveUpdates,
  refetchEngagement,
  setRefetchEngagement,
  refetchPeriod,
  setRefetchPeriod,
  stockMarketAnalysis,
  setStockMarketAnalysis,
  isSmallDevice,
}) {
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  const selectedPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.value === refetchPeriod)?.label || 'Select interval…';

  return (
    <View>
      {/* ── Profile summary card ── */}
      <View
        className="bg-primary-xlight"
        style={{
          borderRadius: 14,
          padding: 14,
          paddingHorizontal: 16,
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#1877f2',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
            {profileName ? profileName.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text className="text-dark font-bold" style={{ fontSize: 13 }}>
            {profileName}
          </Text>
          <Text className="text-muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            {formatDateFull(startDate)} → {formatDateFull(endDate)}
          </Text>
        </View>
      </View>

      {/* ── Update Behaviour label ── */}
      <Text
        className="text-muted font-bold uppercase"
        style={{ fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 22 }}
      >
        Update Behaviour
      </Text>

      {/* ── Toggle card ── */}
      <View
        className="bg-white"
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          shadowColor: 'rgba(110,34,110,0.05)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        {/* Live Updates */}
        <ToggleRow
          iconBg="#e6f9f4"
          iconComponent={<ClockIcon size={17} color="#00a878" />}
          title="Live Updates"
          subtitle="Refresh data in real time"
          value={liveUpdates}
          onToggle={() => setLiveUpdates(!liveUpdates)}
        />

        {/* Refetch Engagement */}
        <ToggleRow
          iconBg="#fff7e0"
          iconComponent={<RefreshIcon size={17} color="#d97706" />}
          title="Refetch Engagement"
          subtitle="Re-pull engagement metrics"
          value={refetchEngagement}
          onToggle={() => setRefetchEngagement(!refetchEngagement)}
          borderBottom={!refetchEngagement}
        />

        {/* Period in Hours — visible when refetch is ON */}
        {refetchEngagement && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 14,
              borderTopWidth: 1,
              borderTopColor: '#ede4ed',
              borderBottomWidth: 1,
              borderBottomColor: '#ede4ed',
            }}
          >
            <Text
              className="text-muted font-semibold uppercase"
              style={{ fontSize: 11, letterSpacing: 0.5, paddingTop: 12, marginBottom: 8 }}
            >
              Period in Hours
            </Text>

            <TouchableOpacity
              onPress={() => setShowPeriodPicker(true)}
              activeOpacity={0.8}
              className="relative"
              style={{
                backgroundColor: '#faf5fa',
                borderWidth: 1.5,
                borderColor: '#ede4ed',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                paddingRight: 38,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ flex: 1, fontSize: 14, color: refetchPeriod ? '#1a0a1a' : '#c8b2c8' }}>
                {selectedPeriodLabel}
              </Text>
              <View style={{ position: 'absolute', right: 12 }}>
                <ChevronDownIcon size={16} color="#9e859e" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Stock Market Analysis */}
        <ToggleRow
          iconBg="#e8f0ff"
          iconComponent={<StockChartIcon size={17} color="#2563eb" />}
          title="Stock Market Analysis"
          subtitle="Link to market impact data"
          value={stockMarketAnalysis}
          onToggle={() => setStockMarketAnalysis(!stockMarketAnalysis)}
          borderBottom={false}
        />
      </View>

      {/* ── Info warning note ── */}
      <View
        style={{
          backgroundColor: '#fff7e0',
          borderRadius: 12,
          padding: 12,
          paddingHorizontal: 14,
          marginTop: 14,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <View style={{ marginTop: 1 }}>
          <InfoIcon size={15} color="#d97706" />
        </View>
        <Text style={{ fontSize: 12, color: '#92400e', lineHeight: 18, flex: 1 }}>
          Enabling Refetch Engagement will count towards your monthly quota. Choose a longer
          interval to conserve usage.
        </Text>
      </View>

      {/* ── Period picker bottom-sheet modal ── */}
      <Modal transparent visible={showPeriodPicker} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          {/* Backdrop tap to close */}
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowPeriodPicker(false)}
          />

          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: 34,
            }}
          >
            {/* Header */}
            <View
              className="flex-row items-center justify-between"
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#ede4ed',
              }}
            >
              <TouchableOpacity onPress={() => setShowPeriodPicker(false)}>
                <Text style={{ fontSize: 16, color: '#9e859e', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <Text className="text-dark font-bold" style={{ fontSize: 16 }}>
                Select Interval
              </Text>
              <TouchableOpacity onPress={() => setShowPeriodPicker(false)}>
                <Text style={{ fontSize: 16, color: '#6e226e', fontWeight: '700' }}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Options */}
            {PERIOD_OPTIONS.map((option) => {
              const isSelected = refetchPeriod === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setRefetchPeriod(option.value);
                    setShowPeriodPicker(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f0f5',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected ? '#f3e6f3' : '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#1a0a1a',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {option.label}
                  </Text>
                  {isSelected && <CheckIcon size={18} color="#6e226e" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}