// ─────────────────────────────────────────────────────────
// VitalSync – "Smart Health, Simplified" Color Token System
// Core palette + semantic tokens for light & dark modes
// ─────────────────────────────────────────────────────────

// ── Raw palette (never reference directly in components) ──
const palette = {
  // Brand
  deepTeal:    '#0F766E',
  tealDark:    '#0D6560',
  tealLight:   '#CCFBF1',
  emerald:     '#10B981',
  emeraldDark: '#059669',
  emeraldLight:'#D1FAE5',
  skyBlue:     '#38BDF8',
  skyBlueDark: '#0EA5E9',
  skyBlueLight:'#E0F2FE',

  // Semantic
  amber:       '#F59E0B',
  amberLight:  '#FEF3C7',
  red:         '#EF4444',
  redLight:    '#FEE2E2',
  indigo:      '#6366F1',
  indigoLight: '#E0E7FF',
  aqua:        '#22D3EE',
  aquaLight:   '#CFFAFE',
  softOrange:  '#FB923C',
  orangeLight: '#FFF7ED',

  // Neutrals
  white:       '#FFFFFF',
  offWhite:    '#F8FAFC',
  slateLight:  '#F1F5F9',
  slateMid:    '#CBD5E1',
  slate:       '#94A3B8',
  slateDark:   '#475569',
  charcoal:    '#1F2937',
  darkBg:      '#0F172A',
  darkCard:    '#1E293B',
  darkSurface: '#334155',
  darkText:    '#E2E8F0',
};

// ── Light theme tokens ──
const light = {
  // Brand
  primary:        palette.deepTeal,
  primaryDark:    palette.tealDark,
  primaryLight:   palette.tealLight,
  primaryGrad:    [palette.deepTeal, palette.emeraldDark],

  // Accents
  secondary:      palette.emerald,
  secondaryDark:  palette.emeraldDark,
  secondaryLight: palette.emeraldLight,
  accent:         palette.skyBlue,
  accentDark:     palette.skyBlueDark,
  accentLight:    palette.skyBlueLight,

  // Semantic
  success:        palette.emerald,
  successLight:   palette.emeraldLight,
  warning:        palette.amber,
  warningLight:   palette.amberLight,
  error:          palette.red,
  errorLight:     palette.redLight,
  info:           palette.skyBlue,
  infoLight:      palette.skyBlueLight,

  // Medication status
  medTaken:       palette.emerald,
  medUpcoming:    palette.amber,
  medMissed:      palette.red,

  // Fitness
  fitnessSteps:   palette.skyBlue,
  fitnessSleep:   palette.indigo,
  fitnessWater:   palette.aqua,
  fitnessDiet:    palette.emerald,
  stepsGrad:      [palette.skyBlueDark, palette.skyBlue],
  sleepGrad:      [palette.indigo, '#818CF8'],
  waterGrad:      [palette.aqua, '#67E8F9'],

  // AI chatbot
  aiGrad:         [palette.deepTeal, palette.skyBlue],

  // Trusted contacts
  contactAlert:   palette.softOrange,
  contactAlertBg: palette.orangeLight,

  // Neutrals
  white:          palette.white,
  black:          palette.darkBg,
  grey:           palette.slate,
  lightGrey:      palette.slateLight,
  midGrey:        palette.slateMid,
  darkGrey:       palette.slateDark,

  // Surfaces
  background:     palette.offWhite,
  card:           palette.white,
  cardAlt:        palette.offWhite,

  // Text
  text:           palette.charcoal,
  textMid:        palette.slateDark,
  textLight:      palette.slate,

  // Border
  border:         '#E2E8F0',

  // Misc
  overlay:        'rgba(15,23,42,0.4)',
  shadow:         '#000',
};

// ── Dark theme tokens ──
const dark = {
  ...light,

  // Brand
  primary:        palette.emerald,
  primaryDark:    palette.emeraldDark,
  primaryLight:   '#064E3B',
  primaryGrad:    [palette.emeraldDark, palette.emerald],

  // Accents
  secondary:      palette.emerald,
  secondaryDark:  palette.emeraldDark,
  secondaryLight: '#064E3B',
  accent:         palette.skyBlue,
  accentDark:     palette.skyBlueDark,
  accentLight:    '#0C4A6E',

  // Semantic
  successLight:   '#064E3B',
  warningLight:   '#78350F',
  errorLight:     '#7F1D1D',
  infoLight:      '#0C4A6E',

  // Surfaces
  background:     palette.darkBg,
  card:           palette.darkCard,
  cardAlt:        palette.darkSurface,

  // Neutrals
  white:          palette.darkBg,
  black:          palette.white,
  grey:           palette.slate,
  lightGrey:      palette.darkSurface,
  midGrey:        palette.slateDark,
  darkGrey:       palette.slateMid,

  // Text
  text:           palette.darkText,
  textMid:        palette.slateMid,
  textLight:      palette.slate,

  // Border
  border:         palette.darkSurface,

  // Misc
  overlay:        'rgba(0,0,0,0.6)',
  shadow:         '#000',
};

// Default export is the light palette (backward compatible)
const colors = { ...light };
export { palette, light, dark };
export default colors;
