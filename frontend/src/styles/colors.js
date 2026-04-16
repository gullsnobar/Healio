// ─────────────────────────────────────────────────────────
// HEALIO – Premium Healthcare Design System Color Tokens
// Industry-grade palette: Neumorphism + Glassmorphism + Cards
// ─────────────────────────────────────────────────────────

// ── Raw palette (never reference directly in components) ──
const palette = {
  // Brand – Teal & Green health gradient
  teal:        '#14B8A6',
  tealDark:    '#0F766E',
  tealDeep:    '#0D6560',
  tealLight:   '#CCFBF1',
  tealSoft:    '#99F6E4',
  emerald:     '#22C55E',
  emeraldDark: '#16A34A',
  emeraldLight:'#DCFCE7',

  // Accent
  blue:        '#3B82F6',
  blueDark:    '#2563EB',
  blueLight:   '#DBEAFE',
  indigo:      '#6366F1',
  indigoLight: '#E0E7FF',
  violet:      '#8B5CF6',
  violetLight: '#EDE9FE',

  // Semantic
  amber:       '#F59E0B',
  amberDark:   '#D97706',
  amberLight:  '#FEF3C7',
  red:         '#EF4444',
  redDark:     '#DC2626',
  redLight:    '#FEE2E2',
  orange:      '#FB923C',
  orangeLight: '#FFF7ED',

  // Health metric colours
  aqua:        '#06B6D4',
  aquaLight:   '#CFFAFE',
  pink:        '#EC4899',
  pinkLight:   '#FCE7F3',
  lime:        '#84CC16',
  limeLight:   '#ECFCCB',

  // Neutrals
  white:       '#FFFFFF',
  offWhite:    '#F8FAFC',
  slateLight:  '#F1F5F9',
  slateMid:    '#CBD5E1',
  slate:       '#94A3B8',
  slateDark:   '#64748B',
  charcoal:    '#334155',
  ink:         '#1E293B',
  deepInk:     '#0F172A',

  // Dark mode surfaces
  darkBg:      '#0F172A',
  darkCard:    '#1E293B',
  darkSurface: '#334155',
  darkElevated:'#475569',
  darkText:    '#E2E8F0',
  darkTextMid: '#94A3B8',
};

// ── Light theme tokens ──
const light = {
  // Brand
  primary:        palette.teal,
  primaryDark:    palette.tealDark,
  primaryDeep:    palette.tealDeep,
  primaryLight:   palette.tealLight,
  primarySoft:    palette.tealSoft,

  // Accents
  secondary:      palette.emerald,
  secondaryDark:  palette.emeraldDark,
  secondaryLight: palette.emeraldLight,
  accent:         palette.blue,
  accentDark:     palette.blueDark,
  accentLight:    palette.blueLight,

  // Semantic
  success:        palette.emerald,
  successLight:   palette.emeraldLight,
  warning:        palette.amber,
  warningDark:    palette.amberDark,
  warningLight:   palette.amberLight,
  error:          palette.red,
  errorDark:      palette.redDark,
  errorLight:     palette.redLight,
  info:           palette.blue,
  infoLight:      palette.blueLight,

  // Medication status
  medTaken:       palette.emerald,
  medTakenBg:     palette.emeraldLight,
  medUpcoming:    palette.amber,
  medUpcomingBg:  palette.amberLight,
  medMissed:      palette.red,
  medMissedBg:    palette.redLight,

  // Fitness
  fitnessSteps:   palette.blue,
  fitnessStepsBg: palette.blueLight,
  fitnessSleep:   palette.indigo,
  fitnessSleepBg: palette.indigoLight,
  fitnessWater:   palette.aqua,
  fitnessWaterBg: palette.aquaLight,
  fitnessCal:     palette.orange,
  fitnessCalBg:   palette.orangeLight,
  fitnessDiet:    palette.emerald,
  fitnessDietBg:  palette.emeraldLight,
  fitnessHeart:   palette.pink,
  fitnessHeartBg: palette.pinkLight,

  // AI chatbot
  aiBot:          palette.tealLight,
  aiBotIcon:      palette.tealDark,

  // Trusted contacts
  contactAlert:   palette.orange,
  contactAlertBg: palette.orangeLight,

  // Neutrals
  white:          palette.white,
  black:          palette.deepInk,
  grey:           palette.slate,
  lightGrey:      palette.slateLight,
  midGrey:        palette.slateMid,
  darkGrey:       palette.slateDark,

  // Text colors (theme-based)
  text:           '#000000',  // Black text for light mode
  textSecondary:  '#000000',  // Black secondary text for light mode
  textTertiary:   '#000000',  // Black tertiary text for light mode

  // Surfaces
  background:     palette.offWhite,
  card:           palette.white,
  cardAlt:        palette.offWhite,
  elevated:       palette.white,

  // Neumorphism
  neuLight:       '#FFFFFF',
  neuDark:        '#D1D9E6',
  neuBg:          '#E8EDF5',

  // Additional UI tokens
  border:         palette.slateMid,
  shadow:         'rgba(0, 0, 0, 0.1)',
  overlay:        'rgba(0, 0, 0, 0.3)',

  // Fitness card gradients
  stepsGrad:      [palette.blue, palette.blueDark],
  sleepGrad:      [palette.indigo, '#4F46E5'],
  waterGrad:      [palette.aqua, '#0891B2'],

  // Primary gradient (used by FAB and buttons)
  primaryGrad:    [palette.teal, palette.tealDark],

  // Action button colors (light theme)
  actionDietText:     palette.amberDark,
  actionDietBg:       palette.amberLight,
  actionManualText:   palette.indigo,
  actionManualBg:     palette.indigoLight,
  actionExerciseText: palette.violet,
  actionExerciseBg:   palette.violetLight,
  actionMealText:     palette.orange,
  actionMealBg:       palette.orangeLight,
  actionChartsText:   '#0369A1',
  actionChartsBg:     palette.blueLight,
  actionAIText:       palette.emerald,
  actionAIBg:         palette.emeraldLight,
};

// ── Dark theme tokens ──
const dark = {
  ...light,

  // Brand
  primary:        palette.teal,
  primaryDark:    palette.tealDark,
  primaryDeep:    palette.tealDeep,
  primaryLight:   '#064E3B',
  primarySoft:    '#065F46',

  // Accents (brighter for dark bg)
  secondary:      palette.emerald,
  secondaryDark:  palette.emeraldDark,
  secondaryLight: '#064E3B',
  accent:         '#60A5FA',
  accentDark:     palette.blue,
  accentLight:    '#1E3A5F',

  // Semantic (darker backgrounds)
  successLight:   '#064E3B',
  warningLight:   '#78350F',
  errorLight:     '#7F1D1D',
  infoLight:      '#1E3A5F',
  medTakenBg:     '#064E3B',
  medUpcomingBg:  '#78350F',
  medMissedBg:    '#7F1D1D',
  fitnessStepsBg: '#1E3A5F',
  fitnessSleepBg: '#312E81',
  fitnessWaterBg: '#164E63',
  fitnessCalBg:   '#7C2D12',
  fitnessDietBg:  '#064E3B',
  fitnessHeartBg: '#831843',

  // Surfaces
  background:     palette.darkBg,
  card:           palette.darkCard,
  cardAlt:        palette.darkSurface,
  elevated:       palette.darkSurface,

  // Neumorphism dark
  neuLight:       palette.darkSurface,
  neuDark:        '#0B1120',
  neuBg:          palette.darkCard,

  // Text colors (theme-based)
  text:           '#FFFFFF',  // White text for dark mode
  textSecondary:  '#FFFFFF',  // White secondary text for dark mode
  textTertiary:   '#FFFFFF',  // White tertiary text for dark mode

  // Additional UI tokens (dark mode)
  border:         palette.darkSurface,
  shadow:         'rgba(0, 0, 0, 0.5)',
  overlay:        'rgba(0, 0, 0, 0.6)',

  // Fitness card gradients (dark theme)
  stepsGrad:      ['#1E3A8A', '#1E40AF'],
  sleepGrad:      ['#3730A3', '#4F46E5'],
  waterGrad:      ['#0E7490', '#0891B2'],

  // Primary gradient (dark theme)
  primaryGrad:    ['#0D6560', '#0F766E'],

  // Action button colors (dark theme)
  actionDietText:     '#FB923C',
  actionDietBg:       '#7C2D12',
  actionManualText:   '#C4B5FD',
  actionManualBg:     '#3B1F7E',
  actionExerciseText: '#C4B5FD',
  actionExerciseBg:   '#3B1F7E',
  actionMealText:     '#FB923C',
  actionMealBg:       '#7C2D12',
  actionChartsText:   '#7DD3FC',
  actionChartsBg:     '#1E3A5F',
  actionAIText:       '#6EE7B7',
  actionAIBg:         '#064E3B',

  // AI
  aiBot:          palette.darkSurface,
  aiBotIcon:      palette.teal,
};

// Default export is the light palette (backward compatible)
const colors = { ...light };
export { palette, light, dark };
export default colors;
