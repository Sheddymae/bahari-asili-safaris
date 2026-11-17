// Brand palette lock: deep teal #0F5560 + orange #F97316.
// Orange is a conversion accent, never body text and never paired with white:
// near-black (#16181A) is the only foreground used on an orange surface.
const pairs = {
  'ink on sand': ['#1F2937', '#F5F1E8'],
  'deep teal link on sand': ['#0F5560', '#F5F1E8'],
  'muted on sand': ['#475569', '#F5F1E8'],
  'ink on white': ['#1F2937', '#FFFFFF'],
  'deep teal link on white': ['#0F5560', '#FFFFFF'],
  'muted on white': ['#475569', '#FFFFFF'],
  'cream on ink': ['#F5F1E8', '#1F2937'],
  'white text on deep teal': ['#FFFFFF', '#0F5560'],
  'cream link on ink': ['#BFEAF0', '#1F2937'],
  'muted cream on ink': ['#D6DEE4', '#1F2937'],
  'near-black on orange button': ['#16181A', '#F97316'],
  'near-black on orange hover': ['#16181A', '#EA580C'],
  'ink on pale orange': ['#1F2937', '#FFF0E5'],
};
const luminance = hex => {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const contrast = (fg, bg) => {
  const [lighter, darker] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};
let failed = false;
for (const [name, [fg, bg]] of Object.entries(pairs)) {
  const ratio = contrast(fg, bg);
  const pass = ratio >= 4.5;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${ratio.toFixed(2)}:1 — ${name}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
