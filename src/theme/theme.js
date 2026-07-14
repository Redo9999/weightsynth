// ─────────────────────────────────────────────────────────────────────────────
// theme.js — Sistema de tema claro e escuro
// WeightSynth v1.1.0
// ─────────────────────────────────────────────────────────────────────────────

export const THEMES = {
  light: {
    id: "light",
    bg:          "#f8fafc",
    card:        "#ffffff",
    border:      "#e2e8f0",
    borderStrong:"#cbd5e1",
    text:        "#1e293b",
    textSub:     "#64748b",
    textMuted:   "#94a3b8",
    accent:      "#6366f1",
    accentBg:    "#eef2ff",
    accentBorder:"#c7d2fe",
    green:       "#10b981",
    amber:       "#f59e0b",
    red:         "#ef4444",
    tabBg:       "#ffffff",
    tabBorder:   "#f1f5f9",
    inputBg:     "#ffffff",
    pillBg:      "#f3f4f6",
    pillBorder:  "#d1d5db",
    chipBg:      "#f3f4f6",
    statusBar:   "dark",
    // Gradiente do header
    headerGrad:  ["#6366f1", "#818cf8"],
  },
  dark: {
    id: "dark",
    bg:          "#0f172a",
    card:        "#1e293b",
    border:      "#334155",
    borderStrong:"#475569",
    text:        "#f1f5f9",
    textSub:     "#94a3b8",
    textMuted:   "#64748b",
    accent:      "#818cf8",
    accentBg:    "#1e1b4b",
    accentBorder:"#4338ca",
    green:       "#34d399",
    amber:       "#fbbf24",
    red:         "#f87171",
    tabBg:       "#1e293b",
    tabBorder:   "#334155",
    inputBg:     "#0f172a",
    pillBg:      "#334155",
    pillBorder:  "#475569",
    chipBg:      "#334155",
    statusBar:   "light",
    headerGrad:  ["#312e81", "#4338ca"],
  },
};

export function getTheme(id) {
  return THEMES[id] || THEMES.light;
}
