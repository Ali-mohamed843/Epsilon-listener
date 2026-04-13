import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { PlusIcon, DeleteIcon, CalendarIcon, ShieldIcon, LinkIcon, InfoIcon, ChevronDownIcon, platformsData } from './Icons';
import DatePickerCard from './DatePickerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PlatformChip = ({ platform, isSelected, onToggle, isSmallDevice }) => {
  const IconComponent = platform.icon;
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: isSelected ? '#6e226e' : '#ffffff',
        borderWidth: isSelected ? 0 : 2, borderColor: '#ede4ed',
        paddingHorizontal: isSmallDevice ? 12 : 16,
        paddingVertical: isSmallDevice ? 6 : 8,
        borderRadius: 40, gap: 6,
      }}
    >
      <IconComponent size={14} color={isSelected ? '#fff' : '#9e859e'} />
      <Text style={{ fontSize: 13, fontWeight: '500', color: isSelected ? '#fff' : '#9e859e' }}>
        {platform.name}
      </Text>
    </TouchableOpacity>
  );
};

const KeywordRow = ({ value, onChange, onDelete, isFirst, isSmallDevice }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
    <TextInput
      style={{
        flex: 1, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: isSmallDevice ? 10 : 12,
        fontSize: 14, backgroundColor: isFirst ? '#faf5fa' : '#fff', color: '#1a0a1a',
      }}
      value={value}
      onChangeText={onChange}
      placeholder="Enter keyword..."
      placeholderTextColor="#c8b2c8"
    />
    <TouchableOpacity
      onPress={onDelete}
      style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: isFirst ? 'transparent' : '#fff0f3',
        alignItems: 'center', justifyContent: 'center',
        opacity: isFirst ? 0 : 1,
      }}
      disabled={isFirst}
    >
      <DeleteIcon />
    </TouchableOpacity>
  </View>
);

const ToggleRow = ({ label, value, onChange, disabled = false }) => (
  <View style={{
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5eef5',
  }}>
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

// ── Step 1: Keyword Details + Dates ──────────────────────────────────────────
export function Step1({
  keywordName, setKeywordName,
  selectedPlatforms = [], togglePlatform,
  keywords = [], addKeyword, updateKeyword, deleteKeyword,
  startDate, setStartDate, endDate, setEndDate,
  isSmallDevice,
}) {
  const durationDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s)
      return Math.round((e - s) / (1000 * 60 * 60 * 24));
    return 0;
  }, [startDate, endDate]);

  return (
    <View>
      {/* Name */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#9e859e', letterSpacing: 1, marginBottom: 8, marginTop: 20, textTransform: 'uppercase' }}>
        Keyword Name
      </Text>
      <TextInput
        style={{
          backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ede4ed',
          borderRadius: 14, paddingHorizontal: 16,
          paddingVertical: isSmallDevice ? 12 : 14, fontSize: 15, color: '#1a0a1a',
        }}
        value={keywordName}
        onChangeText={setKeywordName}
        placeholder="Enter keyword name..."
        placeholderTextColor="#c8b2c8"
      />

      {/* Platforms */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#9e859e', letterSpacing: 1, marginBottom: 8, marginTop: 20, textTransform: 'uppercase' }}>
        Keyword Platforms
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {platformsData.map((platform) => (
          <PlatformChip
            key={platform.id} platform={platform}
            isSelected={selectedPlatforms.includes(platform.id)}
            onToggle={() => togglePlatform(platform.id)}
            isSmallDevice={isSmallDevice}
          />
        ))}
      </View>

      {/* Keywords */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#9e859e', letterSpacing: 1, textTransform: 'uppercase' }}>
          Keywords
        </Text>
        <TouchableOpacity
          onPress={addKeyword}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#6e226e', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 5 }}
        >
          <PlusIcon color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Add More</Text>
        </TouchableOpacity>
      </View>
      {keywords.map((kw) => (
        <KeywordRow
          key={kw.id} value={kw.value}
          onChange={(v) => updateKeyword(kw.id, v)}
          onDelete={() => deleteKeyword(kw.id)}
          isFirst={kw.isFirst} isSmallDevice={isSmallDevice}
        />
      ))}

      {/* Dates */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 18, gap: 8 }}>
        <CalendarIcon size={18} color="#6e226e" />
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', letterSpacing: -0.3 }}>
          Monitoring Period
        </Text>
      </View>
      <DatePickerCard
        title="Start Date" subtitle="When monitoring begins"
        value={startDate} onChange={setStartDate}
        iconType="start" isSmallDevice={isSmallDevice}
      />
      <DatePickerCard
        title="End Date" subtitle="When monitoring ends"
        value={endDate} onChange={setEndDate}
        iconType="end" isSmallDevice={isSmallDevice}
      />
      {durationDays > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3e6f3', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14, gap: 8 }}>
          <ShieldIcon />
          <Text style={{ color: '#6e226e', fontWeight: '600', fontSize: 13 }}>
            Monitoring period: {durationDays} day{durationDays !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Step 2: URL Groups ────────────────────────────────────────────────────────
export function Step2({ urlGroup, setUrlGroup, urlGroups = [], isSmallDevice }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageUrls, setPageUrls] = useState([]);

  useEffect(() => {
    if (urlGroup?.urls) setPageUrls([...urlGroup.urls]);
    else setPageUrls([]);
  }, [urlGroup]);

  const handleSelectGroup = (group) => {
    setUrlGroup(group);
    setPageUrls([...group.urls]);
    setShowDropdown(false);
  };

  const handleDeleteUrl = (index) => {
    const updated = pageUrls.filter((_, i) => i !== index);
    setPageUrls(updated);
    if (urlGroup) setUrlGroup({ ...urlGroup, urls: updated });
  };

  const handleAddUrl = () => {
    const updated = [...pageUrls, ''];
    setPageUrls(updated);
    if (urlGroup) setUrlGroup({ ...urlGroup, urls: updated });
  };

  const handleUpdateUrl = (index, value) => {
    const updated = [...pageUrls];
    updated[index] = value;
    setPageUrls(updated);
    if (urlGroup) setUrlGroup({ ...urlGroup, urls: updated });
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 18, gap: 8 }}>
        <LinkIcon />
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', letterSpacing: -0.3 }}>
          Fetch From Specific Pages
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 14, paddingHorizontal: 16, gap: 10, backgroundColor: '#f3e6f3', marginBottom: 16 }}>
        <InfoIcon size={18} />
        <Text style={{ color: '#6e226e', fontSize: 12.5, lineHeight: 18.75, flex: 1 }}>
          Select a predefined group of pages to restrict data collection.
        </Text>
      </View>

      <Text style={{ fontSize: 11, fontWeight: '700', color: '#9e859e', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
        URL Group
      </Text>

      <View style={{ position: 'relative', zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          style={{
            backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            borderWidth: 1.5, borderColor: showDropdown ? '#6e226e' : '#ede4ed',
            borderRadius: 14, paddingHorizontal: 16,
            height: isSmallDevice ? 46 : 50,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 14, color: urlGroup ? '#1a0a1a' : '#c8b2c8', flex: 1 }} numberOfLines={1}>
            {urlGroup ? urlGroup.name : 'Select URL Group...'}
          </Text>
          <ChevronDownIcon color={showDropdown ? '#6e226e' : '#9e859e'} />
        </TouchableOpacity>

        {showDropdown && (
          <View style={{
            backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ede4ed',
            borderRadius: 12, marginTop: 4, maxHeight: 200, overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1, shadowRadius: 5, elevation: 5,
          }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {urlGroups.length > 0 ? (
                urlGroups.map((group, index) => (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => handleSelectGroup(group)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 13,
                      borderBottomWidth: index < urlGroups.length - 1 ? 1 : 0,
                      borderBottomColor: '#ede4ed',
                      backgroundColor: urlGroup?.id === group.id ? '#f3e6f3' : '#fff',
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14, color: urlGroup?.id === group.id ? '#6e226e' : '#1a0a1a', fontWeight: urlGroup?.id === group.id ? '600' : '400' }}>
                      {group.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 2 }}>
                      {group.urls?.length || 0} URLs
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#9e859e' }}>No URL groups available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      <Text style={{ fontSize: 12, color: '#9e859e', marginTop: 8, marginBottom: 16, paddingLeft: 4 }}>
        {urlGroup ? `${urlGroup.name} (${pageUrls.length} URLs)` : 'Choose a URL group to auto-fill page URLs'}
      </Text>

      {/* URLs list */}
      {urlGroup && (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9e859e', letterSpacing: 1, textTransform: 'uppercase' }}>
              Pages Urls
            </Text>
            <TouchableOpacity
              onPress={handleAddUrl}
              style={{ backgroundColor: '#1a0a1a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Add More</Text>
            </TouchableOpacity>
          </View>

          {pageUrls.map((url, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TextInput
                value={url}
                onChangeText={(text) => handleUpdateUrl(index, text)}
                placeholder="https://..."
                placeholderTextColor="#c8b2c8"
                style={{
                  flex: 1, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
                  paddingHorizontal: 14, paddingVertical: isSmallDevice ? 10 : 12,
                  fontSize: 13, color: '#1a0a1a', backgroundColor: '#fff',
                }}
              />
              <TouchableOpacity
                onPress={() => handleDeleteUrl(index)}
                style={{ backgroundColor: '#e8365d', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Step 3: Advanced Settings ─────────────────────────────────────────────────
const REFETCH_PERIODS = [
  { label: '8 Hours',  value: 8  },
  { label: '9 Hours',  value: 9  },
  { label: '10 Hours', value: 10 },
  { label: '12 Hours', value: 12 },
  { label: '24 Hours', value: 24 },
  { label: '48 Hours', value: 48 },
];


export function Step3({
  customizedIntents, setCustomizedIntents,
  aiIntents, setAiIntents,
  intents, setIntents,
  drivers, setDrivers,
  isLiveUpdates, setIsLiveUpdates,
  refetchEngagment, setRefetchEngagment,
  refetchPeriod, setRefetchPeriod,
  stockAnalysis, setStockAnalysis,
  stockCompany, setStockCompany,
  stockStartDate, setStockStartDate,
  stockEndDate, setStockEndDate,
  isSmallDevice,
}) {
  const [periodOpen,  setPeriodOpen]  = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companySearch, setCompanySearch]       = useState('');
const [companies, setCompanies]               = useState([]);
const [loadingCompanies, setLoadingCompanies] = useState(false);
const [companyPage, setCompanyPage]           = useState(1);
const [hasMoreCompanies, setHasMoreCompanies] = useState(true);
const searchTimeout = useRef(null);
const fetchCompanies = async (name = '', page = 1, append = false) => {
  setLoadingCompanies(true);
  try {
    const token = await AsyncStorage.getItem('authToken');
    const res = await fetch(
      `https://listener-api.epsilonfinder.com/admin/api/stock-market?page=${page}&perPage=10&name=${encodeURIComponent(name)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.success) {
      const mapped = data.companies.map((c) => ({
        label: `${c.name} - ${c.country}`,
        value: c.id,
        name: c.name,
      }));
      setCompanies((prev) => append ? [...prev, ...mapped] : mapped);
      setHasMoreCompanies(data.pageInfo.currentPage < data.pageInfo.totalPages);
      setCompanyPage(page);
    }
  } catch (e) {
    console.error('Stock market fetch error:', e);
  } finally {
    setLoadingCompanies(false);
  }
};
useEffect(() => {
  if (companyOpen) fetchCompanies(companySearch, 1, false);
}, [companyOpen]);
const handleCompanySearch = (text) => {
  setCompanySearch(text);
  clearTimeout(searchTimeout.current);
  searchTimeout.current = setTimeout(() => {
    fetchCompanies(text, 1, false);
  }, 400);
};

const handleLoadMoreCompanies = () => {
  if (!loadingCompanies && hasMoreCompanies) {
    fetchCompanies(companySearch, companyPage + 1, true);
  }
};

const selectedCompany = stockCompany
  ? companies.find((c) => c.value === stockCompany) || { label: stockCompany?.name || 'Selected', value: stockCompany }
  : null;

  const selectedPeriod  = REFETCH_PERIODS.find((p) => p.value === refetchPeriod);

  const addIntent    = () => setIntents((p) => [...p, '']);
  const updateIntent = (i, t) => setIntents((p) => p.map((v, idx) => idx === i ? t : v));
  const removeIntent = (i)    => setIntents((p) => p.filter((_, idx) => idx !== i));

  const addDriver    = () => setDrivers((p) => [...p, '']);
  const updateDriver = (i, t) => setDrivers((p) => p.map((v, idx) => idx === i ? t : v));
  const removeDriver = (i)    => setDrivers((p) => p.filter((_, idx) => idx !== i));

  const inputStyle = {
    flex: 1, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: isSmallDevice ? 10 : 12,
    fontSize: 14, color: '#1a0a1a', backgroundColor: '#fff',
  };

  const dropdownTriggerStyle = {
    height: 48, borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#faf7fa',
  };

  return (
    <View style={{ paddingBottom: 16 }}>

      {/* ── Customize Intent ── */}
      <ToggleRow
        label="Customize Your Intent and Drivers"
        value={customizedIntents}
        onChange={(v) => {
          setCustomizedIntents(v);
          if (v) {
            setAiIntents(false);
            if (intents.length === 0) setIntents(['']);
            if (drivers.length === 0) setDrivers(['']);
          }
        }}
      />

      {customizedIntents && (
        <>
          {/* Intents */}
          <View style={{ marginTop: 14, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#555' }}>Intents</Text>
              <TouchableOpacity
                onPress={addIntent}
                style={{ backgroundColor: '#1a0a1a', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Add More</Text>
              </TouchableOpacity>
            </View>
            {intents.map((intent, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <TextInput
                  value={intent} onChangeText={(t) => updateIntent(i, t)}
                  placeholder={`Intent ${i + 1}`} placeholderTextColor="#c8b2c8"
                  style={inputStyle}
                />
                {intents.length > 1 && (
                  <TouchableOpacity onPress={() => removeIntent(i)} style={{ padding: 6 }}>
                    <DeleteIcon />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Drivers */}
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#555' }}>Drivers</Text>
              <TouchableOpacity
                onPress={addDriver}
                style={{ backgroundColor: '#1a0a1a', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Add More</Text>
              </TouchableOpacity>
            </View>
            {drivers.map((driver, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <TextInput
                  value={driver} onChangeText={(t) => updateDriver(i, t)}
                  placeholder={`Driver ${i + 1}`} placeholderTextColor="#c8b2c8"
                  style={inputStyle}
                />
                {drivers.length > 1 && (
                  <TouchableOpacity onPress={() => removeDriver(i)} style={{ padding: 6 }}>
                    <DeleteIcon />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── AI Intent ── */}
      <ToggleRow
        label="Use AI to Detect Intent and Drivers"
        value={aiIntents}
        onChange={(v) => { setAiIntents(v); if (v) setCustomizedIntents(false); }}
        disabled={customizedIntents}
      />

      {/* ── Live Updates ── */}
      <ToggleRow
        label="Live Updates"
        value={isLiveUpdates}
        onChange={setIsLiveUpdates}
      />

      {/* ── Refetch Engagement ── */}
      <ToggleRow
        label="Refetch Engagment"
        value={refetchEngagment}
        onChange={(v) => { setRefetchEngagment(v); if (!v) setRefetchPeriod(null); }}
      />

      {refetchEngagment && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#9e859e', marginBottom: 6, marginTop: 8 }}>
            Period In Hours
          </Text>
          <TouchableOpacity
            onPress={() => { setPeriodOpen((o) => !o); setCompanyOpen(false); }}
            style={{ ...dropdownTriggerStyle, borderColor: periodOpen ? '#6e226e' : '#ede4ed' }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 13.5, color: selectedPeriod ? '#1a0a1a' : '#c8b2c8' }}>
              {selectedPeriod ? selectedPeriod.label : 'Select hours...'}
            </Text>
            <ChevronDownIcon color={periodOpen ? '#6e226e' : '#9e859e'} />
          </TouchableOpacity>

          {periodOpen && (
            <View style={{
              borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
              backgroundColor: '#fff', marginTop: 4,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
            }}>
              {REFETCH_PERIODS.map((p, i) => (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => { setRefetchPeriod(p.value); setPeriodOpen(false); }}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 14,
                    backgroundColor: refetchPeriod === p.value ? '#f5edf5' : '#fff',
                    borderBottomWidth: i < REFETCH_PERIODS.length - 1 ? 1 : 0,
                    borderBottomColor: '#f5eef5',
                  }}
                >
                  <Text style={{ fontSize: 14, color: refetchPeriod === p.value ? '#6e226e' : '#1a0a1a', fontWeight: refetchPeriod === p.value ? '700' : '400' }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Stock Market Analysis ── */}
      <ToggleRow
        label="Stock Market Analysis"
        value={stockAnalysis}
        onChange={(v) => {
          setStockAnalysis(v);
          if (!v) { setStockCompany(null); setStockStartDate(''); setStockEndDate(''); }
        }}
      />

      {stockAnalysis && (
        <View style={{ marginTop: 8, marginBottom: 16 }}>
         {/* Company */}
<Text style={{ fontSize: 12, fontWeight: '600', color: '#9e859e', marginBottom: 6 }}>Company</Text>
<TouchableOpacity
  onPress={() => { setCompanyOpen((o) => !o); setPeriodOpen(false); }}
  style={{
    height: 48, borderWidth: 1.5,
    borderColor: companyOpen ? '#6e226e' : '#ede4ed',
    borderRadius: 12, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#faf7fa', marginBottom: 4,
  }}
  activeOpacity={0.8}
>
  <Text style={{ fontSize: 13.5, color: selectedCompany ? '#1a0a1a' : '#c8b2c8', flex: 1 }} numberOfLines={1}>
    {selectedCompany ? selectedCompany.label : 'Select...'}
  </Text>
  <ChevronDownIcon color={companyOpen ? '#6e226e' : '#9e859e'} />
</TouchableOpacity>

{companyOpen && (
  <View style={{
    borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12,
    backgroundColor: '#fff', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
    maxHeight: 280,
  }}>
    {/* Search input */}
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      borderBottomWidth: 1, borderBottomColor: '#f0e8f0',
      paddingHorizontal: 12, paddingVertical: 8, gap: 8,
    }}>
      <TextInput
        value={companySearch}
        onChangeText={handleCompanySearch}
        placeholder="Search company..."
        placeholderTextColor="#c8b2c8"
        style={{ flex: 1, fontSize: 13.5, color: '#1a0a1a', paddingVertical: 4 }}
        autoFocus
      />
      {loadingCompanies && <ActivityIndicator size="small" color="#6e226e" />}
    </View>

    {/* List */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 40) {
          handleLoadMoreCompanies();
        }
      }}
      scrollEventThrottle={200}
    >
      {companies.length === 0 && !loadingCompanies ? (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: '#9e859e', fontSize: 13 }}>No companies found</Text>
        </View>
      ) : (
        companies.map((c, i) => {
          const selected = stockCompany === c.value;
          return (
            <TouchableOpacity
              key={c.value}
              onPress={() => {
                setStockCompany(c.value);
                setCompanySearch(c.label);
                setCompanyOpen(false);
              }}
              style={{
                paddingHorizontal: 16, paddingVertical: 13,
                backgroundColor: selected ? '#f5edf5' : '#fff',
                borderBottomWidth: i < companies.length - 1 ? 1 : 0,
                borderBottomColor: '#f5eef5',
              }}
            >
              <Text style={{
                fontSize: 14,
                color: selected ? '#6e226e' : '#1a0a1a',
                fontWeight: selected ? '700' : '400',
              }}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
      {loadingCompanies && companies.length > 0 && (
        <View style={{ paddingVertical: 12, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#6e226e" />
        </View>
      )}
    </ScrollView>
  </View>
)}

          {/* Stock dates */}
          <DatePickerCard
            title="Start Date"
            subtitle="Stock analysis start"
            value={stockStartDate}
            onChange={setStockStartDate}
            iconType="start"
            isSmallDevice={isSmallDevice}
          />
          <DatePickerCard
            title="End Date"
            subtitle="Stock analysis end"
            value={stockEndDate}
            onChange={setStockEndDate}
            iconType="end"
            isSmallDevice={isSmallDevice}
          />
        </View>
      )}

    </View>
  );
}