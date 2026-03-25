import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { PlusIcon, DeleteIcon, CalendarIcon, ShieldIcon, LinkIcon, InfoIcon, ChevronDownIcon, platformsData } from './Icons';
import DatePickerCard from './DatePickerCard';

const { width, height } = Dimensions.get('window');

const PlatformChip = ({ platform, isSelected, onToggle, isSmallDevice }) => {
  const IconComponent = platform.icon;
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isSelected ? '#6e226e' : '#ffffff',
        borderWidth: isSelected ? 0 : 2,
        borderColor: '#ede4ed',
        paddingHorizontal: isSmallDevice ? 12 : 16,
        paddingVertical: isSmallDevice ? 6 : 8,
        borderRadius: 40,
        gap: 6,
      }}
    >
      <IconComponent size={14} color={isSelected ? '#fff' : '#9e859e'} />
      <Text style={{ fontSize: 13, fontWeight: '500', color: isSelected ? '#fff' : '#9e859e' }}>{platform.name}</Text>
    </TouchableOpacity>
  );
};

const KeywordRow = ({ value, onChange, onDelete, isFirst, isSmallDevice }) => (
  <View className="flex-row items-center" style={{ marginBottom: 8, gap: 8 }}>
    <TextInput
      className="flex-1 text-dark"
      style={{ borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, paddingHorizontal: 14, paddingVertical: isSmallDevice ? 10 : 12, fontSize: 14, backgroundColor: isFirst ? '#faf5fa' : '#fff' }}
      value={value}
      onChangeText={onChange}
      placeholder="Enter keyword..."
      placeholderTextColor="#c8b2c8"
      editable={!isFirst}
    />
    <TouchableOpacity
      onPress={onDelete}
      style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isFirst ? 'transparent' : '#fff0f3', alignItems: 'center', justifyContent: 'center', opacity: isFirst ? 0 : 1 }}
      disabled={isFirst}
    >
      <DeleteIcon />
    </TouchableOpacity>
  </View>
);

export function Step1({ keywordName, setKeywordName, selectedPlatforms, togglePlatform, keywords, addKeyword, updateKeyword, deleteKeyword, isSmallDevice }) {
  return (
    <View>
      <Text className="text-muted font-bold uppercase" style={{ fontSize: 12, letterSpacing: 1, marginBottom: 8, marginTop: 20 }}>Keyword Name</Text>
      <TextInput
        className="bg-white text-dark"
        style={{ borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 14, paddingHorizontal: 16, paddingVertical: isSmallDevice ? 12 : 14, fontSize: 15 }}
        value={keywordName}
        onChangeText={setKeywordName}
        placeholder="Enter keyword name..."
        placeholderTextColor="#c8b2c8"
      />

      <Text className="text-muted font-bold uppercase" style={{ fontSize: 12, letterSpacing: 1, marginBottom: 8, marginTop: 20 }}>Keyword Platforms</Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {platformsData.map((platform) => (
          <PlatformChip key={platform.id} platform={platform} isSelected={selectedPlatforms.includes(platform.id)} onToggle={() => togglePlatform(platform.id)} isSmallDevice={isSmallDevice} />
        ))}
      </View>

      <View className="flex-row items-center justify-between" style={{ marginTop: 20, marginBottom: 10 }}>
        <Text className="text-muted font-bold uppercase" style={{ fontSize: 12, letterSpacing: 1 }}>Keywords</Text>
        <TouchableOpacity onPress={addKeyword} className="flex-row items-center bg-primary" style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 5 }}>
          <PlusIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Add More</Text>
        </TouchableOpacity>
      </View>

      {keywords.map((kw) => (
        <KeywordRow key={kw.id} value={kw.value} onChange={(v) => updateKeyword(kw.id, v)} onDelete={() => deleteKeyword(kw.id)} isFirst={kw.isFirst} isSmallDevice={isSmallDevice} />
      ))}
    </View>
  );
}

export function Step2({ startDate, setStartDate, endDate, setEndDate, isSmallDevice }) {
  const durationDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) return Math.round((e - s) / (1000 * 60 * 60 * 24));
    return 0;
  }, [startDate, endDate]);

  return (
    <View>
      <View className="flex-row items-center" style={{ marginTop: 20, marginBottom: 18, gap: 8 }}>
        <CalendarIcon size={18} color="#6e226e" />
        <Text className="text-dark font-extrabold" style={{ fontSize: 16, letterSpacing: -0.3 }}>Monitoring Period</Text>
      </View>

      <DatePickerCard title="Start Date" subtitle="When monitoring begins" value={startDate} onChange={setStartDate} iconType="start" isSmallDevice={isSmallDevice} />
      <DatePickerCard title="End Date" subtitle="When monitoring ends" value={endDate} onChange={setEndDate} iconType="end" isSmallDevice={isSmallDevice} />

      {durationDays > 0 && (
        <View className="flex-row items-center bg-primary-xlight" style={{ borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14, gap: 8 }}>
          <ShieldIcon />
          <Text className="text-primary font-semibold" style={{ fontSize: 13 }}>
            Monitoring period: {durationDays} day{durationDays !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

export function Step3({ urlGroup, setUrlGroup, urls, addUrl, updateUrl, deleteUrl, isSmallDevice }) {
  return (
    <View>
      <View className="flex-row items-center" style={{ marginTop: 12, marginBottom: 18, gap: 8 }}>
        <LinkIcon />
        <Text className="text-dark font-extrabold" style={{ fontSize: 16, letterSpacing: -0.3 }}>Fetch From Specific Pages</Text>
      </View>

      <View className="flex-row items-start" style={{ borderRadius: 14, padding: 14, paddingHorizontal: 16, gap: 10, backgroundColor: '#f3e6f3', marginBottom: 16 }}>
        <InfoIcon size={18} />
        <Text className="text-primary" style={{ fontSize: 12.5, lineHeight: 18.75, flex: 1 }}>
          Optionally restrict data collection to specific page URLs. Leave empty to fetch from all sources.
        </Text>
      </View>

      <Text className="text-muted font-bold uppercase" style={{ fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>URL Group</Text>
      <View className="relative">
        <TextInput
          className="bg-white text-dark"
          style={{ borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 14, paddingHorizontal: 16, paddingVertical: isSmallDevice ? 11 : 13, paddingRight: 44, fontSize: 14 }}
          value={urlGroup}
          onChangeText={setUrlGroup}
          placeholder="Select a group..."
          placeholderTextColor="#c8b2c8"
        />
        <View className="absolute" style={{ right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
          <ChevronDownIcon />
        </View>
      </View>
      <Text className="text-muted" style={{ fontSize: 12, marginTop: 6, paddingLeft: 4, lineHeight: 18 }}>
        Choose a URL group to auto-fill page URLs below
      </Text>

      <View className="flex-row items-center justify-between" style={{ marginTop: 20, marginBottom: 10 }}>
        <Text className="text-muted font-bold uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>Page URLs</Text>
        <TouchableOpacity onPress={addUrl} className="flex-row items-center bg-primary" style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 5 }}>
          <PlusIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Add More</Text>
        </TouchableOpacity>
      </View>

      {urls.map((url, index) => (
        <View key={url.id} className="flex-row items-center" style={{ marginBottom: 8, gap: 8 }}>
          <TextInput
            className="flex-1 bg-white text-dark"
            style={{ borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, paddingHorizontal: 14, paddingVertical: isSmallDevice ? 10 : 12, fontSize: 13.5 }}
            value={url.value}
            onChangeText={(v) => updateUrl(url.id, v)}
            placeholder="https://example.com/article"
            placeholderTextColor="#c8b2c8"
            keyboardType="url"
          />
          <TouchableOpacity
            onPress={() => deleteUrl(url.id)}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: index === 0 ? 'transparent' : '#fff0f3', alignItems: 'center', justifyContent: 'center', opacity: index === 0 ? 0 : 1 }}
            disabled={index === 0}
          >
            <DeleteIcon />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}