import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ChevronDownIcon = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const SocialMediaIcon = ({ size = 20, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const UsersIcon = ({ size = 20, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Path d="M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const ActionDropdown = ({ onSocialMediaPress, onAuthorsPress }) => {
  const [visible, setVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          top: y + height + 8,
          right: 16,
        });
        setVisible(true);
      });
    } else {
      setVisible(true);
    }
  };

  const handleOptionPress = (option) => {
    setVisible(false);
    if (option === 'social') {
      onSocialMediaPress?.();
    } else if (option === 'authors') {
      onAuthorsPress?.();
    }
  };

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleOpen}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Actions</Text>
        <ChevronDownIcon size={14} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.top || 100,
              right: dropdownPosition.right,
              backgroundColor: '#fff',
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              minWidth: 180,
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={() => handleOptionPress('social')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 16,
                gap: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f1f5f9',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#f3e6f3',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SocialMediaIcon size={18} color="#6e226e" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a0a1a' }}>
                  Social Media
                </Text>
                <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>
                  View all posts & content
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOptionPress('authors')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#e6f9f4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UsersIcon size={18} color="#00a878" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a0a1a' }}>
                  Authors
                </Text>
                <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>
                  View content creators
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default ActionDropdown;