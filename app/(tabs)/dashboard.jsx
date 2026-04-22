import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable, StatusBar, Platform, ToastAndroid, Alert, Clipboard, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackIcon, PlusIcon, EditPencilIcon, DeleteIcon, CheckIcon, ChevronDownIcon, CopyIcon } from '../../components/Icons';
import { fetchDashboards, fetchShows, createDashboard } from '../../api/dashboardApi';

const { height } = Dimensions.get('window');

const PLATFORMS = [
  { value: 'facebook-profile', label: 'Facebook' },
  { value: 'instagram-profile', label: 'Instagram' },
  { value: 'twitter-profile', label: 'Twitter' },
  { value: 'tiktok-profile', label: 'TikTok' },
  { value: 'youtube-profile', label: 'YouTube' },
  { value: 'linkedin-profile', label: 'LinkedIn' },
];

function toast(msg) {
  Platform.OS === 'android' ? ToastAndroid.show(msg, ToastAndroid.SHORT) : Alert.alert('', msg);
}

function ToggleGroup({ options, active, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: '#ede4ed', marginBottom: 16 }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={{
            flex: 1,
            height: 54,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: active === opt.value ? '#6e226e' : '#fff',
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: active === opt.value ? '#fff' : '#9e859e' }}>
            {String(opt.label)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SelectField({ fetchType, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');  

  useEffect(() => { setOptions([]); setSearch(''); }, [fetchType]);

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    setLoading(true); setError('');
    fetchShows(fetchType, 1, 50, search)   
      .then(res => {
        if (res.success) {
          setOptions(res.data.map(item => ({
            id: item.id,
            label: item.name || item.keywords || 'Unnamed',
            type: item.type
          })));
        } else setError(res.message || 'Failed to load');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [open, fetchType, search]);            

  const filteredOptions = search.trim()
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity 
        onPress={() => setOpen(o => !o)} 
        style={{
          backgroundColor: '#fff',
          borderWidth: 1.5,
          borderColor: open ? '#6e226e' : '#ede4ed',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} 
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text numberOfLines={1} style={{ fontSize: 14, color: value ? '#1a0a1a' : '#c8b2c8' }}>
            {value?.label || placeholder || 'Select an option'}
          </Text>
        </View>
        {loading && !open ? <ActivityIndicator size="small" color="#6e226e" /> : <ChevronDownIcon size={16} color="#9e859e" />}
      </TouchableOpacity>
      
      {open && (
        <View style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, marginTop: 4, overflow: 'hidden', maxHeight: 260 }}>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ede4ed', paddingHorizontal: 12, paddingVertical: 8 }}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search…"
              placeholderTextColor="#c8b2c8"
              autoFocus
              style={{ flex: 1, fontSize: 14, color: '#1a0a1a', paddingVertical: 4 }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={{ paddingHorizontal: 4 }} activeOpacity={0.7}>
                <Text style={{ fontSize: 16, color: '#9e859e', lineHeight: 20 }}>✕</Text>
              </TouchableOpacity>
            )}
            {loading && <ActivityIndicator size="small" color="#6e226e" style={{ marginLeft: 8 }} />}
          </View>

          {error ? (
            <Text style={{ color: '#e8365d', padding: 16, textAlign: 'center', fontSize: 14 }}>{error}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {filteredOptions.length > 0 ? filteredOptions.map((opt, i) => (
                <TouchableOpacity 
                  key={opt.id} 
                  onPress={() => { onChange(opt); setOpen(false); setSearch(''); }} 
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: i < filteredOptions.length - 1 ? 1 : 0,
                    borderBottomColor: '#ede4ed',
                    backgroundColor: value?.id === opt.id ? '#f3e6f3' : '#fff',
                  }} 
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, color: value?.id === opt.id ? '#6e226e' : '#1a0a1a', fontWeight: value?.id === opt.id ? '600' : '400' }}>{opt.label}</Text>
                </TouchableOpacity>
              )) : !loading ? (
                <Text style={{ padding: 16, textAlign: 'center', color: '#9e859e' }}>No results found</Text>
              ) : null}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

function GroupSection({ group, index, onRemove, onUpdate, fetchType }) {
  return (
    <View style={{ backgroundColor: '#faf5fa', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: '#ede4ed' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#1a0a1a' }}>Group {String(index + 1)} Name</Text>
        <TouchableOpacity onPress={onRemove} style={{ backgroundColor: '#e8365d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }} activeOpacity={0.8}>
          <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#fff' }}>Remove</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        value={group.name} 
        onChangeText={t => onUpdate({ ...group, name: t })} 
        placeholder="Enter group name…" 
        placeholderTextColor="#c8b2c8" 
        style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ede4ed', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#1a0a1a', marginBottom: 12 }} 
      />
      <SelectField fetchType={fetchType} value={group.selection} onChange={v => onUpdate({ ...group, selection: v })} placeholder="Select keyword or profile…" />
    </View>
  );
}

function DashboardCard({ item, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    Clipboard.setString(item.link); setCopied(true); toast('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 14.5, color: '#1a0a1a', marginBottom: 8 }} numberOfLines={2}>{item.name || 'Untitled'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 11.5, color: '#6e226e', flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.link}</Text>
          <TouchableOpacity onPress={handleCopy} style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: copied ? '#e6f9f4' : '#f3e6f3' }} activeOpacity={0.7}>
            {copied ? <CheckIcon size={13} color="#00a878" /> : <CopyIcon size={13} color="#6e226e" />}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 12, color: '#9e859e', lineHeight: 18 }} numberOfLines={2}>
          {item.keywords && item.keywords.length > 0 
            ? item.keywords.slice(0, 2).join(', ') 
            : 'No items assigned'}
        </Text>
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: '#ede4ed', paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
        <TouchableOpacity onPress={() => onEdit(item)} style={{ height: 34, paddingHorizontal: 16, backgroundColor: '#1a0a1a', borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.8}>
          <EditPencilIcon size={12} color="#fff" /><Text style={{ fontWeight: 'bold', fontSize: 12, color: '#fff' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={{ width: 34, height: 34, backgroundColor: '#fff0f3', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.8}>
          <DeleteIcon size={14} color="#e8365d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DashboardModal({ visible, mode, initialData, onClose, onSave }) {
  const [name, setName] = useState('');
  const [sgMode, setSgMode] = useState('single');
  const [pkMode, setPkMode] = useState('keyword');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook-profile');
  const [singleValue, setSingleValue] = useState(null);
  const [groups, setGroups] = useState([{ id: 1, name: '', selection: null }]);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialData?.name || '');
      setSgMode('single'); setPkMode('keyword'); setSelectedPlatform('facebook-profile');
      setSingleValue(null); setGroups([{ id: Date.now(), name: '', selection: null }]);
      setNameError(false);
    }
  }, [visible, initialData]);

  useEffect(() => { setSingleValue(null); }, [selectedPlatform]);
  useEffect(() => { if (pkMode === 'profile') setSelectedPlatform('facebook-profile'); }, [pkMode]);

  const handleSave = async () => {
    if (!name.trim()) { setNameError(true); return; }
    setSaving(true);
    
    let shows = [];
    if (sgMode === 'single' && singleValue) shows.push(singleValue.id);
    else if (sgMode === 'groups') groups.forEach(g => { if (g.selection) shows.push(g.selection.id); });

    const payload = { name: name.trim(), shows };
    const res = await createDashboard(payload);
    setSaving(false);
    
    if (res.success) {
      toast(mode === 'edit' ? 'Dashboard updated!' : 'Dashboard created!');
      onSave(res.data || payload); onClose();
    } else Alert.alert('Error', res.message || 'Failed to save dashboard');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(26,10,26,0.55)', justifyContent: 'center', paddingHorizontal: 20 }}>
        <Pressable onPress={e => e.stopPropagation()} style={{ width: '100%' }}>
          <ScrollView style={{ maxHeight: height * 0.88, backgroundColor: '#fff', borderRadius: 28 }} contentContainerStyle={{ padding: 28, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={{ fontWeight: '800', fontSize: 20, color: '#1a0a1a', textAlign: 'center', marginBottom: 24 }}>
              {mode === 'edit' ? 'Edit Dashboard' : 'Add Dashboard'}
            </Text>

            <Text style={{ fontWeight: 'bold', fontSize: 11, color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Name</Text>
            <TextInput 
              value={name} 
              onChangeText={t => { setName(t); setNameError(false); }} 
              placeholder="Dashboard name…" 
              placeholderTextColor="#c8b2c8" 
              style={{ backgroundColor: '#faf5fa', borderWidth: 1.5, borderColor: nameError ? '#e8365d' : '#ede4ed', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1a0a1a', marginBottom: 20 }} 
            />

            <ToggleGroup options={[{ value: 'single', label: 'Single' }, { value: 'groups', label: 'Groups' }]} active={sgMode} onSelect={setSgMode} />

            {sgMode === 'single' && (
              <>
                <ToggleGroup options={[{ value: 'profile', label: 'Profile' }, { value: 'keyword', label: 'Keyword' }]} active={pkMode} onSelect={setPkMode} />
                
                {pkMode === 'profile' && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 11, color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Platform</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {PLATFORMS.map(p => (
                        <TouchableOpacity 
                          key={p.value} 
                          onPress={() => setSelectedPlatform(p.value)} 
                          style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, backgroundColor: selectedPlatform === p.value ? '#6e226e' : '#fff', borderColor: selectedPlatform === p.value ? '#6e226e' : '#ede4ed' }} 
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPlatform === p.value ? '#fff' : '#9e859e' }}>{p.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <SelectField
                  fetchType={pkMode === 'profile' ? selectedPlatform : 'keyword'}
                  value={singleValue} onChange={setSingleValue}
                  placeholder={pkMode === 'keyword' ? 'Select keyword…' : 'Select profile…'}
                />
              </>
            )}

            {sgMode === 'groups' && (
              <>
                {groups.map((grp, i) => (
                  <GroupSection key={grp.id} group={grp} index={i} onRemove={() => setGroups(g => g.filter(x => x.id !== grp.id))} onUpdate={u => setGroups(g => g.map(x => x.id === grp.id ? u : x))} fetchType="keyword" />
                ))}
                <TouchableOpacity 
                  onPress={() => setGroups(g => [...g, { id: Date.now(), name: '', selection: null }])} 
                  style={{ height: 48, backgroundColor: '#6e226e', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }} 
                  activeOpacity={0.8}
                >
                  <PlusIcon size={15} color="#fff" />
                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#fff' }}>Add Group</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={{ height: 1, backgroundColor: '#ede4ed', marginVertical: 20 }} />
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={onClose} style={{ height: 52, paddingHorizontal: 24, borderRadius: 16, borderWidth: 2, borderColor: '#ede4ed', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.8}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#9e859e' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={saving} style={{ flex: 1, height: 52, backgroundColor: '#6e226e', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }} activeOpacity={0.8}>
                {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                  <> 
                    <CheckIcon size={17} color="#fff" />
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>{mode === 'edit' ? 'Save' : 'Add'}</Text> 
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ExternalDashboardsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isSmallDevice = height < 700;

  const [dashboards, setDashboards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);

  const loadDashboards = useCallback(async () => {
    setIsLoading(true); setError('');
    const result = await fetchDashboards();
    if (result.success) setDashboards(result.data);
    else setError(result.message || 'Failed to load dashboards');
    setIsLoading(false);
  }, []);

  useEffect(() => { loadDashboards(); }, [loadDashboards]);

  const openAdd = () => { setModalMode('add'); setEditingItem(null); setModalVisible(true); };
  const openEdit = (item) => { setModalMode('edit'); setEditingItem(item); setModalVisible(true); };
  const handleDelete = (id) => {
    Alert.alert('Delete Dashboard', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setDashboards(prev => prev.filter(d => d.id !== id)); toast('Dashboard deleted'); } }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#faf5fa' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ backgroundColor: '#6e226e', overflow: 'hidden', paddingTop: (insets.top || StatusBar.currentHeight || 0) + 8, paddingBottom: isSmallDevice ? 20 : 24, paddingHorizontal: 24 }}>
        <View style={{ position: 'absolute', borderRadius: 80, top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.8}><BackIcon size={18} color="#fff" /></TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Analytics</Text>
            <Text style={{ fontWeight: '800', fontSize: isSmallDevice ? 20 : 22, color: '#fff', letterSpacing: -0.5 }}>External Dashboards</Text>
          </View>
          <TouchableOpacity onPress={openAdd} style={{ backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.8}><PlusIcon size={14} color="#6e226e" /><Text style={{ fontWeight: 'bold', fontSize: 13, color: '#6e226e' }}>Create</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ede4ed', paddingHorizontal: 20, paddingTop: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 13.5, color: '#6e226e', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: '#6e226e' }}>Keywords & Profiles</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: isLoading || error ? 1 : 0 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}><ActivityIndicator size="large" color="#6e226e" /><Text style={{ color: '#9e859e', marginTop: 12 }}>Loading dashboards...</Text></View>) 
        : error ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}><Text style={{ color: '#e8365d', textAlign: 'center', marginBottom: 12 }}>{error}</Text><TouchableOpacity onPress={loadDashboards} style={{ backgroundColor: '#6e226e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text></TouchableOpacity></View>) 
        : dashboards.length === 0 ? (<Text style={{ textAlign: 'center', color: '#9e859e', fontSize: 14, marginTop: 64 }}>No dashboards yet.{'\n'}Tap Create to add one.</Text>) 
        : dashboards.map(item => <DashboardCard key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />)}
      </ScrollView>

      <DashboardModal visible={modalVisible} mode={modalMode} initialData={editingItem} onClose={() => setModalVisible(false)} onSave={() => loadDashboards()} />
    </View>
  );
}