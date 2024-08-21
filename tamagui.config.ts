import { createFont, createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { themes, tokens } from '@tamagui/themes';
import { shorthands } from '@tamagui/shorthands';
import { createAnimations } from '@tamagui/animations-css';

const headingFont = createInterFont();
const bodyFont = createInterFont();

const customTokens = createTokens({
  ...tokens,
  color: {
    ...tokens.color,
    white: '#fff',
    black: '#1B1E23',
    primary: '#1A60E3',
    error: 'red',
  },
  gap: {
    true: 16,
    small: 8,
    medium: 16,
    large: 24,
  },
  size: {
    true: 16,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
  },
  radius: {
    small: 4,
    medium: 8,
    large: 16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    small: 100,
    medium: 300,
    large: 500,
  },
});

const animations = createAnimations({
  fast: 'ease-in 150ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 450ms',
});

const customThemes = {
  ...themes,
  light: {
    ...themes.light,
    background: customTokens.color.primary,
    color: '#000',
  },
};
const config = createTamagui({
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  animations: animations,
  themes: customThemes,
  tokens: customTokens,
});

export const tamaguiConfig = createTamagui(config);
export type Conf = typeof tamaguiConfig;
export default tamaguiConfig;

// export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

// export default config;
