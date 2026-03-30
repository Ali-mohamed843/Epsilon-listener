import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkleIcon } from './Icons';
import Svg, { Path, Line } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CloseIcon = ({ size = 20, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);

const SendIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </Svg>
);

const KEYWORD_SUGGESTIONS = [
  'Summarize this report',
  'What are the key risks?',
  'Which platform performs best?',
  'How is the sentiment trending?',
];

const PROFILE_SUGGESTIONS = [
  'Summarize this profile report',
  'Any fake account concerns?',
  'How is engagement performing?',
  'What does the sentiment look like?',
];

const MessageBubble = ({ message, isLast }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(message.role === 'user' ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = message.role === 'user';

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        marginBottom: isLast ? 4 : 10,
      }}
    >
      {!isUser && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor: '#f3e6f3',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SparkleIcon size={10} color="#6e226e" />
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#6e226e' }}>Epsilon AI</Text>
        </View>
      )}
      <View
        style={{
          backgroundColor: isUser ? '#6e226e' : '#f3e6f3',
          borderRadius: 16,
          borderTopRightRadius: isUser ? 4 : 16,
          borderTopLeftRadius: isUser ? 16 : 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13.5,
            lineHeight: 20,
            color: isUser ? '#fff' : '#1a0a1a',
            fontWeight: '400',
          }}
        >
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
};

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

    animateDot(dot1, 0).start();
    animateDot(dot2, 200).start();
    animateDot(dot3, 400).start();

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, []);

  const dotStyle = (anim) => ({
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#9e859e',
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
  });

  return (
    <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            backgroundColor: '#f3e6f3',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SparkleIcon size={10} color="#6e226e" />
        </View>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#6e226e' }}>Epsilon AI</Text>
      </View>
      <View
        style={{
          backgroundColor: '#f3e6f3',
          borderRadius: 16,
          borderTopLeftRadius: 4,
          paddingHorizontal: 18,
          paddingVertical: 14,
          flexDirection: 'row',
          gap: 5,
        }}
      >
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>
    </View>
  );
};

const BACKDROP_RATIO = 0.12;
const getKavOffset = () => {
  const backdropHeight = SCREEN_HEIGHT * BACKDROP_RATIO;
  if (Platform.OS === 'android') {
    return backdropHeight - (StatusBar.currentHeight ?? 0);
  }
  return backdropHeight;
};

export default function AIChatModal({ visible, onClose, onSendMessage, reportType = 'keyword' }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const suggestions = reportType === 'profile' ? PROFILE_SUGGESTIONS : KEYWORD_SUGGESTIONS;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      setMessages([]);
      setInputText('');
      setIsTyping(false);
    }
  }, [visible]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText || isTyping) return;

    Keyboard.dismiss();
    setInputText('');

    const userMessage = { role: 'user', text: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await onSendMessage(updatedMessages, messageText);
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const inputBarBottomPad =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom, 16)
      : Math.max(insets.bottom, 12);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <TouchableOpacity
          style={{ height: SCREEN_HEIGHT * BACKDROP_RATIO }}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={{
            flex: 1,
            backgroundColor: '#faf5fa',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            transform: [{ translateY: slideAnim }],
            overflow: 'hidden',
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={getKavOffset()}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#ede4ed',
                backgroundColor: '#fff',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: '#6e226e',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SparkleIcon size={18} color="#fff" />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1a0a1a' }}>
                    Epsilon AI
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 1 }}>
                    Ask about your report
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#f3e6f3',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon size={18} color="#6e226e" />
              </TouchableOpacity>
            </View>
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 8,
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {messages.length === 0 && !isTyping && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 40,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      backgroundColor: '#f3e6f3',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <SparkleIcon size={28} color="#6e226e" />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '800',
                      color: '#1a0a1a',
                      marginBottom: 6,
                      textAlign: 'center',
                    }}
                  >
                    Ask me anything
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#9e859e',
                      textAlign: 'center',
                      lineHeight: 19,
                      paddingHorizontal: 20,
                      marginBottom: 24,
                    }}
                  >
                    I can analyze your report data, highlight trends, and answer questions about
                    metrics and sentiment.
                  </Text>
                  <View style={{ width: '100%', gap: 8 }}>
                    {suggestions.map((suggestion, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleSend(suggestion)}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: '#fff',
                          borderWidth: 1.5,
                          borderColor: '#ede4ed',
                          borderRadius: 14,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <SparkleIcon size={14} color="#6e226e" />
                        <Text
                          style={{ fontSize: 13, color: '#1a0a1a', fontWeight: '500', flex: 1 }}
                        >
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                  isLast={i === messages.length - 1 && !isTyping}
                />
              ))}

              {isTyping && <TypingIndicator />}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingHorizontal: 16,
                paddingTop: 10,
                paddingBottom: inputBarBottomPad,
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#ede4ed',
                gap: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#faf5fa',
                  borderWidth: 1.5,
                  borderColor: '#ede4ed',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  maxHeight: 100,
                  justifyContent: 'center',
                }}
              >
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your question..."
                  placeholderTextColor="#c8b2c8"
                  multiline
                  style={{
                    fontSize: 14,
                    color: '#1a0a1a',
                    maxHeight: 80,
                    paddingTop: 0,
                    paddingBottom: 0,
                    textAlignVertical: 'center',
                  }}
                  editable={!isTyping}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
                activeOpacity={0.8}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: !inputText.trim() || isTyping ? '#ede4ed' : '#6e226e',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#6e226e',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: !inputText.trim() || isTyping ? 0 : 0.3,
                  shadowRadius: 8,
                  elevation: !inputText.trim() || isTyping ? 0 : 4,
                }}
              >
                {isTyping ? (
                  <ActivityIndicator size="small" color="#9e859e" />
                ) : (
                  <SendIcon size={18} color={!inputText.trim() ? '#c8b2c8' : '#fff'} />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}