/// <reference types="jest" />
import React from 'react';
import { View as MockGradientView, type StyleProp, type ViewStyle } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { makeMutable } from 'react-native-reanimated';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { AppThemeProvider } from '@/theme/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { NORMAL_LAYOUT_CONFIG } from '@/api/mockData';
import type { ConfigSection } from '@/types/domain';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }) => <MockGradientView style={style}>{children}</MockGradientView>,
}));

async function renderSection(
  section: ConfigSection,
  overrides?: Partial<React.ComponentProps<typeof SectionRenderer>>
) {
  const scrollY = makeMutable(0);
  return render(
    <I18nProvider>
      <AppThemeProvider
        configTheme={NORMAL_LAYOUT_CONFIG.theme}
        isDark={false}
        onToggleDark={jest.fn()}
      >
        <SectionRenderer
          section={section}
          index={0}
          scrollY={scrollY}
          viewportHeight={800}
          selectedCategory={null}
          onSelectCategory={jest.fn()}
          onQuickAction={jest.fn()}
          onBookDoctor={jest.fn()}
          onBookService={jest.fn()}
          onOpenDoctorDetail={jest.fn()}
          onHeroCta={jest.fn()}
          {...overrides}
        />
      </AppThemeProvider>
    </I18nProvider>
  );
}

describe('SectionRenderer', () => {
  it('renders nothing and never crashes for an unknown section type', async () => {
    const unknownSection: ConfigSection = {
      id: 'sec-unknown',
      type: 'unsupported_3d_hologram',
      background: { kind: 'color', value: '#FFFFFF' },
      title: 'Should Never Render',
      items: [{ id: '1' }],
    };

    const { queryByText, toJSON } = await renderSection(unknownSection);
    expect(queryByText('Should Never Render')).toBeNull();
    expect(toJSON()).toBeNull();
  });

  it('renders service_grid items with rupee prices and triggers booking callback', async () => {
    const onBookService = jest.fn();
    const serviceSection: ConfigSection = {
      id: 'sec-srv-test',
      type: 'service_grid',
      background: { kind: 'gradient', value: '#FFFFFF,#ECFDF5' },
      title: 'Clinic Tests',
      items: [
        {
          id: 'srv-test-1',
          name: 'HbA1c Diabetes Panel',
          priceInr: 399,
          badge: 'FAST REPORT',
          doctorId: 'doc-3',
          category: 'labs',
        },
      ],
    };

    const { getByText } = await renderSection(serviceSection, { onBookService });
    expect(getByText('Clinic Tests')).toBeTruthy();
    expect(getByText('HbA1c Diabetes Panel')).toBeTruthy();
    expect(getByText('₹399')).toBeTruthy();
    expect(getByText('FAST REPORT')).toBeTruthy();

    await fireEvent.press(getByText('HbA1c Diabetes Panel'));
    expect(onBookService).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'srv-test-1', priceInr: 399 })
    );
  });
});
