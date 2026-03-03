// VitalSync typography tokens
// Text colors adapt via ThemeContext — these are light-mode defaults
const CHARCOAL = '#1F2937';
const MID      = '#475569';
const LIGHT    = '#94A3B8';

export const typography = {
  h1:        { fontSize: 28, fontWeight: '800', color: CHARCOAL },
  h2:        { fontSize: 24, fontWeight: '700', color: CHARCOAL },
  h3:        { fontSize: 20, fontWeight: '600', color: CHARCOAL },
  h4:        { fontSize: 18, fontWeight: '600', color: CHARCOAL },
  body:      { fontSize: 15, fontWeight: '400', color: MID, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400', color: LIGHT },
  caption:   { fontSize: 11, fontWeight: '400', color: LIGHT },
  button:    { fontSize: 16, fontWeight: '600' },
  label:     { fontSize: 14, fontWeight: '500', color: MID },
};
export default typography;
