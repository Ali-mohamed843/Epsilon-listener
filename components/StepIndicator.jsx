import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function StepIndicator({ currentStep, isSmallDevice }) {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Schedule' },
    { number: 3, label: 'Pages' },
  ];

  return (
    <View className="flex-row items-center" style={{ paddingHorizontal: width * 0.06, paddingVertical: isSmallDevice ? 12 : 16 }}>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;

        return (
          <View key={step.number} className="flex-1 items-center relative">
            {index < steps.length - 1 && (
              <View
                className="absolute"
                style={{
                  top: 14,
                  left: '60%',
                  width: '80%',
                  height: 2,
                  backgroundColor: isDone || isActive ? '#6e226e' : '#ede4ed',
                  zIndex: 0,
                }}
              />
            )}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: isActive || isDone ? '#6e226e' : '#ede4ed',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 5,
                zIndex: 1,
                ...(isActive && {
                  shadowColor: '#f3e6f3',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                }),
              }}
            >
              {isDone ? (
                <Text style={{ fontSize: 13, color: '#fff' }}>✓</Text>
              ) : (
                <Text style={{ fontSize: 12, fontWeight: '800', color: isActive ? '#fff' : '#9e859e' }}>
                  {step.number}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: 10, fontWeight: '600', letterSpacing: 0.3, color: isActive || isDone ? '#6e226e' : '#9e859e', textAlign: 'center' }}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}