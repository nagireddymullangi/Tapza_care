jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('mock-notif-id'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const MockIcon = ({ name }) => <Text>{name ?? 'icon'}</Text>;
  return {
    Ionicons: MockIcon,
    MaterialCommunityIcons: MockIcon,
  };
});

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      createAnimatedComponent: (Comp) => Comp,
    },
    View,
    Text,
    ScrollView,
    createAnimatedComponent: (Comp) => Comp,
    useSharedValue: (initial) => ({
      value: initial,
      get: () => initial,
      set: jest.fn(),
    }),
    makeMutable: (initial) => ({
      value: initial,
      get: () => initial,
      set: jest.fn(),
    }),
    useAnimatedStyle: (fn) => fn(),
    useAnimatedProps: (fn) => fn(),
    useAnimatedScrollHandler: () => jest.fn(),
    withTiming: (val) => val,
    withSpring: (val) => val,
    withRepeat: (val) => val,
    withSequence: (...vals) => vals[vals.length - 1],
    withDelay: (_d, val) => val,
    interpolate: (v) => v,
    Extrapolation: { CLAMP: 'clamp' },
    Easing: { out: () => () => 1, cubic: jest.fn() },
    runOnJS: (fn) => fn,
  };
});
