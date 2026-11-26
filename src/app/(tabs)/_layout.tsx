import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppContext';
import { useAppTheme } from '@/theme/ThemeContext';
import type { ConfigTab, TabScreenName } from '@/types/domain';

const DEFAULT_TABS: ConfigTab[] = [
  { id: 'tab-home', label: 'Home', icon: 'home', screen: 'home' },
  { id: 'tab-bookings', label: 'Bookings', icon: 'calendar', screen: 'bookings' },
  { id: 'tab-rx', label: 'Prescriptions', icon: 'medkit', screen: 'prescriptions' },
  { id: 'tab-profile', label: 'Profile', icon: 'person', screen: 'profile' },
];

const ROUTE_BY_SCREEN: Record<TabScreenName, string> = {
  home: 'index',
  bookings: 'bookings',
  prescriptions: 'prescriptions',
  profile: 'profile',
};

const ICON_BY_NAME: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  calendar: 'calendar-outline',
  medkit: 'medkit-outline',
  person: 'person-outline',
};

const ACTIVE_ICON_BY_NAME: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  calendar: 'calendar',
  medkit: 'medkit',
  person: 'person',
};

export default function TabsLayout() {
  const { config, pendingSyncCount } = useAppState();
  const theme = useAppTheme();
  const { colors, typography } = theme;

  const tabs = config?.tabs && config.tabs.length > 0 ? config.tabs : DEFAULT_TABS;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.border,
          minHeight: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.xs,
          fontWeight: '700',
        },
      }}
    >
      {tabs.map((tab) => {
        const routeName = ROUTE_BY_SCREEN[tab.screen];
        const inactiveIcon = ICON_BY_NAME[tab.icon] ?? 'ellipse-outline';
        const activeIcon = ACTIVE_ICON_BY_NAME[tab.icon] ?? 'ellipse';
        return (
          <Tabs.Screen
            key={tab.id}
            name={routeName}
            options={{
              title: tab.label,
              tabBarBadge:
                tab.screen === 'bookings' && pendingSyncCount > 0 ? pendingSyncCount : undefined,
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? activeIcon : inactiveIcon}
                  size={size}
                  color={typeof color === 'string' ? color : focused ? colors.primary : colors.textSecondary}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
