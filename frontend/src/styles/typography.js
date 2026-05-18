// MR & FT – Premium Typography System
// Fonts: Inter (primary), Poppins (headings alternative)
// 8px grid baseline

export const fonts = {
  primary: 'System',    // Falls back to SF Pro (iOS) / Roboto (Android)
  heading: 'System',
};

export const typography = {
  // Display
  display:   { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },

  // Headings
  h1:        { fontSize: 28, fontWeight: '800', letterSpacing: -0.3 },
  h2:        { fontSize: 24, fontWeight: '700', letterSpacing: -0.2 },
  h3:        { fontSize: 20, fontWeight: '600', letterSpacing: 0 },
  h4:        { fontSize: 18, fontWeight: '600', letterSpacing: 0.1 },

  // Body
  body:      { fontSize: 15, fontWeight: '400', lineHeight: 24 },
  bodyMed:   { fontSize: 15, fontWeight: '500', lineHeight: 24 },
  bodyBold:  { fontSize: 15, fontWeight: '700', lineHeight: 24 },
  bodySm:    { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  bodySmMed: { fontSize: 13, fontWeight: '500', lineHeight: 20 },

  // UI
  button:    { fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  buttonSm:  { fontSize: 14, fontWeight: '600', letterSpacing: 0.2 },
  label:     { fontSize: 14, fontWeight: '500' },
  labelSm:   { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  caption:   { fontSize: 11, fontWeight: '500' },
  badge:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  // Numbers / Metrics
  metric:    { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  metricMd:  { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  metricSm:  { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
};

export default typography;
