import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable, StatusBar, Platform, ToastAndroid, Alert, Clipboard, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackIcon, PlusIcon, EditPencilIcon, DeleteIcon, CheckIcon, ChevronDownIcon, CopyIcon } from '../../components/Icons';

const { height } = Dimensions.get('window');

const KEYWORD_OPTIONS = ['Climate Summit 2026', 'Tech Layoffs Wave', 'Water Crisis MENA', 'Gaza Ceasefire Talks'];
const PROFILE_OPTIONS = ['NileSoft Solutions – FB 2026', 'Desert Wind Media – IG', 'Apex News Network – Twitter', 'Green Future Channel – YT'];
const GROUP_OPTIONS = ['Climate Summit 2026 (keyword)', 'Tech Layoffs Wave (keyword)', 'NileSoft Solutions – FB (profile)', 'Desert Wind Media – IG (profile)'];

const INITIAL_DASHBOARDS = [
  { id: '1', name: 'Lorem ipsum dolor sit amet, consectetur adipisicing.', link: 'https://epsilon.io/d/lorem-ipsum', keywords: ['Lorem ipsum dolor sit.', 'lorem', 'ipsum', 'dolor', 'sit', 'amet'] },
  { id: '2', name: 'Nile Basin Water Crisis Monitor', link: 'https://epsilon.io/d/water-crisis-nile', keywords: ['Water Crisis MENA', 'Nile Basin', 'drought', 'irrigation'] },
  { id: '3', name: 'Tech Layoffs Regional Tracker', link: 'https://epsilon.io/d/tech-layoffs-2026', keywords: ['Tech Layoffs Wave', 'MENA tech', 'startup funding'] },
];

function toast(msg) {
  Platform.OS === 'android' ? ToastAndroid.show(msg, ToastAndroid.SHORT) : Alert.alert('', msg);
}

function ToggleGroup({ options, active, onSelect }) {
  return (
    <View className="flex-row rounded-xl overflow-hidden border border-[#ede4ed] mb-3">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          className={`flex-1 h-[46px] items-center justify-center ${active === opt.value ? 'bg-[#6e226e]' : 'bg-white'}`}
          activeOpacity={0.8}
        >
          <Text className={`font-bold text-[14px] ${active === opt.value ? 'text-white' : 'text-[#9e859e]'}`}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SelectField({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setOpen(o => !o)}
        className={`bg-white border-[1.5px] ${open ? 'border-[#6e226e]' : 'border-[#ede4ed]'} rounded-xl px-4 py-3.5 flex-row items-center justify-between`}
        activeOpacity={0.8}
      >
        <Text className={`text-[14px] flex-1 ${value ? 'text-[#1a0a1a]' : 'text-[#c8b2c8]'}`}>{value || placeholder}</Text>
        <ChevronDownIcon size={16} color="#9e859e" />
      </TouchableOpacity>
      {open && (
        <View className="bg-white border-[1.5px] border-[#ede4ed] rounded-xl mt-1 overflow-hidden">
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onChange(opt); setOpen(false); }}
              className={`px-4 py-3.5 ${i < options.length - 1 ? 'border-b border-[#ede4ed]' : ''} ${value === opt ? 'bg-[#f3e6f3]' : 'bg-white'}`}
              activeOpacity={0.7}
            >
              <Text className={`text-[14px] ${value === opt ? 'text-[#6e226e] font-semibold' : 'text-[#1a0a1a]'}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function GroupSection({ group, index, onRemove, onUpdate }) {
  return (
    <View className="bg-[#faf5fa] rounded-2xl p-4 mb-3 border-[1.5px] border-[#ede4ed]">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-bold text-[13px] text-[#1a0a1a]">Group {index + 1} Name</Text>
        <TouchableOpacity onPress={onRemove} className="bg-[#e8365d] rounded-lg px-3 py-1.5" activeOpacity={0.8}>
          <Text className="font-bold text-[12px] text-white">Remove</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        value={group.name}
        onChangeText={t => onUpdate({ ...group, name: t })}
        placeholder="Enter group name…"
        placeholderTextColor="#c8b2c8"
        className="bg-white border-[1.5px] border-[#ede4ed] rounded-xl px-3 py-3 text-[14px] text-[#1a0a1a] mb-3"
      />
      <SelectField options={GROUP_OPTIONS} value={group.selection} onChange={v => onUpdate({ ...group, selection: v })} placeholder="Select keyword or profile…" />
    </View>
  );
}

function DashboardCard({ item, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(item.link);
    setCopied(true);
    toast('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="bg-white rounded-[18px] mb-3 overflow-hidden shadow-sm">
      <View className="p-4 pb-2">
        <Text className="font-bold text-[14.5px] text-[#1a0a1a] mb-2" numberOfLines={2}>{item.name}</Text>
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-[11.5px] text-[#6e226e] flex-1" numberOfLines={1} ellipsizeMode="tail">{item.link}</Text>
          <TouchableOpacity onPress={handleCopy} className={`w-7 h-7 rounded-lg items-center justify-center ${copied ? 'bg-[#e6f9f4]' : 'bg-[#f3e6f3]'}`} activeOpacity={0.7}>
            {copied ? <CheckIcon size={13} color="#00a878" /> : <CopyIcon size={13} color="#6e226e" />}
          </TouchableOpacity>
        </View>
        <Text className="text-[12px] text-[#9e859e] leading-[18px]" numberOfLines={2}>
          {item.keywords.slice(0, 2).map((kw, i) => (
            <Text key={i}><Text className="text-[#1a0a1a] font-medium">{kw}</Text>{i < 1 ? ', ' : ''}</Text>
          ))}
          {item.keywords.length > 2 && <Text>{', ' + item.keywords.slice(2).join(', ')}</Text>}
        </Text>
      </View>
      <View className="border-t border-[#ede4ed] px-3 py-2 flex-row justify-end gap-2">
        <TouchableOpacity onPress={() => onEdit(item)} className="h-[34px] px-4 bg-[#1a0a1a] rounded-[9px] flex-row items-center gap-1" activeOpacity={0.8}>
          <EditPencilIcon size={12} color="#fff" />
          <Text className="font-bold text-[12px] text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} className="w-[34px] h-[34px] bg-[#fff0f3] rounded-[9px] items-center justify-center" activeOpacity={0.8}>
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
  const [singleValue, setSingleValue] = useState('');
  const [groups, setGroups] = useState([{ id: 1, name: '', selection: '' }]);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialData?.name || '');
      setSgMode('single'); setPkMode('keyword');
      setSingleValue(''); setGroups([{ id: Date.now(), name: '', selection: '' }]);
      setNameError(false);
    }
  }, [visible]);

  const handleSave = () => {
    if (!name.trim()) { setNameError(true); return; }
    onSave({ name: name.trim() });
    toast(mode === 'edit' ? 'Dashboard updated!' : 'Dashboard created!');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-[#1a0a1a]/55 justify-center px-5">
        <Pressable onPress={e => e.stopPropagation()}>
          <ScrollView
            style={{ maxHeight: height * 0.88, backgroundColor: '#fff', borderRadius: 28 }}
            contentContainerStyle={{ padding: 28, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            <Text className="font-extrabold text-[20px] text-[#1a0a1a] text-center mb-6">
              {mode === 'edit' ? 'Edit Dashboard' : 'Add Dashboard'}
            </Text>

            <Text className="font-bold text-[11px] text-[#9e859e] uppercase tracking-widest mb-2">Name</Text>
            <TextInput
              value={name}
              onChangeText={t => { setName(t); setNameError(false); }}
              placeholder="Dashboard name…"
              placeholderTextColor="#c8b2c8"
              className={`bg-[#faf5fa] border-[1.5px] ${nameError ? 'border-[#e8365d]' : 'border-[#ede4ed]'} rounded-xl px-4 py-3.5 text-[15px] text-[#1a0a1a] mb-5`}
            />

            <ToggleGroup
              options={[{ value: 'single', label: 'Single' }, { value: 'groups', label: 'Groups' }]}
              active={sgMode}
              onSelect={setSgMode}
            />

            {sgMode === 'single' && (
              <>
                <ToggleGroup
                  options={[{ value: 'profile', label: 'Profile' }, { value: 'keyword', label: 'Keyword' }]}
                  active={pkMode}
                  onSelect={setPkMode}
                />
                <SelectField
                  options={pkMode === 'keyword' ? KEYWORD_OPTIONS : PROFILE_OPTIONS}
                  value={singleValue}
                  onChange={setSingleValue}
                  placeholder={pkMode === 'keyword' ? 'Select keyword…' : 'Select profile…'}
                />
              </>
            )}

            {sgMode === 'groups' && (
              <>
                {groups.map((grp, i) => (
                  <GroupSection
                    key={grp.id}
                    group={grp}
                    index={i}
                    onRemove={() => setGroups(g => g.filter(x => x.id !== grp.id))}
                    onUpdate={u => setGroups(g => g.map(x => x.id === grp.id ? u : x))}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => setGroups(g => [...g, { id: Date.now(), name: '', selection: '' }])}
                  className="h-12 bg-[#6e226e] rounded-xl flex-row items-center justify-center gap-2 mb-5"
                  activeOpacity={0.8}
                >
                  <PlusIcon size={15} color="#fff" />
                  <Text className="font-bold text-[14px] text-white">Add Group</Text>
                </TouchableOpacity>
              </>
            )}

            <View className="h-px bg-[#ede4ed] my-5" />

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={onClose} className="h-[52px] px-6 rounded-2xl border-2 border-[#ede4ed] items-center justify-center" activeOpacity={0.8}>
                <Text className="font-bold text-[15px] text-[#9e859e]">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} className="flex-1 h-[52px] bg-[#6e226e] rounded-2xl flex-row items-center justify-center gap-2" activeOpacity={0.8}>
                <CheckIcon size={17} color="#fff" />
                <Text className="font-bold text-[15px] text-white">{mode === 'edit' ? 'Save' : 'Add'}</Text>
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

  const [dashboards, setDashboards] = useState(INITIAL_DASHBOARDS);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);

  const openAdd = () => { setModalMode('add'); setEditingItem(null); setModalVisible(true); };
  const openEdit = (item) => { setModalMode('edit'); setEditingItem(item); setModalVisible(true); };
  const handleDelete = (id) => setDashboards(prev => prev.filter(d => d.id !== id));
  const handleSave = ({ name }) => {
    if (modalMode === 'edit') {
      setDashboards(prev => prev.map(d => d.id === editingItem.id ? { ...d, name } : d));
    } else {
      setDashboards(prev => [...prev, { id: String(Date.now()), name, link: `https://epsilon.io/d/${name.toLowerCase().replace(/\s+/g, '-')}`, keywords: [] }]);
    }
  };

  return (
    <View className="flex-1 bg-[#faf5fa]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-[#6e226e] overflow-hidden"
        style={{
          paddingTop: (insets.top || StatusBar.currentHeight || 0) + 8,
          paddingBottom: isSmallDevice ? 20 : 24,
          paddingHorizontal: 24,
        }}
      >
        <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center" activeOpacity={0.8}>
            <BackIcon size={18} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[11px] text-white/60 uppercase tracking-widest mb-0.5">Analytics</Text>
            <Text className="font-extrabold text-[22px] text-white tracking-tight" style={{ fontSize: isSmallDevice ? 20 : 22 }}>
              External Dashboards
            </Text>
          </View>
          <TouchableOpacity onPress={openAdd} className="bg-white rounded-xl px-4 py-2 flex-row items-center gap-1" activeOpacity={0.8}>
            <PlusIcon size={14} color="#6e226e" />
            <Text className="font-bold text-[13px] text-[#6e226e]">Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white border-b border-[#ede4ed] px-5 pt-3">
        <Text className="font-bold text-[13.5px] text-[#6e226e] px-4 py-2 border-b-2 border-[#6e226e] self-start">
          Keywords & Profiles
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {dashboards.length === 0 ? (
          <Text className="text-center text-[#9e859e] text-[14px] mt-16">No dashboards yet.{'\n'}Tap Create to add one.</Text>
        ) : (
          dashboards.map(item => <DashboardCard key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />)
        )}
      </ScrollView>

      <DashboardModal visible={modalVisible} mode={modalMode} initialData={editingItem} onClose={() => setModalVisible(false)} onSave={handleSave} />
    </View>
  );
}